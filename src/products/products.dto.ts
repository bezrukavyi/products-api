import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Expose } from 'class-transformer';

class ProductModifyDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Expose()
  readonly price: number;
}

export class ProductDto extends ProductModifyDto {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  readonly id: number;
}

export class CreateProductDto extends ProductModifyDto {}

export class UpdateProductDto extends ProductModifyDto {}
