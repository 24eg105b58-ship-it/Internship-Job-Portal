package com.internshipportal.service.impl;

import com.internshipportal.dto.request.ApplicationCreateRequest;
import com.internshipportal.dto.request.ApplicationStatusUpdateRequest;
import com.internshipportal.dto.response.ApplicationDto;
import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.entity.*;
import com.internshipportal.exception.DuplicateResourceException;
import com.internshipportal.exception.ForbiddenException;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.exception.ValidationException;
import com.internshipportal.repository.*;
import com.internshipportal.service.ApplicationService;
import com.internshipportal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public ApplicationDto applyForJob(ApplicationCreateRequest request, String studentEmail) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + request.getJobId()));

        if (job.getStatus() != JobStatus.APPROVED) {
            throw new ValidationException("Cannot apply to a job that is not approved or is closed");
        }

        if (applicationRepository.existsByStudentIdAndJobId(student.getId(), job.getId())) {
            throw new DuplicateResourceException("You have already submitted an application for this position");
        }

        Resume resume = null;
        if (request.getResumeId() != null) {
            resume = resumeRepository.findById(request.getResumeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
            if (!resume.getStudent().getId().equals(student.getId())) {
                throw new ForbiddenException("Cannot use another student's resume");
            }
        } else if (student.getDefaultResumeId() != null) {
            resume = resumeRepository.findById(student.getDefaultResumeId()).orElse(null);
        }

        if (resume == null) {
            // Check if student has any resume uploaded
            List<Resume> resumes = resumeRepository.findByStudentIdOrderByUploadedAtDesc(student.getId());
            if (!resumes.isEmpty()) {
                resume = resumes.get(0);
            } else {
                throw new ValidationException("Please upload a resume before applying");
            }
        }

        Application application = Application.builder()
                .student(student)
                .job(job)
                .resume(resume)
                .status(ApplicationStatus.APPLIED)
                .coverNote(request.getCoverNote())
                .build();

        application = applicationRepository.save(application);

        // Notify Student
        notificationService.sendNotification(
                student.getUser(),
                "Application Submitted",
                "You successfully applied for '" + job.getTitle() + "' at " + job.getCompanyName() + ".",
                NotificationType.APPLICATION_SUBMITTED,
                "/applications"
        );

        // Notify Recruiter
        notificationService.sendNotification(
                job.getRecruiter().getUser(),
                "New Application Received",
                student.getUser().getFullName() + " applied for '" + job.getTitle() + "'.",
                NotificationType.APPLICATION_SUBMITTED,
                "/recruiter/applicants"
        );

        return mapToDto(application);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDto> getMyApplications(String studentEmail, Pageable pageable) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Page<Application> page = applicationRepository.findByStudentId(student.getId(), pageable);
        List<ApplicationDto> dtos = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PagedResponse.of(page, dtos);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationDto getApplicationById(Long id, String currentUserEmail) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isStudentOwner = application.getStudent().getUser().getId().equals(user.getId());
        boolean isRecruiterOwner = application.getJob().getRecruiter().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isStudentOwner && !isRecruiterOwner && !isAdmin) {
            throw new ForbiddenException("You do not have permission to view this application");
        }

        return mapToDto(application);
    }

    @Override
    @Transactional
    public ApplicationDto updateApplicationStatus(Long id, ApplicationStatusUpdateRequest request, String userEmail) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isRecruiterOwner = application.getJob().getRecruiter().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isRecruiterOwner && !isAdmin) {
            throw new ForbiddenException("Only the recruiting organization or an administrator can update candidate status");
        }

        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            application.setNotes(request.getNotes());
        }

        application = applicationRepository.save(application);

        // Send status change notification to candidate
        NotificationType notifType = switch (request.getStatus()) {
            case SHORTLISTED -> NotificationType.CANDIDATE_SHORTLISTED;
            case SELECTED -> NotificationType.CANDIDATE_SELECTED;
            case REJECTED -> NotificationType.CANDIDATE_REJECTED;
            default -> NotificationType.APPLICATION_STATUS_UPDATED;
        };

        String message = "Your application status for '" + application.getJob().getTitle() + "' at " +
                application.getJob().getCompanyName() + " was updated to: " + request.getStatus().name().replace('_', ' ');

        notificationService.sendNotification(
                application.getStudent().getUser(),
                "Application Status Updated",
                message,
                notifType,
                "/applications"
        );

        return mapToDto(application);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDto> getJobApplications(Long jobId, String recruiterEmail, Pageable pageable) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User user = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.ADMIN && !job.getRecruiter().getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Cannot view applicants for another recruiter's job");
        }

        Page<Application> page = applicationRepository.findByJobId(jobId, pageable);
        List<ApplicationDto> dtos = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PagedResponse.of(page, dtos);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationDto> searchRecruiterApplications(
            Long jobId,
            ApplicationStatus status,
            String search,
            String recruiterEmail,
            Pageable pageable
    ) {
        Recruiter recruiter = recruiterRepository.findByUserEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found"));

        String cleanSearch = search != null && !search.isBlank() ? search.trim() : null;

        Page<Application> page = applicationRepository.searchRecruiterApplications(
                recruiter.getId(),
                jobId,
                status,
                cleanSearch,
                pageable
        );

        List<ApplicationDto> dtos = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return PagedResponse.of(page, dtos);
    }

    @Override
    @Transactional
    public void withdrawApplication(Long id, String studentEmail) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        if (!application.getStudent().getUser().getEmail().equalsIgnoreCase(studentEmail)) {
            throw new ForbiddenException("Cannot withdraw another student's application");
        }

        if (application.getStatus() == ApplicationStatus.SELECTED) {
            throw new ValidationException("Cannot withdraw an application after being selected");
        }

        applicationRepository.delete(application);
    }

    private ApplicationDto mapToDto(Application app) {
        Student student = app.getStudent();
        Job job = app.getJob();
        Resume resume = app.getResume();

        return ApplicationDto.builder()
                .id(app.getId())
                .studentId(student.getId())
                .studentName(student.getUser().getFullName())
                .studentEmail(student.getUser().getEmail())
                .studentPhone(student.getUser().getPhoneNumber())
                .studentUniversity(student.getUniversity())
                .studentDegree(student.getDegree())
                .studentSkills(student.getSkills())
                .studentCgpa(student.getCgpa())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .companyName(job.getCompanyName())
                .jobLocation(job.getLocation())
                .jobType(job.getJobType().name())
                .jobSalary(job.getSalary())
                .resumeId(resume != null ? resume.getId() : null)
                .resumeFileName(resume != null ? resume.getFileName() : null)
                .resumeOriginalName(resume != null ? resume.getOriginalFileName() : null)
                .status(app.getStatus())
                .coverNote(app.getCoverNote())
                .notes(app.getNotes())
                .appliedAt(app.getAppliedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
