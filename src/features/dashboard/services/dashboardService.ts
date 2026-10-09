import { apiClient } from '../../../core/api/apiClient';
import type { Product, Deal } from '../types';

export const dashboardService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  getDeals: async (): Promise<Deal[]> => {
    const response = await apiClient.get<Deal[]>('/deals');
    return response.data;
  },

  triggerScraper: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/scrape/run');
    return response.data;
  }
};
