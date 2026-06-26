import apiClient from '@/config/axios.config';
import { API } from '@/constants/api.constants';
import { Reorder } from '@/types';

export const ReorderService = {
  create: async (productId: string, quantity: number): Promise<Reorder> => {
    const { data } = await apiClient.post(API.REORDERS.BASE, { productId, quantity });
    return data;
  },
  getPendingCount: async (): Promise<number> => {
    const { data } = await apiClient.get(API.REORDERS.PENDING_COUNT);
    return data;
  }
};
