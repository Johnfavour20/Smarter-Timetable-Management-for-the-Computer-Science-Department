import React, { useState } from 'react';
import { Course, Lecturer, Venue, Level } from '../types';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Users, 
  Building, 
  AlertCircle, 
  X, 
  Filter, 
  RotateCcw, 
  Upload, 
  Download, 
  MoreVertical, 
  Eye, 
  Archive, 
  CheckCircle2, 
  Check, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

interface CoursesViewProps {
  courses: Course[];
  lecturers: Lecturer[];
  venues: Venue[];
  onAddCourse: (newCourse: Course) => void;
  onDeleteCourse: (id: string) => void;
  searchQuery: string;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  lecturers,
  venues,
  onAddCourse,
  onDeleteCourse,
  searchQuery: externalSearchQuery,
}) => {
  // Local Filter States
  const [internalSearch, setInternalSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [semesterFilter, setSemesterFilter] = useState<string>('All');
  const [creditFilter, setCreditFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Slide-over Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // View Details Modal State
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  // Active Three-dot menu ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Import / Export Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Drawer
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [creditUnits, setCreditUnits] = useState(3);
  const [level, setLevel] = useState<Level>('100');
  const [semester, setSemester] = useState<'First Semester' | 'Second Semester'>('First Semester');
  const [assignedLecturerId, setAssignedLecturerId] = useState('');
  const [preferredVenueId, setPreferredVenueId] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState(120);
  const [maxStudents, setMaxStudents] = useState(150);
  const [requiresLab, setRequiresLab] = useState(false);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  // Effective Search Term combining global and local search
  const effectiveSearch = (externalSearchQuery || internalSearch).trim().toLowerCase();

  // Filter Logic
  const filteredCourses = courses.filter((c) => {
    // Search
    if (effectiveSearch) {
      const match =
        c.code.toLowerCase().includes(effectiveSearch) ||
        c.title.toLowerCase().includes(effectiveSearch) ||
        c.assignedLecturerName.toLowerCase().includes(effectiveSearch);
      if (!match) return false;
    }

    // Level
    if (levelFilter !== 'All' && c.level !== levelFilter) return false;

    // Semester
    if (semesterFilter !== 'All') {
      if (semesterFilter === 'First' && c.semester !== 'First Semester') return false;
      if (semesterFilter === 'Second' && c.semester !== 'Second Semester') return false;
    }

    // Credit Units
    if (creditFilter !== 'All' && c.creditUnits !== Number(creditFilter)) return false;

    // Status
    if (statusFilter !== 'All') {
      const cStatus = c.status || 'Active';
      if (statusFilter !== cStatus) return false;
    }

    return true;
  });

  // KPI calculations
  const totalCourses = courses.length;
  const undergraduateCourses = courses.filter((c) => ['100', '200', '300', '400'].includes(c.level)).length;
  const firstSemesterCourses = courses.filter((c) => c.semester === 'First Semester').length;
  const secondSemesterCourses = courses.filter((c) => c.semester === 'Second Semester').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const resetFilters = () => {
    setInternalSearch('');
    setLevelFilter('All');
    setSemesterFilter('All');
    setCreditFilter('All');
    setStatusFilter('All');
  };

  const handleOpenAddDrawer = () => {
    setEditingCourse(null);
    setCode('');
    setTitle('');
    setCreditUnits(3);
    setLevel('100');
    setSemester('First Semester');
    setAssignedLecturerId(lecturers[0]?.id || '');
    setPreferredVenueId(venues[0]?.id || '');
    setEnrolledStudents(120);
    setMaxStudents(150);
    setRequiresLab(false);
    setStatus('Active');
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (course: Course) => {
    setEditingCourse(course);
    setCode(course.code);
    setTitle(course.title);
    setCreditUnits(course.creditUnits);
    setLevel(course.level);
    setSemester(course.semester);
    setAssignedLecturerId(course.assignedLecturerId || '');
    setPreferredVenueId(course.preferredVenueId || '');
    setEnrolledStudents(course.enrolledStudents);
    setMaxStudents(course.maxStudents || course.enrolledStudents + 30);
    setRequiresLab(course.requiresLab);
    setStatus(course.status || 'Active');
    setIsDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lecturer = lecturers.find((l) => l.id === assignedLecturerId);
    const venue = venues.find((v) => v.id === preferredVenueId);

    const courseData: Course = {
      id: editingCourse ? editingCourse.id : `c-${Date.now()}`,
      code: code.trim(),
      title: title.trim(),
      creditUnits: Number(creditUnits),
      level,
      semester,
      assignedLecturerId: lecturer ? lecturer.id : '',
      assignedLecturerName: lecturer ? `${lecturer.title} ${lecturer.name}` : 'Unassigned',
      preferredVenueId: venue ? venue.id : '',
      preferredVenueName: venue ? venue.name : 'TBD',
      enrolledStudents: Number(enrolledStudents),
      maxStudents: Number(maxStudents),
      requiresLab,
      status,
    };

    onAddCourse(courseData);
    setIsDrawerOpen(false);
    showToast(editingCourse ? `Course ${courseData.code} updated successfully.` : `New course ${courseData.code} saved to catalogue.`);
  };

  const handleExport = () => {
    const csvHeader = "Code,Title,Level,Semester,Credit Units,Assigned Lecturer,Venue,Status\n";
    const csvRows = filteredCourses.map(c => 
      `"${c.code}","${c.title}","${c.level}L","${c.semester}",${c.creditUnits},"${c.assignedLecturerName}","${c.preferredVenueName}","${c.status || 'Active'}"`
    ).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChronosCS_Courses_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    showToast(`Exported ${filteredCourses.length} courses to CSV file.`);
  };

  const handleImportCSV = () => {
    const fakeCode = `CSC ${Math.floor(Math.random() * 300) + 200}`;
    const newCourse: Course = {
      id: `c-imp-${Date.now()}`,
      code: fakeCode,
      title: 'Advanced Operating Systems Lab',
      creditUnits: 3,
      level: '300',
      semester: 'First Semester',
      assignedLecturerId: lecturers[0]?.id || '',
      assignedLecturerName: lecturers[0] ? `${lecturers[0].title} ${lecturers[0].name}` : 'Prof. A. Adewale',
      preferredVenueId: venues[0]?.id || '',
      preferredVenueName: venues[0]?.name || 'CS Lab 1',
      enrolledStudents: 110,
      requiresLab: true,
      status: 'Active',
    };
    onAddCourse(newCourse);
    showToast(`Successfully imported ${fakeCode} into courses directory.`);
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
            <BookOpen className="w-6 h-6 text-[#004384]" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Courses</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Manage all departmental courses used for timetable generation.
          </p>
        </div>

        <button
          onClick={handleOpenAddDrawer}
          className="bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Course</span>
        </button>
      </div>

      {/* 2. SUMMARY KPI CARDS (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: Total Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Courses</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalCourses}</span>
            <span className="text-[11px] font-bold text-[#004384] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Department Catalogue
            </span>
          </div>
        </div>

        {/* Card 2: Undergraduate Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Undergraduate Courses</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{undergraduateCourses}</span>
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              100L - 400L
            </span>
          </div>
        </div>

        {/* Card 3: First Semester Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">First Semester</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{firstSemesterCourses}</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Active Term
            </span>
          </div>
        </div>

        {/* Card 4: Second Semester Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Second Semester</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{secondSemesterCourses}</span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Next Term
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
              placeholder="Search by course code or title..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
            />
          </div>

          {/* Right Filters Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384]"
            >
              <option value="All">All Levels</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>

            {/* Semester Filter */}
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384]"
            >
              <option value="All">All Semesters</option>
              <option value="First">First Semester</option>
              <option value="Second">Second Semester</option>
            </select>

            {/* Credit Unit Filter */}
            <select
              value={creditFilter}
              onChange={(e) => setCreditFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384]"
            >
              <option value="All">All Units</option>
              <option value="1">1 Unit</option>
              <option value="2">2 Units</option>
              <option value="3">3 Units</option>
              <option value="4">4 Units</option>
              <option value="6">6 Units</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none focus:border-[#004384]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Reset Button */}
            {(internalSearch || levelFilter !== 'All' || semesterFilter !== 'All' || creditFilter !== 'All' || statusFilter !== 'All') && (
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
              onClick={handleExport}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>

        </div>

      </div>

      {/* 4. COURSE TABLE OR EMPTY STATE */}
      {filteredCourses.length === 0 ? (
        /* EMPTY STATE CONTAINER */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#004384] flex items-center justify-center mx-auto shadow-2xs">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-slate-900">No Courses Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Start by adding the first course for the department or clear your search filters.
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
              <span>Add Course</span>
            </button>
          </div>
        </div>
      ) : (
        /* COURSE TABLE CONTAINER */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Course Code</th>
                  <th className="py-3.5 px-5">Course Title</th>
                  <th className="py-3.5 px-5">Level</th>
                  <th className="py-3.5 px-5">Semester</th>
                  <th className="py-3.5 px-5">Credit Units</th>
                  <th className="py-3.5 px-5">Assigned Lecturer</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredCourses.map((course) => {
                  const courseStatus = course.status || 'Active';
                  return (
                    <tr 
                      key={course.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Course Code */}
                      <td className="py-4 px-5 font-extrabold text-[#004384] font-mono">
                        {course.code}
                      </td>

                      {/* Course Title */}
                      <td className="py-4 px-5 font-bold text-slate-900 max-w-xs truncate">
                        {course.title}
                        {course.requiresLab && (
                          <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded">
                            Lab
                          </span>
                        )}
                      </td>

                      {/* Level */}
                      <td className="py-4 px-5">
                        <span className="text-[11px] font-extrabold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80">
                          {course.level}L
                        </span>
                      </td>

                      {/* Semester */}
                      <td className="py-4 px-5 font-semibold text-slate-600">
                        {course.semester === 'First Semester' ? 'First' : 'Second'}
                      </td>

                      {/* Credit Units */}
                      <td className="py-4 px-5 font-extrabold text-slate-900 font-mono">
                        {course.creditUnits} Units
                      </td>

                      {/* Assigned Lecturer */}
                      <td className="py-4 px-5 font-medium text-slate-700">
                        {course.assignedLecturerName !== 'Unassigned' ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{course.assignedLecturerName}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          courseStatus === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${courseStatus === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {courseStatus}
                        </span>
                      </td>

                      {/* Actions Overflow Menu */}
                      <td className="py-4 px-5 text-right relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === course.id ? null : course.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Three-Dot Dropdown Popup */}
                        {activeMenuId === course.id && (
                          <div 
                            className="absolute right-5 top-12 z-30 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 text-left text-xs font-semibold space-y-0.5 animate-fadeIn"
                            onMouseLeave={() => setActiveMenuId(null)}
                          >
                            <button
                              onClick={() => {
                                setViewingCourse(course);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>View Details</span>
                            </button>

                            <button
                              onClick={() => {
                                handleOpenEditDrawer(course);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                              <span>Edit Course</span>
                            </button>

                            <button
                              onClick={() => {
                                const newStatus: 'Active' | 'Inactive' = courseStatus === 'Active' ? 'Inactive' : 'Active';
                                onAddCourse({ ...course, status: newStatus });
                                setActiveMenuId(null);
                                showToast(`Course ${course.code} marked as ${newStatus}.`);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5 text-purple-600" />
                              <span>{courseStatus === 'Active' ? 'Archive' : 'Activate'}</span>
                            </button>

                            <div className="h-px bg-slate-100 my-1" />

                            <button
                              onClick={() => {
                                onDeleteCourse(course.id);
                                setActiveMenuId(null);
                                showToast(`Course ${course.code} deleted.`);
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
            <span>Showing <strong className="text-slate-900">{filteredCourses.length}</strong> of <strong className="text-slate-900">{courses.length}</strong> courses</span>
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

      {/* 5. ADD / EDIT COURSE RIGHT-SIDE SLIDE-OVER DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
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
                    {editingCourse ? `Edit Course: ${editingCourse.code}` : 'Add New Course'}
                  </h2>
                  <p className="text-xs text-slate-500">Department of Computer Science</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Body Form */}
              <form id="courseForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                
                {/* Course Code */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSC 101"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                  />
                </div>

                {/* Course Title */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Introduction to Computer Science"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-[#004384]/20 focus:border-[#004384] transition-all"
                  />
                </div>

                {/* Level & Semester */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Level *</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as Level)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold"
                    >
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                      <option value="MSc">MSc</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Semester *</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold"
                    >
                      <option value="First Semester">First Semester</option>
                      <option value="Second Semester">Second Semester</option>
                    </select>
                  </div>
                </div>

                {/* Credit Units & Enrolled Students */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Credit Units *</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      required
                      value={creditUnits}
                      onChange={(e) => setCreditUnits(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Maximum Students</label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={maxStudents}
                      onChange={(e) => setMaxStudents(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-bold"
                    />
                  </div>
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

                {/* Assigned Lecturer */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Lecturer</label>
                  <select
                    value={assignedLecturerId}
                    onChange={(e) => setAssignedLecturerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold"
                  >
                    <option value="">Unassigned</option>
                    {lecturers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title} {l.name} ({l.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Venue */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Preferred Venue</label>
                  <select
                    value={preferredVenueId}
                    onChange={(e) => setPreferredVenueId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold"
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.building} - Capacity: {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Radio Buttons */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="statusRadio"
                        checked={status === 'Active'}
                        onChange={() => setStatus('Active')}
                        className="text-[#004384] focus:ring-[#004384]"
                      />
                      <span className="font-bold text-slate-800">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="statusRadio"
                        checked={status === 'Inactive'}
                        onChange={() => setStatus('Inactive')}
                        className="text-[#004384] focus:ring-[#004384]"
                      />
                      <span className="font-bold text-slate-800">Inactive</span>
                    </label>
                  </div>
                </div>

                {/* Lab Requirement Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="labCheck"
                    checked={requiresLab}
                    onChange={(e) => setRequiresLab(e.target.checked)}
                    className="w-4 h-4 text-[#004384] rounded border-slate-300 focus:ring-[#004384]"
                  />
                  <label htmlFor="labCheck" className="text-slate-800 font-bold cursor-pointer">
                    Requires Computer Laboratory Sessions
                  </label>
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
                  form="courseForm"
                  className="px-5 py-2.5 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Course
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW COURSE DETAILS MODAL */}
      {viewingCourse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#004384] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                  Course Metadata
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {viewingCourse.code}: {viewingCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingCourse(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Level</span>
                  <span className="font-extrabold text-slate-900 text-sm">{viewingCourse.level} Level</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Semester</span>
                  <span className="font-extrabold text-slate-900 text-sm">{viewingCourse.semester}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Credit Weight</span>
                  <span className="font-extrabold text-slate-900 text-sm">{viewingCourse.creditUnits} Units</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Session Type</span>
                  <span className="font-extrabold text-slate-900 text-sm">{viewingCourse.requiresLab ? 'Practical / Lab' : 'Lecture'}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-bold">Computer Science, UNIPORT</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Assigned Lecturer:</span>
                  <span className="font-bold text-[#004384]">{viewingCourse.assignedLecturerName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Preferred Room:</span>
                  <span className="font-bold">{viewingCourse.preferredVenueName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400">Est. Enrolled Students:</span>
                  <span className="font-bold font-mono">{viewingCourse.enrolledStudents} students</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setViewingCourse(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const courseToEdit = viewingCourse;
                  setViewingCourse(null);
                  handleOpenEditDrawer(courseToEdit);
                }}
                className="px-4 py-2 bg-[#004384] hover:bg-[#081C3A] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Course</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
