import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PermissionsGuard, PermissionType } from '../guards/permissions.guard';

export function Permissions(permission: PermissionType) {
  return applyDecorators(
    UseGuards(PermissionsGuard(permission)),
    ApiBearerAuth(),
    ApiResponse({ status: 200, description: 'Success' }),
    ApiResponse({ status: 403, description: 'Forbidden: Insufficient permissions' }),
    ApiResponse({ status: 401, description: 'Unauthorized: Invalid token' }),
  );
}
