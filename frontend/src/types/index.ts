export type Role = 'STUDENT' | 'RECRUITER' | 'ADMIN';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';

export type JobStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED';

export type ApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'SELECTED';

export type NotificationType =
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_VIEWED'
  | 'APPLICATION_STATUS_UPDATED'
  | 'CANDIDATE_SHORTLISTED'
  | 'CANDIDATE_REJECTED'
  | 'CANDIDATE_SELECTED'
  | 'JOB_APPROVED'
  | 'JOB_REJECTED'
  | 'NEW_JOB_POSTED'
  | 'ADMIN_ANNOUNCEMENT'
  | 'GENERAL';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  phoneNumber?: string;
  profileSummary?: string;
  createdAt?: string;
}

export interface StudentProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileSummary?: string;
  university?: string;
  degree?: string;
  graduationYear?: number;
  cgpa?: number;
  skills?: string;
  experienceYears?: number;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  location?: string;
  defaultResumeId?: number;
  active: boolean;
  createdAt?: string;
}

export interface RecruiterProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileSummary?: string;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  designation?: string;
  companyLogo?: string;
  location?: string;
  verified: boolean;
  active: boolean;
  createdAt?: string;
}

export interface Job {
  id: number;
  title: string;
  companyName: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  location: string;
  jobType: JobType;
  salary?: string;
  experience?: string;
  skills?: string;
  deadline?: string;
  openings: number;
  status: JobStatus;
  recruiterId?: number;
  recruiterName?: string;
  recruiterEmail?: string;
  companyWebsite?: string;
  companyLogo?: string;
  applicantCount?: number;
  isApplied?: boolean;
  isSaved?: boolean;
  applicationStatus?: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Application {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentUniversity?: string;
  studentDegree?: string;
  studentSkills?: string;
  studentCgpa?: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  jobType: string;
  jobSalary?: string;
  resumeId?: number;
  resumeFileName?: string;
  resumeOriginalName?: string;
  status: ApplicationStatus;
  coverNote?: string;
  notes?: string;
  appliedAt: string;
  updatedAt?: string;
}

export interface Resume {
  id: number;
  studentId: number;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  isDefault: boolean;
  uploadedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface StudentDashboardStats {
  totalApplications: number;
  underReviewApplications: number;
  shortlistedApplications: number;
  selectedApplications: number;
  rejectedApplications: number;
  savedJobsCount: number;
  recentApplications: Application[];
  recommendedJobs: Job[];
}

export interface RecruiterDashboardStats {
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  totalApplicants: number;
  shortlistedCandidates: number;
  selectedCandidates: number;
  pendingReviewApplicants: number;
  recentApplicants: Application[];
  recentJobs: Job[];
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalRecruiters: number;
  totalJobs: number;
  pendingJobs: number;
  approvedJobs: number;
  totalApplications: number;
  shortlistedCandidates: number;
  applicationsByStatus: Record<string, number>;
  jobsByType: Record<string, number>;
  recentApplications: Application[];
  recentJobs: Job[];
  recentUsers: User[];
}

export interface AdminReport {
  totalUsers: number;
  totalStudents: number;
  totalRecruiters: number;
  totalJobs: number;
  totalApplications: number;
  applicationStatusDistribution: Record<string, number>;
  jobTypeDistribution: Record<string, number>;
  topRecruiters: Array<{ companyName: string; jobCount: number }>;
  mostAppliedJobs: Array<{ title: string; companyName: string; applicationCount: number }>;
  monthlyApplicationTrends: Array<{ month: string; applications: number; jobs: number }>;
}

export interface JobFilterParams {
  search?: string;
  location?: string;
  company?: string;
  jobType?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
}
