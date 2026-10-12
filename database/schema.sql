-- =========================================================
-- Internship and Job Application Portal Database Schema
-- Target Database: MySQL 8.0+
-- =========================================================

CREATE DATABASE IF NOT EXISTS internship_portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE internship_portal_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    phone_number VARCHAR(25),
    profile_summary VARCHAR(1000),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    university VARCHAR(150) DEFAULT 'University Student',
    degree VARCHAR(100) DEFAULT 'B.Tech / B.S.',
    graduation_year INT DEFAULT 2026,
    cgpa DOUBLE DEFAULT 8.0,
    skills VARCHAR(500) DEFAULT 'Software Engineering, Web Development',
    experience_years INT DEFAULT 0,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    location VARCHAR(100) DEFAULT 'Remote / Flexible',
    default_resume_id BIGINT,
    resume_path VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_university (university),
    INDEX idx_student_skills (skills)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Recruiters Table
CREATE TABLE IF NOT EXISTS recruiters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    company_website VARCHAR(255),
    company_description VARCHAR(1000),
    designation VARCHAR(100) DEFAULT 'Talent Partner',
    company_logo VARCHAR(255),
    location VARCHAR(100) DEFAULT 'Remote',
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_recruiters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_recruiter_company (company_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT,
    requirements TEXT,
    location VARCHAR(150) NOT NULL,
    job_type VARCHAR(30) NOT NULL,
    salary VARCHAR(100),
    experience VARCHAR(100),
    skills VARCHAR(500),
    deadline DATE,
    openings INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    recruiter_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_jobs_recruiter FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE,
    INDEX idx_jobs_status (status),
    INDEX idx_jobs_job_type (job_type),
    INDEX idx_jobs_location (location),
    INDEX idx_jobs_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resumes_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_resumes_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    resume_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED',
    cover_note TEXT,
    notes TEXT,
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_applications_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_resume FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL,
    CONSTRAINT uk_application_student_job UNIQUE (student_id, job_id),
    INDEX idx_applications_status (status),
    INDEX idx_applications_job (job_id),
    INDEX idx_applications_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(40) NOT NULL DEFAULT 'GENERAL',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Saved Jobs Table
CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    saved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_saved_jobs_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_jobs_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT uk_saved_job_student_job UNIQUE (student_id, job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- Clean Formatted Views (For terminal queries & reporting)
-- Prevents wide column terminal wrapping and makes tables readable
-- =========================================================

-- View 1: Clean Student Profiles
CREATE OR REPLACE VIEW student_profiles_view AS
SELECT 
    s.id AS student_id,
    u.full_name,
    u.email,
    s.university,
    s.degree,
    s.graduation_year AS grad_year,
    s.cgpa,
    s.skills,
    s.location
FROM students s
JOIN users u ON s.user_id = u.id;

-- View 2: Clean Recruiter Profiles
CREATE OR REPLACE VIEW recruiter_profiles_view AS
SELECT 
    r.id AS recruiter_id,
    u.full_name AS contact_name,
    u.email,
    r.company_name,
    r.designation,
    r.location,
    r.verified
FROM recruiters r
JOIN users u ON r.user_id = u.id;

-- View 3: Clean Job Listings
CREATE OR REPLACE VIEW job_listings_view AS
SELECT 
    j.id AS job_id,
    j.title,
    j.company_name,
    j.job_type,
    j.location,
    j.salary,
    j.openings,
    j.status
FROM jobs j;

-- View 4: Clean Application Statuses
CREATE OR REPLACE VIEW applications_view AS
SELECT 
    a.id AS app_id,
    u.full_name AS student_name,
    j.title AS job_title,
    j.company_name,
    a.status,
    a.applied_at
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN users u ON s.user_id = u.id
JOIN jobs j ON a.job_id = j.id;
