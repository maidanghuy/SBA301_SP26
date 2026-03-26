import axiosClient from './axiosClient';
import { ApiResponse, ShippingMethod } from '../types/product.types';

const shippingService = {
  getShippingMethods: async (): Promise<ShippingMethod[]> => {
    const response = await axiosClient.get<ApiResponse<ShippingMethod[]>>('/v1/shipping-methods');
    return response.data.data;
  },

  createShippingMethod: async (data: Omit<ShippingMethod, 'id'>): Promise<ShippingMethod> => {
    const response = await axiosClient.post<ApiResponse<ShippingMethod>>('/v1/shipping-methods', data);
    return response.data.data;
  },

  updateShippingMethod: async (id: number, data: ShippingMethod): Promise<ShippingMethod> => {
    const response = await axiosClient.put<ApiResponse<ShippingMethod>>(`/v1/shipping-methods/${id}`, data);
    return response.data.data;
  },

  deleteShippingMethod: async (id: number): Promise<void> => {
    await axiosClient.delete<ApiResponse<void>>(`/v1/shipping-methods/${id}`);
  },
};

export default shippingService;
