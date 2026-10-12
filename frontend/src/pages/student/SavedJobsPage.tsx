import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../../api/jobApi';
import { Job, PagedResponse } from '../../types';
import { JobCard } from '../../components/common/JobCard';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Bookmark, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const [pagedData, setPagedData] = useState<PagedResponse<Job> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobApi.getSavedJobs(page, 9);
      setPagedData(data);
    } catch (err) {
      console.error('Failed to load saved jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [page]);

  const handleSaveToggle = async (jobId: number) => {
    try {
      await jobApi.unsaveJob(jobId);
      // Remove from list
      setPagedData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.filter((j) => j.id !== jobId),
          totalElements: Math.max(0, prev.totalElements - 1),
        };
      });
    } catch (err) {
      console.error('Failed to unsave job', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Saved Job Openings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Positions and internships you have bookmarked for easy reference and future applications.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          Discover More Jobs →
        </Link>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !pagedData || pagedData.content.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No Saved Jobs"
          description="Bookmark job postings you find intriguing while browsing to quickly review and apply later."
          actionText="Browse Available Jobs"
          onAction={() => (window.location.href = '/jobs')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagedData.content.map((job) => (
            <JobCard
              key={job.id}
              job={{ ...job, isSaved: true }}
              onSaveToggle={handleSaveToggle}
              showSaveButton={true}
            />
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
    </div>
  );
};
