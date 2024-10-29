import mongoose from 'mongoose';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message || 'Not Found', HttpStatus.NOT_FOUND);
  }
}

export function CatchDBValidationError() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
          const messages = Object.values(error.errors).map(
            (err) => err.message,
          );
          throw new BadRequestException({
            statusCode: 400,
            error: 'Bad Request',
            message: messages,
          });
        }
        throw error;
      }
    };
  };
}
