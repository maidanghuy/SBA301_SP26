package com.lacvn.controller;

import com.lacvn.common.ApiResponse;
import com.lacvn.common.ApiResponses;
import com.lacvn.dto.payment.CheckoutRequest;
import com.lacvn.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLink;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CreatePaymentLinkResponse>> createPaymentLink(
            @RequestBody CheckoutRequest request,
            HttpServletRequest req
    ) throws Exception {
        CreatePaymentLinkResponse data = paymentService.createPaymentLink(request);
        return ResponseEntity.ok(ApiResponses.ok(data, req));
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse<String>> handlePayOSWebhook(
            @RequestBody Webhook webhookBody,
            HttpServletRequest req
    ) throws Exception {
        log.info("Received webhook from PayOS");
        WebhookData data = paymentService.verifyPaymentWebhook(webhookBody);
        log.info("Webhook verified for orderCode: {}", data.getOrderCode());
        return ResponseEntity.ok(ApiResponses.ok("success", req));
    }

    @GetMapping("/{orderCode}")
    public ResponseEntity<ApiResponse<PaymentLink>> getPaymentStatus(
            @PathVariable long orderCode,
            HttpServletRequest req
    ) throws Exception {
        PaymentLink paymentLink = paymentService.getPaymentLinkInformation(orderCode);
        return ResponseEntity.ok(ApiResponses.ok(paymentLink, req));
    }
}
