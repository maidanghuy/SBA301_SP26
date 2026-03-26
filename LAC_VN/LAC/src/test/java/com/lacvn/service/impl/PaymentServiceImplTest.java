package com.lacvn.service.impl;

import com.lacvn.entity.Order;
import com.lacvn.entity.Payment;
import com.lacvn.repository.OrderRepository;
import com.lacvn.repository.PaymentRepository;
import com.lacvn.repository.UserRepository;
import com.lacvn.repository.ProductRepository;
import com.lacvn.repository.OrderItemRepository;
import com.lacvn.repository.OrderShippingRepository;
import com.lacvn.repository.ShippingMethodRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.PaymentLink;
import vn.payos.model.v2.paymentRequests.PaymentLinkStatus;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PayOS payOS;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @Test
    void getPaymentLinkInformation_ShouldReturnPaymentLink() throws Exception {
        long orderCode = 123456L;
        PaymentLink mockLink = mock(PaymentLink.class);
        when(mockLink.getStatus()).thenReturn(PaymentLinkStatus.PAID);
        
        var paymentRequests = mock(vn.payos.service.blocking.v2.paymentRequests.PaymentRequestsService.class);
        when(payOS.paymentRequests()).thenReturn(paymentRequests);
        when(paymentRequests.get(orderCode)).thenReturn(mockLink);

        Payment payment = new Payment();
        payment.setId(orderCode);
        payment.setStatus("PENDING");
        payment.setOrder(new Order());

        when(paymentRepository.findById(orderCode)).thenReturn(Optional.of(payment));

        PaymentLink result = paymentService.getPaymentLinkInformation(orderCode);

        assertNotNull(result);
        assertEquals(PaymentLinkStatus.PAID, result.getStatus());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }
}
