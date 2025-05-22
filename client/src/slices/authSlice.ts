// src/slices/authSlice.ts (with Thunks)
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginService, signup as signupService, logout as logoutService } from '../api/authService';

interface AuthState {
  user: string | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: { username: string; password: string }) => {
  const { token, user } = await loginService(credentials.username, credentials.password);
  return { token, user };
});

export const signup = createAsyncThunk('auth/signup', async (credentials: { username: string; password: string }) => {
  const { token, user } = await signupService(credentials.username, credentials.password);
  return { token, user };
});

export const logout = createAsyncThunk('auth/logout', async () => {
  logoutService();
  return {};
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Login failed';
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.loading = false;
        state.error = 'Signup failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
      
  },
});

export default authSlice.reducer;