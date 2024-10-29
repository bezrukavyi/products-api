import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { Body, Param, Query } from '@nestjs/common';
import { CatchDBValidationError } from 'src/app.exceptions';
import { PaginationDto } from 'src/app.pagination.dto';
import { ProductDto, CreateProductDto, UpdateProductDto } from './products.dto';
import { ProductsService } from './products.service';
import { Product } from './products.model';
import { plainToInstance } from 'class-transformer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async index(@Query() pagination: PaginationDto): Promise<ProductDto[]> {
    const products = await this.productsService.search(pagination);

    return products.map((product) => this._serialize(product));
  }

  @Get(':id')
  async show(@Param('id') id: string): Promise<ProductDto> {
    return this._serialize(await this.productsService.find(id));
  }

  @Post()
  @CatchDBValidationError()
  async create(@Body() params: CreateProductDto): Promise<ProductDto> {
    return this._serialize(await this.productsService.create(params));
  }

  @Patch(':id')
  @CatchDBValidationError()
  async update(
    @Param('id') id: string,
    @Body() params: UpdateProductDto,
  ): Promise<ProductDto> {
    return this._serialize(await this.productsService.update(id, params));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.productsService.delete(id);
  }

  _serialize(product: Product) {
    return plainToInstance(ProductDto, product, {
      excludeExtraneousValues: true,
    });
  }
}
