import axiosClient from './axiosClient';
import { AddToCartRequest, Cart, DeleteCartItemRequest } from '../types/cart.types';
import { ApiResponse } from '../types/product.types';

const cartService = {
  addToCart: async (request: AddToCartRequest): Promise<Cart> => {
    const response = await axiosClient.post<ApiResponse<Cart>>('/add-to-cart', request);
    return response.data.data;
  },

  getCartByEmail: async (email: string): Promise<Cart> => {
    const response = await axiosClient.get<ApiResponse<Cart>>(`/carts/user/${email}`);
    return response.data.data;
  },

  deleteCartItem: async (request: DeleteCartItemRequest): Promise<void> => {
    await axiosClient.delete<ApiResponse<void>>('/cart-items', { data: request });
  },
};

export default cartService;
