import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/modules/products/products.model';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductSeeder implements Seeder {
  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

  async seed(): Promise<any> {
    const products = Array.from({ length: 10 }, () => ({
      name: faker.commerce.productName(),
      price: faker.number.int({ min: 1, max: 10000 }),
    }));

    return this.productModel.insertMany(products);
  }

  async drop(): Promise<any> {
    return this.productModel.deleteMany({});
  }
}
