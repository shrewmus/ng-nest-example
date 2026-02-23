import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { decodeProtectedHeader, JWTPayload } from 'jose';
import { createRemoteJWKSet } from 'jose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from '../common/interfaces/auth-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor() {
    const realm = process.env.KEYCLOAK_REALM ?? 'quickpoll';
    const baseUrl = process.env.KEYCLOAK_BASE_URL ?? 'http://localhost:8081';
    const issuer = `${baseUrl}/realms/${realm}`;
    const audience = process.env.KEYCLOAK_AUDIENCE ?? 'quickpoll-frontend';
    const jwks = createRemoteJWKSet(
      new URL(`${issuer}/protocol/openid-connect/certs`),
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer,
      audience,
      algorithms: ['RS256'],
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        void this.resolveSigningKey(rawJwtToken, jwks)
          .then((key) => done(null, key))
          .catch(() =>
            done(new UnauthorizedException('Invalid token signature'), null),
          );
      },
    });

    this.jwks = jwks;
  }

  async validate(payload: JWTPayload): Promise<AuthUser> {
    return payload as unknown as AuthUser;
  }

  private async resolveSigningKey(rawJwtToken: string, jwks = this.jwks) {
    const protectedHeader = decodeProtectedHeader(rawJwtToken);
    return jwks(protectedHeader, rawJwtToken);
  }
}
