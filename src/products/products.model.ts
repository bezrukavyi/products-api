import { Schema } from 'mongoose';
import { Document } from 'mongoose';

export const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'], // Required validation with custom error message
    minlength: [3, 'Product name must be at least 3 characters long'], // Minimum length validation
    maxlength: [50, 'Product name must not exceed 50 characters'], // Maximum length validation
    trim: true, // Removes whitespace from both ends
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'], // Required validation with custom error message
    min: [0, 'Product price must be a positive number'], // Minimum value validation
    max: [10000, 'Product price must not exceed 10,000'], // Maximum value validation
  },
});

// Interface for TypeScript typing
export interface Product extends Document {
  readonly name: string;
  readonly price: number;
}
