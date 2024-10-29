import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ProductDto } from './products.dto';

@Injectable()
export class ProductsService {
  private products = [
    { id: 1, name: 'string1', price: 19.2 },
    { id: 2, name: 'string2', price: 20.2 },
  ];

  all(): ProductDto[] {
    return this.products;
  }

  find(id: number): ProductDto {
    const product = this.products.find((product) => product.id == id);

    if (!product) {
      throw 'Not found';
    }

    return product;
  }

  create(input: CreateProductDto): ProductDto {
    const newProduct = { id: Math.floor(Math.random() * 999999999), ...input };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, input: UpdateProductDto): ProductDto {
    const product = this.products.find((product) => product.id == id);

    if (!id) {
      throw 'Not found';
    }

    const updatedProduct = { ...product, ...input };

    this.products.reduce((product) => {
      return product.id == updatedProduct.id ? updatedProduct : product;
    });

    return updatedProduct;
  }

  delete(id: number): boolean {
    const product = this.products.find((product) => product.id == id);

    if (!id) {
      return false;
    }

    this.products = this.products.filter((product) => product.id == id);

    return true;
  }
}
