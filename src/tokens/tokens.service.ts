const jwt = require('jsonwebtoken');
import { JwtPayload } from 'jsonwebtoken';

export type PermissionType = 'readOnly' | 'readWrite';

type TokenPayload = {
  permission: PermissionType;
};

export class TokensService {
  generateToken(permission: PermissionType) {
    return jwt.sign({ permission }, process.env.JWT_PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: '30d',
    });
  }

  verifyToken(token: string): JwtPayload | null {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, {
      algorithms: ['RS256'],
    });

    return decoded as TokenPayload;
  }
}
