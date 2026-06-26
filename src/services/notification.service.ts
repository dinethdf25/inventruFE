import apiClient from '@/config/axios.config';
import { API } from '@/constants/api.constants';
import { Notification } from '@/types';

export const NotificationService = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await apiClient.get(API.NOTIFICATIONS.BASE);
    return data;
  },
  getUnreadCount: async (): Promise<number> => {
    const { data } = await apiClient.get(API.NOTIFICATIONS.UNREAD_COUNT);
    return data;
  },
  getCount: async (): Promise<number> => {
    const { data } = await apiClient.get(API.NOTIFICATIONS.COUNT);
    return data;
  }
};
