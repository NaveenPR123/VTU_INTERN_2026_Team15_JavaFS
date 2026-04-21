package com.edutrack;

import com.edutrack.controller.AuthController;
import com.edutrack.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@WithMockUser
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean  private AuthService authService;

    // ── POST /api/auth/login/admin ────────────────────────────

    @Test
    void adminLogin_validCredentials_returns200WithSuccess() throws Exception {
        when(authService.loginAdmin(anyString(), anyString()))
            .thenReturn(Map.of("success", true, "role", "admin", "message", "Login successful"));

        mockMvc.perform(post("/api/auth/login/admin")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "admin@edutrack.com",
                        "password", "Admin@123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.role").value("admin"));
    }

    @Test
    void adminLogin_wrongPassword_returns200WithFailure() throws Exception {
        when(authService.loginAdmin(anyString(), anyString()))
            .thenReturn(Map.of("success", false, "message", "Invalid email or password"));

        mockMvc.perform(post("/api/auth/login/admin")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "admin@edutrack.com",
                        "password", "wrongpass"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    // ── POST /api/auth/login/student ──────────────────────────

    @Test
    void studentLogin_validCredentials_returns200WithSuccess() throws Exception {
        when(authService.loginStudent(anyString(), anyString()))
            .thenReturn(Map.of("success", true, "role", "student", "message", "Login successful"));

        mockMvc.perform(post("/api/auth/login/student")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "student@test.com",
                        "password", "Test@123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.role").value("student"));
    }

    @Test
    void studentLogin_wrongPassword_returns200WithFailure() throws Exception {
        when(authService.loginStudent(anyString(), anyString()))
            .thenReturn(Map.of("success", false, "message", "Invalid email or password"));

        mockMvc.perform(post("/api/auth/login/student")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "student@test.com",
                        "password", "wrongpass"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }

    // ── POST /api/auth/login/teacher ──────────────────────────

    @Test
    void teacherLogin_validCredentials_returns200WithSuccess() throws Exception {
        when(authService.loginTeacher(anyString(), anyString()))
            .thenReturn(Map.of("success", true, "role", "teacher", "message", "Login successful"));

        mockMvc.perform(post("/api/auth/login/teacher")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "teacher@test.com",
                        "password", "Test@123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.role").value("teacher"));
    }

    // ── POST /api/auth/change-password/admin ─────────────────

    @Test
    void changeAdminPassword_correctPassword_returnsSuccess() throws Exception {
        when(authService.changeAdminPassword(1, "Admin@123", "NewPass@123"))
            .thenReturn(Map.of("success", true, "message", "Password changed successfully"));

        mockMvc.perform(post("/api/auth/change-password/admin")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "id", 1,
                        "currentPassword", "Admin@123",
                        "newPassword", "NewPass@123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void changeAdminPassword_missingFields_returnsFailure() throws Exception {
        mockMvc.perform(post("/api/auth/change-password/admin")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "id", 1))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));
    }
}
