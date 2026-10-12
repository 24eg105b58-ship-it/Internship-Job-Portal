import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi';
import { resumeApi } from '../../api/resumeApi';
import { Application, ApplicationStatus, PagedResponse } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate, formatTimeAgo } from '../../utils/formatters';
import {
  FileCheck2,
  Building,
  MapPin,
  Calendar,
  FileText,
  Download,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const [pagedData, setPagedData] = useState<PagedResponse<Application> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Withdraw state
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await applicationApi.getMyApplications(page, 10);
      setPagedData(data);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const handleWithdraw = async () => {
    if (!selectedApp) return;
    setIsWithdrawing(true);
    try {
      await applicationApi.withdrawApplication(selectedApp.id);
      setIsWithdrawModalOpen(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      console.error('Failed to withdraw application', err);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const filteredContent = pagedData?.content.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  }) || [];

  const statuses: { label: string; value: string }[] = [
    { label: 'All Applications', value: 'ALL' },
    { label: 'Applied', value: 'APPLIED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Shortlisted', value: 'SHORTLISTED' },
    { label: 'Selected / Offers', value: 'SELECTED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Job & Internship Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time candidate review status and recruiter communications.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          Explore More Jobs →
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === s.value
                ? 'bg-brand-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filteredContent.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No Applications Found"
          description={
            statusFilter !== 'ALL'
              ? `You don't have any applications marked as "${statusFilter}".`
              : "You haven't submitted any job applications yet."
          }
          actionText="Browse Available Jobs"
          onAction={() => (window.location.href = '/jobs')}
        />
      ) : (
        <div className="space-y-4">
          {filteredContent.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:shadow-sm transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      {app.companyName}
                    </span>
                    <StatusBadge status={app.status} type="application" />
                  </div>
                  <Link
                    to={`/jobs/${app.jobId}`}
                    className="text-base sm:text-lg font-bold text-slate-900 hover:text-brand-600 transition-colors inline-flex items-center gap-1"
                  >
                    {app.jobTitle}
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {app.jobLocation}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Applied on {formatDate(app.appliedAt)} ({formatTimeAgo(app.appliedAt)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-start">
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setIsWithdrawModalOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"
                    title="Withdraw Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cover note or Recruiter Note snippet */}
              {app.coverNote && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-0.5">Your Cover Note:</span>
                  <p className="line-clamp-2">{app.coverNote}</p>
                </div>
              )}

              {app.notes && (
                <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-900 border border-purple-100">
                  <span className="font-bold text-purple-800 block mb-0.5">Recruiter Feedback Note:</span>
                  <p>{app.notes}</p>
                </div>
              )}

              {/* Attached Resume */}
              {app.resumeId && app.resumeOriginalName && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileText className="w-4 h-4 text-brand-600" />
                    Attached Resume: <strong className="text-slate-700">{app.resumeOriginalName}</strong>
                  </span>
                  <a
                    href={resumeApi.downloadResumeUrl(app.resumeId)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagedData && pagedData.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-slate-600 px-2">
            Page {pagedData.page + 1} of {pagedData.totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(pagedData.totalPages - 1, prev + 1))}
            disabled={page >= pagedData.totalPages - 1}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Withdraw Confirm Dialog */}
      <ConfirmDialog
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdraw}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your application for "${selectedApp?.jobTitle}" at ${selectedApp?.companyName}? This action cannot be undone.`}
        confirmText="Withdraw"
        cancelText="Keep Application"
        isDangerous={true}
        isLoading={isWithdrawing}
      />
    </div>
  );
};
