import React from 'react';
import { ApplicationStatus, JobStatus, JobType } from '../../types';
import { formatJobType, formatStatus } from '../../utils/formatters';

interface StatusBadgeProps {
  status?: ApplicationStatus | JobStatus | JobType | string;
  type?: 'application' | 'job' | 'jobType';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'application' }) => {
  if (!status) return null;

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (type === 'application') {
    switch (status) {
      case 'APPLIED':
        colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case 'UNDER_REVIEW':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'SHORTLISTED':
        colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
        break;
      case 'SELECTED':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'REJECTED':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
    }
  } else if (type === 'job') {
    switch (status) {
      case 'APPROVED':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'PENDING':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
      case 'REJECTED':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
        break;
      case 'CLOSED':
        colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
        break;
    }
  } else if (type === 'jobType') {
    switch (status) {
      case 'INTERNSHIP':
        colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
        break;
      case 'FULL_TIME':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        break;
      case 'PART_TIME':
        colorClasses = 'bg-teal-50 text-teal-700 border-teal-200';
        break;
      case 'CONTRACT':
        colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
        break;
    }
  }

  const label = type === 'jobType' ? formatJobType(status) : formatStatus(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      {label}
    </span>
  );
};
