import apiClient from '@/config/axios.config';
import { API } from '@/constants/api.constants';
import { InventoryAdjustment } from '@/types';

export const InventoryService = {
  getHistory: async (): Promise<InventoryAdjustment[]> => {
    const { data } = await apiClient.get(API.INVENTORY.BASE);
    return data;
  },
  adjust: async (adjustment: Partial<InventoryAdjustment>): Promise<InventoryAdjustment> => {
    const { data } = await apiClient.post(API.INVENTORY.ADJUST, adjustment);
    return data;
  },
};
