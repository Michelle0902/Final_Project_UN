// src/slices/reviewSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addReview, fetchReviewsByProduct, editReview, deleteReview as deleteReviewAPI } from '../api/reviewService';

interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  sentiment?: string;
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

export const loadReviews = createAsyncThunk('reviews/load', async (productId: number) => {
  return await fetchReviewsByProduct(productId);
});

export const submitReview = createAsyncThunk(
  'reviews/submit',
  async (
    data: {
      productId: number;
      reviewId?: number;
      review: { author: string; rating: number; comment: string };
    },
  ) => {
    if (data.reviewId) {
      return await editReview(data.productId, data.reviewId, data.review);
    }
    return await addReview(data.productId, data.review);
  },
);

// ✅ Delete Review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async ({ productId, reviewId }: { productId: number; reviewId: number }) => {
    await deleteReviewAPI(productId, reviewId);
    return { productId, reviewId };
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(submitReview.fulfilled, (state, action: PayloadAction<Review>) => {
        const existingIndex = state.reviews.findIndex(r => r.id === action.payload.id);
        if (existingIndex >= 0) {
          state.reviews[existingIndex] = action.payload;
        } else {
          state.reviews.push(action.payload);
        }
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<{ productId: number; reviewId: number }>) => {
        state.reviews = state.reviews.filter(
          (r) => !(r.productId === action.payload.productId && r.id === action.payload.reviewId)
        );
      });
  },
});

export default reviewSlice.reducer;
