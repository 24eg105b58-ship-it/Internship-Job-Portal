package com.internshipportal.service.impl;

import com.internshipportal.dto.request.StudentProfileRequest;
import com.internshipportal.dto.response.ApplicationDto;
import com.internshipportal.dto.response.JobDto;
import com.internshipportal.dto.response.StudentDashboardStatsDto;
import com.internshipportal.dto.response.StudentDto;
import com.internshipportal.entity.*;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.repository.*;
import com.internshipportal.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final SavedJobRepository savedJobRepository;
    private final ResumeRepository resumeRepository;

    @Override
    @Transactional(readOnly = true)
    public StudentDto getProfile(String email) {
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for email: " + email));
        return mapToDto(student);
    }

    @Override
    @Transactional
    public StudentDto updateProfile(String email, StudentProfileRequest request) {
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for email: " + email));

        User user = student.getUser();
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setProfileSummary(request.getProfileSummary());
        userRepository.save(user);

        student.setUniversity(request.getUniversity());
        student.setDegree(request.getDegree());
        student.setGraduationYear(request.getGraduationYear());
        student.setCgpa(request.getCgpa());
        student.setSkills(request.getSkills());
        student.setExperienceYears(request.getExperienceYears());
        student.setGithubUrl(request.getGithubUrl());
        student.setLinkedinUrl(request.getLinkedinUrl());
        student.setPortfolioUrl(request.getPortfolioUrl());
        student.setLocation(request.getLocation());

        if (request.getDefaultResumeId() != null) {
            var resumeOpt = resumeRepository.findById(request.getDefaultResumeId());
            if (resumeOpt.isPresent() && resumeOpt.get().getStudent().getId().equals(student.getId())) {
                student.setDefaultResumeId(resumeOpt.get().getId());
                student.setResumePath(resumeOpt.get().getFileName());
            }
        }

        Student savedStudent = studentRepository.save(student);
        return mapToDto(savedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        return mapToDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDashboardStatsDto getStudentDashboard(String email) {
        Student student = studentRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        long totalApps = applicationRepository.countByStudentId(student.getId());
        long underReview = applicationRepository.countByStudentIdAndStatus(student.getId(), ApplicationStatus.UNDER_REVIEW);
        long shortlisted = applicationRepository.countByStudentIdAndStatus(student.getId(), ApplicationStatus.SHORTLISTED);
        long selected = applicationRepository.countByStudentIdAndStatus(student.getId(), ApplicationStatus.SELECTED);
        long rejected = applicationRepository.countByStudentIdAndStatus(student.getId(), ApplicationStatus.REJECTED);

        Page<SavedJob> savedPage = savedJobRepository.findByStudentIdOrderBySavedAtDesc(student.getId(), PageRequest.of(0, 1));
        long savedJobsCount = savedPage.getTotalElements();

        Page<Application> recentAppsPage = applicationRepository.findByStudentId(
                student.getId(),
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "appliedAt"))
        );

        List<ApplicationDto> recentApps = recentAppsPage.getContent().stream()
                .map(app -> ApplicationDto.builder()
                        .id(app.getId())
                        .studentId(student.getId())
                        .studentName(student.getUser().getFullName())
                        .studentEmail(student.getUser().getEmail())
                        .jobId(app.getJob().getId())
                        .jobTitle(app.getJob().getTitle())
                        .companyName(app.getJob().getCompanyName())
                        .jobLocation(app.getJob().getLocation())
                        .jobType(app.getJob().getJobType().name())
                        .status(app.getStatus())
                        .appliedAt(app.getAppliedAt())
                        .build())
                .collect(Collectors.toList());

        // Recommended jobs: approved jobs
        String skillsKeyword = StringUtils.hasText(student.getSkills()) ? student.getSkills().split(",")[0].trim() : null;
        Page<Job> recommendedJobsPage = jobRepository.searchJobs(
                skillsKeyword, null, null, null, JobStatus.APPROVED,
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

        List<JobDto> recommendedJobs = recommendedJobsPage.getContent().stream()
                .map(job -> JobDto.builder()
                        .id(job.getId())
                        .title(job.getTitle())
                        .companyName(job.getCompanyName())
                        .description(job.getDescription())
                        .location(job.getLocation())
                        .jobType(job.getJobType())
                        .salary(job.getSalary())
                        .skills(job.getSkills())
                        .deadline(job.getDeadline())
                        .status(job.getStatus())
                        .isApplied(applicationRepository.existsByStudentIdAndJobId(student.getId(), job.getId()))
                        .isSaved(savedJobRepository.existsByStudentIdAndJobId(student.getId(), job.getId()))
                        .createdAt(job.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return StudentDashboardStatsDto.builder()
                .totalApplications(totalApps)
                .underReviewApplications(underReview)
                .shortlistedApplications(shortlisted)
                .selectedApplications(selected)
                .rejectedApplications(rejected)
                .savedJobsCount(savedJobsCount)
                .recentApplications(recentApps)
                .recommendedJobs(recommendedJobs)
                .build();
    }

    private StudentDto mapToDto(Student s) {
        User u = s.getUser();
        return StudentDto.builder()
                .id(s.getId())
                .userId(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .profileSummary(u.getProfileSummary())
                .university(s.getUniversity())
                .degree(s.getDegree())
                .graduationYear(s.getGraduationYear())
                .cgpa(s.getCgpa())
                .skills(s.getSkills())
                .experienceYears(s.getExperienceYears())
                .githubUrl(s.getGithubUrl())
                .linkedinUrl(s.getLinkedinUrl())
                .portfolioUrl(s.getPortfolioUrl())
                .location(s.getLocation())
                .defaultResumeId(s.getDefaultResumeId())
                .active(u.isActive())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
