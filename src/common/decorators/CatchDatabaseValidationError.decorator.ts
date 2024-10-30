import mongoose from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function CatchDatabaseValidationError() {
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
