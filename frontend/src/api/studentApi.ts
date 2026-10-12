import apiClient from './client';
import { ApiResponse, StudentDashboardStats, StudentProfile } from '../types';

export const studentApi = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<StudentProfile>>('/students/profile');
    return response.data.data;
  },

  updateProfile: async (profileData: Partial<StudentProfile>) => {
    const response = await apiClient.put<ApiResponse<StudentProfile>>('/students/profile', profileData);
    return response.data.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get<ApiResponse<StudentDashboardStats>>('/students/dashboard');
    return response.data.data;
  },

  getStudentById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<StudentProfile>>(`/students/${id}`);
    return response.data.data;
  },
};
