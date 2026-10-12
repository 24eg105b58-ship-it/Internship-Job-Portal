import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi } from '../../api/studentApi';
import { StudentDashboardStats } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JobCard } from '../../components/common/JobCard';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate } from '../../utils/formatters';
import {
  FileCheck2,
  Clock,
  Award,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Briefcase,
  UserCheck,
  TrendingUp,
  FileText,
  Sparkles,
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await studentApi.getDashboard();
        setStats(data);
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-200" /> Candidate Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl leading-relaxed">
            You have {stats?.totalApplications || 0} active applications submitted. Track your recruiter reviews and explore curated matches below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/jobs"
            className="px-5 py-2.5 bg-white text-brand-700 hover:bg-brand-50 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" /> Browse Opportunities
          </Link>
          <Link
            to="/student/resumes"
            className="px-5 py-2.5 bg-brand-500/40 hover:bg-brand-500/60 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> My Resumes
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalApplications || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Total Applied</p>
        </div>

        {/* Under Review */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.underReviewApplications || 0}</p>
          <p className="text-xs font-semibold text-slate-500">In Review</p>
        </div>

        {/* Shortlisted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.shortlistedApplications || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
        </div>

        {/* Selected / Offers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.selectedApplications || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Offers / Selected</p>
        </div>

        {/* Saved Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Bookmark className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.savedJobsCount || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Saved Jobs</p>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
            <p className="text-xs text-slate-500">Track progress and status updates on your job submissions.</p>
          </div>
          <Link
            to="/student/applications"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentApplications && stats.recentApplications.length > 0 ? (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="py-3 px-2">Job Opportunity</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Applied Date</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-slate-800">{app.jobTitle}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{app.companyName}</p>
                    </td>
                    <td className="py-3.5 px-2 text-slate-600 font-medium">{app.jobLocation}</td>
                    <td className="py-3.5 px-2 text-slate-500">{formatDate(app.appliedAt)}</td>
                    <td className="py-3.5 px-2">
                      <StatusBadge status={app.status} type="application" />
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <Link
                        to={`/jobs/${app.jobId}`}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        View Job
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center space-y-2">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">No applications submitted yet</p>
            <p className="text-[11px] text-slate-400">Discover top internships and apply with one click.</p>
            <Link
              to="/jobs"
              className="inline-block mt-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Start Applying
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Jobs */}
      {stats?.recommendedJobs && stats.recommendedJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recommended For You</h2>
              <p className="text-xs text-slate-500">Tailored openings matching university student profiles.</p>
            </div>
            <Link
              to="/jobs"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              See More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
