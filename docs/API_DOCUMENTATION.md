# 📚 REST API Documentation

Base API URL: `http://localhost:8080/api`
Swagger UI: `http://localhost:8080/swagger-ui/index.html`
OpenAPI Specification: `http://localhost:8080/v3/api-docs`

---

## 🔐 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student or recruiter account | Public |
| `POST` | `/api/auth/login` | Authenticate with email/password and receive JWT tokens | Public |
| `POST` | `/api/auth/refresh` | Exchange refresh token for fresh access token | Public |
| `POST` | `/api/auth/change-password` | Update account password | Authenticated |
| `GET` | `/api/auth/me` | Fetch authenticated user profile details | Authenticated |

---

## 💼 2. Job Openings (`/api/jobs`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/jobs` | Browse, search, filter and paginate approved job listings | Public |
| `GET` | `/api/jobs/{id}` | Get detailed job specifications by ID | Public |
| `POST` | `/api/jobs` | Post new job or internship | Recruiter |
| `PUT` | `/api/jobs/{id}` | Update existing job posting | Recruiter / Admin |
| `DELETE` | `/api/jobs/{id}` | Delete job posting | Recruiter / Admin |
| `POST` | `/api/jobs/{id}/approve` | Approve job posting | Admin |
| `POST` | `/api/jobs/{id}/reject` | Reject job posting with reason | Admin |
| `GET` | `/api/jobs/{id}/applicants` | Get paginated applicants for specific job | Recruiter / Admin |
| `POST` | `/api/jobs/{id}/save` | Save job to student bookmarks | Student |
| `DELETE` | `/api/jobs/{id}/save` | Remove job from student bookmarks | Student |
| `GET` | `/api/jobs/saved` | Get all saved jobs for current student | Student |

---

## 📄 3. Applications (`/api/applications`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/applications` | Submit application for job with attached resume and note | Student |
| `GET` | `/api/applications/my` | Get paginated applications submitted by current student | Student |
| `GET` | `/api/applications/{id}` | Get application details by ID | Authenticated |
| `PUT` | `/api/applications/{id}/status` | Advance applicant status (`UNDER_REVIEW`, `SHORTLISTED`, `SELECTED`, `REJECTED`) | Recruiter / Admin |
| `DELETE` | `/api/applications/{id}` | Withdraw active application | Student |

---

## 📁 4. Resume Documents (`/api/resumes`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/resumes/upload` | Upload PDF/DOC/DOCX resume file (max 10MB) | Student |
| `GET` | `/api/resumes/my` | Get list of all uploaded resumes | Student |
| `GET` | `/api/resumes/{id}` | Get resume document metadata | Authenticated |
| `PUT` | `/api/resumes/{id}/default` | Set resume as primary default | Student |
| `DELETE` | `/api/resumes/{id}` | Delete uploaded resume document | Student |
| `GET` | `/api/resumes/{id}/download` | Stream / download resume document file | Authenticated |

---

## 🎓 5. Student Management (`/api/students`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/students/profile` | Get current student's full profile | Student |
| `PUT` | `/api/students/profile` | Update academic record, GPA, skills, portfolio links | Student |
| `GET` | `/api/students/dashboard` | Get student metric counters and recommendations | Student |
| `GET` | `/api/students/{id}` | Inspect student profile by ID | Recruiter / Admin |

---

## 🏢 6. Recruiter Management (`/api/recruiters`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/recruiters/profile` | Get current recruiter & company profile | Recruiter |
| `PUT` | `/api/recruiters/profile` | Update company information, website, and branding | Recruiter |
| `GET` | `/api/recruiters/dashboard` | Get hiring funnel metrics and recent activity | Recruiter |
| `GET` | `/api/recruiters/jobs` | Get all jobs posted by current recruiter | Recruiter |
| `GET` | `/api/recruiters/applications` | Search and filter applicants for recruiter's jobs | Recruiter |
| `GET` | `/api/recruiters/{id}` | Get public recruiter & company profile | Public |

---

## 🛡️ 7. Admin Control Room (`/api/admin`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Get platform executive stats and pending queue | Admin |
| `GET` | `/api/admin/reports` | Get deep analytical trends and distribution data | Admin |
| `GET` | `/api/admin/students` | Search and paginate student accounts | Admin |
| `GET` | `/api/admin/recruiters` | Search and paginate recruiter accounts | Admin |
| `GET` | `/api/admin/jobs` | Moderation view for all jobs across all employers | Admin |
| `GET` | `/api/admin/applications` | Platform-wide applications list | Admin |
| `PUT` | `/api/admin/users/{id}/status` | Activate or deactivate user account | Admin |
| `POST` | `/api/admin/jobs/{id}/approve` | Approve job posting | Admin |
| `POST` | `/api/admin/jobs/{id}/reject` | Reject job posting with reason | Admin |

---

## 🔔 8. Notifications & Alerts (`/api/notifications`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/notifications` | Get user notifications with pagination | Authenticated |
| `GET` | `/api/notifications/unread-count` | Get count of unread notifications | Authenticated |
| `PUT` | `/api/notifications/{id}/read` | Mark individual notification as read | Authenticated |
| `PUT` | `/api/notifications/read-all` | Mark all user notifications as read | Authenticated |
