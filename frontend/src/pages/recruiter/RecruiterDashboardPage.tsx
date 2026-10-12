import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterApi } from '../../api/recruiterApi';
import { applicationApi } from '../../api/applicationApi';
import { RecruiterDashboardStats, ApplicationStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate, formatTimeAgo } from '../../utils/formatters';
import {
  Briefcase,
  Users,
  Award,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Building,
  Check,
} from 'lucide-react';

export const RecruiterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<RecruiterDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingAppId, setUpdatingAppId] = useState<number | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await recruiterApi.getDashboard();
      setStats(data);
    } catch (err) {
      console.error('Failed to load recruiter dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickStatusChange = async (appId: number, nextStatus: ApplicationStatus) => {
    setUpdatingAppId(appId);
    try {
      await applicationApi.updateStatus(appId, nextStatus);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to update applicant status', err);
    } finally {
      setUpdatingAppId(null);
    }
  };

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
      {/* Welcome & Action Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
            <Building className="w-3.5 h-3.5" /> Employer Talent Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruiter Workspace: {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Manage your candidate pipeline across {stats?.totalJobs || 0} job postings and review pending university applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/recruiter/jobs/new"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Post New Job
          </Link>
          <Link
            to="/recruiter/applicants"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" /> Candidate ATS
          </Link>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Active Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.activeJobs || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Live Postings</p>
        </div>

        {/* Pending Moderation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.pendingJobs || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Pending Review</p>
        </div>

        {/* Total Applicants */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalApplicants || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Total Applicants</p>
        </div>

        {/* Unreviewed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.pendingReviewApplicants || 0}</p>
          <p className="text-xs font-semibold text-slate-500">New / Unreviewed</p>
        </div>

        {/* Shortlisted */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.shortlistedCandidates || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
        </div>

        {/* Selected / Hired */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.selectedCandidates || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Selected / Hired</p>
        </div>
      </div>

      {/* Candidate Pipeline Overview & Recent Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Breakdown Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Hiring Funnel Status</h2>
            <p className="text-xs text-slate-400 mt-0.5">Candidate distribution across active hiring stages.</p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Under Review</span>
                <span className="text-slate-900">{stats?.pendingReviewApplicants || 0}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{
                    width: `${
                      stats?.totalApplicants
                        ? ((stats.pendingReviewApplicants || 0) / stats.totalApplicants) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Shortlisted for Rounds</span>
                <span className="text-purple-600 font-bold">{stats?.shortlistedCandidates || 0}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{
                    width: `${
                      stats?.totalApplicants
                        ? ((stats.shortlistedCandidates || 0) / stats.totalApplicants) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Offers Extended / Selected</span>
                <span className="text-emerald-600 font-bold">{stats?.selectedCandidates || 0}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${
                      stats?.totalApplicants
                        ? ((stats.selectedCandidates || 0) / stats.totalApplicants) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/recruiter/applicants"
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Applicant Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Applicants Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Candidate Applications</h2>
              <p className="text-xs text-slate-400">Review profiles and advance promising applicants.</p>
            </div>
            <Link
              to="/recruiter/applicants"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.recentApplicants && stats.recentApplicants.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {stats.recentApplicants.map((app) => (
                <div
                  key={app.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{app.studentName}</p>
                      <StatusBadge status={app.status} type="application" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Applied for <strong className="text-slate-700">{app.jobTitle}</strong> •{' '}
                      {formatTimeAgo(app.appliedAt)}
                    </p>
                    {app.studentUniversity && (
                      <p className="text-[11px] text-slate-400">
                        {app.studentUniversity} • {app.studentDegree} {app.studentCgpa && `(GPA: ${app.studentCgpa})`}
                      </p>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    {app.status === 'APPLIED' && (
                      <button
                        onClick={() => handleQuickStatusChange(app.id, 'UNDER_REVIEW')}
                        disabled={updatingAppId === app.id}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg transition-colors border border-amber-200"
                      >
                        Start Review
                      </button>
                    )}
                    {app.status === 'UNDER_REVIEW' && (
                      <button
                        onClick={() => handleQuickStatusChange(app.id, 'SHORTLISTED')}
                        disabled={updatingAppId === app.id}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-lg transition-colors border border-purple-200"
                      >
                        Shortlist
                      </button>
                    )}
                    {app.status === 'SHORTLISTED' && (
                      <button
                        onClick={() => handleQuickStatusChange(app.id, 'SELECTED')}
                        disabled={updatingAppId === app.id}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg transition-colors border border-emerald-200"
                      >
                        Select & Offer
                      </button>
                    )}
                    <Link
                      to={`/recruiter/applicants?jobId=${app.jobId}`}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              No recent applicant submissions yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Posted Jobs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Posted Openings</h2>
            <p className="text-xs text-slate-400">Recent jobs and active candidate counts.</p>
          </div>
          <Link
            to="/recruiter/jobs"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Manage All ({stats?.totalJobs || 0}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentJobs && stats.recentJobs.length > 0 ? (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="py-3 px-2">Role Title</th>
                  <th className="py-3 px-2">Job Type</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Applicants</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-2">
                      <Link to={`/jobs/${job.id}`} className="font-bold text-slate-800 hover:text-brand-600">
                        {job.title}
                      </Link>
                      <p className="text-[11px] text-slate-400">Posted {formatDate(job.createdAt)}</p>
                    </td>
                    <td className="py-3.5 px-2">
                      <StatusBadge status={job.jobType} type="jobType" />
                    </td>
                    <td className="py-3.5 px-2">
                      <StatusBadge status={job.status} type="job" />
                    </td>
                    <td className="py-3.5 px-2 text-slate-600 font-medium">{job.location}</td>
                    <td className="py-3.5 px-2 font-bold text-brand-600">
                      {job.applicantCount || 0} candidate(s)
                    </td>
                    <td className="py-3.5 px-2 text-right space-x-2">
                      <Link
                        to={`/recruiter/applicants?jobId=${job.id}`}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Applicants
                      </Link>
                      <span className="text-slate-300">•</span>
                      <Link
                        to={`/recruiter/jobs/${job.id}/edit`}
                        className="text-xs font-semibold text-slate-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center space-y-2">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-600">No active job postings</p>
            <Link
              to="/recruiter/jobs/new"
              className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Post Your First Opening
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
