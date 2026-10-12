package com.internshipportal.service;

import com.internshipportal.dto.request.StudentProfileRequest;
import com.internshipportal.dto.response.StudentDashboardStatsDto;
import com.internshipportal.dto.response.StudentDto;

public interface StudentService {

    StudentDto getProfile(String email);

    StudentDto updateProfile(String email, StudentProfileRequest request);

    StudentDto getStudentById(Long studentId);

    StudentDashboardStatsDto getStudentDashboard(String email);
}
