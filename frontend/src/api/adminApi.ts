import apiClient from './client';
import {
  AdminDashboardStats,
  AdminReport,
  ApiResponse,
  Application,
  ApplicationStatus,
  Job,
  JobFilterParams,
  PagedResponse,
  RecruiterProfile,
  StudentProfile,
  User,
} from '../types';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await apiClient.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard');
    return response.data.data;
  },

  getReports: async () => {
    const response = await apiClient.get<ApiResponse<AdminReport>>('/admin/reports');
    return response.data.data;
  },

  getStudents: async (search?: string, page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<StudentProfile>>>('/admin/students', {
      params: { search, page, size },
    });
    return response.data.data;
  },

  getRecruiters: async (search?: string, page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<RecruiterProfile>>>('/admin/recruiters', {
      params: { search, page, size },
    });
    return response.data.data;
  },

  getAllJobs: async (params: JobFilterParams) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Job>>>('/admin/jobs', { params });
    return response.data.data;
  },

  getAllApplications: async (search?: string, status?: ApplicationStatus, page = 0, size = 10) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Application>>>('/admin/applications', {
      params: { search, status, page, size },
    });
    return response.data.data;
  },

  toggleUserStatus: async (userId: number, active: boolean) => {
    const response = await apiClient.put<ApiResponse<User>>(`/admin/users/${userId}/status`, { active });
    return response.data.data;
  },

  approveJob: async (jobId: number) => {
    const response = await apiClient.post<ApiResponse<Job>>(`/admin/jobs/${jobId}/approve`);
    return response.data.data;
  },

  rejectJob: async (jobId: number, reason?: string) => {
    const response = await apiClient.post<ApiResponse<Job>>(`/admin/jobs/${jobId}/reject`, { reason });
    return response.data.data;
  },
};
