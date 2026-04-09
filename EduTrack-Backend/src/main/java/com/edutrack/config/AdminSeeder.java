package com.edutrack.config;

import com.edutrack.entity.Admin;
import com.edutrack.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements ApplicationRunner {

    @Autowired private AdminRepository adminRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public void run(ApplicationArguments args) {
        if (!adminRepo.existsByEmail("admin@edutrack.com")) {
            Admin admin = new Admin();
            admin.setName("Admin");
            admin.setEmail("admin@edutrack.com");
            admin.setPassword(encoder.encode("Admin@123"));
            adminRepo.save(admin);
            System.out.println("[SEEDER] Default admin created: admin@edutrack.com / Admin@123");
        }
    }
}
