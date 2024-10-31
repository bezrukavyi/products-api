import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/modules/products/products.model';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductsSeeder implements Seeder {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  async seed(attributes: Partial<Product>[] = []): Promise<any> {
    const generateProps = (props = {}) => ({
      name: faker.commerce.productName(),
      price: faker.number.int({ min: 1, max: 1000000 }),
      ...props,
    });

    const products =
      attributes.length > 0
        ? attributes.map(generateProps)
        : Array.from({ length: 10 }, () => generateProps());

    return this.productModel.insertMany(products);
  }

  async drop(): Promise<any> {
    return this.productModel.deleteMany({});
  }
}
