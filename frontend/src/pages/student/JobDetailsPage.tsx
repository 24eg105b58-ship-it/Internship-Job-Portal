import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobApi } from '../../api/jobApi';
import { applicationApi } from '../../api/applicationApi';
import { resumeApi } from '../../api/resumeApi';
import { Job, Resume, Application } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { DetailSkeleton } from '../../components/common/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { formatTimeAgo, formatDate } from '../../utils/formatters';
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Upload,
  Globe,
  Share2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | undefined>(undefined);
  const [coverNote, setCoverNote] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchJob = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await jobApi.getJobById(Number(id));
      setJob(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const loadResumes = async () => {
    if (user?.role === 'STUDENT') {
      try {
        const list = await resumeApi.getMyResumes();
        setResumes(list);
        const defaultResume = list.find((r) => r.isDefault) || list[0];
        if (defaultResume) {
          setSelectedResumeId(defaultResume.id);
        }
      } catch (err) {
        console.error('Failed to load student resumes', err);
      }
    }
  };

  const handleOpenApplyModal = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    loadResumes();
    setIsApplyModalOpen(true);
    setApplyError('');
    setApplySuccess(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    try {
      const uploaded = await resumeApi.uploadResume(file);
      setResumes((prev) => [uploaded, ...prev]);
      setSelectedResumeId(uploaded.id);
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to upload resume document');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setIsSubmitting(true);
    setApplyError('');

    try {
      await applicationApi.applyForJob({
        jobId: job.id,
        resumeId: selectedResumeId,
        coverNote,
      });

      setApplySuccess(true);
      setJob((prev) => (prev ? { ...prev, isApplied: true, applicationStatus: 'APPLIED' } : prev));
      setTimeout(() => {
        setIsApplyModalOpen(false);
      }, 2000);
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!job) return;
    if (!user || user.role !== 'STUDENT') {
      alert('Please log in with a student account to save jobs.');
      return;
    }

    try {
      if (job.isSaved) {
        await jobApi.unsaveJob(job.id);
        setJob({ ...job, isSaved: false });
      } else {
        await jobApi.saveJob(job.id);
        setJob({ ...job, isSaved: true });
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-1">Job Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'This posting may have been removed or closed.'}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Jobs
        </Link>
      </div>
    );
  }

  const skillsArray = job.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Postings
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          {user?.role === 'STUDENT' && (
            <button
              onClick={handleSaveToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shadow-2xs ${
                job.isSaved
                  ? 'bg-brand-50 border-brand-200 text-brand-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {job.isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save Job</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Job Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md flex-shrink-0">
              {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {job.companyName}
                </span>
                {job.companyWebsite && (
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Globe className="w-3 h-3" /> Website
                  </a>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <StatusBadge status={job.jobType} type="jobType" />
                <StatusBadge status={job.status} type="job" />
                {job.createdAt && (
                  <span className="text-xs text-slate-400">
                    Posted {formatTimeAgo(job.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="flex flex-col items-stretch sm:items-end gap-2 flex-shrink-0">
            {job.isApplied ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You have applied!</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Current Status: <strong>{job.applicationStatus || 'APPLIED'}</strong>
                </p>
                <Link
                  to="/student/applications"
                  className="inline-block text-[11px] text-brand-600 hover:underline font-bold pt-1"
                >
                  Track in Applications →
                </Link>
              </div>
            ) : user?.role === 'STUDENT' ? (
              <button
                onClick={handleOpenApplyModal}
                className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/25 transition-all text-center"
              >
                Apply for Position
              </button>
            ) : !isAuthenticated ? (
              <button
                onClick={handleOpenApplyModal}
                className="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/25 transition-all text-center"
              >
                Sign In & Apply
              </button>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                Logged in as <strong>{user?.role}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Location
            </span>
            <p className="font-bold text-slate-800">{job.location}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Compensation
            </span>
            <p className="font-bold text-slate-800">{job.salary || 'Competitive / Unspecified'}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" /> Open Positions
            </span>
            <p className="font-bold text-slate-800">{job.openings} opening(s)</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> Application Deadline
            </span>
            <p className="font-bold text-slate-800">
              {job.deadline ? formatDate(job.deadline) : 'Rolling Admissions'}
            </p>
          </div>
        </div>

        {/* Technical Skills Required */}
        {skillsArray.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Relevant Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-brand-50 border border-brand-100 text-brand-700 rounded-lg text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Description */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-slate-900">About the Role</h3>
          <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {/* Key Responsibilities */}
        {job.responsibilities && (
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-slate-900">Key Responsibilities</h3>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {job.responsibilities}
            </div>
          </div>
        )}

        {/* Requirements & Qualifications */}
        {job.requirements && (
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-slate-900">Candidate Requirements</h3>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {job.requirements}
            </div>
          </div>
        )}
      </div>

      {/* Application Submission Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply to ${job.title}`}
        maxWidth="lg"
      >
        {applySuccess ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-xs text-slate-500">
              {job.companyName} has received your application. You can track updates in your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitApplication} className="space-y-5">
            {applyError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {applyError}
              </div>
            )}

            {/* Resume Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700">
                  Select Resume Document
                </label>
                <Link
                  to="/student/resumes"
                  target="_blank"
                  className="text-[11px] font-semibold text-brand-600 hover:underline flex items-center gap-1"
                >
                  Manage All Resumes <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {resumes.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {resumes.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedResumeId === r.id
                          ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-100'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="resumeOption"
                          value={r.id}
                          checked={selectedResumeId === r.id}
                          onChange={() => setSelectedResumeId(r.id)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{r.originalFileName}</p>
                          <p className="text-[10px] text-slate-400">
                            Uploaded {formatDate(r.uploadedAt)} {r.isDefault && '• (Default)'}
                          </p>
                        </div>
                      </div>
                      <FileText className="w-4 h-4 text-slate-400" />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 mb-3">
                  You haven't uploaded any resumes yet. Upload one below to continue.
                </div>
              )}

              {/* Fast Upload File */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                  Or Upload New Resume (PDF, DOCX max 10MB)
                </label>
                <label className="flex items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl hover:border-brand-400 cursor-pointer bg-slate-50 hover:bg-brand-50/30 transition-colors">
                  <Upload className="w-4 h-4 text-brand-600 mr-2" />
                  <span className="text-xs font-semibold text-slate-700">
                    {isUploadingResume ? 'Uploading...' : 'Browse & Upload File'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={isUploadingResume}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Cover Note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cover Note / Pitch (Optional)
              </label>
              <textarea
                rows={4}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Explain why you are an exceptional fit for this opportunity, notable projects, or links..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden transition-colors"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploadingResume}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
