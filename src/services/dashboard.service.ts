import apiClient from '@/config/axios.config';
import { API } from '@/constants/api.constants';
import { DashboardStats } from '@/types';

export const DashboardService = {
  getOverview: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get(API.DASHBOARD.OVERVIEW);
    return data;
  },
  getMonthlyAnalytics: async (): Promise<any[]> => {
    const { data } = await apiClient.get(API.ANALYTICS.MONTHLY);
    return data;
  }
};
