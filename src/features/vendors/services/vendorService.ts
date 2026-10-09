import { apiClient } from '../../../core/api/apiClient';
import type { Vendor, VendorFormData, Currency } from '../types';

export const vendorService = {
  getVendors: async (): Promise<Vendor[]> => {
    const response = await apiClient.get<Vendor[]>('/vendors');
    return response.data;
  },

  createVendor: async (data: VendorFormData): Promise<Vendor> => {
    const response = await apiClient.post<Vendor>('/vendors', data);
    return response.data;
  },

  updateVendor: async (vendorId: number, data: Partial<VendorFormData>): Promise<Vendor> => {
    const response = await apiClient.put<Vendor>(`/vendors/${vendorId}`, data);
    return response.data;
  },

  toggleVendorStatus: async (vendorId: number): Promise<Vendor> => {
    const response = await apiClient.patch<Vendor>(`/vendors/${vendorId}/status`);
    return response.data;
  },

  deleteVendor: async (vendorId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/vendors/${vendorId}`);
    return response.data;
  },

  getCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get<Currency[]>('/currencies');
    return response.data;
  }
};
