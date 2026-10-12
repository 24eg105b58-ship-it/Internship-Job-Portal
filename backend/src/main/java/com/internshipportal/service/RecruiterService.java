package com.internshipportal.service;

import com.internshipportal.dto.request.RecruiterProfileRequest;
import com.internshipportal.dto.response.RecruiterDashboardStatsDto;
import com.internshipportal.dto.response.RecruiterDto;

public interface RecruiterService {

    RecruiterDto getProfile(String email);

    RecruiterDto updateProfile(String email, RecruiterProfileRequest request);

    RecruiterDto getRecruiterById(Long recruiterId);

    RecruiterDashboardStatsDto getRecruiterDashboard(String email);
}
