// src/api/authService.ts
import axios from './axios';

export async function login(username: string, password: string) {
  const response = await axios.post('/auth/login', { username, password });
  const { token, user } = response.data;

  // Save the token and user info in local storage
  localStorage.setItem('token', token);
  localStorage.setItem('user', user);

  return { token, user };
}

export async function signup(username: string, password: string) {
  const response = await axios.post('/auth/signup', { username, password });
  const { token, user } = response.data;

  // Save the token and user info in local storage
  localStorage.setItem('token', token);
  localStorage.setItem('user', user);

  return { token, user };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}