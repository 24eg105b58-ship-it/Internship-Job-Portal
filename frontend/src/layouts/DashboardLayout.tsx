import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 selection:bg-brand-500 selection:text-white">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Toggle Bar */}
        <div className="md:hidden mb-4 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-700">Dashboard Menu</span>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
            aria-label="Toggle Dashboard Menu"
          >
            {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop Fixed Sidebar */}
          <Sidebar className="hidden md:flex rounded-2xl shadow-xs sticky top-24" />

          {/* Mobile Overlay Sidebar Drawer */}
          {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/50 backdrop-blur-xs">
              <div className="w-72 bg-white h-full shadow-2xl p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-800">Navigation</span>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <Sidebar onLinkClick={() => setIsMobileSidebarOpen(false)} />
              </div>
              <div
                className="flex-1"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          )}

          {/* Dashboard Main Content View Area */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
