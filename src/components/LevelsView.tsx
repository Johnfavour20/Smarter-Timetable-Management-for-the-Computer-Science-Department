import React, { useState } from 'react';
import { LevelItem, Course } from '../types';
import { 
  Layers, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  BookOpen, 
  Users, 
  X, 
  RotateCcw, 
  Download, 
  MoreVertical, 
  Eye, 
  Archive, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Check,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface LevelsViewProps {
  levels: LevelItem[];
  courses: Course[];
  onAddLevel: (newLevel: LevelItem) => void;
  onUpdateLevel: (updatedLevel: LevelItem) => void;
  onDeleteLevel: (id: string) => void;
  searchQuery?: string;
}

export const LevelsView: React.FC<LevelsViewProps> = ({
  levels,
  courses,
  onAddLevel,
  onUpdateLevel,
  onDeleteLevel,
  searchQuery: externalSearchQuery = '',
}) => {
  // Local Filter States
  const [internalSearch, setInternalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sessionFilter, setSessionFilter] = useState<string>('All');

  // Slide-over Drawer State (Add / Edit)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelItem | null>(null);

  // View Details Modal State
  const [viewingLevel, setViewingLevel] = useState<LevelItem | null>(null);

  // Active Overflow Menu ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Add/Edit Drawer
  const [name, setName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedStudents, setEstimatedStudents] = useState<number>(200);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [academicSession, setAcademicSession] = useState('2026/2027');

  // Helper to show toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Combine external and internal search
  const effectiveSearch = (externalSearchQuery || internalSearch).trim().toLowerCase();

  // Filter Logic
  const filteredLevels = levels.filter((lvl) => {
    // Search match
    if (effectiveSearch) {
      const match =
        lvl.name.toLowerCase().includes(effectiveSearch) ||
        lvl.shortCode.toLowerCase().includes(effectiveSearch) ||
        lvl.description.toLowerCase().includes(effectiveSearch);
      if (!match) return false;
    }

    // Status Filter
    if (statusFilter !== 'All' && lvl.status !== statusFilter) {
      return false;
    }

    // Academic Session Filter
    if (sessionFilter !== 'All' && (lvl.academicSession || '2026/2027') !== sessionFilter) {
      return false;
    }

    return true;
  });

  // Calculate actual courses assigned count per level from courses array if available
  const getCoursesForLevel = (shortCode: string) => {
    const rawLevel = shortCode.replace('L', '');
    return courses.filter((c) => c.level === rawLevel || c.level === shortCode);
  };

  // KPI Calculations
  const totalLevelsCount = levels.length;
  const activeLevelsCount = levels.filter((l) => l.status === 'Active').length;
  
  // Total courses assigned across all levels
  const totalCoursesAssigned = levels.reduce((sum, lvl) => {
    const actualCount = getCoursesForLevel(lvl.shortCode).length;
    return sum + (actualCount > 0 ? actualCount : lvl.coursesAssignedCount || 0);
  }, 0);

  // Total estimated students across active levels
  const totalEstimatedStudents = levels.reduce((sum, lvl) => {
    return sum + Number(lvl.estimatedStudents || 0);
  }, 0);

  const resetFilters = () => {
    setInternalSearch('');
    setStatusFilter('All');
    setSessionFilter('All');
  };

  const handleOpenAddDrawer = () => {
    setEditingLevel(null);
    setName('');
    setShortCode('100L');
    setDescription('');
    setEstimatedStudents(250);
    setStatus('Active');
    setAcademicSession('2026/2027');
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (lvl: LevelItem) => {
    setEditingLevel(lvl);
    setName(lvl.name);
    setShortCode(lvl.shortCode);
    setDescription(lvl.description);
    setEstimatedStudents(lvl.estimatedStudents);
    setStatus(lvl.status);
    setAcademicSession(lvl.academicSession || '2026/2027');
    setIsDrawerOpen(true);
  };

  const handleSubmitDrawer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!shortCode.trim()) return;

    const levelData: LevelItem = {
      id: editingLevel ? editingLevel.id : `lvl-${Date.now()}`,
      name: name.trim() || `${shortCode} Level`,
      shortCode: shortCode.trim().toUpperCase(),
      description: description.trim() || 'Academic Level Cohort',
      estimatedStudents: Number(estimatedStudents) || 0,
      coursesAssignedCount: editingLevel
        ? editingLevel.coursesAssignedCount
        : getCoursesForLevel(shortCode).length,
      status,
      academicSession,
    };

    if (editingLevel) {
      onUpdateLevel(levelData);
      showToast(`Updated level record for ${levelData.shortCode}.`);
    } else {
      onAddLevel(levelData);
      showToast(`Added new academic level ${levelData.shortCode} (${levelData.name}).`);
    }

    setIsDrawerOpen(false);
  };

  const handleToggleStatus = (lvl: LevelItem) => {
    const newStatus: 'Active' | 'Inactive' = lvl.status === 'Active' ? 'Inactive' : 'Active';
    const updated = { ...lvl, status: newStatus };
    onUpdateLevel(updated);
    showToast(`Level ${lvl.shortCode} is now ${newStatus}.`);
  };

  const handleDelete = (lvl: LevelItem) => {
    onDeleteLevel(lvl.id);
    showToast(`Deleted level ${lvl.shortCode}.`);
  };

  const handleExportCSV = () => {
    const csvHeader = 'Level Short Code,Level Name,Description,Courses Assigned,Estimated Students,Status,Academic Session\n';
    const csvRows = filteredLevels
      .map((l) => {
        const courseCount = getCoursesForLevel(l.shortCode).length || l.coursesAssignedCount || 0;
        return `"${l.shortCode}","${l.name}","${l.description}",${courseCount},${l.estimatedStudents},"${l.status}","${l.academicSession || '2026/2027'}"`;
      })
      .join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChronosCS_Levels_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast(`Exported ${filteredLevels.length} level records to CSV.`);
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
            <Layers className="w-6 h-6 text-[#004384]" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Levels</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Manage student levels used for timetable generation.
          </p>
        </div>

        <button
          onClick={handleOpenAddDrawer}
          id="addLevelBtn"
          className="bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Level</span>
        </button>
      </div>

      {/* 2. SUMMARY CARDS (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Total Levels */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Layers className="w-4 h-4 text-[#004384]" />
            <span className="text-xs font-bold uppercase tracking-wider block">Total Levels</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalLevelsCount}</span>
            <span className="text-[11px] font-bold text-[#004384] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Department Cohorts
            </span>
          </div>
        </div>

        {/* Card 2: Active Levels */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider block">Active Levels</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeLevelsCount}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              In Scheduling
            </span>
          </div>
        </div>

        {/* Card 3: Courses Assigned */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <BookOpen className="w-4 h-4 text-[#004384]" />
            <span className="text-xs font-bold uppercase tracking-wider block">Courses Assigned</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalCoursesAssigned}</span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Curriculum Units
            </span>
          </div>
        </div>

        {/* Card 4: Estimated Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold uppercase tracking-wider block">Estimated Students</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalEstimatedStudents}</span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Total Capacity
            </span>
          </div>
        </div>

      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Search by level */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder="Search by level (e.g. 100L, First Year)..."
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
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Academic Session Filter */}
            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384] cursor-pointer"
            >
              <option value="All">Session: All</option>
              <option value="2026/2027">2026/2027</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2024/2025">2024/2025</option>
              <option value="2023/2024">2023/2024</option>
            </select>

            {/* Reset Filters Button */}
            {(internalSearch || statusFilter !== 'All' || sessionFilter !== 'All') && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

          </div>

          {/* Export Action */}
          <div className="flex items-center gap-2 text-xs pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
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

      {/* 4. LEVELS TABLE OR EMPTY STATE */}
      {filteredLevels.length === 0 ? (
        /* EMPTY STATE CONTAINER */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#004384] flex items-center justify-center mx-auto shadow-2xs">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-slate-900">No Levels Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create your first academic level before assigning courses and generating timetables.
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
              <span>Add Level</span>
            </button>
          </div>
        </div>
      ) : (
        /* LEVELS TABLE CONTAINER */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider sticky top-0 z-10 bg-white">
                  <th className="py-3.5 px-5">Level</th>
                  <th className="py-3.5 px-5">Description</th>
                  <th className="py-3.5 px-5">Courses Assigned</th>
                  <th className="py-3.5 px-5">Estimated Students</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredLevels.map((lvl) => {
                  const assignedCourses = getCoursesForLevel(lvl.shortCode);
                  const coursesCount = assignedCourses.length > 0
                    ? assignedCourses.length
                    : lvl.coursesAssignedCount || 0;

                  return (
                    <tr 
                      key={lvl.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Level Badge Column */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1.5 rounded-xl font-extrabold text-xs inline-flex items-center justify-center border shadow-2xs ${
                            lvl.status === 'Active'
                              ? 'bg-blue-50 text-[#004384] border-blue-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {lvl.shortCode}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">{lvl.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Session: {lvl.academicSession || '2026/2027'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-5 text-slate-600 font-medium max-w-xs">
                        {lvl.description || 'Academic level cohort'}
                      </td>

                      {/* Courses Assigned */}
                      <td className="py-4 px-5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#004384] border border-blue-100 font-extrabold">
                            {coursesCount} Courses
                          </span>
                        </div>
                      </td>

                      {/* Estimated Students */}
                      <td className="py-4 px-5 font-bold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{lvl.estimatedStudents} Students</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          lvl.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            lvl.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`} />
                          {lvl.status}
                        </span>
                      </td>

                      {/* Actions Overflow Menu */}
                      <td className="py-4 px-5 text-right relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === lvl.id ? null : lvl.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Three-dot Dropdown Popup */}
                        {activeMenuId === lvl.id && (
                          <div 
                            className="absolute right-5 top-12 z-30 w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 text-left text-xs font-semibold space-y-0.5"
                            onMouseLeave={() => setActiveMenuId(null)}
                          >
                            {/* View */}
                            <button
                              onClick={() => {
                                setViewingLevel(lvl);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>View</span>
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => {
                                handleOpenEditDrawer(lvl);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                              <span>Edit</span>
                            </button>

                            {/* Archive */}
                            <button
                              onClick={() => {
                                handleToggleStatus(lvl);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5 text-purple-600" />
                              <span>{lvl.status === 'Active' ? 'Archive' : 'Activate'}</span>
                            </button>

                            <div className="h-px bg-slate-100 my-1" />

                            {/* Delete */}
                            <button
                              onClick={() => {
                                handleDelete(lvl);
                                setActiveMenuId(null);
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
            <span>Showing <strong className="text-slate-900">{filteredLevels.length}</strong> of <strong className="text-slate-900">{levels.length}</strong> levels</span>
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

      {/* 5. ADD / EDIT LEVEL RIGHT-SIDE SLIDE-OVER DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            id="drawerOverlay"
          />

          {/* Slide-over Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10" id="addLevelDrawer">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-slideIn">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {editingLevel ? `Edit Level: ${editingLevel.shortCode}` : 'Add New Level'}
                  </h2>
                  <p className="text-xs text-slate-500">Department of Computer Science, UNIPORT</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  id="closeDrawerBtn"
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form id="levelForm" onSubmit={handleSubmitDrawer} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                
                {/* Level Name */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Level Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., First Year / Freshmen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                  />
                </div>

                {/* Short Code */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Short Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 100L"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Used in timetable grid headers and course filters.</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Optional description of this academic cohort..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all resize-none"
                  />
                </div>

                {/* Estimated Number of Students */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Estimated Number of Students
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="2000"
                    value={estimatedStudents}
                    onChange={(e) => setEstimatedStudents(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Used for preliminary venue capacity allocation calculations.
                  </p>
                </div>

                {/* Academic Session */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Academic Session</label>
                  <select
                    value={academicSession}
                    onChange={(e) => setAcademicSession(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384]"
                  >
                    <option value="2026/2027">2026/2027 Session</option>
                    <option value="2025/2026">2025/2026 Session</option>
                    <option value="2024/2025">2024/2025 Session</option>
                  </select>
                </div>

                {/* Status Switch */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <label className="text-slate-900 font-bold block">Status</label>
                    <span className="text-[11px] text-slate-500">
                      Enable level for active timetable generation
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status === 'Active'}
                      onChange={(e) => setStatus(e.target.checked ? 'Active' : 'Inactive')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004384]"></div>
                  </label>
                </div>

              </form>

              {/* Drawer Footer Buttons */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  id="cancelDrawerBtn"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="levelForm"
                  className="px-5 py-2.5 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Level
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW LEVEL DETAILS MODAL */}
      {viewingLevel && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#004384] font-black text-base flex items-center justify-center border border-blue-200 shadow-xs">
                  {viewingLevel.shortCode}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {viewingLevel.name}
                  </h3>
                  <p className="text-xs font-bold text-[#004384]">
                    Session: {viewingLevel.academicSession || '2026/2027'} • Status: {viewingLevel.status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingLevel(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Description</span>
                <p className="font-medium text-slate-800">{viewingLevel.description || 'No custom description provided.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                  <span className="text-[#004384] block text-[10px] uppercase font-bold">Estimated Students</span>
                  <span className="font-extrabold text-slate-900 text-base">{viewingLevel.estimatedStudents} Students</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                  <span className="text-emerald-700 block text-[10px] uppercase font-bold">Courses Count</span>
                  <span className="font-extrabold text-slate-900 text-base">
                    {getCoursesForLevel(viewingLevel.shortCode).length || viewingLevel.coursesAssignedCount || 0} Courses
                  </span>
                </div>
              </div>

              {/* Course Breakdown */}
              <div className="space-y-2">
                <span className="font-extrabold text-slate-900 block text-xs">
                  Assigned Courses ({getCoursesForLevel(viewingLevel.shortCode).length}):
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {getCoursesForLevel(viewingLevel.shortCode).length === 0 ? (
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl text-center italic text-[11px]">
                      No courses currently mapped to this level.
                    </div>
                  ) : (
                    getCoursesForLevel(viewingLevel.shortCode).map((c) => (
                      <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="font-extrabold font-mono text-[#004384] mr-2">{c.code}</span>
                          <span className="font-semibold text-slate-800">{c.title}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {c.creditUnits} Units
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  handleOpenEditDrawer(viewingLevel);
                  setViewingLevel(null);
                }}
                className="px-4 py-2 bg-[#004384] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#081C3A] cursor-pointer"
              >
                Edit Level
              </button>
              <button
                onClick={() => setViewingLevel(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
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
