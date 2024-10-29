import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../tokens/tokens.service';

const PERMISSION_KEY = 'permission';

export const Permission = (permission: PermissionType) =>
  SetMetadata(PERMISSION_KEY, permission);
