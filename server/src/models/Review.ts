import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: Date;
  sentiment?: string;
}

const reviewSchema = new Schema<IReview>({
  id: { type: Number, unique: true, required: true, index: true },
  productId: { type: Number, required: true },
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  sentiment: { type: String, default: 'neutral' },
});

export default mongoose.model<IReview>('Review', reviewSchema, 'reviews');