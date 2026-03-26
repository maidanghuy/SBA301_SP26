package com.lacvn.service;

public interface RedisService {
    void saveOtp(String email, String otpCode);

    String getOtp(String email);

    void deleteOtp(String email);

    void markOtpAsVerified(String email);

    boolean isOtpVerified(String email);

    void deleteVerifiedOtp(String email);
}