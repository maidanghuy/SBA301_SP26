package com.lacvn.service.impl;

import com.lacvn.dto.payment.CheckoutItemDTO;
import com.lacvn.dto.payment.CheckoutRequest;
import com.lacvn.entity.*;
import com.lacvn.repository.*;
import com.lacvn.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLinkItem;
import vn.payos.model.v2.paymentRequests.PaymentLink;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PayOS payOS;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderShippingRepository orderShippingRepository;
    private final PaymentRepository paymentRepository;
    private final ShippingMethodRepository shippingMethodRepository;

    @Override
    @Transactional
    public CreatePaymentLinkResponse createPaymentLink(CheckoutRequest request) throws Exception {
        log.info("Processing checkout request for {} items", request.getOrderItems() != null ? request.getOrderItems().size() : 0);

        List<PaymentLinkItem> payOSItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // 1. Resolve ShippingMethod if provided
        ShippingMethod shippingMethod = null;
        if (request.getShippingMethodId() != null) {
            shippingMethod = shippingMethodRepository.findById(request.getShippingMethodId())
                    .orElseThrow(() -> new Exception("Shipping method not found"));
        }

        // 2. Get the current user and set it to the Order entity
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found for email: " + email));

        // 3. Create the Order entity first
        Order order = Order.builder()
                .id(UUID.randomUUID().toString())
                .total(BigDecimal.ZERO)
                .status("PENDING")
                .paymentStatus("UNPAID")
                .paymentMethod("PAYOS")
                .note(request.getNote())
                .shippingMethod(shippingMethod)
                .user(user) // Set the user here
                .build();
        order = orderRepository.save(order);

        // 4. Process order items and calculate total
        if (request.getOrderItems() != null) {
            for (CheckoutItemDTO itemDto : request.getOrderItems()) {
                Product product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new Exception("Product not found: " + itemDto.getProductId()));

                int quantity = itemDto.getQuantity() != null ? itemDto.getQuantity() : 1;
                BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
                totalAmount = totalAmount.add(itemTotal);

                // Save OrderItem to DB
                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(quantity)
                        .price(product.getPrice())
                        .build();
                orderItemRepository.save(orderItem);

                // Build PayOS item
                PaymentLinkItem pItem = PaymentLinkItem.builder()
                        .name(product.getName())
                        .price(product.getPrice().longValue())
                        .quantity(quantity)
                        .build();
                payOSItems.add(pItem);
            }
        }

        // 5. Add Shipping Fee to totals and PayOS items if applicable
        if (shippingMethod != null && shippingMethod.getPrice().compareTo(BigDecimal.ZERO) > 0) {
            totalAmount = totalAmount.add(shippingMethod.getPrice());
            PaymentLinkItem shippingPItem = PaymentLinkItem.builder()
                    .name("Phí giao hàng: " + shippingMethod.getName())
                    .price(shippingMethod.getPrice().longValue())
                    .quantity(1)
                    .build();
            payOSItems.add(shippingPItem);
        }

        // Update the total in order
        order.setTotal(totalAmount);
        orderRepository.save(order);

        // 6. Save Order Shipping
        if (request.getShippingInfo() != null) {
            OrderShipping shipping = OrderShipping.builder()
                    .order(order)
                    .fullName(request.getShippingInfo().getFullName())
                    .address(request.getShippingInfo().getAddress())
                    .phone(request.getShippingInfo().getPhone())
                    .email(request.getShippingInfo().getEmail())
                    .build();
            orderShippingRepository.save(shipping);
        }

        // 7. Generate Payment tracking record before calling PayOS
        Payment payment = Payment.builder()
                .order(order)
                .amount(totalAmount)
                .status("PENDING")
                .method("PAYOS")
                .build();
        payment = paymentRepository.save(payment); // Get the auto-increment DB ID

        // 8. Build PayOS CreatePaymentLinkRequest using payment.getId() as orderCode
        vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest payOSRequest = vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest.builder()
                .orderCode(payment.getId())
                .amount(payment.getAmount().longValue())
                .description("Don hang " + payment.getId())
                .returnUrl(request.getReturnUrl() != null ? request.getReturnUrl() : "http://localhost:3000")
                .cancelUrl(request.getCancelUrl() != null ? request.getCancelUrl() : "http://localhost:3000")
                .buyerName(request.getShippingInfo() != null ? request.getShippingInfo().getFullName() : "")
                .buyerPhone(request.getShippingInfo() != null ? request.getShippingInfo().getPhone() : "")
                .buyerEmail(request.getShippingInfo() != null ? request.getShippingInfo().getEmail() : "")
                .items(payOSItems)
                .build();

        // 9. Execute PayOS Call
        try {
            CreatePaymentLinkResponse data = payOS.paymentRequests().create(payOSRequest);
            log.info("Successfully created payment link for PayOS orderCode: {}", payment.getId());

            // Optionally update transaction link in Payment record
            payment.setTransactionId(data.getPaymentLinkId());
            payment.setCheckoutUrl(data.getCheckoutUrl());
            payment.setQrCode(data.getQrCode());
            paymentRepository.save(payment);

            return data;
        } catch (vn.payos.exception.APIException e) {
            log.error("APIException: Signature không hợp lệ hoặc lỗi API. Chi tiết: {}", e.getMessage());
            throw new Exception("Lỗi gọi PayOS: " + e.getMessage());
        } catch (Exception e) {
            log.error("Lỗi tạo payment link: {}", e.getMessage(), e);
            throw new Exception("Đã xảy ra lỗi khi tạo payment link.");
        }
    }

    private String getCurrentUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    @Override
    @Transactional
    public WebhookData verifyPaymentWebhook(Webhook webhookBody) throws Exception {
        log.info("Verifying webhook data from PayOS");
        WebhookData data = payOS.webhooks().verify(webhookBody);
        
        long orderCode = data.getOrderCode();
        Payment payment = paymentRepository.findById(orderCode).orElse(null);
        
        if (payment != null) {
            payment.setStatus("PAID");
            payment.setPaidAt(Instant.now());
            // optionally parse data.getTransactionId() -> setTransactionId(data.getReference())
            paymentRepository.save(payment);

            Order order = payment.getOrder();
            if (order != null) {
                order.setPaymentStatus("PAID");
                orderRepository.save(order);
                log.info("Order {} and Payment {} marked as PAID", order.getId(), orderCode);
            }
        } else {
            log.warn("Webhook received for unknown orderCode: {}", orderCode);
        }

        return data;
    }

    @Override
    @Transactional
    public PaymentLink getPaymentLinkInformation(long orderCode) throws Exception {
        try {
            PaymentLink paymentLink = payOS.paymentRequests().get(orderCode);
            // Optionally, update our local DB status here if it's PAID
            if (paymentLink != null) {
                String payOSStatus = paymentLink.getStatus() != null ? paymentLink.getStatus().name() : null;
                if ("PAID".equals(payOSStatus)) {
                    Payment payment = paymentRepository.findById(orderCode).orElse(null);
                    if (payment != null && !"PAID".equals(payment.getStatus())) {
                        payment.setStatus("PAID");
                        payment.setPaidAt(Instant.now());
                        paymentRepository.save(payment);
                        
                        Order order = payment.getOrder();
                        if (order != null) {
                            order.setPaymentStatus("PAID");
                            orderRepository.save(order);
                            log.info("Order {} and Payment {} marked as PAID via get API", order.getId(), orderCode);
                        }
                    }
                }
            }
            return paymentLink;
        } catch (vn.payos.exception.APIException e) {
            log.error("APIException: Lỗi lấy thông tin thanh toán. Chi tiết: {}", e.getMessage());
            throw new Exception("Lỗi gọi PayOS: " + e.getMessage());
        } catch (Exception e) {
            log.error("Lỗi lấy thông tin thanh toán: {}", e.getMessage(), e);
            throw new Exception("Đã xảy ra lỗi khi lấy thông tin thanh toán.");
        }
    }
}
