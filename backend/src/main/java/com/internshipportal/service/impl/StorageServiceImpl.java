package com.internshipportal.service.impl;

import com.internshipportal.exception.FileUploadException;
import com.internshipportal.exception.ResourceNotFoundException;
import com.internshipportal.service.StorageService;
import com.internshipportal.util.AppConstants;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.UUID;

@Slf4j
@Service
public class StorageServiceImpl implements StorageService {

    @Value("${app.upload.dir:uploads/resumes}")
    private String uploadDir;

    private Path rootLocation;

    @PostConstruct
    public void init() {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new FileUploadException("Could not initialize upload storage location", e);
        }
    }

    @Override
    public String storeResume(MultipartFile file, Long studentId) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Failed to store empty file");
        }

        if (file.getSize() > AppConstants.MAX_FILE_SIZE) {
            throw new FileUploadException("File size exceeds 10MB limit");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");

        // Validate extension
        String lowerName = originalFilename.toLowerCase();
        boolean validExtension = Arrays.stream(AppConstants.ALLOWED_RESUME_EXTENSIONS)
                .anyMatch(lowerName::endsWith);

        if (!validExtension) {
            throw new FileUploadException("Invalid file format. Allowed formats: PDF, DOC, DOCX");
        }

        try {
            if (originalFilename.contains("..")) {
                throw new FileUploadException("Filename contains invalid relative path sequence: " + originalFilename);
            }

            String extension = "";
            int i = originalFilename.lastIndexOf('.');
            if (i > 0) {
                extension = originalFilename.substring(i);
            }

            String uniqueFilename = "student_" + studentId + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path destinationFile = this.rootLocation.resolve(uniqueFilename).normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                throw new FileUploadException("Cannot store file outside target directory");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            return uniqueFilename;
        } catch (IOException e) {
            throw new FileUploadException("Failed to store file: " + originalFilename, e);
        }
    }

    @Override
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.rootLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + fileName);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("File not found: " + fileName);
        }
    }

    @Override
    public void deleteFile(String fileName) {
        try {
            Path filePath = this.rootLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("Failed to delete file {}: {}", fileName, e.getMessage());
        }
    }
}
