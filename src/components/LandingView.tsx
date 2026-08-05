import React from 'react';
import { AppTab } from '../types';
import { 
  CheckCircle, 
  ExternalLink, 
  BookOpen, 
  Search, 
  Bell, 
  Sparkles, 
  Gavel, 
  Archive, 
  TrendingUp, 
  ShieldCheck, 
  Share2, 
  Globe, 
  Mail, 
  MapPin, 
  Phone,
  Calendar as CalendarIcon,
  LayoutDashboard,
  Clock,
  Building,
  Edit,
  CheckCheck,
  Users
} from 'lucide-react';

interface LandingViewProps {
  onOpenSystem: (tab?: AppTab) => void;
  onOpenAdminSetup?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onOpenSystem, onOpenAdminSetup }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden hero-bg-pattern">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d5e3ff]/60 text-[#001b3c] border border-[#a8c8ff]/60 shadow-xs">
              <span className="material-symbols-outlined text-[16px] text-[#C89B2C]">verified</span>
              <span className="text-xs font-semibold text-slate-800">University of Port Harcourt, CS Dept.</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Smarter Timetable Management for the{' '}
              <span className="text-[#0F5BAA] relative inline-block mt-1">
                Computer Science Department
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#C89B2C]" fill="none" viewBox="0 0 200 9" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 7C45.3333 3 133 -3.4 198 6.6" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
                </svg>
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
              An enterprise-grade internal management platform tailored for academic constraints. Eliminate scheduling conflicts, optimize venue utilization, and ensure a seamless academic experience for faculty and students.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => onOpenSystem('dashboard')}
                className="bg-[#004384] hover:bg-[#081C3A] text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                Open System
                <ExternalLink className="w-4 h-4" />
              </button>

              <button 
                onClick={() => onOpenSystem('public-portal')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-emerald-100" />
                Public Timetable Portal
              </button>

              {onOpenAdminSetup && (
                <button 
                  onClick={onOpenAdminSetup}
                  className="bg-[#004384]/10 hover:bg-[#004384]/20 text-[#004384] border border-[#004384]/30 font-semibold text-sm px-5 py-3 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#004384]" />
                  Admin Setup
                </button>
              )}
            </div>
          </div>

          {/* Right Column Interactive High-Fidelity Mockup Widget */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#a8c8ff]/40 to-[#ffdf9e]/40 rounded-full blur-[80px] -z-10 opacity-70"></div>
            
            <div className="w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col relative z-20">
              {/* Top Window Bar */}
              <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 mr-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                  <div className="h-7 w-56 bg-white rounded border border-slate-200 flex items-center px-2.5 shadow-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
                    <span className="text-xs text-slate-400">Search schedules...</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-500" />
                  <div className="w-7 h-7 bg-[#0F5BAA] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    AD
                  </div>
                </div>
              </div>

              <div className="flex h-[420px] overflow-hidden text-xs">
                {/* Mini Sidebar */}
                <div className="w-40 bg-slate-50 border-r border-slate-200 p-3 flex flex-col gap-1.5 shrink-0">
                  <button 
                    onClick={() => onOpenSystem('dashboard')}
                    className="px-2.5 py-1.5 bg-[#d5e3ff] text-[#0F5BAA] rounded font-semibold flex items-center gap-2 text-left"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </button>
                  <button 
                    onClick={() => onOpenSystem('schedules')}
                    className="px-2.5 py-1.5 text-slate-600 rounded font-medium flex items-center gap-2 hover:bg-slate-100 text-left"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Schedules
                  </button>
                  <button 
                    onClick={() => onOpenSystem('courses')}
                    className="px-2.5 py-1.5 text-slate-600 rounded font-medium flex items-center gap-2 hover:bg-slate-100 text-left"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Courses
                  </button>
                  <button 
                    onClick={() => onOpenSystem('lecturers')}
                    className="px-2.5 py-1.5 text-slate-600 rounded font-medium flex items-center gap-2 hover:bg-slate-100 text-left"
                  >
                    <Users className="w-3.5 h-3.5" />
                    Lecturers
                  </button>
                  <button 
                    onClick={() => onOpenSystem('venues')}
                    className="px-2.5 py-1.5 text-slate-600 rounded font-medium flex items-center gap-2 hover:bg-slate-100 text-left"
                  >
                    <Building className="w-3.5 h-3.5" />
                    Venues
                  </button>
                </div>

                {/* Mini Dashboard Content */}
                <div className="flex-1 bg-slate-50/50 p-4 flex flex-col gap-4 overflow-y-auto">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-sm">System Overview</h3>
                    <span className="text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-xs">
                      First Semester 2023/2024
                    </span>
                  </div>

                  {/* KPI Row */}
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                      <div className="text-slate-500 text-[10px]">Active Courses</div>
                      <div className="text-base font-bold text-slate-900">42</div>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                      <div className="text-slate-500 text-[10px]">Venues</div>
                      <div className="text-base font-bold text-slate-900">12</div>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200 shadow-xs">
                      <div className="text-slate-500 text-[10px]">Utilization</div>
                      <div className="text-base font-bold text-[#0F5BAA]">78%</div>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-emerald-200 shadow-xs bg-emerald-50/20">
                      <div className="text-slate-500 text-[10px]">Conflicts</div>
                      <div className="text-base font-bold text-emerald-600 flex items-center gap-1">
                        0 <CheckCircle className="w-3 h-3 text-emerald-500" />
                      </div>
                    </div>
                  </div>

                  {/* Today's Schedule & Recent Activity */}
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <div className="col-span-2 bg-white rounded border border-slate-200 p-3 shadow-xs flex flex-col">
                      <div className="font-semibold text-slate-700 pb-2 border-b border-slate-100 mb-2">Today's Schedule</div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-blue-50 border-l-4 border-[#0F5BAA] p-2 rounded-r flex justify-between items-center">
                          <div>
                            <div className="font-bold text-[#0F5BAA]">CSC 411</div>
                            <div className="text-[10px] text-slate-500">08:00 - 10:00 • OFR 1</div>
                          </div>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded text-slate-600 border border-slate-200">400L</span>
                        </div>
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-2 rounded-r flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-800">CSC 301</div>
                            <div className="text-[10px] text-slate-500">10:00 - 12:00 • CS Lab 2</div>
                          </div>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded text-slate-600 border border-slate-200">300L</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 bg-white rounded border border-slate-200 p-3 shadow-xs flex flex-col">
                      <div className="font-semibold text-slate-700 pb-2 border-b border-slate-100 mb-2">Recent Activity</div>
                      <div className="space-y-2.5 text-[11px]">
                        <div className="flex gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0F5BAA] flex items-center justify-center shrink-0 mt-0.5">
                            <Edit className="w-3 h-3" />
                          </div>
                          <div className="text-slate-600 leading-tight">
                            Dr. Okafor updated CSC 411 constraints.
                            <div className="text-slate-400 text-[9px] mt-0.5">2 hrs ago</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCheck className="w-3 h-3" />
                          </div>
                          <div className="text-slate-600 leading-tight">
                            Draft schedule generated.
                            <div className="text-slate-400 text-[9px] mt-0.5">5 hrs ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* KPI Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="flex flex-col items-start border-l-4 border-[#0F5BAA] pl-6">
              <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">42</span>
              <span className="text-sm font-semibold text-slate-600 mt-2">Active Courses</span>
            </div>
            <div className="flex flex-col items-start border-l-4 border-slate-300 pl-6">
              <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">18</span>
              <span className="text-sm font-semibold text-slate-600 mt-2">Academic Staff</span>
            </div>
            <div className="flex flex-col items-start border-l-4 border-slate-300 pl-6">
              <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">12</span>
              <span className="text-sm font-semibold text-slate-600 mt-2">Lecture Venues</span>
            </div>
            <div className="flex flex-col items-start border-l-4 border-emerald-500 pl-6">
              <div className="flex items-center gap-2">
                <span className="text-4xl lg:text-5xl font-black text-emerald-600 tracking-tight">0</span>
                <CheckCircle className="w-8 h-8 text-emerald-500 fill-emerald-100" />
              </div>
              <span className="text-sm font-semibold text-slate-600 mt-2">Scheduling Conflicts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 bg-slate-50/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Engineered for Academic Rigor
            </h2>
            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive, enterprise-grade tools designed specifically for the unique constraints and complexities of university departmental scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              onClick={() => onOpenSystem('generator')}
              className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0F5BAA]/40 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0F5BAA] transition-colors">
                <Sparkles className="w-6 h-6 text-[#0F5BAA] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Automated Generation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Smart algorithms draft conflict-free timetables based on predefined departmental constraints and lecturer availability.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => onOpenSystem('dashboard')}
              className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                <Gavel className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Conflict Resolution</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real-time alerts and intelligent suggestions for resolving double-bookings of venues, lecturers, or student cohorts.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => onOpenSystem('venues')}
              className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                <Archive className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Resource Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Centralized database for all courses, venues (with capacity limits), and lecturer preferences to ensure optimal allocation.
              </p>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={() => onOpenSystem('dashboard')}
              className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Utilization Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visual dashboards detailing venue usage rates, lecturer load, and schedule efficiency metrics.
              </p>
            </div>

            {/* Feature 5 */}
            <div 
              onClick={() => onOpenSystem('lecturers')}
              className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-400 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-slate-700 transition-colors">
                <ShieldCheck className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Role-Based Access</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Secure access tiers for Administrators (full control), Lecturers (view/request), and Students (view only).
              </p>
            </div>

            {/* Feature 6 */}
            <div 
              onClick={() => onOpenSystem('export')}
              className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0F5BAA]/40 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0F5BAA] transition-colors">
                <Share2 className="w-6 h-6 text-[#0F5BAA] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Universal Export Hub</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Publish schedules instantly to student portals or export to standard formats (PDF, CSV, iCal) for distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Streamlined Workflow Timeline */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Streamlined Workflow
            </h2>
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
              From raw data to published schedule in five clear, structured steps.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {/* Step 1 */}
              <div 
                onClick={() => onOpenSystem('courses')}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#0F5BAA] text-white flex items-center justify-center mb-4 font-bold shadow-md ring-4 ring-white">
                  1
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-base group-hover:text-[#0F5BAA] transition-colors">Setup Data</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Input courses, venues, and lecturers.</p>
              </div>

              {/* Step 2 */}
              <div 
                onClick={() => onOpenSystem('lecturers')}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#0F5BAA] text-white flex items-center justify-center mb-4 font-bold shadow-md ring-4 ring-white">
                  2
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-base group-hover:text-[#0F5BAA] transition-colors">Define Constraints</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Set availability and capacity rules.</p>
              </div>

              {/* Step 3 */}
              <div 
                onClick={() => onOpenSystem('generator')}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-[#0F5BAA] text-[#0F5BAA] flex items-center justify-center mb-4 font-bold shadow-xs ring-4 ring-white">
                  3
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-base group-hover:text-[#0F5BAA] transition-colors">Generate Schedule</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Run the automated drafting engine.</p>
              </div>

              {/* Step 4 */}
              <div 
                onClick={() => onOpenSystem('schedules')}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center mb-4 font-bold ring-4 ring-white">
                  4
                </div>
                <h4 className="font-semibold text-slate-700 mb-1 text-base group-hover:text-[#0F5BAA] transition-colors">Resolve Conflicts</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Manually tweak any flagged issues.</p>
              </div>

              {/* Step 5 */}
              <div 
                onClick={() => onOpenSystem('export')}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center mb-4 font-bold ring-4 ring-white">
                  5
                </div>
                <h4 className="font-semibold text-slate-700 mb-1 text-base group-hover:text-[#0F5BAA] transition-colors">Publish & Export</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Share finalized timetable instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 w-full pt-16 pb-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            
            {/* Col 1 Brand */}
            <div className="lg:col-span-1 flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#0F5BAA] flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ChronosCS</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                Enterprise-grade academic timetabling for modern computer science departments.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Share2 className="w-4 h-4" /></a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Col 2 Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => onOpenSystem('schedules')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => onOpenSystem('generator')} className="hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={() => onOpenSystem('dashboard')} className="hover:text-white transition-colors">Screenshots</button></li>
                <li><button onClick={() => onOpenSystem('courses')} className="hover:text-white transition-colors">Changelog</button></li>
                <li><button onClick={() => onOpenSystem('export')} className="hover:text-white transition-colors">Roadmap</button></li>
              </ul>
            </div>

            {/* Col 3 Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-2.5">
                <li><button onClick={() => onOpenSystem('courses')} className="hover:text-white transition-colors">Documentation</button></li>
                <li><button onClick={() => onOpenSystem('schedules')} className="hover:text-white transition-colors">User Guide</button></li>
                <li><button onClick={() => onOpenSystem('generator')} className="hover:text-white transition-colors">Video Tutorials</button></li>
                <li><button onClick={() => onOpenSystem('export')} className="hover:text-white transition-colors">API Reference</button></li>
                <li><button onClick={() => onOpenSystem('dashboard')} className="hover:text-white transition-colors">FAQ</button></li>
              </ul>
            </div>

            {/* Col 4 Support */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Report an Issue</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>

            {/* Col 5 Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Department of Computer Science,<br />University of Port Harcourt,<br />Rivers State, Nigeria.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>+234 (0) 800 000 0000</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>admin@chronoscs.edu.ng</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
            <div>© 2024 ChronosCS Timetabling. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
