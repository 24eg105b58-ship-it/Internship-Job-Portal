package com.internshipportal;

import com.internshipportal.dto.request.ApplicationCreateRequest;
import com.internshipportal.dto.request.ApplicationStatusUpdateRequest;
import com.internshipportal.dto.response.ApplicationDto;
import com.internshipportal.entity.*;
import com.internshipportal.exception.DuplicateResourceException;
import com.internshipportal.exception.ValidationException;
import com.internshipportal.repository.*;
import com.internshipportal.service.NotificationService;
import com.internshipportal.service.impl.ApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private RecruiterRepository recruiterRepository;

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private User studentUser;
    private Student student;
    private User recruiterUser;
    private Recruiter recruiter;
    private Job approvedJob;
    private Job pendingJob;
    private Resume sampleResume;

    @BeforeEach
    void setUp() {
        studentUser = User.builder().id(1L).email("student@test.com").fullName("Student One").role(Role.STUDENT).build();
        student = Student.builder().id(100L).user(studentUser).build();

        recruiterUser = User.builder().id(2L).email("recruiter@test.com").fullName("Recruiter One").role(Role.RECRUITER).build();
        recruiter = Recruiter.builder().id(200L).user(recruiterUser).companyName("Acme").build();

        approvedJob = Job.builder()
                .id(10L)
                .title("Software Intern")
                .companyName("Acme")
                .status(JobStatus.APPROVED)
                .jobType(JobType.INTERNSHIP)
                .location("Remote")
                .recruiter(recruiter)
                .build();

        pendingJob = Job.builder()
                .id(11L)
                .title("Draft Intern")
                .companyName("Acme")
                .status(JobStatus.PENDING)
                .jobType(JobType.INTERNSHIP)
                .location("Remote")
                .recruiter(recruiter)
                .build();

        sampleResume = Resume.builder()
                .id(50L)
                .student(student)
                .fileName("alex_resume.pdf")
                .originalFileName("alex_resume.pdf")
                .filePath("alex_resume.pdf")
                .fileType("application/pdf")
                .build();
    }

    @Test
    void testApplyForJob_Success() {
        ApplicationCreateRequest request = ApplicationCreateRequest.builder()
                .jobId(10L)
                .coverNote("Excited to apply")
                .build();

        when(studentRepository.findByUserEmail("student@test.com")).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(approvedJob));
        when(applicationRepository.existsByStudentIdAndJobId(100L, 10L)).thenReturn(false);
        when(resumeRepository.findByStudentIdOrderByUploadedAtDesc(100L)).thenReturn(Collections.singletonList(sampleResume));
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> {
            Application app = invocation.getArgument(0);
            app.setId(500L);
            return app;
        });

        ApplicationDto result = applicationService.applyForJob(request, "student@test.com");

        assertNotNull(result);
        assertEquals(ApplicationStatus.APPLIED, result.getStatus());
        assertEquals("Software Intern", result.getJobTitle());
        verify(notificationService, times(2)).sendNotification(any(), any(), any(), any(), any());
    }

    @Test
    void testApplyForJob_DuplicateApplication_ThrowsDuplicateResourceException() {
        ApplicationCreateRequest request = ApplicationCreateRequest.builder()
                .jobId(10L)
                .build();

        when(studentRepository.findByUserEmail("student@test.com")).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(approvedJob));
        when(applicationRepository.existsByStudentIdAndJobId(100L, 10L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> applicationService.applyForJob(request, "student@test.com"));
    }

    @Test
    void testApplyForJob_NonApprovedJob_ThrowsValidationException() {
        ApplicationCreateRequest request = ApplicationCreateRequest.builder()
                .jobId(11L)
                .build();

        when(studentRepository.findByUserEmail("student@test.com")).thenReturn(Optional.of(student));
        when(jobRepository.findById(11L)).thenReturn(Optional.of(pendingJob));

        assertThrows(ValidationException.class, () -> applicationService.applyForJob(request, "student@test.com"));
    }

    @Test
    void testUpdateApplicationStatus_Shortlisted() {
        Application app = Application.builder()
                .id(500L)
                .student(student)
                .job(approvedJob)
                .status(ApplicationStatus.APPLIED)
                .build();

        ApplicationStatusUpdateRequest request = ApplicationStatusUpdateRequest.builder()
                .status(ApplicationStatus.SHORTLISTED)
                .notes("Good candidate")
                .build();

        when(applicationRepository.findById(500L)).thenReturn(Optional.of(app));
        when(userRepository.findByEmail("recruiter@test.com")).thenReturn(Optional.of(recruiterUser));
        when(applicationRepository.save(any(Application.class))).thenReturn(app);

        ApplicationDto result = applicationService.updateApplicationStatus(500L, request, "recruiter@test.com");

        assertNotNull(result);
        assertEquals(ApplicationStatus.SHORTLISTED, app.getStatus());
        verify(notificationService, times(1)).sendNotification(eq(studentUser), any(), any(), eq(NotificationType.CANDIDATE_SHORTLISTED), any());
    }
}
