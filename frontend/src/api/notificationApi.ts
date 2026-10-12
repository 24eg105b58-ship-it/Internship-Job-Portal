import apiClient from './client';
import { ApiResponse, Notification, PagedResponse } from '../types';

export const notificationApi = {
  getNotifications: async (page = 0, size = 15) => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Notification>>>('/notifications', {
      params: { page, size },
    });
    return response.data.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get<ApiResponse<{ unreadCount: number }>>('/notifications/unread-count');
    return response.data.data.unreadCount;
  },

  markAsRead: async (id: number) => {
    const response = await apiClient.put<ApiResponse<void>>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put<ApiResponse<void>>('/notifications/read-all');
    return response.data;
  },
};
