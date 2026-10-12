import apiClient from './client';
import { ApiResponse, Job, JobFilterParams, PagedResponse, Application } from '../types';

export const jobApi = {
  searchJobs: async (params: JobFilterParams) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Job>>>('/jobs', { params });
    return response.data.data;
  },

  getJobById: async (id: number) => {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data.data;
  },

  createJob: async (jobData: Partial<Job>) => {
    const response = await apiClient.post<ApiResponse<Job>>('/jobs', jobData);
    return response.data.data;
  },

  updateJob: async (id: number, jobData: Partial<Job>) => {
    const response = await apiClient.put<ApiResponse<Job>>(`/jobs/${id}`, jobData);
    return response.data.data;
  },

  deleteJob: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/jobs/${id}`);
    return response.data;
  },

  saveJob: async (id: number) => {
    const response = await apiClient.post<ApiResponse<void>>(`/jobs/${id}/save`);
    return response.data;
  },

  unsaveJob: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/jobs/${id}/save`);
    return response.data;
  },

  getSavedJobs: async (page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Job>>>('/jobs/saved', {
      params: { page, size },
    });
    return response.data.data;
  },

  getJobApplicants: async (jobId: number, page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Application>>>(`/jobs/${jobId}/applicants`, {
      params: { page, size },
    });
    return response.data.data;
  },
};
