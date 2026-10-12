import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  Bookmark,
  FileText,
  User,
  PlusCircle,
  Users,
  BarChart3,
  ShieldAlert,
  Building,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onLinkClick }) => {
  const { user } = useAuth();

  if (!user) return null;

  const renderStudentLinks = () => (
    <>
      <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Candidate Portal
      </div>
      <NavLink
        to="/student/dashboard"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/jobs"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <Briefcase className="w-4 h-4" />
          <span>Explore Jobs</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/student/applications"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <FileCheck2 className="w-4 h-4" />
          <span>My Applications</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/student/saved"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <Bookmark className="w-4 h-4" />
          <span>Saved Jobs</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <div className="px-3 mt-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Profile & Documents
      </div>

      <NavLink
        to="/student/resumes"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-4 h-4" />
          <span>Resume Manager</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/student/profile"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>
    </>
  );

  const renderRecruiterLinks = () => (
    <>
      <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Recruiter ATS
      </div>
      <NavLink
        to="/recruiter/dashboard"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/recruiter/jobs/new"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-brand-600 hover:bg-brand-50 font-bold'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/recruiter/jobs"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <Briefcase className="w-4 h-4" />
          <span>Manage Jobs</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/recruiter/applicants"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <Users className="w-4 h-4" />
          <span>Candidate Pipeline</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <div className="px-3 mt-6 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Company & Profile
      </div>

      <NavLink
        to="/recruiter/profile"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <Building className="w-4 h-4" />
          <span>Company Profile</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        System Administration
      </div>
      <NavLink
        to="/admin/dashboard"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <LayoutDashboard className="w-4 h-4" />
          <span>Executive Overview</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/admin/jobs"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-4 h-4" />
          <span>Job Moderation</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/admin/users"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <Users className="w-4 h-4" />
          <span>User Directory</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>

      <NavLink
        to="/admin/reports"
        onClick={onLinkClick}
        className={({ isActive }) =>
          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isActive
              ? 'bg-brand-50 text-brand-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Reports</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
      </NavLink>
    </>
  );

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-1">
        {user.role === 'STUDENT' && renderStudentLinks()}
        {user.role === 'RECRUITER' && renderRecruiterLinks()}
        {user.role === 'ADMIN' && renderAdminLinks()}
      </div>

      {/* Role info tag in sidebar footer */}
      <div className="pt-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
            {user.role.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
