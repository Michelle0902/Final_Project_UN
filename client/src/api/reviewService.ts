import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const addReview = async (productId: number, reviewData: any) => {
  const response = await axios.post(`${API_URL}/products/${productId}/reviews`, reviewData);
  return response.data;
};

export const editReview = async (productId: number, reviewId: number, reviewData: any) => {
  const response = await axios.put(`${API_URL}/products/${productId}/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const fetchReviewsByProduct = async (productId: number) => {
  const response = await axios.get(`${API_URL}/products/${productId}/reviews`);
  return response.data;
};

export const deleteReview = async (productId: number, reviewId: number) => {
  const response = await axios.delete(`${API_URL}/products/${productId}/${reviewId}`);
  return response.data;
};
