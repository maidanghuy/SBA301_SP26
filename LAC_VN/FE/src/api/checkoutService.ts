import axiosClient from './axiosClient';
import { ApiResponse } from '../types/product.types';

export interface ShippingMethod {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface ShippingInfo {
  full_name: string;
  address: string;
  phone: string;
  email: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface CreateOrderRequest {
  order_items: OrderItem[];
  shipping_info: ShippingInfo;
  note: string;
  shipping_method_id: number;
}

export interface CreateOrderResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  expiredAt: string | null;
  checkoutUrl: string;
  qrCode: string;
}

export interface PaymentStatusResponse {
  id: string;
  orderCode: number;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
  createdAt: string;
  transactions: any[];
  cancellationReason: string | null;
  canceledAt: string | null;
}

const checkoutService = {
  getShippingMethods: async () => {
    const response = await axiosClient.get<ApiResponse<ShippingMethod[]>>('/v1/shipping-methods');
    return response.data.data; 
  },

  createOrder: async (data: CreateOrderRequest) => {
    const response = await axiosClient.post<ApiResponse<CreateOrderResponse>>('/v1/payment/create', data);
    return response.data.data;
  },

  getPaymentStatus: async (orderCode: number) => {
    const response = await axiosClient.get<ApiResponse<PaymentStatusResponse>>(`/v1/payment/${orderCode}`);
    return response.data.data;
  }
};

export default checkoutService;
