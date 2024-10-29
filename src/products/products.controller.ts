import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { ProductDto, CreateProductDto, UpdateProductDto } from './products.dto';
import { ProductsService } from './products.service';
import { Product } from './products.model';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async show(@Param() id: number): Promise<Product> {
    return this.productsService.find(id);
  }

  @Get()
  async index(): Promise<ProductDto[]> {
    return this.productsService.all();
  }

  @Post()
  async create(@Body() params: CreateProductDto): Promise<Product> {
    return this.productsService.create(params);
  }

  @Patch(':id')
  async update(
    @Param() id: number,
    @Body() params: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, params);
  }

  @Delete(':id')
  async delete(@Param() id: number): Promise<boolean> {
    return await this.productsService.delete(id);
  }
}
