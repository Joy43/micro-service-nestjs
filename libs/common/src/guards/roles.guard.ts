import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../constants/roles.constant';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.roles) {
      return false;
    }

    const rawRoles = Array.isArray(user.roles)
      ? user.roles
      : typeof user.roles === 'string'
        ? user.roles.split(',')
        : [];

    const userRoles = rawRoles.map((role: string) => String(role).trim().toUpperCase());

    return requiredRoles.some((requiredRole) =>
      userRoles.includes(String(requiredRole).trim().toUpperCase()),
    );
  }
}
