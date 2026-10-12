import apiClient from './client';
import { ApiResponse, AuthResponse, User } from '../types';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (userData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    companyName?: string;
    university?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/change-password', passwords);
    return response.data;
  },
};
