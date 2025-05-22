import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { filterProduct, fetchProducts, createProduct, editProduct as editProductAPI, getProductById as getProductByIdAPI, fetchByCategory as fetchByCategoryAPI } from '../api/productService';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  dateAdded: string;
  averageRating: number;
}

interface ProductState {
  products: Product[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  selectedProduct?: Product | null;
}

const initialState: ProductState = {
  products: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  selectedProduct: null,
};

// Add Product
// const addProduct = createAsyncThunk<Product, Omit<Product, 'id' | 'dateAdded' | 'averageRating'>>(
//   'products/addProduct',
//   async (productData) => {
//     const product = await createProduct(productData);
//     return product;
//   }
// );
const addProduct = createAsyncThunk<
  Product,
  Omit<Product, 'id' | 'dateAdded' | 'averageRating'>,
  { rejectValue: any }
>(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const product = await createProduct(productData);
      return product;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data); 
      }
      throw err;
    }
  }
);

// Edit Product
const editProduct = createAsyncThunk<Product, { id: number; data: Omit<Product, 'id' | 'dateAdded' | 'averageRating'> }>(
  'products/editProduct',
  async ({ id, data }) => {
    const updated = await editProductAPI(id, data);
    return updated;
  }
);

// Load Products
const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async ({ page = 1 }: { page?: number }) => {
    const data = await fetchProducts(page);
    return data;
  }
);

// Filter Products
const filterProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ page = 1, search = '' }: { page?: number; search?: string }) => {
    const data = await filterProduct(page, search);
    return data;
  }
);

// Fetch Products by Category
const fetchByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ page, category }: { page: number; category: string }) => {
    const data = await fetchByCategoryAPI(page, category);
    return data;
  }
);

// Get Single Product by ID
const getProductById = createAsyncThunk(
  'products/getProductById',
  async (productId: number) => {
    const data = await getProductByIdAPI(productId);
    return data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProducts.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load products';
      })
      .addCase(loadProducts.fulfilled, (state, action: PayloadAction<any>) => {
        state.products = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
      })
      .addCase(filterProducts.fulfilled, (state, action: PayloadAction<any>) => {
        state.products = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(editProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.selectedProduct = action.payload;
        state.loading = false;
      })
      .addCase(getProductById.rejected, (state) => {
        state.selectedProduct = null;
        state.loading = false;
      })
      .addCase(fetchByCategory.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
export { addProduct, editProduct, loadProducts, filterProducts, getProductById, fetchByCategory, };
