import { ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PermissionsGuard, PermissionType } from 'src/common/guards/permissions.guard';
import { JwtService } from 'src/common/services/jwt.service';

describe('PermissionsGuard', () => {
  let jwtService: JwtService;
  let mockContext: Partial<ExecutionContext>;

  beforeEach(() => {
    jwtService = { verifyToken: (token) => ({ permission: token }) } as unknown as JwtService;
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as any;
  });

  const createGuard = (requiredPermission: PermissionType) => {
    const Guard = PermissionsGuard(requiredPermission);
    return new Guard(jwtService);
  };

  it('should allow access if no requiredPermission is set', async () => {
    const guard = createGuard(null);
    const canActivate = await guard.canActivate(mockContext as ExecutionContext);
    expect(canActivate).toBe(true);
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const guard = createGuard('readOnly');
    await expect(guard.canActivate(mockContext as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if the token is invalid', async () => {
    const guard = createGuard('readOnly');
    mockContext.switchToHttp = () =>
      ({
        getRequest: () => ({
          headers: {
            authorization: null,
          },
        }),
      }) as any;

    await expect(guard.canActivate(mockContext as ExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw ForbiddenException if permission is insufficient (required readWrite, token has readOnly)', async () => {
    const guard = createGuard('readWrite');
    mockContext.switchToHttp = () =>
      ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer readOnly',
          },
        }),
      }) as any;

    await expect(guard.canActivate(mockContext as ExecutionContext)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should allow access if required permission is readOnly and token has readOnly permission', async () => {
    const guard = createGuard('readOnly');
    mockContext.switchToHttp = () =>
      ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer readOnly',
          },
        }),
      }) as any;

    const canActivate = await guard.canActivate(mockContext as ExecutionContext);
    expect(canActivate).toBe(true);
  });

  it('should allow access if required permission is readWrite and token has readWrite permission', async () => {
    const guard = createGuard('readWrite');
    mockContext.switchToHttp = () =>
      ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer readWrite',
          },
        }),
      }) as any;

    const canActivate = await guard.canActivate(mockContext as ExecutionContext);
    expect(canActivate).toBe(true);
  });

  it('should throw ForbiddenException if an unknown permission is provided in the token', async () => {
    const guard = createGuard('readOnly');
    mockContext.switchToHttp = () =>
      ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer unknownPermission',
          },
        }),
      }) as any;

    await expect(guard.canActivate(mockContext as ExecutionContext)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
