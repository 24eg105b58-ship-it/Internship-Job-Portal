import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

// Student Pages
import { BrowseJobsPage } from '../pages/student/BrowseJobsPage';
import { JobDetailsPage } from '../pages/student/JobDetailsPage';
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { MyApplicationsPage } from '../pages/student/MyApplicationsPage';
import { SavedJobsPage } from '../pages/student/SavedJobsPage';
import { StudentProfilePage } from '../pages/student/StudentProfilePage';
import { ResumeManagerPage } from '../pages/student/ResumeManagerPage';

// Recruiter Pages
import { RecruiterDashboardPage } from '../pages/recruiter/RecruiterDashboardPage';
import { PostJobPage } from '../pages/recruiter/PostJobPage';
import { EditJobPage } from '../pages/recruiter/EditJobPage';
import { ManageJobsPage } from '../pages/recruiter/ManageJobsPage';
import { ApplicantManagementPage } from '../pages/recruiter/ApplicantManagementPage';
import { RecruiterProfilePage } from '../pages/recruiter/RecruiterProfilePage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminJobModerationPage } from '../pages/admin/AdminJobModerationPage';
import { AdminUserManagementPage } from '../pages/admin/AdminUserManagementPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages with Standard Header/Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<BrowseJobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Student Portal Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="applications" element={<MyApplicationsPage />} />
        <Route path="saved" element={<SavedJobsPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="resumes" element={<ResumeManagerPage />} />
      </Route>

      {/* Recruiter Portal Protected Routes */}
      <Route
        path="/recruiter"
        element={
          <ProtectedRoute allowedRoles={['RECRUITER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterDashboardPage />} />
        <Route path="jobs" element={<ManageJobsPage />} />
        <Route path="jobs/new" element={<PostJobPage />} />
        <Route path="jobs/:id/edit" element={<EditJobPage />} />
        <Route path="applicants" element={<ApplicantManagementPage />} />
        <Route path="profile" element={<RecruiterProfilePage />} />
      </Route>

      {/* Administrator Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="jobs" element={<AdminJobModerationPage />} />
        <Route path="users" element={<AdminUserManagementPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
