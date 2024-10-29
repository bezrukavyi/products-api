import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { ProductDto, CreateProductDto, UpdateProductDto } from './products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  private productsService: ProductsService;

  constructor() {
    this.productsService = new ProductsService();
  }

  @Get(':id')
  show(@Param() id: number): ProductDto {
    return this.productsService.find(id);
  }

  @Get()
  index(): ProductDto[] {
    return this.productsService.all();
  }

  @Post()
  create(@Body() params: CreateProductDto): ProductDto {
    return this.productsService.create(params);
  }

  @Patch(':id')
  update(@Param() id: number, @Body() params: UpdateProductDto): ProductDto {
    return this.productsService.update(id, params);
  }

  @Delete(':id')
  delete(@Param() id: number): boolean {
    return this.productsService.delete(id);
  }
}
