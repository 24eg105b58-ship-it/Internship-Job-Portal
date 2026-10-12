import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminDashboardStats } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate, formatTimeAgo } from '../../utils/formatters';
import {
  ShieldAlert,
  Users,
  Building,
  Briefcase,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Check,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin dashboard stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApproveJob = async (jobId: number) => {
    try {
      await adminApi.approveJob(jobId);
      setActionSuccess(`Job #${jobId} approved successfully!`);
      fetchDashboard();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve job');
    }
  };

  const handleRejectJob = async (jobId: number) => {
    const reason = prompt('Please provide a reason for rejection (optional):') || 'Criteria not met';
    try {
      await adminApi.rejectJob(jobId, reason);
      setActionSuccess(`Job #${jobId} marked as rejected.`);
      fetchDashboard();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject job');
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

  // Prep Chart Data
  const statusPieData = stats?.applicationsByStatus
    ? Object.entries(stats.applicationsByStatus).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
      }))
    : [];

  const jobTypeBarData = stats?.jobsByType
    ? Object.entries(stats.jobsByType).map(([name, count]) => ({
        name: name.replace('_', ' '),
        count,
      }))
    : [];

  const COLORS = ['#0c8de9', '#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" /> Portal Executive Control Room
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Operations & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Monitor verified employer postings, regulate student candidate records, review analytical reports, and moderate newly submitted opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/jobs"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" /> Moderation Queue ({stats?.pendingJobs || 0})
          </Link>
          <Link
            to="/admin/reports"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <BarChart2 className="w-4 h-4" /> Full Reports
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Global Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalStudents || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Students</p>
        </div>

        {/* Total Recruiters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalRecruiters || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Recruiters</p>
        </div>

        {/* Total Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalJobs || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Total Jobs</p>
        </div>

        {/* Pending Moderation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.pendingJobs || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Pending Review</p>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileCheck className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalApplications || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Applications</p>
        </div>

        {/* Shortlisted Candidates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.shortlistedCandidates || 0}</p>
          <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Pie Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Application Pipeline Distribution
          </h2>
          <div className="h-64">
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No application distribution data yet.
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            {statusPieData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-600 font-medium">
                  {entry.name}: <strong>{entry.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs by Type Bar Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Job & Internship Categories
          </h2>
          <div className="h-64">
            {jobTypeBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobTypeBarData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0c8de9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No job category distribution data yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Moderation Queue Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <span>Pending Moderation Queue</span>
            </h2>
            <p className="text-xs text-slate-400">
              Verify submitted employer listings to publish them for student applications.
            </p>
          </div>
          <Link
            to="/admin/jobs?status=PENDING"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Moderate All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentJobs && stats.recentJobs.filter((j) => j.status === 'PENDING').length > 0 ? (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <th className="py-3 px-2">Position Title</th>
                  <th className="py-3 px-2">Employer</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Location</th>
                  <th className="py-3 px-2">Submitted</th>
                  <th className="py-3 px-2 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentJobs
                  .filter((j) => j.status === 'PENDING')
                  .map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-2">
                        <Link to={`/jobs/${job.id}`} className="font-bold text-slate-900 hover:text-brand-600">
                          {job.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-2 font-medium text-slate-700">{job.companyName}</td>
                      <td className="py-3.5 px-2">
                        <StatusBadge status={job.jobType} type="jobType" />
                      </td>
                      <td className="py-3.5 px-2 text-slate-600">{job.location}</td>
                      <td className="py-3.5 px-2 text-slate-400">{formatTimeAgo(job.createdAt)}</td>
                      <td className="py-3.5 px-2 text-right space-x-2">
                        <button
                          onClick={() => handleApproveJob(job.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectJob(job.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors border border-rose-200 inline-flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400 space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">All submissions are moderated!</p>
            <p>No job postings currently awaiting review.</p>
          </div>
        )}
      </div>
    </div>
  );
};
