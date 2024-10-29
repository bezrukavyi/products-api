import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { Product } from './products.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  all(): Promise<any[]> {
    return this.productModel.find().exec();
  }

  async find(id: number): Promise<Product> {
    const product = await this.productModel.findById(id).exec();

    if (!product) throw 'Not found';

    return product;
  }

  async create(input: CreateProductDto): Promise<any> {
    const newProduct = new this.productModel(input);
    return await newProduct.save();
  }

  async update(id: number, input: UpdateProductDto): Promise<any> {
    const product = await this.find(id);

    Object.assign(product, input);

    return await product.save();
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.productModel.deleteOne({ _id: id });

    return result.deletedCount === 1;
  }
}
