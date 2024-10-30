import { Document, Schema } from 'mongoose';

export const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    minlength: [3, 'Product name must be at least 3 characters long'],
    maxlength: [50, 'Product name must not exceed 50 characters'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Product price must be a positive number'],
    max: [10000, 'Product price must not exceed 10,000'],
  },
});

export interface Product extends Document {
  readonly name: string;
  readonly price: number;
}
