import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobApi } from '../../api/jobApi';
import { Job, JobType, PagedResponse } from '../../types';
import { JobCard } from '../../components/common/JobCard';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  MapPin,
  Building,
  Filter,
  Briefcase,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

export const BrowseJobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [company, setCompany] = useState(searchParams.get('company') || '');
  const [jobType, setJobType] = useState<string>(searchParams.get('jobType') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0);

  const [pagedData, setPagedData] = useState<PagedResponse<Job> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const debouncedSearch = useDebounce(search, 400);
  const debouncedLocation = useDebounce(location, 400);
  const debouncedCompany = useDebounce(company, 400);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await jobApi.searchJobs({
        search: debouncedSearch || undefined,
        location: debouncedLocation || undefined,
        company: debouncedCompany || undefined,
        jobType: jobType || undefined,
        page,
        size: 9,
      });
      setPagedData(data);
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Update URL query params
    const nextParams = new URLSearchParams();
    if (debouncedSearch) nextParams.set('search', debouncedSearch);
    if (debouncedLocation) nextParams.set('location', debouncedLocation);
    if (debouncedCompany) nextParams.set('company', debouncedCompany);
    if (jobType) nextParams.set('jobType', jobType);
    if (page > 0) nextParams.set('page', String(page));
    setSearchParams(nextParams, { replace: true });
  }, [debouncedSearch, debouncedLocation, debouncedCompany, jobType, page]);

  const handleSaveToggle = async (jobId: number, isSaved: boolean) => {
    if (!user || user.role !== 'STUDENT') {
      alert('Please log in with a student account to save jobs.');
      return;
    }
    try {
      if (isSaved) {
        await jobApi.unsaveJob(jobId);
      } else {
        await jobApi.saveJob(jobId);
      }
      setPagedData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          content: prev.content.map((j) =>
            j.id === jobId ? { ...j, isSaved: !isSaved } : j
          ),
        };
      });
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setCompany('');
    setJobType('');
    setPage(0);
  };

  const hasActiveFilters = !!(search || location || company || jobType);

  const jobTypeOptions: { label: string; value: JobType | '' }[] = [
    { label: 'All Job Types', value: '' },
    { label: 'Internships', value: 'INTERNSHIP' },
    { label: 'Full-Time Positions', value: 'FULL_TIME' },
    { label: 'Part-Time Roles', value: 'PART_TIME' },
    { label: 'Contract Opportunities', value: 'CONTRACT' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Direct Verified Postings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Internships & Tech Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified openings, filter by location or work type, and apply directly.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters & Search</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-600" />
          )}
        </button>
      </div>

      {/* Filter and Search Bar Container */}
      <div
        className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 ${
          showFiltersMobile ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              placeholder="Title, skill (e.g. Java, AI)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden transition-colors"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(0);
              }}
              placeholder="Location or 'Remote'"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden transition-colors"
            />
          </div>

          {/* Company Filter */}
          <div className="relative">
            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setPage(0);
              }}
              placeholder="Company name"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden transition-colors"
            />
          </div>

          {/* Job Type Select */}
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-hidden transition-colors appearance-none cursor-pointer"
            >
              {jobTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Pills & Reset */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium">Applied Filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-semibold">
                  Keyword: "{search}"
                  <button onClick={() => setSearch('')} aria-label="Clear search">
                    <X className="w-3 h-3 hover:text-brand-900" />
                  </button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-semibold">
                  Location: "{location}"
                  <button onClick={() => setLocation('')} aria-label="Clear location">
                    <X className="w-3 h-3 hover:text-brand-900" />
                  </button>
                </span>
              )}
              {company && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-semibold">
                  Company: "{company}"
                  <button onClick={() => setCompany('')} aria-label="Clear company">
                    <X className="w-3 h-3 hover:text-brand-900" />
                  </button>
                </span>
              )}
              {jobType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-semibold">
                  Type: {jobType}
                  <button onClick={() => setJobType('')} aria-label="Clear job type">
                    <X className="w-3 h-3 hover:text-brand-900" />
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing{' '}
          <strong className="text-slate-800">
            {pagedData?.totalElements || 0}
          </strong>{' '}
          openings found
        </span>
        {pagedData && pagedData.totalPages > 1 && (
          <span>
            Page {pagedData.page + 1} of {pagedData.totalPages}
          </span>
        )}
      </div>

      {/* Job Grid / List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !pagedData || pagedData.content.length === 0 ? (
        <EmptyState
          title="No Matching Openings Found"
          description="Try broadening your search keywords, location filters, or resetting filter options to see all available roles."
          actionText="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagedData.content.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSaveToggle={handleSaveToggle}
              showSaveButton={user?.role === 'STUDENT'}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagedData && pagedData.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: pagedData.totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                page === idx
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(pagedData.totalPages - 1, prev + 1))}
            disabled={page >= pagedData.totalPages - 1}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
