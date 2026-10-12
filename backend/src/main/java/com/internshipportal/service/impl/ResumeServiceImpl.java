package com.internshipportal.service.impl;

import com.internshipportal.dto.response.ResumeDto;
import com.internshipportal.entity.Resume;
import com.internshipportal.entity.Role;
import com.internshipportal.entity.Student;
import com.internshipportal.entity.User;
import com.internshipportal.exception.ForbiddenException;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.repository.ResumeRepository;
import com.internshipportal.repository.StudentRepository;
import com.internshipportal.repository.UserRepository;
import com.internshipportal.service.ResumeService;
import com.internshipportal.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Override
    @Transactional
    public ResumeDto uploadResume(MultipartFile file, String studentEmail) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for email: " + studentEmail));

        String savedFileName = storageService.storeResume(file, student.getId());
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
        String contentType = file.getContentType() != null ? file.getContentType() : "application/pdf";

        long existingCount = resumeRepository.countByStudentId(student.getId());
        boolean isDefault = existingCount == 0;

        Resume resume = Resume.builder()
                .student(student)
                .fileName(savedFileName)
                .originalFileName(originalFilename)
                .fileType(contentType)
                .fileSize(file.getSize())
                .filePath(savedFileName)
                .isDefault(isDefault)
                .build();

        resume = resumeRepository.save(resume);

        if (isDefault) {
            student.setDefaultResumeId(resume.getId());
            student.setResumePath(savedFileName);
            studentRepository.save(student);
        }

        return mapToDto(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeDto> getMyResumes(String studentEmail) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return resumeRepository.findByStudentIdOrderByUploadedAtDesc(student.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeDto getResumeById(Long resumeId, String userEmail) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + resumeId));

        validateAccess(resume, userEmail);

        return mapToDto(resume);
    }

    @Override
    @Transactional
    public ResumeDto setDefaultResume(Long resumeId, String studentEmail) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Resume targetResume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + resumeId));

        if (!targetResume.getStudent().getId().equals(student.getId())) {
            throw new ForbiddenException("Cannot set resume for another student");
        }

        List<Resume> allResumes = resumeRepository.findByStudentIdOrderByUploadedAtDesc(student.getId());
        for (Resume r : allResumes) {
            r.setDefault(r.getId().equals(resumeId));
            resumeRepository.save(r);
        }

        student.setDefaultResumeId(targetResume.getId());
        student.setResumePath(targetResume.getFileName());
        studentRepository.save(student);

        targetResume.setDefault(true);
        return mapToDto(targetResume);
    }

    @Override
    @Transactional
    public void deleteResume(Long resumeId, String studentEmail) {
        Student student = studentRepository.findByUserEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + resumeId));

        if (!resume.getStudent().getId().equals(student.getId())) {
            throw new ForbiddenException("Cannot delete resume belonging to another student");
        }

        storageService.deleteFile(resume.getFileName());
        resumeRepository.delete(resume);

        if (student.getDefaultResumeId() != null && student.getDefaultResumeId().equals(resumeId)) {
            List<Resume> remaining = resumeRepository.findByStudentIdOrderByUploadedAtDesc(student.getId());
            if (!remaining.isEmpty()) {
                Resume newDefault = remaining.get(0);
                newDefault.setDefault(true);
                resumeRepository.save(newDefault);
                student.setDefaultResumeId(newDefault.getId());
                student.setResumePath(newDefault.getFileName());
            } else {
                student.setDefaultResumeId(null);
                student.setResumePath(null);
            }
            studentRepository.save(student);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Resource downloadResumeFile(Long resumeId, String userEmail) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with id: " + resumeId));

        validateAccess(resume, userEmail);

        return storageService.loadFileAsResource(resume.getFileName());
    }

    private void validateAccess(Resume resume, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            return;
        }

        if (user.getRole() == Role.STUDENT && resume.getStudent().getUser().getId().equals(user.getId())) {
            return;
        }

        // Recruiters can view resumes attached to applications (or if authorized)
        if (user.getRole() == Role.RECRUITER) {
            return;
        }

        throw new ForbiddenException("You do not have permission to view this resume");
    }

    private ResumeDto mapToDto(Resume resume) {
        return ResumeDto.builder()
                .id(resume.getId())
                .studentId(resume.getStudent().getId())
                .fileName(resume.getFileName())
                .originalFileName(resume.getOriginalFileName())
                .fileType(resume.getFileType())
                .fileSize(resume.getFileSize())
                .isDefault(resume.isDefault())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }
}
