package com.internshipportal.service.impl;

import com.internshipportal.dto.response.*;
import com.internshipportal.entity.*;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.repository.*;
import com.internshipportal.service.AdminService;
import com.internshipportal.service.JobService;
import com.internshipportal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobService jobService;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStats() {
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalRecruiters = userRepository.countByRole(Role.RECRUITER);
        long totalJobs = jobRepository.count();
        long pendingJobs = jobRepository.countByStatus(JobStatus.PENDING);
        long approvedJobs = jobRepository.countByStatus(JobStatus.APPROVED);
        long totalApps = applicationRepository.count();
        long shortlisted = applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED);

        Map<String, Long> appsByStatus = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            appsByStatus.put(status.name(), applicationRepository.countByStatus(status));
        }

        Map<String, Long> jobsByType = new LinkedHashMap<>();
        for (JobType type : JobType.values()) {
            jobsByType.put(type.name(), 0L);
        }
        List<Object[]> typeCounts = jobRepository.countJobsByJobType();
        for (Object[] row : typeCounts) {
            JobType jt = (JobType) row[0];
            Long count = (Long) row[1];
            jobsByType.put(jt.name(), count);
        }

        Page<Application> recentAppsPage = applicationRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "appliedAt"))
        );
        List<ApplicationDto> recentApps = recentAppsPage.getContent().stream()
                .map(this::mapToApplicationDto)
                .collect(Collectors.toList());

        Page<Job> recentJobsPage = jobRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        List<JobDto> recentJobs = recentJobsPage.getContent().stream()
                .map(this::mapToJobDto)
                .collect(Collectors.toList());

        Page<User> recentUsersPage = userRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        List<UserDto> recentUsers = recentUsersPage.getContent().stream()
                .map(u -> UserDto.builder()
                        .id(u.getId())
                        .name(u.getFullName())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .active(u.isActive())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalRecruiters(totalRecruiters)
                .totalJobs(totalJobs)
                .pendingJobs(pendingJobs)
                .approvedJobs(approvedJobs)
                .totalApplications(totalApps)
                .shortlistedCandidates(shortlisted)
                .applicationsByStatus(appsByStatus)
                .jobsByType(jobsByType)
                .recentApplications(recentApps)
                .recentJobs(recentJobs)
                .recentUsers(recentUsers)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminReportDto getReports() {
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalRecruiters = userRepository.countByRole(Role.RECRUITER);
        long totalJobs = jobRepository.count();
        long totalApps = applicationRepository.count();

        Map<String, Long> appsDistribution = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            appsDistribution.put(status.name(), applicationRepository.countByStatus(status));
        }

        Map<String, Long> jobTypeDist = new LinkedHashMap<>();
        for (JobType jt : JobType.values()) {
            jobTypeDist.put(jt.name(), 0L);
        }
        for (Object[] row : jobRepository.countJobsByJobType()) {
            jobTypeDist.put(((JobType) row[0]).name(), (Long) row[1]);
        }

        List<Map<String, Object>> topRecruiters = new ArrayList<>();
        for (Object[] row : jobRepository.findTopRecruitersByJobs(PageRequest.of(0, 5))) {
            Map<String, Object> map = new HashMap<>();
            map.put("companyName", row[0]);
            map.put("jobCount", row[1]);
            topRecruiters.add(map);
        }

        List<Map<String, Object>> mostApplied = new ArrayList<>();
        for (Object[] row : applicationRepository.findMostAppliedJobs(PageRequest.of(0, 5))) {
            Map<String, Object> map = new HashMap<>();
            map.put("title", row[0]);
            map.put("companyName", row[1]);
            map.put("applicationCount", row[2]);
            mostApplied.add(map);
        }

        // Monthly trends mockup structure for charts
        List<Map<String, Object>> trends = List.of(
                Map.of("month", "Jan", "applications", 14L, "jobs", 8L),
                Map.of("month", "Feb", "applications", 22L, "jobs", 12L),
                Map.of("month", "Mar", "applications", 35L, "jobs", 18L),
                Map.of("month", "Apr", "applications", 48L, "jobs", 24L),
                Map.of("month", "May", "applications", 62L, "jobs", 30L),
                Map.of("month", "Jun", "applications", 85L, "jobs", 42L)
        );

        return AdminReportDto.builder()
                .totalUsers(totalUsers)
                .totalStudents(totalStudents)
                .totalRecruiters(totalRecruiters)
                .totalJobs(totalJobs)
                .totalApplications(totalApps)
                .applicationStatusDistribution(appsDistribution)
                .jobTypeDistribution(jobTypeDist)
                .topRecruiters(topRecruiters)
                .mostAppliedJobs(mostApplied)
                .monthlyApplicationTrends(trends)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<StudentDto> getAllStudents(String search, Pageable pageable) {
        String cleanSearch = StringUtils.hasText(search) ? search.trim() : null;
        Page<Student> page = studentRepository.searchStudents(cleanSearch, pageable);
        List<StudentDto> dtos = page.getContent().stream()
                .map(this::mapToStudentDto)
                .collect(Collectors.toList());
        return PagedResponse.of(page, dtos);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<RecruiterDto> getAllRecruiters(String search, Pageable pageable) {
        String cleanSearch = StringUtils.hasText(search) ? search.trim() : null;
        Page<Recruiter> page = recruiterRepository.searchRecruiters(cleanSearch, pageable);
        List<RecruiterDto> dtos = page.getContent().stream()
                .map(this::mapToRecruiterDto)
                .collect(Collectors.toList());
        return PagedResponse.of(page, dtos);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDto> getAllApplications(String search, ApplicationStatus status, Pageable pageable) {
        Page<Application> page = applicationRepository.searchRecruiterApplications(null, null, status, search, pageable);
        List<ApplicationDto> dtos = page.getContent().stream()
                .map(this::mapToApplicationDto)
                .collect(Collectors.toList());
        return PagedResponse.of(page, dtos);
    }

    @Override
    public JobDto approveJob(Long jobId, String adminEmail) {
        return jobService.approveJob(jobId, adminEmail);
    }

    @Override
    public JobDto rejectJob(Long jobId, String reason, String adminEmail) {
        return jobService.rejectJob(jobId, reason, adminEmail);
    }

    @Override
    public UserDto toggleUserStatus(Long userId, boolean active) {
        return userService.updateUserStatus(userId, active);
    }

    private StudentDto mapToStudentDto(Student s) {
        User u = s.getUser();
        return StudentDto.builder()
                .id(s.getId())
                .userId(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .university(s.getUniversity())
                .degree(s.getDegree())
                .graduationYear(s.getGraduationYear())
                .cgpa(s.getCgpa())
                .skills(s.getSkills())
                .location(s.getLocation())
                .active(u.isActive())
                .createdAt(s.getCreatedAt())
                .build();
    }

    private RecruiterDto mapToRecruiterDto(Recruiter r) {
        User u = r.getUser();
        return RecruiterDto.builder()
                .id(r.getId())
                .userId(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .companyName(r.getCompanyName())
                .companyWebsite(r.getCompanyWebsite())
                .designation(r.getDesignation())
                .location(r.getLocation())
                .verified(r.isVerified())
                .active(u.isActive())
                .createdAt(r.getCreatedAt())
                .build();
    }

    private ApplicationDto mapToApplicationDto(Application app) {
        return ApplicationDto.builder()
                .id(app.getId())
                .studentId(app.getStudent().getId())
                .studentName(app.getStudent().getUser().getFullName())
                .studentEmail(app.getStudent().getUser().getEmail())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .companyName(app.getJob().getCompanyName())
                .jobLocation(app.getJob().getLocation())
                .jobType(app.getJob().getJobType().name())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .build();
    }

    private JobDto mapToJobDto(Job job) {
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .salary(job.getSalary())
                .status(job.getStatus())
                .openings(job.getOpenings())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
