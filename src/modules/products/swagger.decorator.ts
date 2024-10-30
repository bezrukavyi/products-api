import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ProductDto, CreateProductDto, UpdateProductDto } from 'src/modules/products/products.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export function ApiProductOperation(summary: string, description: string, type?: any) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiResponse({ status: 200, description, type, isArray: Array.isArray(type) }),
  );
}

export const ApiProductsListOperation = (summary: string, description: string, type: any) =>
  applyDecorators(
    ApiProductOperation(summary, description, type),
    ApiQuery({ type: PaginationDto }),
  );

export function ApiProductParam() {
  return ApiParam({ name: 'id', type: 'string' });
}

export function ApiProductCreateOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new product' }),
    ApiBody({ type: CreateProductDto }),
    ApiResponse({ status: 201, type: ProductDto }),
  );
}

export function ApiProductUpdateOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a product by ID' }),
    ApiBody({ type: UpdateProductDto }),
    ApiResponse({ status: 200, type: ProductDto }),
  );
}
