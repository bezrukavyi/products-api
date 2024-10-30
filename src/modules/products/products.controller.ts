import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { Body, Param, Query, UseGuards } from '@nestjs/common';
import { CatchDatabaseValidationError } from 'src/common/decorators/CatchDatabaseValidationError.decorator';
import { PaginationDto } from 'src/app.pagination.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { ProductDto, CreateProductDto, UpdateProductDto } from './products.dto';
import { ProductsService } from './products.service';
import { Product } from './products.model';
import { plainToInstance } from 'class-transformer';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(PermissionsGuard('readOnly'))
  async index(@Query() pagination: PaginationDto): Promise<ProductDto[]> {
    const products = await this.productsService.search(pagination);

    return products.map((product) => this.serialize(product));
  }

  @Get(':id')
  @UseGuards(PermissionsGuard('readOnly'))
  async show(@Param('id') id: string): Promise<ProductDto> {
    return this.serialize(await this.productsService.find(id));
  }

  @Post()
  @UseGuards(PermissionsGuard('readWrite'))
  @CatchDatabaseValidationError()
  async create(@Body() params: CreateProductDto): Promise<ProductDto> {
    return this.serialize(await this.productsService.create(params));
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard('readWrite'))
  @CatchDatabaseValidationError()
  async update(
    @Param('id') id: string,
    @Body() params: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.serialize(await this.productsService.update(id, params));
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard('readWrite'))
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.productsService.delete(id);
  }

  private serialize(product: Product) {
    return plainToInstance(ProductDto, product, {
      excludeExtraneousValues: true,
    });
  }
}
