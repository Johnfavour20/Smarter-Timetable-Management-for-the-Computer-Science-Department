import React, { useState } from 'react';
import { AcademicSession } from '../types';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Download,
  MoreVertical,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Clock,
  Layers,
  Check,
  Globe,
  FileText
} from 'lucide-react';

interface AcademicSessionsViewProps {
  sessions: AcademicSession[];
  onAddSession: (newSession: AcademicSession) => void;
  onUpdateSession?: (updatedSession: AcademicSession) => void;
  onDeleteSession: (id: string) => void;
  onSetActiveSession?: (id: string) => void;
  searchQuery?: string;
  onNavigateToSchedule?: () => void;
}

export const AcademicSessionsView: React.FC<AcademicSessionsViewProps> = ({
  sessions,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  onSetActiveSession,
  searchQuery: externalSearchQuery = '',
  onNavigateToSchedule,
}) => {
  // Search and Filters
  const [internalSearch, setInternalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');
  const [timetableFilter, setTimetableFilter] = useState('All');

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);

  // View Details Modal state
  const [viewingSession, setViewingSession] = useState<AcademicSession | null>(null);

  // Action Menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [sessionName, setSessionName] = useState('');
  const [semester, setSemester] = useState<'First Semester' | 'Second Semester'>('First Semester');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActiveToggle, setIsActiveToggle] = useState(false);
  const [timetableStatus, setTimetableStatus] = useState<'Draft' | 'Published'>('Draft');
  const [notes, setNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const effectiveSearch = (externalSearchQuery || internalSearch).trim().toLowerCase();

  // Filter Logic
  const filteredSessions = sessions.filter((s) => {
    if (effectiveSearch) {
      const q = effectiveSearch;
      const match =
        s.name.toLowerCase().includes(q) ||
        s.semester.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (statusFilter !== 'All' && s.status !== statusFilter) {
      return false;
    }

    if (semesterFilter !== 'All' && s.semester !== semesterFilter) {
      return false;
    }

    if (timetableFilter !== 'All' && s.timetableStatus !== timetableFilter) {
      return false;
    }

    return true;
  });

  // KPI Calculations
  const totalSessionsCount = sessions.length;
  const activeSessionObj = sessions.find((s) => s.status === 'Active') || sessions[0];
  const publishedCount = sessions.filter((s) => s.timetableStatus === 'Published').length;

  const resetFilters = () => {
    setInternalSearch('');
    setStatusFilter('All');
    setSemesterFilter('All');
    setTimetableFilter('All');
  };

  const handleOpenAddDrawer = () => {
    setEditingSession(null);
    setSessionName('2026/2027');
    setSemester('First Semester');
    setStartDate('');
    setEndDate('');
    setIsActiveToggle(true);
    setTimetableStatus('Draft');
    setNotes('');
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (s: AcademicSession) => {
    setEditingSession(s);
    setSessionName(s.name);
    setSemester(s.semester);
    setStartDate(s.startDate || '');
    setEndDate(s.endDate || '');
    setIsActiveToggle(s.status === 'Active');
    setTimetableStatus(s.timetableStatus);
    setNotes(s.notes || '');
    setIsDrawerOpen(true);
  };

  const handleSubmitDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) return;

    const newStatus: 'Active' | 'Archived' | 'Upcoming' = isActiveToggle ? 'Active' : (editingSession?.status || 'Upcoming');

    const sessionData: AcademicSession = {
      id: editingSession ? editingSession.id : `ses-${Date.now()}`,
      name: sessionName.trim(),
      semester,
      status: newStatus,
      timetableStatus,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      createdDate: editingSession ? editingSession.createdDate : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      notes: notes.trim() || undefined,
    };

    if (isActiveToggle && onSetActiveSession) {
      // Set active in parent state
      onSetActiveSession(sessionData.id);
    }

    if (editingSession) {
      if (onUpdateSession) {
        onUpdateSession(sessionData);
      } else {
        onAddSession(sessionData);
      }
      showToast(`Updated academic session ${sessionData.name} (${sessionData.semester}).`);
    } else {
      onAddSession(sessionData);
      showToast(`Created new academic session ${sessionData.name} (${sessionData.semester}).`);
    }

    setIsDrawerOpen(false);
  };

  const handleMakeActive = (s: AcademicSession) => {
    if (onSetActiveSession) {
      onSetActiveSession(s.id);
      showToast(`${s.name} (${s.semester}) is now the Active Academic Session.`);
    } else if (onUpdateSession) {
      // Mark this active and others archived
      sessions.forEach((item) => {
        if (item.id === s.id) {
          onUpdateSession({ ...item, status: 'Active' });
        } else if (item.status === 'Active') {
          onUpdateSession({ ...item, status: 'Archived' });
        }
      });
      showToast(`${s.name} (${s.semester}) is now set to Active.`);
    }
  };

  const handleToggleTimetableStatus = (s: AcademicSession) => {
    const nextTimetableStatus: 'Draft' | 'Published' = s.timetableStatus === 'Published' ? 'Draft' : 'Published';
    const updated = { ...s, timetableStatus: nextTimetableStatus };
    if (onUpdateSession) {
      onUpdateSession(updated);
    }
    showToast(`Timetable status for ${s.name} updated to ${nextTimetableStatus}.`);
  };

  const handleDelete = (s: AcademicSession) => {
    onDeleteSession(s.id);
    showToast(`Deleted academic session ${s.name} (${s.semester}).`);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Session Name,Semester,Session Status,Timetable Status,Start Date,End Date,Created Date,Notes\n';
    const csvRows = filteredSessions
      .map((s) => `"${s.name}","${s.semester}","${s.status}","${s.timetableStatus}","${s.startDate || ''}","${s.endDate || ''}","${s.createdDate}","${(s.notes || '').replace(/"/g, '""')}"`)
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChronosCS_Sessions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast(`Exported ${filteredSessions.length} session records to CSV.`);
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

      {/* 1. PAGE HEADER SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#004384]" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Sessions</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Manage academic sessions and semesters used for Computer Science timetable scheduling.
          </p>
        </div>

        <button
          onClick={handleOpenAddDrawer}
          id="newAcademicSessionBtn"
          className="bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Academic Session</span>
        </button>
      </div>

      {/* 2. SUMMARY CARDS (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Total Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider block">Total Sessions</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004384]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalSessionsCount}</span>
            <span className="text-[11px] font-bold text-[#004384] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Recorded
            </span>
          </div>
        </div>

        {/* KPI 2: Active Session */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider block">Active Session</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{activeSessionObj?.name || '2026/2027'}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
            </span>
          </div>
        </div>

        {/* KPI 3: Current Semester */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider block">Current Semester</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">{activeSessionObj?.semester || 'First Semester'}</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              In Progress
            </span>
          </div>
        </div>

        {/* KPI 4: Published Timetables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider block">Published Timetables</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{publishedCount}</span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Live Schedules
            </span>
          </div>
        </div>

      </div>

      {/* 3. MAIN CONTENT (3 cols Table + 1 col Context Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Table & Filters */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Filters Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              
              {/* Search */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  placeholder="Filter sessions or notes..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384] cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                  <option value="Upcoming">Upcoming</option>
                </select>

                {/* Semester Filter */}
                <select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384] cursor-pointer"
                >
                  <option value="All">All Semesters</option>
                  <option value="First Semester">First Semester</option>
                  <option value="Second Semester">Second Semester</option>
                </select>

                {/* Timetable Status Filter */}
                <select
                  value={timetableFilter}
                  onChange={(e) => setTimetableFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384] cursor-pointer"
                >
                  <option value="All">All Timetables</option>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>

                {/* Reset Filters */}
                {(internalSearch || statusFilter !== 'All' || semesterFilter !== 'All' || timetableFilter !== 'All') && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset Filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

                {/* Export CSV */}
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export</span>
                </button>

              </div>

            </div>
          </div>

          {/* Table Container */}
          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#004384] flex items-center justify-center mx-auto shadow-2xs">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-extrabold text-slate-900">No Academic Sessions Found</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No session records matched your search parameters.
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
                  <span>New Session</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-white">
                      <th className="py-3.5 px-5">Academic Session</th>
                      <th className="py-3.5 px-5">Semester</th>
                      <th className="py-3.5 px-5">Session Status</th>
                      <th className="py-3.5 px-5">Timetable Status</th>
                      <th className="py-3.5 px-5 hidden sm:table-cell">Created Date</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                    {filteredSessions.map((s) => {
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                          
                          {/* Name */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                                s.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {s.name.slice(2, 4)}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 text-sm">{s.name}</div>
                                {s.notes && (
                                  <div className="text-[11px] text-slate-400 truncate max-w-xs">{s.notes}</div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Semester */}
                          <td className="py-4 px-5 font-semibold text-slate-700">
                            {s.semester}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              s.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : s.status === 'Upcoming'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                s.status === 'Active'
                                  ? 'bg-emerald-500'
                                  : s.status === 'Upcoming'
                                  ? 'bg-blue-500'
                                  : 'bg-slate-400'
                              }`} />
                              {s.status}
                            </span>
                          </td>

                          {/* Timetable Status */}
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              s.timetableStatus === 'Published'
                                ? 'bg-blue-50 text-[#004384] border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {s.timetableStatus === 'Published' ? (
                                <>
                                  <Globe className="w-3 h-3 text-blue-600" />
                                  <span>Published</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  <span>Draft</span>
                                </>
                              )}
                            </span>
                          </td>

                          {/* Created Date */}
                          <td className="py-4 px-5 text-slate-500 hidden sm:table-cell font-medium">
                            {s.createdDate}
                          </td>

                          {/* Actions Overflow Menu */}
                          <td className="py-4 px-5 text-right relative">
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === s.id ? null : s.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Popup */}
                            {activeMenuId === s.id && (
                              <div 
                                className="absolute right-5 top-12 z-30 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 text-left text-xs font-semibold space-y-0.5"
                                onMouseLeave={() => setActiveMenuId(null)}
                              >
                                {/* View Details */}
                                <button
                                  onClick={() => {
                                    setViewingSession(s);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  <span>View Details</span>
                                </button>

                                {/* Set as Active */}
                                {s.status !== 'Active' && (
                                  <button
                                    onClick={() => {
                                      handleMakeActive(s);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full px-3 py-2 hover:bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Set as Active</span>
                                  </button>
                                )}

                                {/* Toggle Published / Draft */}
                                <button
                                  onClick={() => {
                                    handleToggleTimetableStatus(s);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Globe className="w-3.5 h-3.5 text-purple-600" />
                                  <span>{s.timetableStatus === 'Published' ? 'Set as Draft' : 'Publish Timetable'}</span>
                                </button>

                                {/* Edit */}
                                <button
                                  onClick={() => {
                                    handleOpenEditDrawer(s);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Edit Session</span>
                                </button>

                                <div className="h-px bg-slate-100 my-1" />

                                {/* Delete */}
                                <button
                                  onClick={() => {
                                    handleDelete(s);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-rose-50 text-rose-600 rounded-lg flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Delete Session</span>
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

              {/* Table Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
                <span>Showing <strong className="text-slate-900">{filteredSessions.length}</strong> of <strong className="text-slate-900">{sessions.length}</strong> entries</span>
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

        </div>

        {/* Right Column: Current Context Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#081C3A] rounded-2xl p-5 shadow-xl relative overflow-hidden text-white border border-blue-900/50 space-y-5">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Title */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-base tracking-tight text-white">Current Context</h3>
            </div>

            {/* Active Session Info */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">Active Session</span>
              <div className="text-2xl font-black text-white">{activeSessionObj?.name || '2026/2027'}</div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Semester Info */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">Current Semester</span>
              <div className="text-base font-extrabold text-white">{activeSessionObj?.semester || 'First Semester'}</div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Timetable Status Info */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">Timetable</span>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeSessionObj?.timetableStatus || 'Draft'}</span>
                </div>
              </div>

              {onNavigateToSchedule && (
                <button
                  onClick={onNavigateToSchedule}
                  className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl border border-white/15 transition-all text-white cursor-pointer active:scale-95"
                  title="Open Schedule Matrix"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Additional Info Box */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-[11px] text-blue-200">
              <div className="flex items-center justify-between font-bold text-white">
                <span>Timetable Engine</span>
                <span className="text-emerald-400 text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">Ready</span>
              </div>
              <p className="text-blue-200/80 leading-normal">
                All generated schedules, venue assignments, and lecturer workloads automatically bind to this active session context.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* 4. SLIDE-OVER DRAWER (Create / Edit Session) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            id="drawerOverlay"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10" id="drawer-new-session">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideIn">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {editingSession ? `Edit Session: ${editingSession.name}` : 'New Academic Session'}
                  </h2>
                  <p className="text-xs text-slate-500">Configure session parameters for timetable scheduling.</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form id="sessionForm" onSubmit={handleSubmitDrawer} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                
                {/* Session Name */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Academic Session Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026/2027"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Format: YYYY/YYYY (e.g. 2026/2027)</p>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Semester <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384]"
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384]"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-2" />

                {/* Set as Active Session Switch */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <div className="space-y-0.5 max-w-[240px]">
                    <h4 className="font-extrabold text-slate-900 text-xs">Set as Active Session</h4>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      This will automatically archive any previously active session.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isActiveToggle}
                      onChange={(e) => setIsActiveToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004384]" />
                  </label>
                </div>

                {/* Initial Timetable Status */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Timetable Status</label>
                  <select
                    value={timetableStatus}
                    onChange={(e) => setTimetableStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384]"
                  >
                    <option value="Draft">Draft (Internal preparation mode)</option>
                    <option value="Published">Published (Visible to students & staff)</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Notes (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Add internal scheduling notes, deadlines, or comments..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all resize-none"
                  />
                </div>

              </form>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="sessionForm"
                  className="px-5 py-2.5 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {editingSession ? 'Save Session' : 'Create Session'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW DETAILS MODAL */}
      {viewingSession && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#004384] font-black text-base flex items-center justify-center border border-blue-200 shadow-xs">
                  {viewingSession.name.slice(2, 4)}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Session {viewingSession.name}
                  </h3>
                  <p className="text-xs font-bold text-[#004384]">
                    {viewingSession.semester}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingSession(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Status</span>
                  <span className="font-extrabold text-slate-900 text-sm">{viewingSession.status}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Timetable</span>
                  <span className="font-extrabold text-slate-900 text-sm">{viewingSession.timetableStatus}</span>
                </div>
              </div>

              {viewingSession.startDate && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-500">Duration:</span>
                  <span className="font-semibold text-slate-900">{viewingSession.startDate} to {viewingSession.endDate || 'TBD'}</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-500">Created Date:</span>
                <span className="font-semibold text-slate-900">{viewingSession.createdDate}</span>
              </div>

              {viewingSession.notes && (
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                  <span className="font-extrabold text-[#004384] text-[11px] block">Notes:</span>
                  <p className="text-slate-700 leading-relaxed">{viewingSession.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingSession(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
