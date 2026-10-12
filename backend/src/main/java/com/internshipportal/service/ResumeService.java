package com.internshipportal.service;

import com.internshipportal.dto.response.ResumeDto;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ResumeService {

    ResumeDto uploadResume(MultipartFile file, String studentEmail);

    List<ResumeDto> getMyResumes(String studentEmail);

    ResumeDto getResumeById(Long resumeId, String userEmail);

    ResumeDto setDefaultResume(Long resumeId, String studentEmail);

    void deleteResume(Long resumeId, String studentEmail);

    Resource downloadResumeFile(Long resumeId, String userEmail);
}
