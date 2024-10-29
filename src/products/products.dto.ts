import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

class ProductModifyDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  readonly price: number;
}

export class ProductDto extends ProductModifyDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

export class CreateProductDto extends ProductModifyDto {}

export class UpdateProductDto extends ProductModifyDto {}
