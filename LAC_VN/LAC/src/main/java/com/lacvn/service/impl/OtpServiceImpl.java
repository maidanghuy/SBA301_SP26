package com.lacvn.service.impl;

import com.lacvn.service.OtpService;
import com.lacvn.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {
    private final RedisService redisService;
    private final EmailServiceImpl emailServiceImpl;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public String generateOtp() {
        int otp = 100000 + SECURE_RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }

    public void sendOtp(String email) {
        String otpCode = generateOtp();
        redisService.saveOtp(email, otpCode);
        emailServiceImpl.sendOtpEmail(email, otpCode);
    }

    public boolean verifyOtp(String email, String inputOtp) {
        String storedOtp = redisService.getOtp(email);

        if (storedOtp == null || !storedOtp.equals(inputOtp)) {
            return false;
        }

        // Output OTP is correct
        redisService.markOtpAsVerified(email);
        redisService.deleteOtp(email);

        return true;
    }
}
