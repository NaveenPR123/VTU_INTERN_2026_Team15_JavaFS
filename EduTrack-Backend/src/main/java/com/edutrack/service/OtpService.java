package com.edutrack.service;

import com.edutrack.entity.OtpVerification;
import com.edutrack.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    @Autowired private OtpRepository otpRepo;
    @Autowired private EmailService   emailService;

    @Transactional
    public String generateAndSendOtp(String email) {
        String otp = String.valueOf(new SecureRandom().nextInt(900000) + 100000);
        otpRepo.deleteByEmail(email);

        OtpVerification otpEntity = new OtpVerification();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        otpEntity.setUsed(false);
        otpRepo.save(otpEntity);
        otpRepo.flush(); // ensure saved before email

        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            System.out.println("[OTP] Email send failed (OTP still saved): " + e.getMessage());
        }
        System.out.println("[OTP] Generated OTP for " + email + " → " + otp);
        return otp;
    }

    @Transactional
    public void sendPasswordResetOtp(String email) {
        String otp = String.valueOf(new SecureRandom().nextInt(900000) + 100000);
        otpRepo.deleteByEmail(email);

        OtpVerification otpEntity = new OtpVerification();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        otpEntity.setUsed(false);
        otpRepo.save(otpEntity);
        otpRepo.flush(); // ensure saved before email

        try {
            emailService.sendPasswordResetEmail(email, otp);
        } catch (Exception e) {
            System.out.println("[OTP] Email send failed (OTP still saved): " + e.getMessage());
        }
        System.out.println("[OTP] Password reset OTP for " + email + " → " + otp);
    }

    public boolean validateOtp(String email, String otp) {
        Optional<OtpVerification> opt = otpRepo.findTopByEmailOrderByIdDesc(email);

        if (opt.isEmpty()) {
            System.out.println("[OTP] No OTP record found for email: " + email);
            return false;
        }

        OtpVerification otpEntity = opt.get();
        System.out.println("[OTP] Validating for " + email
            + " | stored=" + otpEntity.getOtp()
            + " | provided=" + otp
            + " | used=" + otpEntity.isUsed()
            + " | expiry=" + otpEntity.getExpiryTime());

        if (otpEntity.isUsed()) {
            System.out.println("[OTP] OTP already used for: " + email);
            return false;
        }

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            System.out.println("[OTP] OTP expired for: " + email);
            return false;
        }

        if (!otpEntity.getOtp().equals(otp)) {
            System.out.println("[OTP] OTP mismatch for: " + email);
            return false;
        }

        otpEntity.setUsed(true);
        otpRepo.save(otpEntity);
        System.out.println("[OTP] OTP validated successfully for: " + email);
        return true;
    }
}
