package com.lacvn.service;

import com.lacvn.dto.payment.CheckoutRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.webhooks.WebhookData;
import vn.payos.model.webhooks.Webhook;

import vn.payos.model.v2.paymentRequests.PaymentLink;

public interface PaymentService {
    CreatePaymentLinkResponse createPaymentLink(CheckoutRequest request) throws Exception;
    WebhookData verifyPaymentWebhook(Webhook webhookBody) throws Exception;
    PaymentLink getPaymentLinkInformation(long orderCode) throws Exception;
}
