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
  },
  getBrands: async (): Promise<any[]> => {
    const response = await apiClient.get('/brands');
    return response.data;
  },
  createBrand: async (brand_name: string): Promise<any> => {
    const response = await apiClient.post('/brands', { brand_name });
    return response.data;
  },
  getCategories: async (): Promise<any[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  createCategory: async (category_name: string): Promise<any> => {
    const response = await apiClient.post('/categories', { category_name });
    return response.data;
  },
  deleteBrand: async (brandId: number): Promise<void> => {
    await apiClient.delete(`/brands/${brandId}`);
  },
  deleteCategory: async (categoryId: number): Promise<void> => {
    await apiClient.delete(`/categories/${categoryId}`);
  }
};
