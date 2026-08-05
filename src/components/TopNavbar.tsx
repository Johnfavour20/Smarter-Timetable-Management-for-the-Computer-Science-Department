import React, { useState } from 'react';
import { AppViewMode, AppTab } from '../types';
import { 
  Calendar, 
  Search, 
  Bell, 
  Sparkles, 
  Download,
  Menu,
  ChevronDown,
  UserCheck,
  Database,
  X,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface TopNavbarProps {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenGenerator: () => void;
  onOpenExport: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarCollapsed?: boolean;
  setIsSidebarCollapsed?: (collapsed: boolean) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  onOpenGenerator,
  onOpenExport,
  searchQuery,
  setSearchQuery,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) => {
  const [showServerModal, setShowServerModal] = useState(false);

  const tabTitles: Record<AppTab, string> = {
    dashboard: 'Dashboard',
    courses: 'Course Management',
    lecturers: 'Academic Staff & Lecturers',
    venues: 'Lecture Venues & Auditoriums',
    sessions: 'Academic Sessions',
    timeslots: 'Time Slots Management',
    levels: 'Student Levels',
    generator: 'AI Timetable Generator',
    published: 'Published Timetables',
    reports: 'System Reports & Analytics',
    users: 'User & Access Control',
    profile: 'My Profile & Preferences',
    help: 'Help & Documentation',
    settings: 'Department Settings',
    schedules: 'Master Timetables',
    review: 'Review Generated Timetable',
    export: 'Export & Share',
    'public-portal': 'Public Timetable Portal',
  };

  return (
    <header className="bg-white/90 backdrop-blur-md w-full sticky top-0 z-30 border-b border-slate-200/80 px-6 py-2.5 transition-all">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        
        {/* Left Side: Brand (on landing/setup) or Page Title + Sidebar Toggle (in app) */}
        {viewMode === 'app' ? (
          <div className="flex items-center gap-3">
            {setIsSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden cursor-pointer"
                title="Toggle Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department of Computer Science</span>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                {tabTitles[activeTab] || 'Dashboard'}
              </h1>
            </div>
          </div>
        ) : (
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setViewMode('landing')}
          >
            <div className="w-8 h-8 rounded-xl bg-[#004384] flex items-center justify-center shadow-xs group-hover:bg-[#081C3A] transition-colors">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">Chronos CS</span>
              <span className="text-[10px] font-semibold text-[#004384] tracking-wider uppercase mt-0.5">UNIPORT CS Dept</span>
            </div>
          </div>
        )}

        {/* Center: Search input in App View */}
        {viewMode === 'app' && (
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Global Search: courses, lecturers, venues, timetables..."
                className="w-full bg-slate-100/90 border border-slate-200 rounded-full pl-10 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] focus:bg-white transition-all"
              />
            </div>
          </div>
        )}

        {/* Right Side: Navigation & Profile */}
        <div className="flex items-center gap-3">
          {viewMode === 'landing' ? (
            <>
              <button 
                onClick={() => setViewMode('admin-setup')}
                className="text-xs font-semibold text-slate-700 hover:text-[#004384] transition-colors hidden sm:block px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Sign In / Admin Setup
              </button>
              <button
                onClick={() => { setViewMode('app'); setActiveTab('dashboard'); }}
                className="bg-[#004384] hover:bg-[#081C3A] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                Open Dashboard
              </button>
            </>
          ) : viewMode === 'admin-setup' ? (
            <>
              <button 
                onClick={() => setViewMode('landing')}
                className="text-xs font-semibold text-slate-600 hover:text-[#004384] border border-slate-200 px-3 py-1.5 rounded-xl bg-white shadow-2xs transition-colors cursor-pointer"
              >
                Landing Page
              </button>
              <button
                onClick={() => { setViewMode('app'); setActiveTab('dashboard'); }}
                className="bg-[#004384] hover:bg-[#081C3A] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                Open Dashboard
              </button>
            </>
          ) : (
            <>
              {/* Server Status Badge */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowServerModal(!showServerModal)}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Click for Server Diagnostics"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden md:inline">Server Connected</span>
                  <span className="md:hidden">Live</span>
                </button>

                {showServerModal && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 text-xs z-50 space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-[#004384]" /> Chronos Engine Status
                      </span>
                      <button onClick={() => setShowServerModal(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-slate-600 font-medium">
                      <div className="flex justify-between">
                        <span>API Gateway:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> HTTP 200 OK
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Interface:</span>
                        <span className="font-bold text-slate-800">Persistent Storage</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Latency / Ping:</span>
                        <span className="font-bold text-emerald-600">18 ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Constraint Solver:</span>
                        <span className="font-bold text-[#004384]">Gemini 2.5 Active</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Reset demo data to initial university baseline?")) {
                            StorageService.resetToDefaults();
                            window.location.reload();
                          }
                        }}
                        className="w-full py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold rounded-xl transition-colors text-[11px] text-center cursor-pointer"
                      >
                        Reset Demo Database Baseline
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick AI Generator trigger - hidden on published timetables page */}
              {activeTab !== 'published' && (
                <button
                  onClick={onOpenGenerator}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  title="AI Timetable Drafting Engine"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span className="hidden sm:inline">AI Solver</span>
                </button>
              )}

              {/* Notifications Icon with Badge */}
              <button 
                className="relative p-2 text-slate-500 hover:text-[#004384] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white" />
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

              {/* Administrator Profile Pill */}
              <div 
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200/80 transition-all cursor-pointer"
                title="View My Profile & Settings"
              >
                <div className="w-7 h-7 bg-[#004384] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-2xs">
                  EO
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">Dr. E. Oti</span>
                  <span className="text-[9px] text-slate-500 leading-none">HOD • Computer Science</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
