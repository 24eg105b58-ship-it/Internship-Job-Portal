import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobApi } from '../api/jobApi';
import { Job } from '../types';
import { JobCard } from '../components/common/JobCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  ShieldCheck,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await jobApi.searchJobs({ page: 0, size: 6 });
        setFeaturedJobs(response.content || []);
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (locationTerm) params.append('location', locationTerm);
    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { label: 'Software Engineering', count: '120+ roles', type: 'INTERNSHIP' },
    { label: 'Data Science & AI', count: '85+ roles', type: 'FULL_TIME' },
    { label: 'Frontend & UI/UX', count: '64+ roles', type: 'INTERNSHIP' },
    { label: 'Backend & Cloud', count: '90+ roles', type: 'CONTRACT' },
    { label: 'Product Management', count: '45+ roles', type: 'INTERNSHIP' },
    { label: 'Cybersecurity', count: '30+ roles', type: 'FULL_TIME' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-white pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200/60">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Over 2,500+ Verified University Tech Opportunities</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Land Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Internship & Career</span> at Top Tech Companies
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect directly with verified recruiters, showcase your projects, track your application lifecycle in real-time, and kickstart your professional journey.
          </p>

          {/* Search Bar Form */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row items-center gap-2.5"
            >
              <div className="flex-1 w-full flex items-center px-3 py-2 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none">
                <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job title, skills (e.g. Java, React, AI), or company"
                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <div className="hidden md:block w-px h-8 bg-slate-200" />

              <div className="flex-1 w-full flex items-center px-3 py-2 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none">
                <MapPin className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  placeholder="City, State, or 'Remote'"
                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 flex-shrink-0"
              >
                <span>Find Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick popular tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular Searches:</span>
              {['Summer 2026 Intern', 'Remote Software Engineer', 'React Frontend', 'Java Spring Boot', 'Machine Learning'].map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchTerm(tag);
                    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-300 transition-colors shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto mt-16 pt-8 border-t border-slate-200/80 text-left">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">1,200+</p>
                <p className="text-xs text-slate-500 font-medium">Active Postings</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">350+</p>
                <p className="text-xs text-slate-500 font-medium">Verified Employers</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">15,000+</p>
                <p className="text-xs text-slate-500 font-medium">Student Applicants</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900">92%</p>
                <p className="text-xs text-slate-500 font-medium">Placement Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Role Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore by Department & Discipline
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find curated internships tailored to your specific field of study.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            Explore All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to={`/jobs?search=${encodeURIComponent(cat.label)}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-brand-50 text-slate-600 group-hover:text-brand-600 flex items-center justify-center transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-400">{cat.count}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
              <Sparkles className="w-3 h-3" /> Featured Openings
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Latest Verified Opportunities
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hand-picked internships and junior roles actively hiring today.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            View All {featuredJobs.length > 0 ? `${featuredJobs.length}+ ` : ''}Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Value Proposition Cards (For Students & Recruiters) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Candidates Card */}
          <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">For Ambitious Students</h3>
                <p className="text-brand-100 text-sm mt-2 leading-relaxed">
                  Directly apply to verified companies without getting lost in third-party spam. Track interviews, view real recruiter feedback, and build a standout profile.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-brand-50">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-300 flex-shrink-0" />
                  <span>One-click apply with custom resumes & cover letters</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-300 flex-shrink-0" />
                  <span>Live application tracking (Applied → Review → Shortlist → Offer)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-300 flex-shrink-0" />
                  <span>Instant email & in-app alerts for recruiter updates</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Create Free Candidate Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For Employers Card */}
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-brand-400 border border-slate-700">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">For Hiring Teams & Recruiters</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Streamline university hiring with our intuitive Applicant Tracking System (ATS). Screen pre-qualified student profiles, schedule rounds, and hire faster.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Integrated candidate pipeline & resume review drawer</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Filter by university, CGPA, graduation year & technical skills</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Dedicated company branding profile & verified badge</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-colors"
              >
                Post Jobs as Employer <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Engineered for Trust & Compliance
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Our end-to-end portal provides students and employers with enterprise-grade reliability and data security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Admin Moderation</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every job posting is vetted by administrators before publication to prevent spam and ghost listings.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Secure Document Vault</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Student resumes and applications are encrypted with multi-tier role-based access control.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-xs border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Direct Candidate Outreach</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Recruiters directly engage candidates without middleman agencies or hidden placement fees.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
