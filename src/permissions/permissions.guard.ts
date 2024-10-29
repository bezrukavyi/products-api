import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  mixin,
} from '@nestjs/common';
import { TokensService, PermissionType } from '../tokens/tokens.service';

export const PermissionsGuard = (
  requiredPermission: PermissionType,
): CanActivate => {
  class PermissionsGuardMixin implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      if (!requiredPermission) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const token = request.headers['authorization']?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Token is missing');
      }

      const tokensService = new TokensService();

      const decoded = tokensService.verifyToken(token);

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

  const guard = mixin(PermissionsGuardMixin);
  return guard as unknown as CanActivate;
};
