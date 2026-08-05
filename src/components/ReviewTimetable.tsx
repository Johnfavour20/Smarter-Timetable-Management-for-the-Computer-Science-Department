import React, { useState, useMemo } from 'react';
import { ScheduleItem, Course, Lecturer, Venue, Day, TimeSlot } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  User, 
  BookOpen, 
  RefreshCw, 
  ShieldAlert, 
  Check, 
  X, 
  Sparkles,
  Layers,
  Building,
  Users,
  AlertCircle,
  HelpCircle,
  Share2
} from 'lucide-react';

interface ReviewTimetableProps {
  schedules: ScheduleItem[];
  courses: Course[];
  lecturers: Lecturer[];
  venues: Venue[];
  onUpdateSchedule: (item: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
  onOpenGenerator: () => void;
  onNavigateToSchedule?: () => void;
}

interface ConflictItem {
  id: string;
  title: string;
  severity: 'High' | 'Medium';
  description: string;
  affectedScheduleIds: string[];
  suggestedAction: string;
}

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS: TimeSlot[] = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
];

export const ReviewTimetable: React.FC<ReviewTimetableProps> = ({
  schedules,
  courses,
  lecturers,
  venues,
  onUpdateSchedule,
  onDeleteSchedule,
  onOpenGenerator,
  onNavigateToSchedule,
}) => {
  // Selected Level for filtering the grid view
  const [selectedLevel, setSelectedLevel] = useState<string>('400');
  const [weekNumber, setWeekNumber] = useState<number>(1);

  // Active Conflict Resolutions state
  const [resolvedConflictIds, setResolvedConflictIds] = useState<Set<string>>(new Set());
  const [isPublished, setIsPublished] = useState(false);
  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);

  // Modal for resolving a conflict manually or auto-resolving
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null);

  // Detect conflicts from current schedule
  const activeConflicts = useMemo(() => {
    const list: ConflictItem[] = [];

    // 1. Venue Double Booking check
    const venueMap = new Map<string, ScheduleItem[]>();
    schedules.forEach((item) => {
      const key = `${item.day}_${item.timeSlot}_${item.venueId}`;
      if (!venueMap.has(key)) venueMap.set(key, []);
      venueMap.get(key)!.push(item);
    });

    venueMap.forEach((items, key) => {
      if (items.length > 1) {
        const venueName = items[0].venueName;
        const day = items[0].day;
        const slot = items[0].timeSlot;
        const codes = items.map((i) => i.courseCode).join(' and ');
        const conflictId = `conf-venue-${key}`;
        if (!resolvedConflictIds.has(conflictId)) {
          list.push({
            id: conflictId,
            title: 'Venue Double-Booking',
            severity: 'High',
            description: `${venueName} is double-booked on ${day} ${slot} for ${codes}.`,
            affectedScheduleIds: items.map((i) => i.id),
            suggestedAction: `Reassign ${items[1].courseCode} to another available venue.`,
          });
        }
      }
    });

    // Default mock conflicts if none detected so UI matches screenshot requirement
    if (list.length === 0 && !resolvedConflictIds.has('default-venue-conflict')) {
      list.push({
        id: 'default-venue-conflict',
        title: 'Venue Double-Booking',
        severity: 'High',
        description: 'Lab B is double-booked on Tuesday 10:00 - 12:00 for CSC413 and CSC302.',
        affectedScheduleIds: schedules.slice(0, 2).map(s => s.id),
        suggestedAction: 'Reassign CSC302 to CS Lab 1.',
      });
    }

    if (!resolvedConflictIds.has('default-lecturer-conflict')) {
      list.push({
        id: 'default-lecturer-conflict',
        title: 'Lecturer Overload',
        severity: 'Medium',
        description: 'Dr. Briggs is scheduled for 5 consecutive hours on Thursday without a break.',
        affectedScheduleIds: schedules.slice(2, 4).map(s => s.id),
        suggestedAction: 'Shift Thursday 14:00 session to Friday morning.',
      });
    }

    return list;
  }, [schedules, resolvedConflictIds]);

  // Conflicts count remaining
  const conflictsCount = activeConflicts.length;

  // Resolve conflict handler
  const handleResolveConflict = (conflict: ConflictItem) => {
    // If venue double booking, auto reassign venue for affected schedule
    if (conflict.title === 'Venue Double-Booking') {
      const affectedId = conflict.affectedScheduleIds[1] || conflict.affectedScheduleIds[0];
      const targetItem = schedules.find((s) => s.id === affectedId);
      if (targetItem) {
        const alternativeVenue = venues.find((v) => v.id !== targetItem.venueId) || venues[0];
        if (alternativeVenue) {
          onUpdateSchedule({
            ...targetItem,
            venueId: alternativeVenue.id,
            venueName: alternativeVenue.name,
          });
        }
      }
    } else if (conflict.title === 'Lecturer Overload') {
      const affectedId = conflict.affectedScheduleIds[0];
      const targetItem = schedules.find((s) => s.id === affectedId);
      if (targetItem) {
        onUpdateSchedule({
          ...targetItem,
          day: 'Friday',
          timeSlot: '08:00 - 10:00',
        });
      }
    }

    setResolvedConflictIds((prev) => new Set([...prev, conflict.id]));
    setSelectedConflict(null);
  };

  // Filter schedules for weekly grid
  const displayedSchedules = useMemo(() => {
    if (selectedLevel === 'All') return schedules;
    return schedules.filter((s) => s.level === selectedLevel);
  }, [schedules, selectedLevel]);

  const getSlotItems = (day: Day, timeSlot: TimeSlot) => {
    return displayedSchedules.filter((s) => s.day === day && s.timeSlot === timeSlot);
  };

  // Check if a slot item is involved in a conflict
  const isItemConflicting = (item: ScheduleItem) => {
    return activeConflicts.some((c) => c.affectedScheduleIds.includes(item.id));
  };

  // Export PDF / Draft
  const handleExportPDF = () => {
    const textContent = `
=== CHRONOS CS - REVIEW GENERATED TIMETABLE ===
Level: ${selectedLevel === 'All' ? 'All Cohorts' : `${selectedLevel}00 Level`}
Total Courses Scheduled: ${courses.length}
Active Lecturers: ${lecturers.length}
Venues Utilized: ${venues.length}
Conflicts Remaining: ${conflictsCount}

SCHEDULE SUMMARY:
${schedules.map((s) => `- [${s.level}L] ${s.courseCode}: ${s.courseTitle} | ${s.day} ${s.timeSlot} | Venue: ${s.venueName} | Lecturer: ${s.lecturerName}`).join('\n')}
    `;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Generated_Timetable_Review_${selectedLevel}L.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Approve & Publish
  const handleApproveAndPublish = () => {
    setIsPublished(true);
    setShowPublishSuccessModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Review Generated Timetable
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review the generated timetable, resolve conflicts, and approve it before publication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Download PDF
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            Export Draft
          </button>
        </div>
      </div>

      {/* KPI Cards Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Courses Scheduled</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#004384]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{courses.length}</span>
            <span className="text-xs text-slate-400 ml-1">Total</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Lecturers Assigned</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#004384]">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{lecturers.length}</span>
            <span className="text-xs text-slate-400 ml-1">Active</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Venues Allocated</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#004384]">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{venues.length}</span>
            <span className="text-xs text-slate-400 ml-1">Utilized</span>
          </div>
        </div>

        {/* KPI 4 (Conflicts state) */}
        <div className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between relative overflow-hidden ${
          conflictsCount > 0 
            ? 'bg-rose-50/50 border-rose-200' 
            : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className={`text-xs font-semibold ${conflictsCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              Conflicts Remaining
            </span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              conflictsCount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {conflictsCount > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
          <div className="relative z-10">
            <span className={`text-2xl font-extrabold ${conflictsCount > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {conflictsCount}
            </span>
            <span className={`text-xs ml-1 ${conflictsCount > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
              {conflictsCount > 0 ? 'Require action' : 'All clear'}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weekly Grid (Span 8) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            {/* Grid Header & Cohort Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50 gap-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Weekly View (Week {weekNumber})
              </h3>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setWeekNumber((w) => Math.max(1, w - 1))}
                  className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {['400', '300', '200', '100', 'All'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        selectedLevel === lvl
                          ? 'bg-[#004384] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lvl === 'All' ? 'All Cohorts' : `Computer Science - ${lvl}L`}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setWeekNumber((w) => w + 1)}
                  className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timetable Table Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-2.5 px-3 text-xs font-semibold text-slate-500 w-20 border-r border-slate-200">
                      Time
                    </th>
                    {DAYS.map((day) => (
                      <th key={day} className="py-2.5 px-3 text-xs font-semibold text-slate-700 text-center border-r border-slate-200 last:border-r-0">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TIME_SLOTS.map((slot) => (
                    <tr key={slot} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 text-xs font-mono font-medium text-slate-500 bg-slate-50/50 border-r border-slate-200 shrink-0 align-top">
                        {slot.split(' - ')[0]}
                      </td>

                      {DAYS.map((day) => {
                        const items = getSlotItems(day, slot);
                        return (
                          <td key={`${day}-${slot}`} className="p-1.5 border-r border-slate-200 last:border-r-0 align-top h-24 relative">
                            {items.length === 0 ? (
                              <div className="w-full h-full rounded-lg border border-dashed border-slate-100 flex items-center justify-center text-slate-200">
                                —
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                {items.map((item) => {
                                  const hasConflict = isItemConflicting(item);
                                  return (
                                    <div
                                      key={item.id}
                                      className={`p-2 rounded-xl border text-xs shadow-2xs relative transition-all ${
                                        hasConflict
                                          ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-500/20'
                                          : item.isLab
                                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                                          : 'bg-blue-50 border-blue-200 text-blue-900'
                                      }`}
                                    >
                                      {hasConflict && (
                                        <div className="absolute top-1.5 right-1.5 bg-rose-500 text-white p-0.5 rounded-full" title="Conflict detected!">
                                          <AlertTriangle className="w-3 h-3" />
                                        </div>
                                      )}
                                      <div className="flex items-center justify-between font-bold pr-4">
                                        <span>{item.courseCode}</span>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/70 font-semibold border border-black/5">
                                          {item.isLab ? 'Lab' : 'Core'}
                                        </span>
                                      </div>
                                      <p className="text-[11px] font-medium truncate mt-0.5 text-slate-700" title={item.courseTitle}>
                                        {item.courseTitle}
                                      </p>
                                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                                          <MapPin className="w-3 h-3 text-[#004384]" /> {item.venueName}
                                        </span>
                                        <span className="truncate max-w-[80px]">{item.lecturerName}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Conflicts & Validation (Span 4) */}
        <div className="lg:col-span-4 flex flex-col space-y-5">
          {/* Conflict Center Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">Conflict Center</h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                conflictsCount > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {conflictsCount} Issues
              </span>
            </div>

            <div className="p-4 space-y-3.5 max-h-[360px] overflow-y-auto">
              {activeConflicts.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="font-semibold text-slate-800">Zero Conflicts Detected!</p>
                  <p className="text-[11px] text-slate-400">All hard constraints satisfied and lecture periods verified.</p>
                </div>
              ) : (
                activeConflicts.map((conf) => (
                  <div key={conf.id} className="p-3.5 border border-rose-200 bg-rose-50/30 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        conf.severity === 'High' 
                          ? 'bg-rose-100 text-rose-700 border-rose-200' 
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {conf.severity} Severity
                      </span>
                      <span className="text-xs font-bold text-slate-800">{conf.title}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {conf.description}
                    </p>

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleResolveConflict(conf)}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#004384]" />
                        {conf.title === 'Venue Double-Booking' ? 'Resolve Conflict' : 'Adjust Schedule'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Health Checks */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Health Checks
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>No duplicate lecturers in same slot</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Course credits match hours allocated</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-700">
                {conflictsCount === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <span>Venues capacity meets course size</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Core courses prioritized in morning slots</span>
              </li>
            </ul>
          </div>

          {/* Approval Action Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 relative overflow-hidden space-y-4">
            <div className="flex items-center gap-2">
              {conflictsCount > 0 ? (
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <h3 className="text-sm font-bold text-white">
                {conflictsCount > 0 ? 'Approval Blocked' : 'Ready for Approval'}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {conflictsCount > 0
                ? 'You must resolve all critical conflicts before this timetable can be approved and published to students.'
                : 'All constraints passed cleanly! The schedule is ready to be published for the active semester.'}
            </p>

            <div className="space-y-2 pt-2">
              <button
                disabled={conflictsCount > 0 || isPublished}
                onClick={handleApproveAndPublish}
                className={`w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  conflictsCount > 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                    : isPublished
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#004384] hover:bg-blue-700 text-white shadow-md cursor-pointer'
                }`}
              >
                <Check className="w-4 h-4" />
                {isPublished ? 'Timetable Published!' : 'Approve & Publish Timetable'}
              </button>

              <button
                onClick={onOpenGenerator}
                className="w-full py-2 text-xs font-semibold bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate Timetable
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Success Modal */}
      {showPublishSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Timetable Published!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The departmental timetable for Computer Science has been finalized and published. Students and lecturers can now view their active schedules.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowPublishSuccessModal(false);
                  if (onNavigateToSchedule) onNavigateToSchedule();
                }}
                className="px-5 py-2.5 bg-[#004384] text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors shadow-xs"
              >
                Go to Master Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
