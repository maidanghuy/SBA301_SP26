export interface CartItem {
  id: number;
  productId: string | number;
  productName: string;
  quantity: number;
  selected: boolean;
}

export interface Cart {
  id: string;
  userId: string;
  status: string;
  items: CartItem[];
}

export interface AddToCartRequest {
  email: string;
  productId: string | number;
  quantity: number;
}

export interface CartResponse {
  status: number;
  data: Cart;
}

export interface MergedCartItem extends CartItem {
  price: number;
  image: string;
  stock: number;
}

export interface DeleteCartItemRequest {
  email: string;
  cartItemId: number;
}
