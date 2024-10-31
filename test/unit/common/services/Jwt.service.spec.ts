import { JwtService } from 'src/common/services/jwt.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

describe('JwtService', () => {
  let jwtService: JwtService;
  let configService: ConfigService;
  const mockPayload = { userId: 1, permission: 'readWrite' };

  const privateKey = fs.readFileSync(path.resolve('test/fixtures/private.key'), 'utf8');
  const publicKey = fs.readFileSync(path.resolve('test/fixtures/public.key'), 'utf8');

  beforeEach(() => {
    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'JWT_PRIVATE_KEY') return privateKey;
        if (key === 'JWT_PUBLIC_KEY') return publicKey;
        return null;
      }),
    } as unknown as ConfigService;

    jwtService = new JwtService(configService);
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = jwtService.generateToken(mockPayload);

      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      expect(decoded).toMatchObject(mockPayload);
    });

    it('should throw an error if JWT_PRIVATE_KEY is not defined', () => {
      (configService.get as jest.Mock).mockReturnValueOnce(null);

      expect(() => jwtService.generateToken(mockPayload)).toThrowError(
        'JWT_PRIVATE_KEY is not defined',
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return the decoded payload', () => {
      const token = jwt.sign(mockPayload, privateKey, { algorithm: 'RS256', expiresIn: '30d' });
      const decoded = jwtService.verifyToken(token);

      expect(decoded).toMatchObject(mockPayload);
    });

    it('should throw an error if JWT_PUBLIC_KEY is not defined', () => {
      (configService.get as jest.Mock).mockReturnValueOnce(null);

      expect(() => jwtService.verifyToken('any_token')).toThrowError(
        'JWT_PUBLIC_KEY is not defined',
      );
    });

    it('should throw an error if the token is invalid', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => jwtService.verifyToken(invalidToken)).toThrow();
    });
  });
});
