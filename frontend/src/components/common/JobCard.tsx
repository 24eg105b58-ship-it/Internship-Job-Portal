import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { StatusBadge } from './StatusBadge';
import { formatTimeAgo } from '../../utils/formatters';
import { MapPin, DollarSign, Bookmark, BookmarkCheck, Building, Clock, ArrowRight } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onSaveToggle?: (jobId: number, isSaved: boolean) => void;
  showSaveButton?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSaveToggle,
  showSaveButton = true,
}) => {
  const skillsArray = job.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header: Company & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-bold text-base flex-shrink-0">
              {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate flex items-center gap-1">
                <Building className="w-3.5 h-3.5 flex-shrink-0" />
                {job.companyName}
              </p>
              <Link to={`/jobs/${job.id}`}>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <StatusBadge status={job.jobType} type="jobType" />
            {showSaveButton && onSaveToggle && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onSaveToggle(job.id, !!job.isSaved);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                title={job.isSaved ? 'Remove from saved' : 'Save job'}
                aria-label="Save job"
              >
                {job.isSaved ? (
                  <BookmarkCheck className="w-5 h-5 text-brand-600" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Location & Salary pills */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              {job.salary}
            </span>
          )}
          {job.createdAt && (
            <span className="flex items-center gap-1 text-slate-400 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {formatTimeAgo(job.createdAt)}
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skillsArray.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-md"
              >
                {skill}
              </span>
            ))}
            {skillsArray.length > 4 && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-50 text-slate-400 rounded-md">
                +{skillsArray.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Status & Action Button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
        <div>
          {job.isApplied ? (
            <span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ Applied ({job.applicationStatus || 'Submitted'})
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              {job.openings > 1 ? `${job.openings} Openings` : '1 Opening'}
            </span>
          )}
        </div>
        <Link
          to={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
