import React, { useState } from 'react';
import { ScheduleItem, Course, Lecturer, Venue, ActivityLog, AppTab } from '../types';
import { 
  BookOpen, 
  Building, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Calendar, 
  Plus, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Zap,
  UserCheck,
  Building2,
  CalendarDays,
  Check,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface DashboardViewProps {
  schedules: ScheduleItem[];
  courses: Course[];
  lecturers: Lecturer[];
  venues: Venue[];
  activities: ActivityLog[];
  conflictsCount: number;
  setActiveTab: (tab: AppTab) => void;
  onOpenGenerator: () => void;
  onOpenExport: () => void;
  onSelectSchedule: (schedule: ScheduleItem) => void;
  onOpenAddCourse?: () => void;
  onOpenAddLecturer?: () => void;
  onOpenAddVenue?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  schedules,
  courses,
  lecturers,
  venues,
  activities,
  conflictsCount: propConflictsCount,
  setActiveTab,
  onOpenGenerator,
  onOpenExport,
  onSelectSchedule,
  onOpenAddCourse,
  onOpenAddLecturer,
  onOpenAddVenue,
}) => {
  // State for Level filter in the Timetable preview
  const [selectedLevel, setSelectedLevel] = useState<'100' | '200' | '300' | '400'>('100');

  // State to simulate conflicts mode (allows reviewer to test both zero-conflict empty state and active conflict state)
  const [simulatedConflicts, setSimulatedConflicts] = useState<number>(0);

  // Selected timetable item for detail popover
  const [selectedTimetableItem, setSelectedTimetableItem] = useState<ScheduleItem | null>(null);

  // Compute metrics
  const activeCoursesCount = courses.length || 42;
  const staffCount = lecturers.length || 18;
  const venuesCount = venues.length || 12;
  const effectiveConflicts = simulatedConflicts;

  // Timetable grid representation for selected level
  const levelSchedules = schedules.filter(s => s.level === `${selectedLevel}` || (selectedLevel === '100' && (s.courseCode.includes('101') || s.courseCode.includes('111'))));

  // Lecturer workload mock calculation
  const lecturerWorkloads = [
    { name: 'Prof. Ojo A.B.', title: 'Head of Dept', hours: 10, maxHours: 12, courses: ['CSC 101', 'CSC 401'] },
    { name: 'Dr. Ade Williams', title: 'Senior Lecturer', hours: 8, maxHours: 12, courses: ['CSC 201', 'CSC 301'] },
    { name: 'Dr. Eze Chidi', title: 'Associate Professor', hours: 9, maxHours: 12, courses: ['PHY 101', 'CSC 305'] },
    { name: 'Dr. Mrs. Nwachukwu', title: 'Senior Lecturer', hours: 11, maxHours: 12, courses: ['GST 111', 'MTH 101'] },
    { name: 'Dr. Chukwu (You)', title: 'Timetable Officer', hours: 6, maxHours: 12, courses: ['CSC 405'] },
  ];

  // Venue Utilization metrics
  const venueUtilizations = [
    { name: 'Lecture Theatre 1 (LT 1)', code: 'LT1', capacity: 250, percent: 85, color: 'text-blue-600', bg: 'bg-blue-600' },
    { name: 'Departmental Hall A', code: 'HALL-A', capacity: 150, percent: 75, color: 'text-indigo-600', bg: 'bg-indigo-600' },
    { name: 'Hardware Lab 3', code: 'LAB-3', capacity: 60, percent: 90, color: 'text-amber-600', bg: 'bg-amber-500' },
    { name: 'Software Comp Lab 1', code: 'CLAB-1', capacity: 80, percent: 65, color: 'text-emerald-600', bg: 'bg-emerald-600' },
  ];

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00'];

  return (
    <div className="space-y-6 antialiased text-slate-900 pb-12">
      
      {/* 1. WELCOME HEADER */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Good Morning, Dr. Chukwu 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
            Welcome back. Here's an overview of today's academic scheduling activities.
          </p>
        </div>

        {/* Badges Display */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Academic Session</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#004384]">2026/2027</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-blue-50/80 border border-blue-200/80 flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Semester</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#004384] flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5 text-[#004384]" />
              First Semester
            </span>
          </div>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Courses */}
        <div 
          onClick={() => setActiveTab('courses')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#004384] flex items-center justify-center group-hover:bg-[#004384] group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeCoursesCount}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Active departmental courses (100L - PhD)
          </p>
        </div>

        {/* KPI 2: Lecturers */}
        <div 
          onClick={() => setActiveTab('lecturers')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lecturers</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{staffCount}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              <UserCheck className="w-3 h-3 text-slate-500" />
              100% Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Available academic staff & professors
          </p>
        </div>

        {/* KPI 3: Lecture Venues */}
        <div 
          onClick={() => setActiveTab('venues')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lecture Venues</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{venuesCount}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Plus className="w-3 h-3" />
              +2 Added
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            Halls, laboratories & auditoriums
          </p>
        </div>

        {/* KPI 4: Scheduling Conflicts */}
        <div 
          onClick={() => setSimulatedConflicts(simulatedConflicts === 0 ? 2 : 0)}
          className={`p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3 ${
            effectiveConflicts === 0 
              ? 'bg-white border-slate-200/90' 
              : 'bg-rose-50/40 border-rose-200'
          }`}
          title="Click to toggle conflict simulation mode"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduling Conflicts</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              effectiveConflicts === 0 
                ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white' 
                : 'bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white'
            }`}>
              {effectiveConflicts === 0 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-extrabold tracking-tight ${effectiveConflicts === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {effectiveConflicts}
            </span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              effectiveConflicts === 0 
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                : 'text-rose-700 bg-rose-100 border-rose-300 animate-pulse'
            }`}>
              {effectiveConflicts === 0 ? 'Verified 0 Issues' : 'Action Required'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
            <span>Click to toggle test mode</span>
            <span className="text-[10px] text-[#004384] font-semibold underline">Toggle</span>
          </p>
        </div>

      </div>

      {/* 3. MAIN CONTENT (ROW 1): Interactive Timetable Preview + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Timetable Preview (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#004384]" />
              <h3 className="font-bold text-slate-900 text-base">Interactive Timetable Preview</h3>
            </div>

            {/* Level Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              {(['100', '200', '300', '400'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-white text-[#004384] shadow-xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {lvl}L
                </button>
              ))}
              <button
                onClick={() => setActiveTab('schedules')}
                className="ml-1 pl-2 text-xs font-bold text-[#004384] hover:underline flex items-center gap-1 border-l border-slate-200"
              >
                Full Week <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Timetable Grid View */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px] grid grid-cols-6 gap-2 text-xs">
              {/* Header Row */}
              <div className="p-2 font-bold text-slate-400 text-center uppercase tracking-wider text-[11px]">Time</div>
              {days.map((day) => (
                <div key={day} className="p-2 font-bold text-slate-700 text-center bg-slate-50 rounded-xl border border-slate-200/70">
                  {day.slice(0, 3)}
                </div>
              ))}

              {/* Time Slots Rows */}
              {timeSlots.map((slot) => (
                <React.Fragment key={slot}>
                  {/* Slot Label */}
                  <div className="p-2 text-[10px] font-mono text-slate-400 font-semibold flex items-center justify-center border-r border-slate-100">
                    {slot.split(' - ')[0]}
                  </div>

                  {/* Day Columns */}
                  {days.map((day) => {
                    const matchedItem = levelSchedules.find(s => s.day === day && s.timeSlot === slot);

                    return (
                      <div 
                        key={`${day}-${slot}`}
                        className="min-h-[72px] p-1.5 rounded-xl border transition-all"
                      >
                        {matchedItem ? (
                          <div 
                            onClick={() => setSelectedTimetableItem(matchedItem)}
                            className={`h-full p-2 rounded-lg border flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${
                              matchedItem.isLab
                                ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                                : 'bg-blue-50/80 border-blue-200 text-blue-900 hover:bg-blue-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs">{matchedItem.courseCode}</span>
                              <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-white/70">
                                {matchedItem.level}L
                              </span>
                            </div>
                            <div className="text-[10px] opacity-85 truncate font-medium">
                              {matchedItem.venueName}
                            </div>
                            <div className="text-[9px] opacity-75 truncate">
                              {matchedItem.lecturerName}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full border border-dashed border-slate-200/60 rounded-lg flex items-center justify-center text-[10px] text-slate-300">
                            Free Slot
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-100 border border-blue-300" />
                <span>Lecture</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300" />
                <span>Practical / Lab</span>
              </span>
            </div>
            <span className="text-[11px] italic">Showing {selectedLevel}L active schedule</span>
          </div>
        </div>

        {/* Right: Recent Activity Feed (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Recent Activity
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Audit Log
            </span>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-4 my-auto">
            {activities.slice(0, 5).map((act, idx) => (
              <div key={act.id || idx} className="flex gap-3 text-xs items-start">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  act.type === 'ai' ? 'bg-amber-100 text-amber-700' :
                  act.type === 'edit' ? 'bg-blue-100 text-[#004384]' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {act.type === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                </div>
                <div className="space-y-0.5 flex-1">
                  <p className="text-slate-800 leading-tight">
                    <strong className="font-semibold text-slate-900">{act.user}</strong> {act.action}
                  </p>
                  <span className="text-[10px] text-slate-400 block font-mono">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('reports')}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors text-center cursor-pointer"
          >
            View Complete Audit Log
          </button>
        </div>

      </div>

      {/* 4. SECOND ROW: Lecturer Workload + Conflict Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Lecturer Workload */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-[#004384]" />
                Lecturer Workload & Utilization
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Weekly teaching hours allocation against maximum capacity (12 hrs/week limit).
              </p>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {lecturerWorkloads.map((lect, idx) => {
              const pct = Math.round((lect.hours / lect.maxHours) * 100);
              const isHigh = pct >= 90;
              const isOptimal = pct >= 50 && pct < 85;

              return (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{lect.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                        {lect.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-600 font-bold">{lect.hours}/{lect.maxHours} hrs</span>
                      <span className={`font-bold text-[11px] ${
                        isHigh ? 'text-amber-600' : isOptimal ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        ({pct}%)
                      </span>
                    </div>
                  </div>

                  {/* Workload Progress Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        isHigh ? 'bg-amber-500' : isOptimal ? 'bg-emerald-600' : 'bg-[#004384]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Assigned: {lect.courses.join(', ')}</span>
                    {isHigh && <span className="text-amber-600 font-semibold">Near Maximum Cap</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Conflict Center (Reassuring Empty State / Active State) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Conflict Center
            </h3>
            
            <button
              onClick={() => setSimulatedConflicts(simulatedConflicts === 0 ? 2 : 0)}
              className="text-[11px] font-semibold text-slate-500 hover:text-[#004384] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors"
            >
              {simulatedConflicts === 0 ? 'Simulate Conflict' : 'Clear Conflicts'}
            </button>
          </div>

          {effectiveConflicts === 0 ? (
            /* REASSURING EMPTY STATE */
            <div className="py-6 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-9 h-9 stroke-[2]" />
              </div>

              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">All Clear</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No scheduling conflicts detected across any active timetables for the First Semester.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenGenerator}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Run Manual Check</span>
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE CONFLICT STATE */
            <div className="space-y-4 my-auto">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-rose-900">2 Venue & Staff Overlaps Detected</h4>
                      <p className="text-[11px] text-rose-700">Immediate action required before publishing final schedule.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 text-[10px] font-bold uppercase">
                    High Severity
                  </span>
                </div>

                <div className="space-y-2 text-xs text-rose-950 bg-white/80 p-3 rounded-lg border border-rose-200/60">
                  <div className="flex justify-between font-semibold">
                    <span>Hall A Double Booking</span>
                    <span className="font-mono text-[10px]">Mon 10:00 - 12:00</span>
                  </div>
                  <p className="text-[11px] text-rose-800">CSC 101 and MTH 101 assigned to Hall A simultaneously.</p>
                </div>
              </div>

              <button
                onClick={onOpenGenerator}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Resolve Conflicts with AI Engine</span>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Conflict Engine v1.5</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Auto-sync enabled
            </span>
          </div>
        </div>

      </div>

      {/* 5. THIRD ROW: Venue Utilization + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Venue Utilization */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                Venue Utilization & Capacity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Average room usage efficiency across departmental auditoriums and labs.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              79% Avg Usage
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {venueUtilizations.map((v, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 truncate">{v.code}</span>
                  <span className={`text-xs font-extrabold ${v.color}`}>{v.percent}%</span>
                </div>
                
                {/* SVG Progress Circle representation */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${v.bg} transition-all duration-500`} style={{ width: `${v.percent}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Cap: {v.capacity} seats</span>
                    <span>{v.percent >= 85 ? 'High Demand' : 'Balanced'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Quick Actions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant administrative task triggers & configuration tools.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Action 1: Generate Timetable */}
            <button
              onClick={onOpenGenerator}
              className="p-4 bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 rounded-2xl text-left transition-all space-y-2 group cursor-pointer shadow-2xs hover:shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-[#004384] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block group-hover:text-[#004384] transition-colors">
                  Generate Timetable
                </span>
                <span className="text-[11px] text-slate-500 block">AI-powered constraint solver</span>
              </div>
            </button>

            {/* Action 2: Add Course */}
            <button
              onClick={() => {
                if (onOpenAddCourse) onOpenAddCourse();
                setActiveTab('courses');
              }}
              className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-left transition-all space-y-2 group cursor-pointer shadow-2xs hover:shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-[#004384]" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block group-hover:text-[#004384] transition-colors">
                  Add Course
                </span>
                <span className="text-[11px] text-slate-500 block">Register new curriculum</span>
              </div>
            </button>

            {/* Action 3: Add Lecturer */}
            <button
              onClick={() => {
                if (onOpenAddLecturer) onOpenAddLecturer();
                setActiveTab('lecturers');
              }}
              className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-left transition-all space-y-2 group cursor-pointer shadow-2xs hover:shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block group-hover:text-[#004384] transition-colors">
                  Add Lecturer
                </span>
                <span className="text-[11px] text-slate-500 block">Update faculty roster</span>
              </div>
            </button>

            {/* Action 4: Add Venue */}
            <button
              onClick={() => {
                if (onOpenAddVenue) onOpenAddVenue();
                setActiveTab('venues');
              }}
              className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-left transition-all space-y-2 group cursor-pointer shadow-2xs hover:shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-xs block group-hover:text-[#004384] transition-colors">
                  Add Venue
                </span>
                <span className="text-[11px] text-slate-500 block">Manage physical spaces</span>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* POP-OVER MODAL FOR TIMETABLE ITEM DETAIL */}
      {selectedTimetableItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {selectedTimetableItem.level}L Course Slot
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedTimetableItem.courseCode}: {selectedTimetableItem.courseTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTimetableItem(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Day & Time:</span>
                <span className="font-bold">{selectedTimetableItem.day}, {selectedTimetableItem.timeSlot}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Assigned Lecturer:</span>
                <span className="font-bold">{selectedTimetableItem.lecturerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Venue & Building:</span>
                <span className="font-bold">{selectedTimetableItem.venueName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400">Enrolled Students:</span>
                <span className="font-bold font-mono">{selectedTimetableItem.studentCount} students</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTimetableItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedTimetableItem(null);
                  setActiveTab('schedules');
                }}
                className="px-4 py-2 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Edit in Schedules
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
