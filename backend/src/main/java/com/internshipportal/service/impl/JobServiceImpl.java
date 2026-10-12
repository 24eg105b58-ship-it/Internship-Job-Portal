package com.internshipportal.service.impl;

import com.internshipportal.dto.request.JobCreateRequest;
import com.internshipportal.dto.request.JobUpdateRequest;
import com.internshipportal.dto.response.JobDto;
import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.entity.*;
import com.internshipportal.exception.ForbiddenException;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.repository.*;
import com.internshipportal.service.JobService;
import com.internshipportal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final RecruiterRepository recruiterRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public JobDto createJob(JobCreateRequest request, String recruiterEmail) {
        Recruiter recruiter = recruiterRepository.findByUserEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for email: " + recruiterEmail));

        String companyName = StringUtils.hasText(request.getCompanyName())
                ? request.getCompanyName().trim()
                : recruiter.getCompanyName();

        Job job = Job.builder()
                .title(request.getTitle().trim())
                .companyName(companyName)
                .description(request.getDescription().trim())
                .responsibilities(request.getResponsibilities())
                .requirements(request.getRequirements())
                .location(request.getLocation().trim())
                .jobType(request.getJobType())
                .salary(request.getSalary())
                .experience(request.getExperience())
                .skills(request.getSkills())
                .deadline(request.getDeadline())
                .openings(request.getOpenings() != null ? request.getOpenings() : 1)
                .status(JobStatus.PENDING)
                .recruiter(recruiter)
                .build();

        job = jobRepository.save(job);

        // Send confirmation notification to recruiter
        notificationService.sendNotification(
                recruiter.getUser(),
                "Job Submitted for Approval",
                "Your job posting '" + job.getTitle() + "' was submitted and is pending administrator review.",
                NotificationType.NEW_JOB_POSTED,
                "/recruiter/jobs"
        );

        return mapToJobDto(job, null);
    }

    @Override
    @Transactional
    public JobDto updateJob(Long id, JobUpdateRequest request, String userEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        validateJobManagementAccess(job, userEmail);

        job.setTitle(request.getTitle().trim());
        if (StringUtils.hasText(request.getCompanyName())) {
            job.setCompanyName(request.getCompanyName().trim());
        }
        job.setDescription(request.getDescription().trim());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation().trim());
        job.setJobType(request.getJobType());
        job.setSalary(request.getSalary());
        job.setExperience(request.getExperience());
        job.setSkills(request.getSkills());
        job.setDeadline(request.getDeadline());
        if (request.getOpenings() != null) {
            job.setOpenings(request.getOpenings());
        }
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }

        job = jobRepository.save(job);
        return mapToJobDto(job, null);
    }

    @Override
    @Transactional
    public void deleteJob(Long id, String userEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        validateJobManagementAccess(job, userEmail);
        jobRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public JobDto getJobById(Long id, String currentUserEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        Long studentId = null;
        if (StringUtils.hasText(currentUserEmail)) {
            studentId = studentRepository.findByUserEmail(currentUserEmail)
                    .map(Student::getId)
                    .orElse(null);
        }

        return mapToJobDto(job, studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobDto> searchJobs(
            String search,
            String location,
            String company,
            JobType jobType,
            JobStatus status,
            Pageable pageable,
            String currentUserEmail
    ) {
        String cleanSearch = StringUtils.hasText(search) ? search.trim() : null;
        String cleanLocation = StringUtils.hasText(location) ? location.trim() : null;
        String cleanCompany = StringUtils.hasText(company) ? company.trim() : null;

        Page<Job> page = jobRepository.searchJobs(cleanSearch, cleanLocation, cleanCompany, jobType, status, pageable);

        Long studentId = null;
        if (StringUtils.hasText(currentUserEmail)) {
            studentId = studentRepository.findByUserEmail(currentUserEmail)
                    .map(Student::getId)
                    .orElse(null);
        }

        final Long finalStudentId = studentId;
        List<JobDto> dtos = page.getContent().stream()
                .map(j -> mapToJobDto(j, finalStudentId))
                .collect(Collectors.toList());

        return PagedResponse.of(page, dtos);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobDto> getRecruiterJobs(String recruiterEmail, Pageable pageable) {
        Page<Job> page = jobRepository.findByRecruiterUserEmail(recruiterEmail, pageable);
        List<JobDto> dtos = page.getContent().stream()
                .map(j -> mapToJobDto(j, null))
                .collect(Collectors.toList());
        return PagedResponse.of(page, dtos);
    }

    @Override
    @Transactional
    public JobDto approveJob(Long id, String adminEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        job.setStatus(JobStatus.APPROVED);
        job = jobRepository.save(job);

        // Notify Recruiter
        notificationService.sendNotification(
                job.getRecruiter().getUser(),
                "Job Posting Approved",
                "Your job posting '" + job.getTitle() + "' has been approved and is now live for candidates.",
                NotificationType.JOB_APPROVED,
                "/jobs/" + job.getId()
        );

        return mapToJobDto(job, null);
    }

    @Override
    @Transactional
    public JobDto rejectJob(Long id, String reason, String adminEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        job.setStatus(JobStatus.REJECTED);
        job = jobRepository.save(job);

        String rejectionReason = StringUtils.hasText(reason) ? " Reason: " + reason : "";
        notificationService.sendNotification(
                job.getRecruiter().getUser(),
                "Job Posting Rejected",
                "Your job posting '" + job.getTitle() + "' was not approved." + rejectionReason,
                NotificationType.JOB_REJECTED,
                "/recruiter/jobs"
        );

        return mapToJobDto(job, null);
    }

    private void validateJobManagementAccess(Job job, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            return;
        }

        if (user.getRole() == Role.RECRUITER && job.getRecruiter().getUser().getId().equals(user.getId())) {
            return;
        }

        throw new ForbiddenException("You do not have permission to modify this job posting");
    }

    private JobDto mapToJobDto(Job job, Long studentId) {
        boolean isApplied = false;
        boolean isSaved = false;
        String appStatus = null;

        if (studentId != null) {
            var appOpt = applicationRepository.findByStudentIdAndJobId(studentId, job.getId());
            if (appOpt.isPresent()) {
                isApplied = true;
                appStatus = appOpt.get().getStatus().name();
            }
            isSaved = savedJobRepository.existsByStudentIdAndJobId(studentId, job.getId());
        }

        long applicantCount = applicationRepository.countByJobRecruiterId(job.getId()); // or custom count by jobId

        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .description(job.getDescription())
                .responsibilities(job.getResponsibilities())
                .requirements(job.getRequirements())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .salary(job.getSalary())
                .experience(job.getExperience())
                .skills(job.getSkills())
                .deadline(job.getDeadline())
                .openings(job.getOpenings())
                .status(job.getStatus())
                .recruiterId(job.getRecruiter().getId())
                .recruiterName(job.getRecruiter().getUser().getFullName())
                .recruiterEmail(job.getRecruiter().getUser().getEmail())
                .companyWebsite(job.getRecruiter().getCompanyWebsite())
                .companyLogo(job.getRecruiter().getCompanyLogo())
                .applicantCount(applicantCount)
                .isApplied(isApplied)
                .isSaved(isSaved)
                .applicationStatus(appStatus)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
