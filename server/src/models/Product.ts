import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  dateAdded: Date;
  averageRating: number;
}

const productSchema = new Schema<IProduct>({
  id: { type: Number, unique: true, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  dateAdded: { type: Date, default: Date.now },
  averageRating: { type: Number, default: 0 },
});

export default mongoose.model<IProduct>('Product', productSchema, 'products');