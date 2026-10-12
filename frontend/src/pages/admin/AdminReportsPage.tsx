import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { AdminReport } from '../../types';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import {
  BarChart3,
  TrendingUp,
  Building,
  Briefcase,
  Users,
  FileCheck2,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminReportsPage: React.FC = () => {
  const [report, setReport] = useState<AdminReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await adminApi.getReports();
        setReport(data);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
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

  const COLORS = ['#0c8de9', '#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

  const statusData = report?.applicationStatusDistribution
    ? Object.entries(report.applicationStatusDistribution).map(([name, value]) => ({
        name: name.replace('_', ' '),
        value,
      }))
    : [];

  const jobTypeData = report?.jobTypeDistribution
    ? Object.entries(report.jobTypeDistribution).map(([name, count]) => ({
        name: name.replace('_', ' '),
        count,
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Platform Analytics & Hiring Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Deep-dive business intelligence metrics, candidate application velocity, and employer hiring volume.
        </p>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <p className="text-xs font-semibold text-slate-500">Total Portal Users</p>
          <p className="text-2xl font-black text-slate-900">{report?.totalUsers || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <p className="text-xs font-semibold text-slate-500">Registered Students</p>
          <p className="text-2xl font-black text-brand-600">{report?.totalStudents || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <p className="text-xs font-semibold text-slate-500">Recruiter Organizations</p>
          <p className="text-2xl font-black text-indigo-600">{report?.totalRecruiters || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <p className="text-xs font-semibold text-slate-500">Published Job Openings</p>
          <p className="text-2xl font-black text-emerald-600">{report?.totalJobs || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <p className="text-xs font-semibold text-slate-500">Total Applications</p>
          <p className="text-2xl font-black text-purple-600">{report?.totalApplications || 0}</p>
        </div>
      </div>

      {/* Growth Trend Area Chart */}
      {report?.monthlyApplicationTrends && report.monthlyApplicationTrends.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span>Monthly Application & Job Creation Volume</span>
              </h2>
              <p className="text-xs text-slate-400">Monthly progression of applicant activity and new openings.</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report.monthlyApplicationTrends}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0c8de9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0c8de9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Applications"
                  stroke="#0c8de9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApps)"
                />
                <Area
                  type="monotone"
                  dataKey="jobs"
                  name="Job Openings"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorJobs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Recruiters & Most Applied Jobs Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Recruiters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-600" />
            <span>Top Hiring Companies</span>
          </h2>
          {report?.topRecruiters && report.topRecruiters.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {report.topRecruiters.map((rec, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-600 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{rec.companyName}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-brand-50 text-brand-700 font-bold rounded-lg">
                    {rec.jobCount} job(s)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No employer rankings available.</p>
          )}
        </div>

        {/* Most Applied Jobs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Most Popular Job Listings</span>
          </h2>
          {report?.mostAppliedJobs && report.mostAppliedJobs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {report.mostAppliedJobs.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.companyName}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg">
                    {item.applicationCount} applied
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No popular job data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
