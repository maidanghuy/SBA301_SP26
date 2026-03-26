package com.lacvn.service;

public interface OtpService {
    String generateOtp();
    void sendOtp(String email);
    boolean verifyOtp(String email, String inputOtp);
}