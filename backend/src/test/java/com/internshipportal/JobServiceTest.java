package com.internshipportal;

import com.internshipportal.dto.request.JobCreateRequest;
import com.internshipportal.dto.request.JobUpdateRequest;
import com.internshipportal.dto.response.JobDto;
import com.internshipportal.entity.*;
import com.internshipportal.exception.ForbiddenException;
import com.internshipportal.repository.*;
import com.internshipportal.service.NotificationService;
import com.internshipportal.service.impl.JobServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private RecruiterRepository recruiterRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private SavedJobRepository savedJobRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private JobServiceImpl jobService;

    private User recruiterUser;
    private Recruiter recruiter;
    private Job sampleJob;

    @BeforeEach
    void setUp() {
        recruiterUser = User.builder()
                .id(2L)
                .email("recruiter@company.com")
                .fullName("Recruiter Jane")
                .role(Role.RECRUITER)
                .active(true)
                .build();

        recruiter = Recruiter.builder()
                .id(1L)
                .user(recruiterUser)
                .companyName("Acme Corp")
                .verified(true)
                .build();

        sampleJob = Job.builder()
                .id(10L)
                .title("Software Engineer")
                .companyName("Acme Corp")
                .description("Build features")
                .location("New York")
                .jobType(JobType.FULL_TIME)
                .salary("$100,000")
                .openings(2)
                .status(JobStatus.PENDING)
                .recruiter(recruiter)
                .build();
    }

    @Test
    void testCreateJob_StatusIsPending() {
        JobCreateRequest request = JobCreateRequest.builder()
                .title("Software Engineer")
                .description("Build features")
                .location("New York")
                .jobType(JobType.FULL_TIME)
                .salary("$100,000")
                .openings(2)
                .build();

        when(recruiterRepository.findByUserEmail("recruiter@company.com")).thenReturn(Optional.of(recruiter));
        when(jobRepository.save(any(Job.class))).thenAnswer(invocation -> {
            Job saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        JobDto result = jobService.createJob(request, "recruiter@company.com");

        assertNotNull(result);
        assertEquals("Software Engineer", result.getTitle());
        assertEquals(JobStatus.PENDING, result.getStatus());
        verify(notificationService, times(1)).sendNotification(any(), any(), any(), any(), any());
    }

    @Test
    void testApproveJob_StatusBecomesApproved() {
        when(jobRepository.findById(10L)).thenReturn(Optional.of(sampleJob));
        when(jobRepository.save(any(Job.class))).thenReturn(sampleJob);

        JobDto approved = jobService.approveJob(10L, "admin@portal.com");

        assertNotNull(approved);
        assertEquals(JobStatus.APPROVED, sampleJob.getStatus());
        verify(notificationService, times(1)).sendNotification(eq(recruiterUser), any(), any(), any(), any());
    }

    @Test
    void testRecruiterCannotModifyOtherRecruiterJob_ThrowsForbiddenException() {
        User otherRecruiter = User.builder()
                .id(99L)
                .email("other@company.com")
                .role(Role.RECRUITER)
                .build();

        when(jobRepository.findById(10L)).thenReturn(Optional.of(sampleJob));
        when(userRepository.findByEmail("other@company.com")).thenReturn(Optional.of(otherRecruiter));

        JobUpdateRequest updateRequest = JobUpdateRequest.builder()
                .title("Hacked Title")
                .description("Hacked Desc")
                .location("Remote")
                .jobType(JobType.FULL_TIME)
                .openings(1)
                .build();

        assertThrows(ForbiddenException.class, () -> jobService.updateJob(10L, updateRequest, "other@company.com"));
    }
}
