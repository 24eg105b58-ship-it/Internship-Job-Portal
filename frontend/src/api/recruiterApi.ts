import apiClient from './client';
import { ApiResponse, Application, ApplicationStatus, Job, PagedResponse, RecruiterDashboardStats, RecruiterProfile } from '../types';

export const recruiterApi = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<RecruiterProfile>>('/recruiters/profile');
    return response.data.data;
  },

  updateProfile: async (profileData: Partial<RecruiterProfile>) => {
    const response = await apiClient.put<ApiResponse<RecruiterProfile>>('/recruiters/profile', profileData);
    return response.data.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get<ApiResponse<RecruiterDashboardStats>>('/recruiters/dashboard');
    return response.data.data;
  },

  getMyJobs: async (page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Job>>>('/recruiters/jobs', {
      params: { page, size },
    });
    return response.data.data;
  },

  getApplicants: async (params: {
    jobId?: number;
    status?: ApplicationStatus;
    search?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Application>>>('/recruiters/applications', {
      params,
    });
    return response.data.data;
  },

  getRecruiterById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<RecruiterProfile>>(`/recruiters/${id}`);
    return response.data.data;
  },
};
