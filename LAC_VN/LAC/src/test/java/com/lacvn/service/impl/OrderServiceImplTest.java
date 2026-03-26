package com.lacvn.service.impl;

import com.lacvn.dto.response.OrderDetailResponseDTO;
import com.lacvn.dto.response.OrderResponseDTO;
import com.lacvn.entity.Order;
import com.lacvn.entity.OrderItem;
import com.lacvn.entity.OrderShipping;
import com.lacvn.entity.Payment;
import com.lacvn.entity.User;
import com.lacvn.repository.OrderItemRepository;
import com.lacvn.repository.OrderRepository;
import com.lacvn.repository.OrderShippingRepository;
import com.lacvn.repository.PaymentRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private OrderShippingRepository orderShippingRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private MockedStatic<SecurityContextHolder> mockedSecurityContextHolder;
    private SecurityContext securityContext;
    private Authentication authentication;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        mockedSecurityContextHolder = mockStatic(SecurityContextHolder.class);
        securityContext = mock(SecurityContext.class);
        authentication = mock(Authentication.class);
        userDetails = mock(UserDetails.class);

        mockedSecurityContextHolder.when(SecurityContextHolder::getContext).thenReturn(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@example.com");
    }

    @AfterEach
    void tearDown() {
        mockedSecurityContextHolder.close();
    }

    @Test
    void getCurrentUserOrders_ShouldReturnOrderList() {
        Order order = new Order();
        order.setId("order-1");
        order.setTotal(new BigDecimal("100.00"));
        order.setStatus("PENDING");
        order.setPaymentStatus("UNPAID");
        order.setCreatedAt(LocalDateTime.now());

        when(orderRepository.findByUser_EmailOrderByCreatedAtDesc("test@example.com"))
                .thenReturn(Collections.singletonList(order));

        List<OrderResponseDTO> result = orderService.getCurrentUserOrders();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("order-1", result.get(0).getId());
    }

    @Test
    void getOrderDetail_ShouldReturnOrderDetailWithQR_WhenUnpaid() {
        User user = new User();
        user.setEmail("test@example.com");

        Order order = new Order();
        order.setId("order-1");
        order.setUser(user);
        order.setPaymentStatus("UNPAID");
        order.setTotal(new BigDecimal("100.00"));
        order.setCreatedAt(LocalDateTime.now());

        Payment payment = new Payment();
        payment.setId(100L);
        payment.setCheckoutUrl("http://checkout.url");
        payment.setQrCode("QR_DATA");

        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));
        when(orderItemRepository.findByOrder_Id("order-1")).thenReturn(Collections.emptyList());
        when(orderShippingRepository.findByOrder_Id("order-1")).thenReturn(Optional.empty());
        when(paymentRepository.findTopByOrder_IdOrderByCreatedAtDesc("order-1")).thenReturn(Optional.of(payment));

        OrderDetailResponseDTO result = orderService.getOrderDetail("order-1");

        assertNotNull(result);
        assertEquals("http://checkout.url", result.getCheckoutUrl());
        assertEquals("QR_DATA", result.getQrCode());
    }

    @Test
    void getOrderDetail_ShouldThrowException_WhenOrderNotFound() {
        when(orderRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> orderService.getOrderDetail("invalid-id"));
    }

    @Test
    void getOrderDetail_ShouldThrowException_WhenOrderBelongsToOtherUser() {
        User otherUser = new User();
        otherUser.setEmail("other@example.com");

        Order order = new Order();
        order.setId("order-1");
        order.setUser(otherUser);

        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));

        assertThrows(RuntimeException.class, () -> orderService.getOrderDetail("order-1"));
    }
}
