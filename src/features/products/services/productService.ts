import { apiClient } from '../../../core/api/apiClient';
import type { Product } from '../../dashboard/types';

export const productService = {
  createProduct: async (productData: any): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', productData);
    return response.data;
  },
  updateProduct: async (productId: number, productData: any): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${productId}`, productData);
    return response.data;
  },
  deleteProduct: async (productId: number): Promise<void> => {
    await apiClient.delete(`/products/${productId}`);
  }
};
