package com.internshipportal;

import com.internshipportal.controller.AdminController;
import com.internshipportal.controller.StudentController;
import com.internshipportal.entity.Role;
import com.internshipportal.security.CustomUserDetailsService;
import com.internshipportal.security.JwtAuthenticationEntryPoint;
import com.internshipportal.security.JwtTokenProvider;
import com.internshipportal.security.UserPrincipal;
import com.internshipportal.service.AdminService;
import com.internshipportal.service.JobService;
import com.internshipportal.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @MockBean
    private StudentService studentService;

    @MockBean
    private JobService jobService;

    @Test
    void testPublicJobsEndpoint_PermittedWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk());
    }

    @Test
    void testAdminEndpoint_UnauthorizedWhenNoToken() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "student@test.com", roles = {"STUDENT"})
    void testAdminEndpoint_ForbiddenForStudent() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@portal.com", roles = {"ADMIN"})
    void testAdminEndpoint_AllowedForAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isOk());
    }
}
