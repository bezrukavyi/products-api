import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { Product } from './products.model';
import { NotFoundException } from 'app.exceptions';
import { PaginationDto, parseSortField } from 'app.pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<Product>,
  ) {}

  search(pagination: PaginationDto): Promise<any[]> {
    const { limit, page, sort } = pagination;
    const offset = (page - 1) * limit;
    const sortProperty = parseSortField(sort, ['name', 'price']);

    return this.productModel
      .find()
      .skip(offset)
      .limit(limit)
      .sort(sortProperty)
      .exec();
  }

  async find(id: string): Promise<Product> {
    if (!isValidObjectId(id)) throw new NotFoundException('Product not found');

    const product = await this.productModel.findById(id).exec();

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async create(input: CreateProductDto): Promise<any> {
    const newProduct = new this.productModel(input);
    return await newProduct.save();
  }

  async update(id: string, input: UpdateProductDto): Promise<any> {
    const product = await this.find(id);

    product.set(input);

    return await product.save();
  }

  async delete(id: string): Promise<boolean> {
    await this.productModel.findById(id);

    const result = await this.productModel.deleteOne({ _id: id });

    return result.deletedCount === 1;
  }

  _raiseNotFoundError() {
    throw new NotFoundException('Product not found');
  }
}
