import React, { useState } from 'react';
import { Lecturer, Course, Day } from '../types';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  BookOpen, 
  Mail, 
  Phone, 
  Award, 
  X, 
  RotateCcw, 
  Upload, 
  Download, 
  MoreVertical, 
  Eye, 
  Archive, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  UserX,
  Gauge,
  Briefcase,
  Layers,
  CalendarDays,
  Check
} from 'lucide-react';

interface LecturersViewProps {
  lecturers: Lecturer[];
  courses: Course[];
  onAddLecturer: (newLecturer: Lecturer) => void;
  onDeleteLecturer: (id: string) => void;
  searchQuery: string;
}

export const LecturersView: React.FC<LecturersViewProps> = ({
  lecturers,
  courses,
  onAddLecturer,
  onDeleteLecturer,
  searchQuery: externalSearchQuery,
}) => {
  // Local Filter States
  const [internalSearch, setInternalSearch] = useState('');
  const [rankFilter, setRankFilter] = useState<string>('All');
  const [specializationFilter, setSpecializationFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [workloadFilter, setWorkloadFilter] = useState<string>('All');
  const [courseAssignmentFilter, setCourseAssignmentFilter] = useState<string>('All');

  // Slide-over Drawer State (Add / Edit)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<Lecturer | null>(null);

  // View Profile Modal State
  const [viewingLecturer, setViewingLecturer] = useState<Lecturer | null>(null);

  // Assign Courses Modal State
  const [assigningCoursesLecturer, setAssigningCoursesLecturer] = useState<Lecturer | null>(null);

  // Active Overflow Menu ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Add/Edit Drawer
  const [title, setTitle] = useState('Dr.');
  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rank, setRank] = useState('Senior Lecturer');
  const [specialization, setSpecialization] = useState('');
  const [maxWeeklyHours, setMaxWeeklyHours] = useState(12);
  const [status, setStatus] = useState<'Active' | 'Sabbatical' | 'On Leave'>('Active');
  const [selectedCourseCodes, setSelectedCourseCodes] = useState<string[]>([]);
  const [preferredDays, setPreferredDays] = useState<Day[]>([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ]);

  // Combine external and internal search
  const effectiveSearch = (externalSearchQuery || internalSearch).trim().toLowerCase();

  // Filter Logic
  const filteredLecturers = lecturers.filter((lecturer) => {
    // Search by Name, Staff ID, or Institutional Email
    if (effectiveSearch) {
      const match =
        lecturer.name.toLowerCase().includes(effectiveSearch) ||
        (lecturer.staffId && lecturer.staffId.toLowerCase().includes(effectiveSearch)) ||
        lecturer.email.toLowerCase().includes(effectiveSearch) ||
        lecturer.specialization.toLowerCase().includes(effectiveSearch);
      if (!match) return false;
    }

    // Rank Filter
    if (rankFilter !== 'All' && (lecturer.rank || '') !== rankFilter) {
      return false;
    }

    // Specialization Filter
    if (specializationFilter !== 'All') {
      if (!lecturer.specialization.toLowerCase().includes(specializationFilter.toLowerCase())) {
        return false;
      }
    }

    // Status Filter
    if (statusFilter !== 'All') {
      const lStatus = lecturer.status || 'Active';
      if (lStatus !== statusFilter) return false;
    }

    // Workload Filter
    if (workloadFilter !== 'All') {
      const loadPercent = Math.min(
        100,
        Math.round((lecturer.currentWeeklyHours / (lecturer.maxWeeklyHours || 1)) * 100)
      );
      if (workloadFilter === 'Normal' && loadPercent >= 75) return false;
      if (workloadFilter === 'High' && (loadPercent < 75 || loadPercent > 90)) return false;
      if (workloadFilter === 'Overloaded' && loadPercent <= 90) return false;
    }

    // Course Assignment Filter
    if (courseAssignmentFilter !== 'All') {
      const hasCourses = lecturer.assignedCourseCodes.length > 0;
      if (courseAssignmentFilter === 'Assigned' && !hasCourses) return false;
      if (courseAssignmentFilter === 'Unassigned' && hasCourses) return false;
    }

    return true;
  });

  // KPI Calculations
  const totalLecturersCount = lecturers.length;
  const assignedLecturersCount = lecturers.filter((l) => l.assignedCourseCodes.length > 0).length;
  const availableLecturersCount = lecturers.filter(
    (l) => (l.status || 'Active') === 'Active' && l.currentWeeklyHours < l.maxWeeklyHours
  ).length;

  // Average Workload across Active lecturers
  const activeLecturers = lecturers.filter((l) => (l.status || 'Active') === 'Active');
  const avgWorkload = activeLecturers.length > 0
    ? Math.round(
        activeLecturers.reduce((sum, l) => {
          const load = Math.min(100, (l.currentWeeklyHours / (l.maxWeeklyHours || 1)) * 100);
          return sum + load;
        }, 0) / activeLecturers.length
      )
    : 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const resetFilters = () => {
    setInternalSearch('');
    setRankFilter('All');
    setSpecializationFilter('All');
    setStatusFilter('All');
    setWorkloadFilter('All');
    setCourseAssignmentFilter('All');
  };

  const handleOpenAddDrawer = () => {
    setEditingLecturer(null);
    setTitle('Dr.');
    setName('');
    setStaffId(`CS-${String(Math.floor(Math.random() * 900) + 100)}`);
    setEmail('');
    setPhone('');
    setRank('Senior Lecturer');
    setSpecialization('');
    setMaxWeeklyHours(12);
    setStatus('Active');
    setSelectedCourseCodes([]);
    setPreferredDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (lecturer: Lecturer) => {
    setEditingLecturer(lecturer);
    setTitle(lecturer.title || 'Dr.');
    setName(lecturer.name);
    setStaffId(lecturer.staffId || `CS-${Math.floor(Math.random() * 900) + 100}`);
    setEmail(lecturer.email);
    setPhone(lecturer.phone || '');
    setRank(lecturer.rank || 'Senior Lecturer');
    setSpecialization(lecturer.specialization || '');
    setMaxWeeklyHours(lecturer.maxWeeklyHours || 12);
    setStatus(lecturer.status || 'Active');
    setSelectedCourseCodes([...lecturer.assignedCourseCodes]);
    setPreferredDays(lecturer.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    setIsDrawerOpen(true);
  };

  const handleSubmitDrawer = (e: React.FormEvent) => {
    e.preventDefault();

    const lecturerData: Lecturer = {
      id: editingLecturer ? editingLecturer.id : `l-${Date.now()}`,
      title,
      name: name.trim(),
      staffId: staffId.trim(),
      email: email.trim(),
      phone: phone.trim() || '+234 800 000 0000',
      rank,
      specialization: specialization.trim() || 'Computer Science',
      maxWeeklyHours: Number(maxWeeklyHours),
      currentWeeklyHours: editingLecturer ? editingLecturer.currentWeeklyHours : selectedCourseCodes.length * 3,
      assignedCourseCodes: selectedCourseCodes,
      availableDays: preferredDays,
      status,
      department: 'Computer Science',
    };

    onAddLecturer(lecturerData);
    setIsDrawerOpen(false);
    showToast(
      editingLecturer
        ? `Updated lecturer record for ${lecturerData.title} ${lecturerData.name}.`
        : `Added ${lecturerData.title} ${lecturerData.name} to academic faculty roster.`
    );
  };

  const handleExportCSV = () => {
    const csvHeader = 'Staff ID,Title,Full Name,Institutional Email,Rank,Specialization,Assigned Courses,Workload %,Status\n';
    const csvRows = filteredLecturers
      .map((l) => {
        const load = Math.min(100, Math.round((l.currentWeeklyHours / (l.maxWeeklyHours || 1)) * 100));
        return `"${l.staffId || 'N/A'}","${l.title}","${l.name}","${l.email}","${l.rank || 'Lecturer'}","${l.specialization}","${l.assignedCourseCodes.join('; ')}",${load}%,"${l.status || 'Active'}"`;
      })
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChronosCS_Lecturers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast(`Exported ${filteredLecturers.length} lecturer records to CSV.`);
  };

  const handleImportCSV = () => {
    const fakeStaffId = `CS-${Math.floor(Math.random() * 800) + 200}`;
    const newLecturer: Lecturer = {
      id: `l-imp-${Date.now()}`,
      title: 'Dr.',
      name: 'P. O. Asagba',
      staffId: fakeStaffId,
      email: 'p.asagba@uniport.edu.ng',
      phone: '+234 803 555 9988',
      rank: 'Senior Lecturer',
      specialization: 'Information Retrieval & AI Systems',
      maxWeeklyHours: 12,
      currentWeeklyHours: 3,
      assignedCourseCodes: ['CSC 302'],
      availableDays: ['Monday', 'Wednesday', 'Thursday'],
      status: 'Active',
      department: 'Computer Science',
    };
    onAddLecturer(newLecturer);
    showToast(`Successfully imported record for ${newLecturer.title} ${newLecturer.name} (${fakeStaffId}).`);
  };

  const toggleDayPreference = (day: Day) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter((d) => d !== day));
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };

  const toggleCourseSelection = (courseCode: string) => {
    if (selectedCourseCodes.includes(courseCode)) {
      setSelectedCourseCodes(selectedCourseCodes.filter((c) => c !== courseCode));
    } else {
      setSelectedCourseCodes([...selectedCourseCodes, courseCode]);
    }
  };

  // Quick Save Course Assignments Modal Submission
  const handleSaveCourseAssignments = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningCoursesLecturer) return;

    const updated: Lecturer = {
      ...assigningCoursesLecturer,
      assignedCourseCodes: selectedCourseCodes,
      currentWeeklyHours: selectedCourseCodes.length * 3,
    };
    onAddLecturer(updated);
    setAssigningCoursesLecturer(null);
    showToast(`Updated course allocations for ${updated.title} ${updated.name}.`);
  };

  return (
    <div className="space-y-6 antialiased text-slate-900 pb-16 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#081C3A] text-white px-4 py-3 rounded-xl shadow-xl border border-blue-400/30 flex items-center gap-3 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#004384]" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lecturers</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Manage academic staff assigned to departmental courses and timetable scheduling.
          </p>
        </div>

        <button
          onClick={handleOpenAddDrawer}
          className="bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Lecturer</span>
        </button>
      </div>

      {/* 2. SUMMARY CARDS (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Total Lecturers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Lecturers</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalLecturersCount}</span>
            <span className="text-[11px] font-bold text-[#004384] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Department Staff
            </span>
          </div>
        </div>

        {/* Card 2: Assigned Lecturers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Assigned Lecturers</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{assignedLecturersCount}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Allocated Courses
            </span>
          </div>
        </div>

        {/* Card 3: Available Lecturers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Available Lecturers</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{availableLecturersCount}</span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Has Capacity
            </span>
          </div>
        </div>

        {/* Card 4: Average Workload */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Average Workload</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{avgWorkload}%</span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              avgWorkload > 90
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : avgWorkload >= 75
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {avgWorkload > 90 ? 'Overloaded' : avgWorkload >= 75 ? 'High Load' : 'Balanced'}
            </span>
          </div>
        </div>

      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        
        {/* Inputs & Dropdowns Grid */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Left: Search input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder="Search by lecturer name, staff ID, or institutional email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
            />
          </div>

          {/* Right Filters Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Rank Filter */}
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384]"
            >
              <option value="All">All Ranks</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Assoc. Professor</option>
              <option value="Senior Lecturer">Senior Lecturer</option>
              <option value="Lecturer I">Lecturer I</option>
              <option value="Lecturer II">Lecturer II</option>
              <option value="Assistant Lecturer">Assistant Lecturer</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Sabbatical">Sabbatical</option>
              <option value="On Leave">On Leave</option>
            </select>

            {/* Workload Filter */}
            <select
              value={workloadFilter}
              onChange={(e) => setWorkloadFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384]"
            >
              <option value="All">All Workloads</option>
              <option value="Normal">Normal (&lt; 75%)</option>
              <option value="High">High (75% - 90%)</option>
              <option value="Overloaded">Overloaded (&gt; 90%)</option>
            </select>

            {/* Course Allocation Filter */}
            <select
              value={courseAssignmentFilter}
              onChange={(e) => setCourseAssignmentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384]"
            >
              <option value="All">All Allocations</option>
              <option value="Assigned">With Courses</option>
              <option value="Unassigned">Unassigned</option>
            </select>

            {/* Reset Button */}
            {(internalSearch || rankFilter !== 'All' || statusFilter !== 'All' || workloadFilter !== 'All' || courseAssignmentFilter !== 'All') && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>

          {/* Action buttons (Import & Export) */}
          <div className="flex items-center gap-2 text-xs pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <button
              onClick={handleImportCSV}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>

        </div>

      </div>

      {/* 4. LECTURER TABLE OR EMPTY STATE */}
      {filteredLecturers.length === 0 ? (
        /* EMPTY STATE CONTAINER */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#004384] flex items-center justify-center mx-auto shadow-2xs">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-slate-900">No Lecturers Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Start by adding the first lecturer to the department or adjust your search filters.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={handleOpenAddDrawer}
              className="px-4 py-2 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lecturer</span>
            </button>
          </div>
        </div>
      ) : (
        /* LECTURER TABLE CONTAINER */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Lecturer</th>
                  <th className="py-3.5 px-5">Staff ID</th>
                  <th className="py-3.5 px-5">Academic Rank</th>
                  <th className="py-3.5 px-5">Specialization</th>
                  <th className="py-3.5 px-5">Assigned Courses</th>
                  <th className="py-3.5 px-5">Workload</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredLecturers.map((lecturer) => {
                  const lStatus = lecturer.status || 'Active';
                  const loadPercent = Math.min(
                    100,
                    Math.round((lecturer.currentWeeklyHours / (lecturer.maxWeeklyHours || 1)) * 100)
                  );

                  // Workload color specs per requirement:
                  // Blue = Normal (< 75%)
                  // Amber = High (75% - 90%)
                  // Red = Overloaded (> 90%)
                  let barColorClass = 'bg-[#004384]';
                  let badgeTextColor = 'text-[#004384]';
                  if (loadPercent > 90) {
                    barColorClass = 'bg-rose-500';
                    badgeTextColor = 'text-rose-600';
                  } else if (loadPercent >= 75) {
                    barColorClass = 'bg-amber-500';
                    badgeTextColor = 'text-amber-600';
                  }

                  const initials = lecturer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <tr 
                      key={lecturer.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Lecturer Column (Avatar + Name & Title + Institutional Email) */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-[#004384] font-extrabold text-xs flex items-center justify-center border border-blue-200 shrink-0 shadow-2xs">
                            {initials || 'L'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>{lecturer.title} {lecturer.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {lecturer.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Staff ID */}
                      <td className="py-4 px-5 font-mono font-extrabold text-[#004384]">
                        {lecturer.staffId || 'CS-0000'}
                      </td>

                      {/* Academic Rank */}
                      <td className="py-4 px-5 font-bold text-slate-700">
                        {lecturer.rank || 'Senior Lecturer'}
                      </td>

                      {/* Specialization */}
                      <td className="py-4 px-5 text-slate-600 font-medium max-w-xs truncate">
                        {lecturer.specialization}
                      </td>

                      {/* Assigned Courses */}
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {lecturer.assignedCourseCodes.length === 0 ? (
                            <span className="text-slate-400 text-[11px] italic">No courses</span>
                          ) : (
                            lecturer.assignedCourseCodes.map((code) => (
                              <span
                                key={code}
                                className="px-2 py-0.5 bg-blue-50 text-[#004384] rounded-lg font-extrabold text-[10px] border border-blue-100"
                              >
                                {code}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Workload Progress Bar */}
                      <td className="py-4 px-5 min-w-[140px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={`font-extrabold ${badgeTextColor}`}>
                              {loadPercent}%
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {lecturer.currentWeeklyHours}/{lecturer.maxWeeklyHours} hrs
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                            <div
                              className={`h-full transition-all duration-300 ${barColorClass}`}
                              style={{ width: `${loadPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          lStatus === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : lStatus === 'Sabbatical'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            lStatus === 'Active' ? 'bg-emerald-500' : lStatus === 'Sabbatical' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                          {lStatus}
                        </span>
                      </td>

                      {/* Actions Overflow Menu */}
                      <td className="py-4 px-5 text-right relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === lecturer.id ? null : lecturer.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Three-Dot Dropdown Popup */}
                        {activeMenuId === lecturer.id && (
                          <div 
                            className="absolute right-5 top-12 z-30 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 text-left text-xs font-semibold space-y-0.5 animate-fadeIn"
                            onMouseLeave={() => setActiveMenuId(null)}
                          >
                            <button
                              onClick={() => {
                                setViewingLecturer(lecturer);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>View Profile</span>
                            </button>

                            <button
                              onClick={() => {
                                handleOpenEditDrawer(lecturer);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                              <span>Edit Profile</span>
                            </button>

                            <button
                              onClick={() => {
                                setAssigningCoursesLecturer(lecturer);
                                setSelectedCourseCodes([...lecturer.assignedCourseCodes]);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Assign Courses</span>
                            </button>

                            <button
                              onClick={() => {
                                const newStatus: 'Active' | 'Sabbatical' | 'On Leave' =
                                  lStatus === 'Active' ? 'On Leave' : 'Active';
                                onAddLecturer({ ...lecturer, status: newStatus });
                                setActiveMenuId(null);
                                showToast(`Updated ${lecturer.name} status to ${newStatus}.`);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5 text-purple-600" />
                              <span>{lStatus === 'Active' ? 'Archive' : 'Activate'}</span>
                            </button>

                            <div className="h-px bg-slate-100 my-1" />

                            <button
                              onClick={() => {
                                onDeleteLecturer(lecturer.id);
                                setActiveMenuId(null);
                                showToast(`Removed ${lecturer.title} ${lecturer.name} from faculty roster.`);
                              }}
                              className="w-full px-3 py-2 hover:bg-rose-50 text-rose-600 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <span>Showing <strong className="text-slate-900">{filteredLecturers.length}</strong> of <strong className="text-slate-900">{lecturers.length}</strong> lecturers</span>
            <div className="flex items-center gap-1">
              <button disabled className="p-1.5 rounded-lg border border-slate-200 opacity-50 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-bold text-[#004384] bg-white rounded-lg border border-slate-200">Page 1 of 1</span>
              <button disabled className="p-1.5 rounded-lg border border-slate-200 opacity-50 cursor-not-allowed">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD / EDIT LECTURER RIGHT-SIDE SLIDE-OVER DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideIn">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {editingLecturer ? `Edit Lecturer: ${editingLecturer.name}` : 'Add New Lecturer'}
                  </h2>
                  <p className="text-xs text-slate-500">Department of Computer Science, UNIPORT</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Body Form */}
              <form id="lecturerForm" onSubmit={handleSubmitDrawer} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                
                {/* Full Name & Title */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Title</label>
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                    >
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Engr.">Engr.</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alan Okafor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                    />
                  </div>
                </div>

                {/* Staff ID & Institutional Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Staff ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CS-0042"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+234 803 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alan.o@uniport.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384]"
                  />
                </div>

                {/* Academic Rank & Max Weekly Hours */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Academic Rank *</label>
                    <select
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold"
                    >
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Senior Lecturer">Senior Lecturer</option>
                      <option value="Lecturer I">Lecturer I</option>
                      <option value="Lecturer II">Lecturer II</option>
                      <option value="Assistant Lecturer">Assistant Lecturer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Max Weekly Hours</label>
                    <input
                      type="number"
                      min="4"
                      max="24"
                      required
                      value={maxWeeklyHours}
                      onChange={(e) => setMaxWeeklyHours(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artificial Intelligence & Machine Learning"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  />
                </div>

                {/* Department (Pre-filled read-only) */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <input
                    type="text"
                    disabled
                    value="Computer Science"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-500 font-bold cursor-not-allowed"
                  />
                </div>

                {/* Employment Status */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Employment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Sabbatical">Sabbatical</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                {/* Preferred Teaching Days */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Preferred Teaching Days</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as Day[]).map((day) => {
                      const isSelected = preferredDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDayPreference(day)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#004384] text-white border-[#004384] shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Courses (Multiselect checklist) */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Assigned Courses</label>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-40 overflow-y-auto space-y-1.5">
                    {courses.map((course) => {
                      const isChecked = selectedCourseCodes.includes(course.code);
                      return (
                        <label
                          key={course.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 hover:border-slate-300 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCourseSelection(course.code)}
                              className="w-4 h-4 text-[#004384] rounded border-slate-300 focus:ring-[#004384]"
                            />
                            <span className="font-extrabold text-[#004384] font-mono">{course.code}</span>
                            <span className="text-slate-700 truncate max-w-[180px]">{course.title}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{course.level}L</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </form>

              {/* Drawer Footer Buttons */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="lecturerForm"
                  className="px-5 py-2.5 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW LECTURER PROFILE MODAL */}
      {viewingLecturer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#004384] font-black text-base flex items-center justify-center border border-blue-200 shadow-xs">
                  {viewingLecturer.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {viewingLecturer.title} {viewingLecturer.name}
                  </h3>
                  <p className="text-xs font-bold text-[#004384]">
                    {viewingLecturer.rank || 'Senior Lecturer'} • Staff ID: {viewingLecturer.staffId || 'CS-0000'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingLecturer(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Specialization</span>
                  <span className="font-extrabold text-slate-900 text-sm">{viewingLecturer.specialization}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <span className="font-extrabold text-slate-900 text-sm">{viewingLecturer.status || 'Active'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Weekly Teaching Load</span>
                  <span className="font-extrabold text-[#004384] text-sm">
                    {viewingLecturer.currentWeeklyHours} / {viewingLecturer.maxWeeklyHours} Hours
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                  <span className="font-extrabold text-slate-900 text-sm">Computer Science</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Institutional Email:</span>
                  <span className="font-bold text-[#004384] font-mono">{viewingLecturer.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Contact Phone:</span>
                  <span className="font-bold">{viewingLecturer.phone}</span>
                </div>
              </div>

              {/* Assigned Courses list */}
              <div>
                <span className="text-slate-500 font-bold block mb-1">Allocated Departmental Courses:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingLecturer.assignedCourseCodes.length === 0 ? (
                    <span className="text-slate-400 italic">No courses allocated</span>
                  ) : (
                    viewingLecturer.assignedCourseCodes.map((cCode) => (
                      <span key={cCode} className="px-2.5 py-1 bg-blue-50 text-[#004384] font-extrabold text-xs rounded-lg border border-blue-100">
                        {cCode}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Available Days */}
              <div>
                <span className="text-slate-500 font-bold block mb-1">Available Teaching Days:</span>
                <div className="flex flex-wrap gap-1">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => {
                    const avail = (viewingLecturer.availableDays || []).includes(d as any);
                    return (
                      <span
                        key={d}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          avail ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400 line-through'
                        }`}
                      >
                        {d.slice(0, 3)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setViewingLecturer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = viewingLecturer;
                  setViewingLecturer(null);
                  handleOpenEditDrawer(target);
                }}
                className="px-4 py-2 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. ASSIGN COURSES QUICK MODAL */}
      {assigningCoursesLecturer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Assign Courses: {assigningCoursesLecturer.title} {assigningCoursesLecturer.name}
                </h3>
                <p className="text-xs text-slate-500">Staff ID: {assigningCoursesLecturer.staffId || 'CS-0000'}</p>
              </div>
              <button
                onClick={() => setAssigningCoursesLecturer(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourseAssignments} className="space-y-3">
              <div className="text-xs text-slate-600">Select departmental courses to allocate to this lecturer:</div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-56 overflow-y-auto space-y-1.5">
                {courses.map((course) => {
                  const isChecked = selectedCourseCodes.includes(course.code);
                  return (
                    <label
                      key={course.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCourseSelection(course.code)}
                          className="w-4 h-4 text-[#004384] rounded border-slate-300 focus:ring-[#004384]"
                        />
                        <div>
                          <span className="font-extrabold text-[#004384] font-mono text-xs">{course.code}</span>
                          <span className="text-xs text-slate-800 ml-2 font-medium">{course.title}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {course.level}L
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssigningCoursesLecturer(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Allocations
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
