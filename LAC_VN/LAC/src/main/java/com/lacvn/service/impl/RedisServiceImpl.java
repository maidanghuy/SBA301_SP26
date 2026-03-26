package com.lacvn.service.impl;

import com.lacvn.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {
    private final StringRedisTemplate redisTemplate;
    private static final String OTP_PREFIX = "otp:";
    private static final String OTP_VERIFIED_PREFIX = "otp_verified:";
    private static final long OTP_TTL_MINUTES = 5;
    private static final long VERIFIED_OTP_TTL_MINUTES = 15;

    public void saveOtp(String email, String otpCode) {
        String key = OTP_PREFIX + email;
        redisTemplate.opsForValue().set(key, otpCode, OTP_TTL_MINUTES, TimeUnit.MINUTES);
    }

    public String getOtp(String email) {
        String key = OTP_PREFIX + email;
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteOtp(String email) {
        String key = OTP_PREFIX + email;
        redisTemplate.delete(key);
    }

    public void markOtpAsVerified(String email) {
        String key = OTP_VERIFIED_PREFIX + email;
        redisTemplate.opsForValue().set(key, "true", VERIFIED_OTP_TTL_MINUTES, TimeUnit.MINUTES);
    }

    public boolean isOtpVerified(String email) {
        String key = OTP_VERIFIED_PREFIX + email;
        String val = redisTemplate.opsForValue().get(key);
        return "true".equals(val);
    }

    public void deleteVerifiedOtp(String email) {
        String key = OTP_VERIFIED_PREFIX + email;
        redisTemplate.delete(key);
    }
}
