package com.internshipportal.service.impl;

import com.internshipportal.dto.request.RecruiterProfileRequest;
import com.internshipportal.dto.response.ApplicationDto;
import com.internshipportal.dto.response.JobDto;
import com.internshipportal.dto.response.RecruiterDashboardStatsDto;
import com.internshipportal.dto.response.RecruiterDto;
import com.internshipportal.entity.*;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.repository.*;
import com.internshipportal.service.RecruiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruiterServiceImpl implements RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    @Transactional(readOnly = true)
    public RecruiterDto getProfile(String email) {
        Recruiter recruiter = recruiterRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for email: " + email));
        return mapToDto(recruiter);
    }

    @Override
    @Transactional
    public RecruiterDto updateProfile(String email, RecruiterProfileRequest request) {
        Recruiter recruiter = recruiterRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for email: " + email));

        User user = recruiter.getUser();
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setProfileSummary(request.getProfileSummary());
        userRepository.save(user);

        recruiter.setCompanyName(request.getCompanyName().trim());
        recruiter.setCompanyWebsite(request.getCompanyWebsite());
        recruiter.setCompanyDescription(request.getCompanyDescription());
        recruiter.setDesignation(request.getDesignation());
        recruiter.setCompanyLogo(request.getCompanyLogo());
        recruiter.setLocation(request.getLocation());

        recruiter = recruiterRepository.save(recruiter);
        return mapToDto(recruiter);
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterDto getRecruiterById(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + recruiterId));
        return mapToDto(recruiter);
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterDashboardStatsDto getRecruiterDashboard(String email) {
        Recruiter recruiter = recruiterRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        long totalJobs = jobRepository.countByRecruiterId(recruiter.getId());
        long activeJobs = jobRepository.countByRecruiterIdAndStatus(recruiter.getId(), JobStatus.APPROVED);
        long pendingJobs = jobRepository.countByRecruiterIdAndStatus(recruiter.getId(), JobStatus.PENDING);

        long totalApplicants = applicationRepository.countByJobRecruiterId(recruiter.getId());
        long shortlisted = applicationRepository.countByJobRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.SHORTLISTED);
        long selected = applicationRepository.countByJobRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.SELECTED);
        long pendingReview = applicationRepository.countByJobRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.APPLIED);

        Page<Application> recentAppsPage = applicationRepository.searchRecruiterApplications(
                recruiter.getId(),
                null,
                null,
                null,
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "appliedAt"))
        );

        List<ApplicationDto> recentApplicants = recentAppsPage.getContent().stream()
                .map(app -> ApplicationDto.builder()
                        .id(app.getId())
                        .studentId(app.getStudent().getId())
                        .studentName(app.getStudent().getUser().getFullName())
                        .studentEmail(app.getStudent().getUser().getEmail())
                        .studentPhone(app.getStudent().getUser().getPhoneNumber())
                        .studentUniversity(app.getStudent().getUniversity())
                        .studentSkills(app.getStudent().getSkills())
                        .jobId(app.getJob().getId())
                        .jobTitle(app.getJob().getTitle())
                        .companyName(app.getJob().getCompanyName())
                        .resumeId(app.getResume() != null ? app.getResume().getId() : null)
                        .resumeFileName(app.getResume() != null ? app.getResume().getFileName() : null)
                        .status(app.getStatus())
                        .appliedAt(app.getAppliedAt())
                        .build())
                .collect(Collectors.toList());

        Page<Job> recentJobsPage = jobRepository.findByRecruiterId(
                recruiter.getId(),
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        List<JobDto> recentJobs = recentJobsPage.getContent().stream()
                .map(j -> JobDto.builder()
                        .id(j.getId())
                        .title(j.getTitle())
                        .companyName(j.getCompanyName())
                        .jobType(j.getJobType())
                        .location(j.getLocation())
                        .salary(j.getSalary())
                        .status(j.getStatus())
                        .openings(j.getOpenings())
                        .applicantCount(applicationRepository.countByJobRecruiterId(j.getId()))
                        .createdAt(j.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return RecruiterDashboardStatsDto.builder()
                .totalJobs(totalJobs)
                .activeJobs(activeJobs)
                .pendingJobs(pendingJobs)
                .totalApplicants(totalApplicants)
                .shortlistedCandidates(shortlisted)
                .selectedCandidates(selected)
                .pendingReviewApplicants(pendingReview)
                .recentApplicants(recentApplicants)
                .recentJobs(recentJobs)
                .build();
    }

    private RecruiterDto mapToDto(Recruiter r) {
        User u = r.getUser();
        return RecruiterDto.builder()
                .id(r.getId())
                .userId(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .profileSummary(u.getProfileSummary())
                .companyName(r.getCompanyName())
                .companyWebsite(r.getCompanyWebsite())
                .companyDescription(r.getCompanyDescription())
                .designation(r.getDesignation())
                .companyLogo(r.getCompanyLogo())
                .location(r.getLocation())
                .verified(r.isVerified())
                .active(u.isActive())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
