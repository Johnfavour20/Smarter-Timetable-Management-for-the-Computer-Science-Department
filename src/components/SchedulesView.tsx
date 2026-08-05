import React, { useState } from 'react';
import { ScheduleItem, Level, Day, TimeSlot, Course, Lecturer, Venue } from '../types';
import { 
  Filter, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Move, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  User, 
  Sparkles,
  X,
  Clock
} from 'lucide-react';

interface SchedulesViewProps {
  schedules: ScheduleItem[];
  courses: Course[];
  lecturers: Lecturer[];
  venues: Venue[];
  onAddSchedule: (newItem: Omit<ScheduleItem, 'id'>) => void;
  onUpdateSchedule: (updated: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
  onOpenGenerator: () => void;
  searchQuery: string;
}

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS: TimeSlot[] = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
];

export const SchedulesView: React.FC<SchedulesViewProps> = ({
  schedules,
  courses,
  lecturers,
  venues,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onOpenGenerator,
  searchQuery,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedVenue, setSelectedVenue] = useState<string>('All');
  const [selectedLecturer, setSelectedLecturer] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string>('All');

  // Modal State
  const [activeSlot, setActiveSlot] = useState<{ day: Day; timeSlot: TimeSlot } | null>(null);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New slot form state
  const [formCourseId, setFormCourseId] = useState('');
  const [formVenueId, setFormVenueId] = useState('');
  const [formLecturerId, setFormLecturerId] = useState('');
  const [formDay, setFormDay] = useState<Day>('Monday');
  const [formTimeSlot, setFormTimeSlot] = useState<TimeSlot>('08:00 - 10:00');

  // Filter schedules
  const filteredSchedules = schedules.filter((item) => {
    if (selectedLevel !== 'All' && item.level !== selectedLevel) return false;
    if (selectedVenue !== 'All' && item.venueId !== selectedVenue) return false;
    if (selectedLecturer !== 'All' && item.lecturerId !== selectedLecturer) return false;
    if (selectedDay !== 'All' && item.day !== selectedDay) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.courseCode.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q) ||
        item.lecturerName.toLowerCase().includes(q) ||
        item.venueName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getSlotItems = (day: Day, timeSlot: TimeSlot) => {
    return filteredSchedules.filter((s) => s.day === day && s.timeSlot === timeSlot);
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find((c) => c.id === formCourseId);
    const lecturer = lecturers.find((l) => l.id === formLecturerId);
    const venue = venues.find((v) => v.id === formVenueId);

    if (!course || !lecturer || !venue) return;

    onAddSchedule({
      courseCode: course.code,
      courseTitle: course.title,
      lecturerId: lecturer.id,
      lecturerName: lecturer.name,
      venueId: venue.id,
      venueName: venue.name,
      day: formDay,
      timeSlot: formTimeSlot,
      level: course.level,
      studentCount: course.enrolledStudents,
      isLab: course.requiresLab,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#0F5BAA]" />
              Master Departmental Timetable
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Weekly scheduled lectures & practical lab sessions for Computer Science.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenGenerator}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
              AI Timetable Solver
            </button>
            <button
              onClick={() => {
                setFormDay('Monday');
                setFormTimeSlot('08:00 - 10:00');
                if (courses.length) setFormCourseId(courses[0].id);
                if (lecturers.length) setFormLecturerId(lecturers[0].id);
                if (venues.length) setFormVenueId(venues[0].id);
                setIsAddModalOpen(true);
              }}
              className="bg-[#0F5BAA] hover:bg-[#0d4d8f] text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Class Slot
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 px-1 font-medium">Level:</span>
            {['All', '100', '200', '300', '400'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-[#0F5BAA] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'All' ? 'All Levels' : `${lvl}L`}
              </button>
            ))}
          </div>

          {/* Venue Selector */}
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F5BAA]/30 text-xs font-medium"
          >
            <option value="All">All Venues</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          {/* Lecturer Selector */}
          <select
            value={selectedLecturer}
            onChange={(e) => setSelectedLecturer(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F5BAA]/30 text-xs font-medium"
          >
            <option value="All">All Staff</option>
            {lecturers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Day Selector */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F5BAA]/30 text-xs font-medium"
          >
            <option value="All">All Days (Mon-Fri)</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {(selectedLevel !== 'All' || selectedVenue !== 'All' || selectedLecturer !== 'All' || selectedDay !== 'All') && (
            <button
              onClick={() => {
                setSelectedLevel('All');
                setSelectedVenue('All');
                setSelectedLecturer('All');
                setSelectedDay('All');
              }}
              className="text-xs text-red-600 font-semibold hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Master Timetable Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs min-w-[900px]">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700">
                <th className="p-3.5 font-bold w-32 border-r border-slate-200">Time Slot</th>
                {DAYS.map((day) => (
                  <th key={day} className="p-3.5 font-bold text-center border-r border-slate-200 last:border-r-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {TIME_SLOTS.map((slot) => (
                <tr key={slot} className="hover:bg-slate-50/40 transition-colors">
                  {/* Time Slot Column */}
                  <td className="p-3.5 font-bold text-slate-700 bg-slate-50/80 border-r border-slate-200 shrink-0 align-top">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0F5BAA]" />
                      <span>{slot}</span>
                    </div>
                  </td>

                  {/* Day Columns */}
                  {DAYS.map((day) => {
                    const items = getSlotItems(day, slot);
                    const isOverbooked = items.length > 1;

                    return (
                      <td
                        key={`${day}-${slot}`}
                        className={`p-2 border-r border-slate-200 last:border-r-0 align-top h-28 relative transition-all ${
                          isOverbooked ? 'bg-red-50/40' : ''
                        }`}
                      >
                        {items.length === 0 ? (
                          <div
                            onClick={() => {
                              setFormDay(day);
                              setFormTimeSlot(slot);
                              if (courses.length) setFormCourseId(courses[0].id);
                              if (lecturers.length) setFormLecturerId(lecturers[0].id);
                              if (venues.length) setFormVenueId(venues[0].id);
                              setIsAddModalOpen(true);
                            }}
                            className="w-full h-full border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 hover:border-[#0F5BAA] hover:text-[#0F5BAA] hover:bg-blue-50/20 transition-all cursor-pointer group"
                          >
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => setEditingItem(item)}
                                className={`p-2 rounded-lg border text-xs shadow-2xs cursor-pointer transition-all hover:scale-[1.02] ${
                                  item.level === '100'
                                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                                    : item.level === '200'
                                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                                    : item.level === '300'
                                    ? 'bg-purple-50 border-purple-200 text-purple-900'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                }`}
                              >
                                <div className="flex items-center justify-between font-bold">
                                  <span>{item.courseCode}</span>
                                  <span className="text-[9px] px-1.5 py-0.2 bg-white/80 rounded border border-black/10">
                                    {item.level}L
                                  </span>
                                </div>
                                <div className="text-[11px] font-medium truncate mt-0.5" title={item.courseTitle}>
                                  {item.courseTitle}
                                </div>
                                <div className="flex items-center justify-between text-[10px] opacity-80 mt-1">
                                  <span className="truncate">{item.lecturerName}</span>
                                  <span className="font-semibold shrink-0">{item.venueName}</span>
                                </div>
                              </div>
                            ))}
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

      {/* Item Detail / Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#0F5BAA] bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                  Class Inspector
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{editingItem.courseCode}: {editingItem.courseTitle}</h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500">Day & Time:</span>
                <span className="font-bold text-slate-900">{editingItem.day} • {editingItem.timeSlot}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500">Assigned Lecturer:</span>
                <span className="font-bold text-slate-900">{editingItem.lecturerName}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500">Venue Allocated:</span>
                <span className="font-bold text-slate-900">{editingItem.venueName}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500">Enrolled Students:</span>
                <span className="font-bold text-slate-900">{editingItem.studentCount} students</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  onDeleteSchedule(editingItem.id);
                  setEditingItem(null);
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-4 py-2 rounded-lg border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Slot
              </button>

              <button
                onClick={() => setEditingItem(null)}
                className="bg-[#0F5BAA] hover:bg-[#0d4d8f] text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Schedule Class Slot</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Course</label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#0F5BAA]/30 focus:border-[#0F5BAA]"
                  required
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title} ({c.level}L)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assign Lecturer</label>
                  <select
                    value={formLecturerId}
                    onChange={(e) => setFormLecturerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#0F5BAA]/30"
                    required
                  >
                    {lecturers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Allocate Venue</label>
                  <select
                    value={formVenueId}
                    onChange={(e) => setFormVenueId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#0F5BAA]/30"
                    required
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} (Cap: {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Day</label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as Day)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Time Slot</label>
                  <select
                    value={formTimeSlot}
                    onChange={(e) => setFormTimeSlot(e.target.value as TimeSlot)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F5BAA] hover:bg-[#0d4d8f] text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
