package com.internshipportal.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String storeResume(MultipartFile file, Long studentId);

    Resource loadFileAsResource(String filePath);

    void deleteFile(String filePath);
}
