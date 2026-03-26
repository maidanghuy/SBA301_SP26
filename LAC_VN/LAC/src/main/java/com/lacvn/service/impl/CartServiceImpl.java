package com.lacvn.service.impl;

import com.lacvn.dto.request.AddToCartRequest;
import com.lacvn.dto.request.CartCreateRequest;
import com.lacvn.dto.request.CartItemCreateRequest;
import com.lacvn.dto.request.CartItemUpdateRequest;
import com.lacvn.dto.request.CartUpdateRequest;
import com.lacvn.dto.request.DeleteCartItemRequest;
import com.lacvn.dto.response.CartItemResponse;
import com.lacvn.dto.response.CartResponse;
import com.lacvn.entity.Cart;
import com.lacvn.entity.CartItem;
import com.lacvn.entity.Product;
import com.lacvn.entity.User;
import com.lacvn.exception.ResourceNotFoundException;
import com.lacvn.repository.CartItemRepository;
import com.lacvn.repository.CartRepository;
import com.lacvn.repository.ProductRepository;
import com.lacvn.repository.UserRepository;
import com.lacvn.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public CartResponse createCart(CartCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Cart cart = Cart.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .note(request.getNote())
                .build();

        cartRepository.save(cart);
        return toCartResponse(cart);
    }

    @Override
    public CartResponse getCartById(String id) {
        Cart cart = findActiveCart(id);
        return toCartResponse(cart);
    }

    @Override
    public CartResponse getCartByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));;
        Cart cart = cartRepository.findFirstByUserIdAndDeleteFlagFalse(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user id: " + email));
        return toCartResponse(cart);
    }

    @Override
    public CartResponse updateCart(String id, CartUpdateRequest request) {
        Cart cart = findActiveCart(id);

        if (request.getStatus() != null) cart.setStatus(request.getStatus());
        if (request.getNote() != null) cart.setNote(request.getNote());

        Cart updated = cartRepository.save(cart);
        return toCartResponse(updated);
    }

    @Override
    public void deleteCart(String id) {
        Cart cart = findActiveCart(id);
        cart.setDeleteFlag(true);
        cartRepository.save(cart);
    }

    @Override
    public CartResponse addToCart(AddToCartRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getEmail()));
        // Get or create cart
        Cart cart = cartRepository.findFirstByUserIdAndDeleteFlagFalse(user.getId())
                .orElse(null);

        if (cart == null) {
            cart = Cart.builder()
                    .id(UUID.randomUUID().toString())
                    .user(user)
                    .status("ACTIVE")
                    .build();

            cart = cartRepository.save(cart);
        }

        // Add item to cart
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        CartItem existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), request.getProductId())
                .orElse(null);

        if (existing != null) {
            // If item already exists, increment quantity
            existing.setQuantity(request.getQuantity());
            existing.setDeleteFlag(false);
            cartItemRepository.save(existing);
        } else {
            // Create new cart item
            long nextId = cartItemRepository.findTopByOrderByIdDesc().map(CartItem::getId).orElse(0L) + 1L;

            CartItem cartItem = CartItem.builder()
                    .id(nextId)
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .selected(true)
                    .build();
            cartItemRepository.save(cartItem);
        }

        return toCartResponse(cart);
    }

    @Override
    public CartItemResponse addCartItem(String cartId, CartItemCreateRequest request) {
        Cart cart = findActiveCart(cartId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        CartItem existing = cartItemRepository.findByCartIdAndProductId(cartId, request.getProductId())
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
            CartItem saved = cartItemRepository.save(existing);
            return toCartItemResponse(saved);
        }

        long nextId = cartItemRepository.findTopByOrderByIdDesc().map(CartItem::getId).orElse(0L) + 1L;

        CartItem cartItem = CartItem.builder()
                .id(nextId)
                .cart(cart)
                .product(product)
                .quantity(request.getQuantity())
                .selected(true)
                .build();
        CartItem saved = cartItemRepository.save(cartItem);

        return toCartItemResponse(saved);
    }

    @Override
    public CartItemResponse updateCartItem(String cartId, Long itemId, CartItemUpdateRequest request) {
        Cart cart = findActiveCart(cartId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to cart: " + cartId);
        }

        if (request.getQuantity() != null) item.setQuantity(request.getQuantity());
        if (request.getSelected() != null) item.setSelected(request.getSelected());

        CartItem updated = cartItemRepository.save(item);
        return toCartItemResponse(updated);
    }

    @Override
    public void removeCartItem(String cartId, Long itemId) {
        Cart cart = findActiveCart(cartId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to cart: " + cartId);
        }

        cartItemRepository.delete(item);
    }

    @Override
    public void deleteCartItemByEmail(DeleteCartItemRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        CartItem item = cartItemRepository.findById(request.getCartItemId() * 1L)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + request.getCartItemId()));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart item does not belong to user: " + request.getEmail());
        }

        item.setDeleteFlag(true);
        cartItemRepository.save(item);
    }

    @Override
    public List<CartItemResponse> getCartItems(String cartId) {
        findActiveCart(cartId);
        return cartItemRepository.findByCartId(cartId).stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CartItemResponse> getCartItemsByUserEmail(String email) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return cartItemRepository.findByCartUserEmailAndDeleteFlagFalse(email).stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());
    }

    private Cart findActiveCart(String id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + id));
        if (Boolean.TRUE.equals(cart.getDeleteFlag())) {
            throw new ResourceNotFoundException("Cart not found with id: " + id);
        }
        return cart;
    }

    private CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cartItemRepository.findByCartId(cart.getId()).stream()
                .filter(item -> Boolean.FALSE.equals(item.getDeleteFlag()))
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser() != null ? cart.getUser().getId() : null)
                .status(cart.getStatus())
                .note(cart.getNote())
                .items(items)
                .build();
    }

    private CartItemResponse toCartItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProduct() != null ? item.getProduct().getName() : null)
                .quantity(item.getQuantity())
                .selected(item.getSelected())
                .build();
    }
}
