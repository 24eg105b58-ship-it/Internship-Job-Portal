import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { recruiterApi } from '../../api/recruiterApi';
import { applicationApi } from '../../api/applicationApi';
import { resumeApi } from '../../api/resumeApi';
import { Application, ApplicationStatus, Job, PagedResponse } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate, formatTimeAgo } from '../../utils/formatters';
import {
  Users,
  Search,
  Filter,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Mail,
  Phone,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export const ApplicantManagementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobId, setJobId] = useState<string>(searchParams.get('jobId') || '');
  const [status, setStatus] = useState<string>(searchParams.get('status') || '');
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 0);

  const [pagedData, setPagedData] = useState<PagedResponse<Application> | null>(null);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Candidate Detail & Status Update Modal State
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('UNDER_REVIEW');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  // Load recruiter's jobs for dropdown filter
  useEffect(() => {
    const fetchJobsList = async () => {
      try {
        const data = await recruiterApi.getMyJobs(0, 50);
        setMyJobs(data.content);
      } catch (err) {
        console.error('Failed to load recruiter jobs list', err);
      }
    };
    fetchJobsList();
  }, []);

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
      const data = await recruiterApi.getApplicants({
        jobId: jobId ? Number(jobId) : undefined,
        status: status ? (status as ApplicationStatus) : undefined,
        search: debouncedSearch || undefined,
        page,
        size: 10,
      });
      setPagedData(data);
    } catch (err) {
      console.error('Failed to load applicants', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    const params = new URLSearchParams();
    if (jobId) params.set('jobId', jobId);
    if (status) params.set('status', status);
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (page > 0) params.set('page', String(page));
    setSearchParams(params, { replace: true });
  }, [jobId, status, debouncedSearch, page]);

  const handleOpenDetailModal = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setRecruiterNotes(app.notes || '');
    setUpdateSuccess('');
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsUpdatingStatus(true);
    setUpdateSuccess('');

    try {
      const updated = await applicationApi.updateStatus(
        selectedApp.id,
        newStatus,
        recruiterNotes
      );
      setSelectedApp(updated);
      setUpdateSuccess(`Applicant status updated to ${newStatus}`);
      fetchApplicants();
      setTimeout(() => {
        setIsDetailModalOpen(false);
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update applicant status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Applicant Tracking System (ATS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Screen candidates, inspect academic backgrounds, download resumes, and manage interview stages.
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Candidate Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search candidate name or skill..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
            />
          </div>

          {/* Job Filter */}
          <div>
            <select
              value={jobId}
              onChange={(e) => {
                setJobId(e.target.value);
                setPage(0);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
            >
              <option value="">All Job Postings ({myJobs.length})</option>
              {myJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
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
              <option value="">All Candidate Statuses</option>
              <option value="APPLIED">Applied (Unreviewed)</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="SELECTED">Selected / Offered</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : !pagedData || pagedData.content.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Applicants Found"
          description="There are currently no candidates matching the specified filters."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Job Role</th>
                  <th className="py-3.5 px-4">University & CGPA</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applied</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedData.content.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900 text-sm">{app.studentName}</p>
                      <p className="text-[11px] text-slate-400">{app.studentEmail}</p>
                    </td>

                    <td className="py-4 px-4">
                      <Link to={`/jobs/${app.jobId}`} className="font-semibold text-slate-800 hover:text-brand-600">
                        {app.jobTitle}
                      </Link>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <p className="font-medium">{app.studentUniversity || 'Not Specified'}</p>
                      <p className="text-[11px] text-slate-400">
                        {app.studentDegree} {app.studentCgpa && `• CGPA: ${app.studentCgpa}`}
                      </p>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={app.status} type="application" />
                    </td>

                    <td className="py-4 px-4 text-slate-500">
                      {formatTimeAgo(app.appliedAt)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {app.resumeId && (
                          <a
                            href={resumeApi.downloadResumeUrl(app.resumeId)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold text-xs"
                            title="Download Candidate Resume"
                          >
                            <Download className="w-3.5 h-3.5" /> Resume
                          </a>
                        )}

                        <button
                          onClick={() => handleOpenDetailModal(app)}
                          className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                        >
                          Review Candidate
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

      {/* Candidate Review Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedApp ? `Applicant: ${selectedApp.studentName}` : 'Candidate Details'}
        maxWidth="xl"
      >
        {selectedApp && (
          <div className="space-y-6">
            {updateSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{updateSuccess}</span>
              </div>
            )}

            {/* Candidate Header Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">{selectedApp.studentName}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedApp.studentEmail}
                  </span>
                  {selectedApp.studentPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedApp.studentPhone}
                    </span>
                  )}
                </div>
              </div>

              {selectedApp.resumeId && (
                <a
                  href={resumeApi.downloadResumeUrl(selectedApp.resumeId)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-brand-700 text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume PDF</span>
                </a>
              )}
            </div>

            {/* Academic & Skills Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">
                  Academic Background
                </span>
                <p className="font-bold text-slate-800">{selectedApp.studentUniversity || 'University Unspecified'}</p>
                <p className="text-slate-600">{selectedApp.studentDegree || 'Degree in Progress'}</p>
                {selectedApp.studentCgpa && (
                  <p className="font-semibold text-emerald-700">Cumulative GPA: {selectedApp.studentCgpa} / 4.0</p>
                )}
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">
                  Application Information
                </span>
                <p className="font-bold text-slate-800">Job: {selectedApp.jobTitle}</p>
                <p className="text-slate-600">Applied on: {formatDate(selectedApp.appliedAt)}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-slate-400">Current Status:</span>
                  <StatusBadge status={selectedApp.status} type="application" />
                </div>
              </div>
            </div>

            {/* Skills Pills */}
            {selectedApp.studentSkills && (
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">
                  Candidate Technical Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.studentSkills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-brand-50 text-brand-700 font-semibold rounded-lg"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Note */}
            {selectedApp.coverNote && (
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">
                  Candidate Cover Pitch
                </span>
                <div className="p-3.5 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-200/80 whitespace-pre-line">
                  {selectedApp.coverNote}
                </div>
              </div>
            )}

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Advance Candidate in Pipeline
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select New Stage
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  >
                    <option value="UNDER_REVIEW">Under Review (Screening)</option>
                    <option value="SHORTLISTED">Shortlisted (Technical / Interview)</option>
                    <option value="SELECTED">Selected / Offer Extended</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recruiter Feedback Notes (Shared with student)
                  </label>
                  <input
                    type="text"
                    value={recruiterNotes}
                    onChange={(e) => setRecruiterNotes(e.target.value)}
                    placeholder="e.g. Advancing to round 1 technical screen..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Save & Notify Candidate'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};
