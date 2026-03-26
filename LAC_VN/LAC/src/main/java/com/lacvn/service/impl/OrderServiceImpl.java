package com.lacvn.service.impl;

import com.lacvn.dto.payment.ShippingInfoDTO;
import com.lacvn.dto.response.OrderDetailResponseDTO;
import com.lacvn.dto.response.OrderItemResponseDTO;
import com.lacvn.dto.response.OrderResponseDTO;
import com.lacvn.entity.Order;
import com.lacvn.entity.OrderItem;
import com.lacvn.entity.OrderShipping;
import com.lacvn.repository.OrderItemRepository;
import com.lacvn.repository.OrderRepository;
import com.lacvn.repository.OrderShippingRepository;
import com.lacvn.repository.PaymentRepository;
import com.lacvn.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderShippingRepository orderShippingRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public List<OrderResponseDTO> getCurrentUserOrders() {
        String email = getCurrentUserEmail();
        List<Order> orders = orderRepository.findByUser_EmailOrderByCreatedAtDesc(email);
        return orders.stream()
                .map(this::mapToOrderResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDetailResponseDTO getOrderDetail(String orderId) {
        String email = getCurrentUserEmail();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to view this order");
        }

        List<OrderItem> items = orderItemRepository.findByOrder_Id(orderId);
        OrderShipping shipping = orderShippingRepository.findByOrder_Id(orderId).orElse(null);

        OrderDetailResponseDTO response = mapToOrderDetailResponseDTO(order, items, shipping);

        if ("UNPAID".equals(order.getPaymentStatus())) {
            paymentRepository.findTopByOrder_IdOrderByCreatedAtDesc(orderId).ifPresent(payment -> {
                response.setCheckoutUrl(payment.getCheckoutUrl());
                response.setQrCode(payment.getQrCode());
            });
        }

        return response;
    }

    private String getCurrentUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    private OrderResponseDTO mapToOrderResponseDTO(Order order) {
        Instant createdAtInstant = order.getCreatedAt()
                .atZone(ZoneId.systemDefault())
                .toInstant();
        return OrderResponseDTO.builder()
                .id(order.getId())
                .total(order.getTotal())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(createdAtInstant)
                .build();
    }

    private OrderDetailResponseDTO mapToOrderDetailResponseDTO(Order order, List<OrderItem> items, OrderShipping shipping) {
        List<OrderItemResponseDTO> itemDTOs = items.stream()
                .map(item -> OrderItemResponseDTO.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImage(item.getProduct().getImage())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .totalPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        ShippingInfoDTO shippingInfo = null;
        if (shipping != null) {
            shippingInfo = ShippingInfoDTO.builder()
                    .fullName(shipping.getFullName())
                    .address(shipping.getAddress())
                    .phone(shipping.getPhone())
                    .email(shipping.getEmail())
                    .build();
        }

        Instant createdAtInstant = order.getCreatedAt()
                .atZone(ZoneId.systemDefault())
                .toInstant();

        return OrderDetailResponseDTO.builder()
                .id(order.getId())
                .total(order.getTotal())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(createdAtInstant)
                .items(itemDTOs)
                .shippingInfo(shippingInfo)
                .shippingMethodName(order.getShippingMethod() != null ? order.getShippingMethod().getName() : null)
                .shippingFee(order.getShippingMethod() != null ? order.getShippingMethod().getPrice() : BigDecimal.ZERO)
                .note(order.getNote())
                .build();
    }
}
