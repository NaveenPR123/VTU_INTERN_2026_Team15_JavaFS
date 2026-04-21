package com.edutrack;

import com.edutrack.entity.OtpVerification;
import com.edutrack.repository.OtpRepository;
import com.edutrack.service.EmailService;
import com.edutrack.service.OtpService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Mock private OtpRepository otpRepo;
    @Mock private EmailService emailService;

    @InjectMocks
    private OtpService otpService;

    // ── validateOtp ───────────────────────────────────────────

    @Test
    void validateOtp_validOtp_returnsTrue() {
        OtpVerification otp = new OtpVerification();
        otp.setEmail("test@test.com");
        otp.setOtp("123456");
        otp.setUsed(false);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        when(otpRepo.findTopByEmailOrderByIdDesc("test@test.com")).thenReturn(Optional.of(otp));
        when(otpRepo.save(any())).thenReturn(otp);

        boolean result = otpService.validateOtp("test@test.com", "123456");

        assertTrue(result);
    }

    @Test
    void validateOtp_wrongOtp_returnsFalse() {
        OtpVerification otp = new OtpVerification();
        otp.setEmail("test@test.com");
        otp.setOtp("123456");
        otp.setUsed(false);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        when(otpRepo.findTopByEmailOrderByIdDesc("test@test.com")).thenReturn(Optional.of(otp));

        boolean result = otpService.validateOtp("test@test.com", "999999");

        assertFalse(result);
    }

    @Test
    void validateOtp_expiredOtp_returnsFalse() {
        OtpVerification otp = new OtpVerification();
        otp.setEmail("test@test.com");
        otp.setOtp("123456");
        otp.setUsed(false);
        otp.setExpiryTime(LocalDateTime.now().minusMinutes(15)); // expired

        when(otpRepo.findTopByEmailOrderByIdDesc("test@test.com")).thenReturn(Optional.of(otp));

        boolean result = otpService.validateOtp("test@test.com", "123456");

        assertFalse(result);
    }

    @Test
    void validateOtp_alreadyUsed_returnsFalse() {
        OtpVerification otp = new OtpVerification();
        otp.setEmail("test@test.com");
        otp.setOtp("123456");
        otp.setUsed(true); // already used
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        when(otpRepo.findTopByEmailOrderByIdDesc("test@test.com")).thenReturn(Optional.of(otp));

        boolean result = otpService.validateOtp("test@test.com", "123456");

        assertFalse(result);
    }

    @Test
    void validateOtp_noRecordFound_returnsFalse() {
        when(otpRepo.findTopByEmailOrderByIdDesc("ghost@test.com")).thenReturn(Optional.empty());

        boolean result = otpService.validateOtp("ghost@test.com", "123456");

        assertFalse(result);
    }

    @Test
    void validateOtp_marksOtpAsUsedAfterSuccess() {
        OtpVerification otp = new OtpVerification();
        otp.setEmail("test@test.com");
        otp.setOtp("123456");
        otp.setUsed(false);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        when(otpRepo.findTopByEmailOrderByIdDesc("test@test.com")).thenReturn(Optional.of(otp));
        when(otpRepo.save(any())).thenReturn(otp);

        otpService.validateOtp("test@test.com", "123456");

        assertTrue(otp.isUsed());
        verify(otpRepo, times(1)).save(otp);
    }

    // ── generateAndSendOtp ────────────────────────────────────

    @Test
    void generateAndSendOtp_savesOtpToRepo() throws Exception {
        when(otpRepo.save(any())).thenAnswer(i -> i.getArgument(0));
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString());

        otpService.generateAndSendOtp("test@test.com");

        verify(otpRepo, times(1)).save(any(OtpVerification.class));
    }

    @Test
    void generateAndSendOtp_deletesOldOtpFirst() throws Exception {
        when(otpRepo.save(any())).thenAnswer(i -> i.getArgument(0));
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString());

        otpService.generateAndSendOtp("test@test.com");

        verify(otpRepo, times(1)).deleteByEmail("test@test.com");
    }
}
