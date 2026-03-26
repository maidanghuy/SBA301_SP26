import axiosClient from './axiosClient';

export interface OrderListItem {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

export interface OrderDetailItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface OrderDetail {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderDetailItem[];
  shippingInfo: {
    full_name: string;
    address: string;
    phone: string;
    email: string;
  };
  shippingMethodName: string;
  shippingFee: number;
  note: string;
  checkoutUrl?: string | null;
  qrCode?: string | null;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
  path: string;
}

const orderService = {
  getOrders: async () => {
    const response = await axiosClient.get<ApiResponse<OrderListItem[]>>('/v1/orders');
    return response.data.data;
  },
  getOrderById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<OrderDetail>>(`/v1/orders/${id}`);
    return response.data.data;
  }
};

export default orderService;
