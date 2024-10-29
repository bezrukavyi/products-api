import { Schema } from 'mongoose';
import { Document } from 'mongoose';

export const ProductSchema = new Schema({
  name: String,
  price: Number,
});

export interface Product extends Document {
  readonly name: string;
  readonly price: number;
}
