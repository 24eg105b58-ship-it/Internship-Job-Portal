import apiClient, { API_BASE_URL } from './client';
import { ApiResponse, Resume } from '../types';

export const resumeApi = {
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<Resume>>('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  getMyResumes: async () => {
    const response = await apiClient.get<ApiResponse<Resume[]>>('/resumes/my');
    return response.data.data;
  },

  setDefaultResume: async (id: number) => {
    const response = await apiClient.put<ApiResponse<Resume>>(`/resumes/${id}/default`);
    return response.data.data;
  },

  deleteResume: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/resumes/${id}`);
    return response.data;
  },

  downloadResumeUrl: (id: number) => {
    return `${API_BASE_URL}/resumes/${id}/download`;
  },
};
