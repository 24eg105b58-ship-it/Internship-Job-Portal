import React, { useState, useEffect } from 'react';
import { resumeApi } from '../../api/resumeApi';
import { Resume } from '../../types';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { formatDate } from '../../utils/formatters';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const ResumeManagerPage: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Delete state
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const data = await resumeApi.getMyResumes();
      setResumes(data);
    } catch (err) {
      console.error('Failed to load resumes', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const uploaded = await resumeApi.uploadResume(file);
      setResumes((prev) => [uploaded, ...prev]);
      setSuccessMessage(`"${uploaded.originalFileName}" uploaded successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to upload resume file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await resumeApi.setDefaultResume(id);
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          isDefault: r.id === id,
        }))
      );
      setSuccessMessage('Default resume updated.');
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to set default resume.');
    }
  };

  const handleDelete = async () => {
    if (!resumeToDelete) return;
    setIsDeleting(true);
    try {
      await resumeApi.deleteResume(resumeToDelete.id);
      setResumes((prev) => prev.filter((r) => r.id !== resumeToDelete.id));
      setSuccessMessage('Resume deleted successfully.');
      setResumeToDelete(null);
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Resume Documents & CV Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload and manage multiple versions of your resume tailored for different engineering roles.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Drag & Drop / Upload Area */}
      <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-300 hover:border-brand-500 transition-colors text-center bg-slate-50/50">
        <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Upload a New Resume Document
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
          Supports PDF, DOC, DOCX files up to 10MB. You can set a primary default resume for quick applications.
        </p>

        <label className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/25 transition-all cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading Resume...' : 'Choose File to Upload'}</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Resumes List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Your Uploaded Documents ({resumes.length})
        </h2>

        {isLoading ? (
          <TableSkeleton rows={3} />
        ) : resumes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Resumes Uploaded Yet"
            description="Upload your CV or resume above to begin applying to tech internships and job openings."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-3 rounded-2xl transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800">{resume.originalFileName}</p>
                      {resume.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {formatFileSize(resume.fileSize)} • Uploaded {formatDate(resume.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  {!resume.isDefault && (
                    <button
                      onClick={() => handleSetDefault(resume.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-lg text-xs font-semibold transition-colors"
                      title="Set as Default Resume"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Set Default</span>
                    </button>
                  )}

                  <a
                    href={resumeApi.downloadResumeUrl(resume.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 rounded-lg text-xs font-semibold transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setResumeToDelete(resume)}
                    className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg text-xs font-semibold transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!resumeToDelete}
        onClose={() => setResumeToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Resume Document"
        message={`Are you sure you want to delete "${resumeToDelete?.originalFileName}"? Any future applications will need an alternate resume document.`}
        confirmText="Delete Document"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
