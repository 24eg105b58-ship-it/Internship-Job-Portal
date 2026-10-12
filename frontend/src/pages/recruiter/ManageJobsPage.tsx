import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterApi } from '../../api/recruiterApi';
import { jobApi } from '../../api/jobApi';
import { Job, PagedResponse } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate } from '../../utils/formatters';
import {
  Briefcase,
  Users,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

export const ManageJobsPage: React.FC = () => {
  const [pagedData, setPagedData] = useState<PagedResponse<Job> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  // Delete state
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await recruiterApi.getMyJobs(page, 10);
      setPagedData(data);
    } catch (err) {
      console.error('Failed to load recruiter jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      await jobApi.deleteJob(jobToDelete.id);
      setJobToDelete(null);
      fetchJobs();
    } catch (err) {
      console.error('Failed to delete job', err);
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
            Manage Posted Openings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active listings, applicant submissions, and edit job criteria.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      {/* Jobs Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : !pagedData || pagedData.content.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Jobs Posted Yet"
          description="You haven't posted any job or internship openings yet. Create your first opening to start hiring candidates."
          actionText="Create New Job Posting"
          onAction={() => (window.location.href = '/recruiter/jobs/new')}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-4">Title & Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4">Date Posted</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedData.content.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="font-bold text-slate-900 hover:text-brand-600 text-sm line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        <StatusBadge status={job.jobType} type="jobType" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {job.openings} opening(s) {job.salary && `• ${job.salary}`}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={job.status} type="job" />
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-700">
                      {job.location}
                    </td>

                    <td className="py-4 px-4">
                      <Link
                        to={`/recruiter/applicants?jobId=${job.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg font-bold text-xs transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount || 0} Candidates</span>
                      </Link>
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {formatDate(job.createdAt)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Public Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/recruiter/jobs/${job.id}/edit`}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setJobToDelete(job)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Job"
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

      {/* Delete Modal */}
      <ConfirmDialog
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Job Posting"
        message={`Are you sure you want to delete the job posting "${jobToDelete?.title}"? All submitted applications associated with this job will also be removed.`}
        confirmText="Delete Job"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
