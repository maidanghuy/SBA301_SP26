package com.lacvn.service;

import com.lacvn.dto.request.AddToCartRequest;
import com.lacvn.dto.request.CartCreateRequest;
import com.lacvn.dto.request.CartItemCreateRequest;
import com.lacvn.dto.request.CartItemUpdateRequest;
import com.lacvn.dto.request.CartUpdateRequest;
import com.lacvn.dto.request.DeleteCartItemRequest;
import com.lacvn.dto.response.CartItemResponse;
import com.lacvn.dto.response.CartResponse;

import java.util.List;

public interface CartService {
    CartResponse createCart(CartCreateRequest request);
    CartResponse getCartById(String id);
    CartResponse getCartByEmail(String email);
    CartResponse updateCart(String id, CartUpdateRequest request);
    void deleteCart(String id);

    CartResponse addToCart(AddToCartRequest request);

    CartItemResponse addCartItem(String cartId, CartItemCreateRequest request);
    CartItemResponse updateCartItem(String cartId, Long itemId, CartItemUpdateRequest request);
    void removeCartItem(String cartId, Long itemId);
    void deleteCartItemByEmail(DeleteCartItemRequest request);
    List<CartItemResponse> getCartItems(String cartId);
    List<CartItemResponse> getCartItemsByUserEmail(String email);
}
