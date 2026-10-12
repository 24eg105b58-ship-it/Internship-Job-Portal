package com.internshipportal.service.impl;

import com.internshipportal.dto.response.JobDto;
import com.internshipportal.dto.response.PagedResponse;
import com.internshipportal.entity.Job;
import com.internshipportal.entity.SavedJob;
import com.internshipportal.entity.Student;
import com.internshipportal.exception.DuplicateResourceException;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.repository.ApplicationRepository;
import com.internshipportal.repository.JobRepository;
import com.internshipportal.repository.SavedJobRepository;
import com.internshipportal.repository.StudentRepository;
import com.internshipportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    @Transactional
    public void saveJob(Long jobId, String studentEmail) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (savedJobRepository.existsByStudentIdAndJobId(student.getId(), job.getId())) {
            throw new DuplicateResourceException("Job is already saved");
        }

        SavedJob savedJob = SavedJob.builder()
                .student(student)
                .job(job)
                .build();
        savedJobRepository.save(savedJob);
    }

    @Override
    @Transactional
    public void unsaveJob(Long jobId, String studentEmail) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        savedJobRepository.deleteByStudentIdAndJobId(student.getId(), job.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobDto> getMySavedJobs(String studentEmail, Pageable pageable) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Page<SavedJob> page = savedJobRepository.findByStudentIdOrderBySavedAtDesc(student.getId(), pageable);
        List<JobDto> dtos = page.getContent().stream()
                .map(sj -> mapToJobDto(sj.getJob(), student.getId()))
                .collect(Collectors.toList());

        return PagedResponse.of(page, dtos);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isJobSaved(Long jobId, String studentEmail) {
        return savedJobRepository.existsByStudentUserEmailAndJobId(studentEmail, jobId);
    }

    private JobDto mapToJobDto(Job job, Long studentId) {
        boolean isApplied = studentId != null && applicationRepository.existsByStudentIdAndJobId(studentId, job.getId());
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
                .isApplied(isApplied)
                .isSaved(true)
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
