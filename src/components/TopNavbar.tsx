import React from 'react';
import { AppViewMode, AppTab } from '../types';
import { 
  Calendar, 
  Search, 
  Bell, 
  Sparkles, 
  Download,
  Menu,
  ChevronDown,
  UserCheck
} from 'lucide-react';

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
