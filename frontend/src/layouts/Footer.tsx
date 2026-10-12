import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, ShieldCheck, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <Briefcase className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight">
                Intern<span className="text-brand-400">Portal</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering students and recent graduates to launch stellar careers through direct access to verified tech internships, full-time roles, and premier recruiters.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@internportal.example.com"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Email support"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Candidates
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-brand-400 transition-colors">
                  Explore Internships
                </Link>
              </li>
              <li>
                <Link to="/jobs?jobType=FULL_TIME" className="hover:text-brand-400 transition-colors">
                  Full-Time Graduate Jobs
                </Link>
              </li>
              <li>
                <Link to="/student/resumes" className="hover:text-brand-400 transition-colors">
                  Resume Builder & Manager
                </Link>
              </li>
              <li>
                <Link to="/student/applications" className="hover:text-brand-400 transition-colors">
                  Application Tracking
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-400 transition-colors">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/recruiter/jobs/new" className="hover:text-brand-400 transition-colors">
                  Post an Internship / Job
                </Link>
              </li>
              <li>
                <Link to="/recruiter/applicants" className="hover:text-brand-400 transition-colors">
                  Candidate ATS Pipeline
                </Link>
              </li>
              <li>
                <Link to="/recruiter/profile" className="hover:text-brand-400 transition-colors">
                  Employer Branding
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-400 transition-colors">
                  Recruiter Sign Up
                </Link>
              </li>
              <li>
                <Link to="/admin/reports" className="hover:text-brand-400 transition-colors">
                  Hiring Benchmark Trends
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Badges */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Trust & Security
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Verified Listings</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Every company and role is strictly moderated by our compliance team.
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                JWT Authenticated • Spring Boot 3 Security • REST APIs • MySQL 8+
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} InternPortal. Built for modern university recruitment.</p>
          <div className="flex items-center space-x-6">
            <span className="inline-flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
