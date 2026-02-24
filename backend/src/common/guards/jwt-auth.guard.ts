import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser | false | null,
    info?: { message?: string } | string,
  ): TUser {
    if (user) {
      return user;
    }

    const message =
      typeof info === 'string'
        ? info
        : info?.message ?? (err instanceof Error ? err.message : 'Unauthorized');

    this.logger.warn(`JWT rejected: ${message}`);
    throw new UnauthorizedException(message);
  }
}
