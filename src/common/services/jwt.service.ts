import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  generateToken(payload: any) {
    const privateKey = this.configService.get<string>('JWT_PRIVATE_KEY');

    if (!privateKey) {
      throw new Error('JWT_PRIVATE_KEY is not defined');
    }

    return jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30d',
    });
  }

  verifyToken(token: string): JwtPayload | null {
    const publicKey = this.configService.get<string>('JWT_PUBLIC_KEY');

    if (!publicKey) {
      throw new Error('JWT_PUBLIC_KEY is not defined');
    }

    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    });
  }
}
