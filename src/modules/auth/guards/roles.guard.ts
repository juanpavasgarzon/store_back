import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Permission } from '../../../shared';
import { ROLE_PERMISSIONS } from '../../../shared/constants';
import type { User } from '../../users/entities/user.entity';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY } from '../../../shared';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions?.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    if (!user) {
      throw new ForbiddenException();
    }

    const userPermissions = ROLE_PERMISSIONS[user.role] ?? [];
    const hasAll = requiredPermissions.every((p: Permission) => userPermissions.includes(p));
    if (!hasAll) {
      throw new ForbiddenException();
    }

    return true;
  }
}
