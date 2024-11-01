import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  mixin,
  Injectable,
  Type,
} from '@nestjs/common';
import { JwtService } from '../services/jwt.service';

export type PermissionType = 'readOnly' | 'readWrite';

type TokenPayload = {
  permission: PermissionType;
};

export function PermissionsGuard(requiredPermission: PermissionType): Type<CanActivate> {
  @Injectable()
  class PermissionsGuardMixin implements CanActivate {
    constructor(private readonly JwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      if (!requiredPermission) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const token = request.headers['authorization']?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }

      let decoded: TokenPayload;

      try {
        decoded = this.JwtService.verifyToken(token);
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }

      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }

      switch (requiredPermission) {
        case 'readWrite':
          if (decoded.permission !== 'readWrite') {
            throw new ForbiddenException('Insufficient permissions');
          }
          break;
        case 'readOnly':
          if (!['readOnly', 'readWrite'].includes(decoded.permission)) {
            throw new ForbiddenException('Insufficient permissions');
          }
          break;
        default:
          throw new ForbiddenException('Insufficient permissions');
      }

      return true;
    }
  }

  return mixin(PermissionsGuardMixin);
}
