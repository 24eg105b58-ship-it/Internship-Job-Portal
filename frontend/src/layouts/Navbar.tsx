import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Briefcase,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Search,
  PlusCircle,
  FileText,
  Bookmark,
  Shield,
  LayoutDashboard,
  Building2,
  Key,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { authApi } from '../api/authApi';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Change Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      await authApi.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess('');
      }, 1500);
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || 'Failed to change password. Verify your current password.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/jobs';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'RECRUITER') return '/recruiter/dashboard';
    return '/student/dashboard';
  };

  const getProfileLink = () => {
    if (!user) return '/login';
    if (user.role === 'RECRUITER') return '/recruiter/profile';
    if (user.role === 'STUDENT') return '/student/profile';
    return '/admin/dashboard';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                  <Briefcase className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-tight flex items-center gap-1">
                    Intern<span className="text-brand-600">Portal</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                    Career Bridge
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center space-x-1 ml-8">
                <Link
                  to="/jobs"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/jobs')
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Browse Jobs
                </Link>

                {isAuthenticated && user?.role === 'STUDENT' && (
                  <>
                    <Link
                      to="/student/applications"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/student/applications')
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/student/saved"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/student/saved')
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Saved Jobs
                    </Link>
                  </>
                )}

                {isAuthenticated && user?.role === 'RECRUITER' && (
                  <>
                    <Link
                      to="/recruiter/jobs"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/recruiter/jobs')
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Manage Jobs
                    </Link>
                    <Link
                      to="/recruiter/applicants"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/recruiter/applicants')
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Applicants
                    </Link>
                  </>
                )}

                {isAuthenticated && user?.role === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin/jobs"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/admin/jobs')
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Job Moderation
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/admin/users')
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      User Management
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Right Action Items */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Recruiter Quick Post Button */}
                  {user?.role === 'RECRUITER' && (
                    <Link
                      to="/recruiter/jobs/new"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Post Job
                    </Link>
                  )}

                  {/* Notifications Icon */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(!isNotificationsOpen);
                        setIsProfileMenuOpen(false);
                      }}
                      className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors relative"
                      aria-label="View notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
                    <NotificationDropdown
                      isOpen={isNotificationsOpen}
                      onClose={() => setIsNotificationsOpen(false)}
                    />
                  </div>

                  {/* Profile Menu Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(!isProfileMenuOpen);
                        setIsNotificationsOpen(false);
                      }}
                      className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="hidden sm:flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-800 leading-tight">
                          {user?.name}
                        </span>
                        <span className="text-[10px] text-brand-600 font-semibold capitalize">
                          {user?.role.toLowerCase()}
                        </span>
                      </div>
                    </button>

                    {/* Profile Dropdown Box */}
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100">
                        <div className="px-4 py-2.5">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {user?.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {user?.email}
                          </p>
                          <span className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            Role: {user?.role}
                          </span>
                        </div>

                        <div className="py-1">
                          <Link
                            to={getDashboardLink()}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2.5 text-slate-400" />
                            Dashboard
                          </Link>

                          {user?.role !== 'ADMIN' && (
                            <Link
                              to={getProfileLink()}
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                            >
                              <User className="w-4 h-4 mr-2.5 text-slate-400" />
                              My Profile
                            </Link>
                          )}

                          {user?.role === 'STUDENT' && (
                            <Link
                              to="/student/resumes"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                            >
                              <FileText className="w-4 h-4 mr-2.5 text-slate-400" />
                              Resume Manager
                            </Link>
                          )}

                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              setIsPasswordModalOpen(true);
                            }}
                            className="w-full flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                          >
                            <Key className="w-4 h-4 mr-2.5 text-slate-400" />
                            Change Password
                          </button>
                        </div>

                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-2.5 text-rose-500" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1">
            <Link
              to="/jobs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Browse Jobs
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Dashboard
                </Link>

                {user?.role === 'STUDENT' && (
                  <>
                    <Link
                      to="/student/applications"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/student/saved"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Saved Jobs
                    </Link>
                    <Link
                      to="/student/resumes"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Resume Manager
                    </Link>
                    <Link
                      to="/student/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Student Profile
                    </Link>
                  </>
                )}

                {user?.role === 'RECRUITER' && (
                  <>
                    <Link
                      to="/recruiter/jobs/new"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-600 font-semibold hover:bg-brand-50"
                    >
                      + Post New Job
                    </Link>
                    <Link
                      to="/recruiter/jobs"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Manage Jobs
                    </Link>
                    <Link
                      to="/recruiter/applicants"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Applicant Tracking
                    </Link>
                    <Link
                      to="/recruiter/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Company Profile
                    </Link>
                  </>
                )}

                {user?.role === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin/jobs"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Job Moderation
                    </Link>
                    <Link
                      to="/admin/users"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      User Management
                    </Link>
                    <Link
                      to="/admin/reports"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Analytics & Reports
                    </Link>
                  </>
                )}

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out ({user?.name})
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPasswordError('');
          setPasswordSuccess('');
        }}
        title="Change Password"
        maxWidth="md"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passwordError && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-medium">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-medium">
              {passwordSuccess}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Password (min 6 characters)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm disabled:opacity-50"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
