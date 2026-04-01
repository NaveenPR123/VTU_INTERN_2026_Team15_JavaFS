package com.edutrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("EduTrack – OTP Verification");
        message.setText(
                "Hello!\n\n" +
                        "Your EduTrack verification OTP is: " + otp + "\n\n" +
                        "This OTP is valid for 10 minutes.\n" +
                        "Do not share this OTP with anyone.\n\n" +
                        "– EduTrack Team"
        );
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("EduTrack – Password Reset OTP");
        message.setText(
                "Hello!\n\n" +
                        "Your password reset OTP is: " + otp + "\n\n" +
                        "This OTP expires in 10 minutes.\n" +
                        "If you did not request this, ignore this email.\n\n" +
                        "– EduTrack Team"
        );
        mailSender.send(message);
    }
}
