import mongoose from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { CatchDatabaseValidationError } from 'src/common/decorators/CatchDatabaseValidationError.decorator';

class TestService {
  @CatchDatabaseValidationError()
  async testMethod() {
    const validationError = new mongoose.Error.ValidationError();
    validationError.errors['field'] = new mongoose.Error.ValidatorError({
      message: 'Field is required',
      path: 'field',
    });
    throw validationError;
  }
}

describe('CatchDatabaseValidationError', () => {
  let testService: TestService;

  beforeEach(() => {
    testService = new TestService();
  });

  it('should throw BadRequestException with correct message structure', async () => {
    try {
      await testService.testMethod();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getResponse()).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: ['Field is required'],
      });
    }
  });

  it('should rethrow non-ValidationError errors', async () => {
    const generalError = new Error('Some other error');
    jest.spyOn(testService, 'testMethod').mockRejectedValue(generalError);

    await expect(testService.testMethod()).rejects.toThrow('Some other error');
  });
});
