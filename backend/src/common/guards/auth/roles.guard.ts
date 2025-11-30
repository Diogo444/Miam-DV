import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  private readonly logger = new Logger(RolesGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (!requiredRoles.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.includes(user.role)) {
      this.logger.warn(
        `Forbidden: required roles=${requiredRoles.join(',') || 'none'}, user role=${user?.role ?? 'none'}`,
      );
      throw new ForbiddenException('Insufficient role');
    }

    this.logger.debug(
      `RolesGuard passed: required roles=${requiredRoles.join(',')}, user role=${user.role}`,
    );
    return true;
  }
}
