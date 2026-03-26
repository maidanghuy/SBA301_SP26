package com.lacvn.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otpCode);
}