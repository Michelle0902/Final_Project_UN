import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('✅ API URL from env:', import.meta.env.VITE_API_URL);
console.log('🌐 Final API base URL used:', API_URL);

// Fetch all products
export const fetchProducts = async (page = 1) => {
  const response = await axios.get(`${API_URL}/products`, {
    params: {
      page
    },
  });
  return response.data; // { products, currentPage, totalPages }
};

// Create a new product
export const createProduct = async (productData: {
  name: string;
  description: string;
  category: string;
  price: number;
}) => {
  const response = await axios.post(`${API_URL}/products`, productData);
  return response.data;
};

// Edit a new product
export const editProduct = async (id: number, productData: {
  name: string;
  description: string;
  category: string;
  price: number;
}) => {
  const response = await axios.put(`${API_URL}/products/${id}`, productData);
  return response.data;
};

// Filter productrs
export const filterProduct = async (page = 1, search = '') => {
  const response = await axios.get(`${API_URL}/products/search`, {
    params: { page, q: search },
  });
  console.log("filtered", response.data);
  return response.data;
};

export const fetchByCategory = async (page: number, category: string) => {
  const response = await axios.get(`${API_URL}/products/filter`, {
    params: { page, category },
  });
  return response.data;
};

export const getProductById = async (id: number) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};