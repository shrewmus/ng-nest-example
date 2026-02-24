import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { decodeProtectedHeader, JWTPayload } from 'jose';
import { createPublicKey, KeyObject } from 'node:crypto';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from '../common/interfaces/auth-user.interface';

type JwkWithKid = import('crypto').JsonWebKey & { kid?: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly jwksUri: string;
  private readonly jwkCache = new Map<string, JwkWithKid>();
  private jwkCacheLoadedAt = 0;
  private readonly acceptedAudiences: Set<string> | null;

  constructor() {
    const realm = process.env.KEYCLOAK_REALM ?? 'quickpoll';
    const baseUrl = process.env.KEYCLOAK_BASE_URL ?? 'http://localhost:8081';
    const issuer = `${baseUrl}/realms/${realm}`;
    const audience = (process.env.KEYCLOAK_AUDIENCE ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    const jwtOptions: {
      jwtFromRequest: ReturnType<typeof ExtractJwt.fromAuthHeaderAsBearerToken>;
      ignoreExpiration: boolean;
      issuer: string;
      algorithms: string[];
      secretOrKeyProvider: (
        request: unknown,
        rawJwtToken: string,
        done: (err: Error | null, secretOrKey?: string) => void,
      ) => void;
    } = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer,
      algorithms: ['RS256'],
      secretOrKeyProvider: (_request: unknown, rawJwtToken: string, done: (err: Error | null, secretOrKey?: string) => void) => {
        void this.resolveSigningKey(rawJwtToken)
          .then((key) => done(null, key as unknown as string))
          .catch((error: unknown) =>
            done(
              error instanceof Error
                ? error
                : new UnauthorizedException('Invalid token signature'),
              undefined,
            ),
          );
      },
    };

    super(jwtOptions as never);

    this.jwksUri = `${issuer}/protocol/openid-connect/certs`;
    this.acceptedAudiences =
      audience.length > 0 ? new Set(audience) : null;
  }

  async validate(payload: JWTPayload): Promise<AuthUser> {
    if (this.acceptedAudiences) {
      const tokenAudiences = Array.isArray(payload.aud)
        ? payload.aud
        : payload.aud
          ? [payload.aud]
          : [];
      const audienceMatched = tokenAudiences.some((aud) =>
        this.acceptedAudiences?.has(aud),
      );

      if (!audienceMatched) {
        throw new UnauthorizedException(
          `jwt audience invalid. expected one of: ${Array.from(this.acceptedAudiences).join(', ')}`,
        );
      }
    }

    return payload as unknown as AuthUser;
  }

  private async resolveSigningKey(rawJwtToken: string): Promise<KeyObject> {
    const protectedHeader = decodeProtectedHeader(rawJwtToken);
    const kid = protectedHeader.kid;

    if (!kid) {
      throw new UnauthorizedException('Token is missing kid header');
    }

    let jwk = this.jwkCache.get(kid);
    if (!jwk || this.isJwkCacheExpired()) {
      await this.refreshJwks();
      jwk = this.jwkCache.get(kid);
    }

    if (!jwk) {
      throw new UnauthorizedException('Unable to resolve signing key');
    }

    return createPublicKey({
      key: jwk,
      format: 'jwk',
    });
  }

  private async refreshJwks(): Promise<void> {
    const response = await fetch(this.jwksUri);
    if (!response.ok) {
      throw new UnauthorizedException('Failed to fetch JWKS');
    }

    const body = (await response.json()) as { keys?: JwkWithKid[] };
    const keys = body.keys ?? [];

    this.jwkCache.clear();
    for (const key of keys) {
      if (key.kid) {
        this.jwkCache.set(key.kid, key);
      }
    }

    this.jwkCacheLoadedAt = Date.now();
  }

  private isJwkCacheExpired(): boolean {
    const cacheTtlMs = 5 * 60 * 1000;
    return Date.now() - this.jwkCacheLoadedAt > cacheTtlMs;
  }
}
