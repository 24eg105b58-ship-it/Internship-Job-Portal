import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { jobApi } from '../../api/jobApi';
import { Job, JobStatus, JobType, PagedResponse } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate, formatTimeAgo } from '../../utils/formatters';
import {
  ShieldAlert,
  Search,
  Check,
  X,
  Trash2,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building,
} from 'lucide-react';

export const AdminJobModerationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || '');
  const [jobType, setJobType] = useState<string>(searchParams.get('jobType') || '');
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 0);

  const [pagedData, setPagedData] = useState<PagedResponse<Job> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Reject Modal state
  const [rejectJobId, setRejectJobId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // Delete state
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getAllJobs({
        search: debouncedSearch || undefined,
        status: status ? (status as JobStatus) : undefined,
        jobType: jobType ? (jobType as JobType) : undefined,
        page,
        size: 10,
      });
      setPagedData(data);
    } catch (err) {
      console.error('Failed to load moderation jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (status) params.set('status', status);
    if (jobType) params.set('jobType', jobType);
    if (page > 0) params.set('page', String(page));
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, status, jobType, page]);

  const handleApprove = async (jobId: number) => {
    try {
      await adminApi.approveJob(jobId);
      setNotification({ text: `Job #${jobId} approved and published!`, type: 'success' });
      fetchJobs();
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({
        text: err.response?.data?.message || 'Failed to approve job',
        type: 'error',
      });
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectJobId) return;

    setIsRejecting(true);
    try {
      await adminApi.rejectJob(rejectJobId, rejectReason);
      setNotification({ text: `Job #${rejectJobId} rejected.`, type: 'success' });
      setRejectJobId(null);
      setRejectReason('');
      fetchJobs();
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({
        text: err.response?.data?.message || 'Failed to reject job',
        type: 'error',
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteJobId) return;
    setIsDeleting(true);
    try {
      await jobApi.deleteJob(deleteJobId);
      setNotification({ text: `Job #${deleteJobId} deleted successfully.`, type: 'success' });
      setDeleteJobId(null);
      fetchJobs();
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      setNotification({
        text: err.response?.data?.message || 'Failed to delete job',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Job Moderation & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, approve, reject, or delete opportunities submitted by employers across the platform.
          </p>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 text-xs rounded-2xl flex items-center gap-2 font-medium ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Toolbar Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search by title, skills or employer..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
            >
              <option value="">All Job Statuses</option>
              <option value="PENDING">Pending Approval (Queue)</option>
              <option value="APPROVED">Approved (Live)</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Job Type Filter */}
          <div>
            <select
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setPage(0);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
            >
              <option value="">All Employment Types</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FULL_TIME">Full-Time</option>
              <option value="PART_TIME">Part-Time</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Moderation Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : !pagedData || pagedData.content.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No Moderation Postings Found"
          description="There are currently no job listings matching the search filter criteria."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-4">Title & Employer</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Posted Date</th>
                  <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedData.content.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <Link to={`/jobs/${job.id}`} className="font-bold text-slate-900 hover:text-brand-600 text-sm">
                        {job.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {job.companyName} {job.recruiterEmail && `(${job.recruiterEmail})`}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={job.jobType} type="jobType" />
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700">{job.location}</td>

                    <td className="py-4 px-4">
                      <StatusBadge status={job.status} type="job" />
                    </td>

                    <td className="py-4 px-4 text-slate-500">{formatDate(job.createdAt)}</td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {job.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(job.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1"
                              title="Approve Job"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectJobId(job.id);
                                setRejectReason('');
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors border border-rose-200 inline-flex items-center gap-1"
                              title="Reject Job"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}

                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteJobId(job.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectJobId}
        onClose={() => setRejectJobId(null)}
        title="Reject Job Posting"
        maxWidth="md"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Please provide optional feedback on why this posting does not meet the portal guidelines.
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reason for Rejection
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete description or duplicate listing..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setRejectJobId(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRejecting}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50"
            >
              {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteJobId}
        onClose={() => setDeleteJobId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action will permanently remove it from the portal."
        confirmText="Delete Job"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
