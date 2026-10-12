# 🚀 Internship and Job Application Portal

A modern, production-grade **Full-Stack Internship and Job Application Portal** connecting ambitious university students with verified technology companies and recruiters.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/24eg105b58-ship-it/Internship-Job-Portal)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/24eg105b58-ship-it/Internship-Job-Portal&root-directory=frontend&env=VITE_API_URL&envDescription=Your+deployed+Render+backend+URL+(e.g.+https://your-backend.onrender.com/api))

---

## 🌟 Key Highlights & Features

### 🎓 Candidate (Student) Features
- **Smart Job Search & Filtering**: Discover internships and full-time tech roles by keyword, technical skill, employment type (`INTERNSHIP`, `FULL_TIME`, `PART_TIME`, `CONTRACT`), location, and employer.
- **One-Click Multi-Resume Applications**: Attach tailored resumes (PDF/DOCX) and write personalized cover notes.
- **Live Application Tracking**: Real-time status updates (`APPLIED` → `UNDER_REVIEW` → `SHORTLISTED` → `SELECTED` / `REJECTED`) with recruiter feedback notes.
- **Resume Document Vault**: Upload, download, manage, and set default resume documents.
- **Job Bookmarking**: Save opportunities for future review and one-click applications.
- **Comprehensive Candidate Profile**: Manage academic records (University, Degree, CGPA, Graduation Year), technical skill tags, GitHub, LinkedIn, and personal portfolio links.

### 💼 Employer & Recruiter Talent Suite
- **Applicant Tracking System (ATS)**: Filter candidates by job posting, review academic backgrounds and skill sets, preview and download resumes.
- **Stage Progression & Feedback**: Move candidates across hiring stages with instant student alerts.
- **Job Posting & Lifecycle Management**: Create, edit, and close job listings with rich requirements and deadline dates.
- **Recruiter Analytics Dashboard**: Visual hiring funnel metrics and recent applicant activity.
- **Company Branding Profile**: Showcase company descriptions, website links, and location badges.

### 🛡️ Administrator & Compliance Controls
- **Job Moderation Pipeline**: Moderate, approve, or reject new employer job submissions before publication.
- **User Directory Administration**: Manage student and recruiter accounts with instant activation/deactivation toggles.
- **Executive Analytics & Reports**: Visual charts powered by Recharts (monthly application trends, top recruiters, most applied positions, and pipeline distribution).
- **Automated Data Seeder**: Instant platform bootstrap with pre-populated demo data.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 17, Spring Boot 3.2.5, Spring Security 6, Spring Data JPA, Hibernate, JWT (io.jsonwebtoken 0.12.5), Lombok, Swagger/OpenAPI (SpringDoc 2.5) |
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS 3.4, React Router DOM 6, Axios, Lucide React, Recharts |
| **Database** | MySQL 8.0+ / H2 In-Memory (Configurable) |

---

## ⚡ Quick Start & Setup

### 1. Backend Setup (Spring Boot)

#### Prerequisites:
- Java JDK 17+
- Maven 3.8+
- MySQL 8.0+ running on `localhost:3306` (or use H2 test profile)

#### Database Configuration:
The database script is located at [`database/schema.sql`](file:///c:/Users/dell/Downloads/Internship-Job-Portal/database/schema.sql). You can also let Spring Boot auto-create the tables via JPA.

In [`backend/src/main/resources/application-dev.yml`](file:///c:/Users/dell/Downloads/Internship-Job-Portal/backend/src/main/resources/application-dev.yml):
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/internship_portal_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: root
    password: your_password
```

#### Run Backend:
```bash
cd backend
mvn clean spring-boot:run
```
*The backend dev server will start at `http://localhost:8080` and seed initial demo accounts automatically.*
*Swagger UI is available at `http://localhost:8080/swagger-ui/index.html`.*

---

### 2. Frontend Setup (React + Vite)

#### Prerequisites:
- Node.js 18+
- npm 9+

#### Run Frontend:
```bash
cd frontend
npm install
npm run dev
```
*The frontend Vite dev server will start at `http://localhost:5173` with automatic API proxy forwarding to `:8080`.*

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Student** | `student@portal.com` | `student123` | Browse jobs, apply, upload resumes, track applications |
| **Recruiter** | `recruiter@portal.com` | `recruiter123` | Post jobs, candidate ATS pipeline, update stages |
| **Admin** | `admin@portal.com` | `admin123` | Job moderation, user management, platform analytics |

> 💡 *Quick-login demo buttons are available on the [Login Page](file:///c:/Users/dell/Downloads/Internship-Job-Portal/frontend/src/pages/LoginPage.tsx) for instant one-click testing.*

---

## 📁 Project Architecture

```
Internship-Job-Portal/
├── backend/
│   ├── src/main/java/com/internshipportal/
│   │   ├── config/             # SecurityConfig, DataInitializer, OpenApiConfig, WebMvcConfig
│   │   ├── controller/         # Auth, Job, Application, Student, Recruiter, Admin, Resume, Notification
│   │   ├── dto/                # Request and Response payloads
│   │   ├── entity/             # User, Student, Recruiter, Job, Application, Resume, Notification
│   │   ├── exception/          # GlobalExceptionHandler & custom exception classes
│   │   ├── repository/         # Spring Data JPA repositories
│   │   ├── security/           # JWT provider, filter, UserDetails service
│   │   └── service/            # Business logic interfaces and implementations
│   └── src/main/resources/     # application.yml, application-dev.yml, application-test.yml
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios API service clients with JWT auto-refresh
│   │   ├── components/         # Common UI components (Cards, Modals, Badges, Skeletons)
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── hooks/              # useAuth, useNotifications, useDebounce
│   │   ├── layouts/            # Navbar, Sidebar, Footer, MainLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── student/        # BrowseJobs, JobDetails, Dashboard, Applications, Saved, Profile, Resumes
│   │   │   ├── recruiter/      # Dashboard, PostJob, EditJob, ManageJobs, ApplicantATS, Profile
│   │   │   ├── admin/          # Dashboard, JobModeration, UserManagement, Reports
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── NotificationsPage.tsx
│   │   ├── routes/             # AppRoutes configuration with role-based route guards
│   │   └── types/              # Full TypeScript interface definitions
├── database/
│   ├── schema.sql              # MySQL DDL Schema
│   └── data.sql                # Seed SQL data
└── docs/
    └── API_DOCUMENTATION.md    # REST API specification
```
