import apiClient from './client';
import { ApiResponse, Application, ApplicationStatus, PagedResponse } from '../types';

export const applicationApi = {
  applyForJob: async (data: { jobId: number; resumeId?: number; coverNote?: string }) => {
    const response = await apiClient.post<ApiResponse<Application>>('/applications', data);
    return response.data.data;
  },

  getMyApplications: async (page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Application>>>('/applications/my', {
      params: { page, size },
    });
    return response.data.data;
  },

  getApplicationById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Application>>(`/applications/${id}`);
    return response.data.data;
  },

  updateStatus: async (id: number, status: ApplicationStatus, notes?: string) => {
    const response = await apiClient.put<ApiResponse<Application>>(`/applications/${id}/status`, {
      status,
      notes,
    });
    return response.data.data;
  },

  withdrawApplication: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/applications/${id}`);
    return response.data;
  },
};
