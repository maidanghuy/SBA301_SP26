package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import com.lacvn.dto.request.AddToCartRequest;
import com.lacvn.dto.request.CartCreateRequest;
import com.lacvn.dto.request.CartItemCreateRequest;
import com.lacvn.dto.request.CartItemUpdateRequest;
import com.lacvn.dto.request.CartUpdateRequest;
import com.lacvn.dto.request.DeleteCartItemRequest;
import com.lacvn.dto.response.CartItemResponse;
import com.lacvn.dto.response.CartResponse;
import com.lacvn.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CartController {

    private final CartService cartService;

    @PostMapping("/carts")
    public ResponseEntity<ApiResponse<CartResponse>> createCart(
            @Valid @RequestBody CartCreateRequest request,
            HttpServletRequest req
    ) {
        CartResponse result = cartService.createCart(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Cart created successfully", result, req));
    }

    @GetMapping("/carts/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @PathVariable String id,
            HttpServletRequest req
    ) {
        CartResponse result = cartService.getCartById(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cart retrieved successfully", result, req));
    }

    @GetMapping("/carts/user/{email}")
    public ResponseEntity<ApiResponse<CartResponse>> getCartByUserId(
            @PathVariable String email,
            HttpServletRequest req
    ) {
        CartResponse result = cartService.getCartByEmail(email);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cart retrieved successfully", result, req));
    }

    @PutMapping("/carts/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> updateCart(
            @PathVariable String id,
            @Valid @RequestBody CartUpdateRequest request,
            HttpServletRequest req
    ) {
        CartResponse result = cartService.updateCart(id, request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cart updated successfully", result, req));
    }

    @DeleteMapping("/carts/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteCart(
            @PathVariable String id,
            HttpServletRequest req
    ) {
        cartService.deleteCart(id);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cart deleted successfully", null, req));
    }

    @PostMapping("/add-to-cart")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            HttpServletRequest req
    ) {
        CartResponse result = cartService.addToCart(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Item added to cart successfully", result, req));
    }

    @PostMapping("/carts/{cartId}/items")
    public ResponseEntity<ApiResponse<CartItemResponse>> addItem(
            @PathVariable String cartId,
            @Valid @RequestBody CartItemCreateRequest request,
            HttpServletRequest req
    ) {
        CartItemResponse result = cartService.addCartItem(cartId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponses.success(HttpStatus.CREATED, "Cart item added successfully", result, req));
    }

    @PutMapping("/carts/{cartId}/items/{itemId}")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateItem(
            @PathVariable String cartId,
            @PathVariable Long itemId,
            @Valid @RequestBody CartItemUpdateRequest request,
            HttpServletRequest req
    ) {
        CartItemResponse result = cartService.updateCartItem(cartId, itemId, request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cart item updated successfully", result, req));
    }

    @DeleteMapping("/carts/{cartId}/items/{itemId}")
    public ResponseEntity<ApiResponse<Object>> removeItem(
            @PathVariable String cartId,
            @PathVariable Long itemId,
            HttpServletRequest req
    ) {
        cartService.removeCartItem(cartId, itemId);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cart item removed successfully", null, req));
    }

    @DeleteMapping("/cart-items")
    public ResponseEntity<ApiResponse<Object>> deleteCartItemByEmail(
            @Valid @RequestBody DeleteCartItemRequest request,
            HttpServletRequest req
    ) {
        cartService.deleteCartItemByEmail(request);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cart item deleted successfully", null, req));
    }

    @GetMapping("/cart-items/user/{email}")
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCartItemsByUserEmail(
            @PathVariable String email,
            HttpServletRequest req
    ) {
        List<CartItemResponse> result = cartService.getCartItemsByUserEmail(email);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cart items retrieved successfully", result, req));
    }

    @GetMapping("/carts/{cartId}/items")
    public ResponseEntity<ApiResponse<List<CartItemResponse>>> getCartItems(
            @PathVariable String cartId,
            HttpServletRequest req
    ) {
        List<CartItemResponse> result = cartService.getCartItems(cartId);
        return ResponseEntity.ok(ApiResponses.success(HttpStatus.OK, "Cart items retrieved successfully", result, req));
    }

}
