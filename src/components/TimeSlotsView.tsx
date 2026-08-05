import React, { useState, useMemo } from 'react';
import { TimeSlotConfig, Day } from '../types';
import { 
  Plus, 
  Search, 
  Grid, 
  Calendar, 
  Hourglass, 
  CheckCircle2, 
  Download, 
  X, 
  AlertTriangle, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Power,
  RotateCcw,
  Clock
} from 'lucide-react';

interface TimeSlotsViewProps {
  timeSlots: TimeSlotConfig[];
  onAddTimeSlot: (slot: TimeSlotConfig) => void;
  onUpdateTimeSlot: (slot: TimeSlotConfig) => void;
  onDeleteTimeSlot: (id: string) => void;
  onToggleStatus: (id: string) => void;
  globalSearchQuery?: string;
}

export const TimeSlotsView: React.FC<TimeSlotsViewProps> = ({
  timeSlots,
  onAddTimeSlot,
  onUpdateTimeSlot,
  onDeleteTimeSlot,
  onToggleStatus,
  globalSearchQuery = '',
}) => {
  // Filters & State
  const [localSearch, setLocalSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Drawer & Modal State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlotConfig | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form Fields
  const [formDay, setFormDay] = useState<Day | 'Saturday'>('Monday');
  const [formStartTime, setFormStartTime] = useState('08:00');
  const [formEndTime, setFormEndTime] = useState('10:00');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formNotes, setFormNotes] = useState('');

  // Combined search term
  const effectiveSearch = localSearch || globalSearchQuery;

  // Time conversion helpers
  const formatTime12h = (time24: string) => {
    if (!time24) return '';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    if (isNaN(h)) return time24;
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const formattedH = h < 10 ? `0${h}` : `${h}`;
    return `${formattedH}:${m} ${ampm}`;
  };

  const getMinutes = (time24: string) => {
    if (!time24) return 0;
    const [hStr, mStr] = time24.split(':');
    return (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0);
  };

  const calculateDurationHours = (start: string, end: string) => {
    const startMins = getMinutes(start);
    const endMins = getMinutes(end);
    if (endMins <= startMins) return 0;
    return Math.round(((endMins - startMins) / 60) * 10) / 10;
  };

  const currentDuration = calculateDurationHours(formStartTime, formEndTime);

  // Overlap Detection
  const overlapWarning = useMemo(() => {
    if (!formStartTime || !formEndTime) return null;
    const newStartMins = getMinutes(formStartTime);
    const newEndMins = getMinutes(formEndTime);

    if (newEndMins <= newStartMins) {
      return 'End time must be later than start time.';
    }

    const conflictingSlot = timeSlots.find((s) => {
      if (s.id === editingSlot?.id) return false;
      if (s.day !== formDay) return false;
      if (s.status !== 'Active') return false;

      const slotStartMins = getMinutes(s.startTime);
      const slotEndMins = getMinutes(s.endTime);

      return newStartMins < slotEndMins && newEndMins > slotStartMins;
    });

    if (conflictingSlot) {
      return `Overlap Detected: This time slot overlaps with an existing ${conflictingSlot.day} slot (${conflictingSlot.formattedTime}). Please adjust the times.`;
    }

    return null;
  }, [formDay, formStartTime, formEndTime, editingSlot, timeSlots]);

  // Open Drawer for Add/Edit
  const handleOpenAdd = () => {
    setEditingSlot(null);
    setFormDay('Monday');
    setFormStartTime('08:00');
    setFormEndTime('10:00');
    setFormStatus('Active');
    setFormNotes('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (slot: TimeSlotConfig) => {
    setEditingSlot(slot);
    setFormDay(slot.day);
    setFormStartTime(slot.startTime);
    setFormEndTime(slot.endTime);
    setFormStatus(slot.status);
    setFormNotes(slot.notes || '');
    setIsDrawerOpen(true);
    setActiveMenuId(null);
  };

  // Save Slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (getMinutes(formEndTime) <= getMinutes(formStartTime)) {
      alert('End time must be strictly after start time.');
      return;
    }

    const duration = calculateDurationHours(formStartTime, formEndTime);
    const startFormatted = formatTime12h(formStartTime);
    const endFormatted = formatTime12h(formEndTime);
    const formattedTime = `${startFormatted} - ${endFormatted}`;

    if (editingSlot) {
      const updated: TimeSlotConfig = {
        ...editingSlot,
        day: formDay,
        startTime: formStartTime,
        endTime: formEndTime,
        formattedTime,
        durationHours: duration,
        status: formStatus,
        notes: formNotes,
      };
      onUpdateTimeSlot(updated);
    } else {
      const created: TimeSlotConfig = {
        id: `ts-${Date.now()}`,
        day: formDay,
        startTime: formStartTime,
        endTime: formEndTime,
        formattedTime,
        durationHours: duration,
        status: formStatus,
        notes: formNotes,
      };
      onAddTimeSlot(created);
    }

    setIsDrawerOpen(false);
  };

  // Filtered List
  const filteredSlots = useMemo(() => {
    return timeSlots.filter((slot) => {
      const matchesSearch = 
        slot.day.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        slot.formattedTime.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
        (slot.notes && slot.notes.toLowerCase().includes(effectiveSearch.toLowerCase()));

      const matchesDay = selectedDay === 'All' || slot.day === selectedDay;
      const matchesStatus = selectedStatus === 'All' || slot.status === selectedStatus;

      return matchesSearch && matchesDay && matchesStatus;
    });
  }, [timeSlots, effectiveSearch, selectedDay, selectedStatus]);

  // KPIs
  const totalCount = timeSlots.length;
  const activeCount = timeSlots.filter((s) => s.status === 'Active').length;
  const distinctDays = new Set(timeSlots.map((s) => s.day)).size;
  const avgDuration = totalCount > 0 
    ? (timeSlots.reduce((sum, s) => sum + s.durationHours, 0) / totalCount).toFixed(0)
    : 2;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Day', 'Time Block', 'Start Time', 'End Time', 'Duration (hrs)', 'Status', 'Notes'];
    const csvRows = [
      headers.join(','),
      ...filteredSlots.map((s) => [
        `"${s.day}"`,
        `"${s.formattedTime}"`,
        `"${s.startTime}"`,
        `"${s.endTime}"`,
        s.durationHours,
        `"${s.status}"`,
        `"${s.notes || ''}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChronosCS_TimeSlots_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#004384]" /> Time Slots
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure the lecture periods available for timetable generation.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#004384] hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Time Slot
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Grid className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-semibold">Total Time Slots</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-semibold">Teaching Days</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{distinctDays}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Hourglass className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-semibold">Avg. Duration</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {avgDuration} <span className="text-sm font-medium text-slate-400">hrs</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-semibold">Active Slots</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{activeCount}</div>
        </div>
      </div>

      {/* Main Container: Toolbar + Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search slots..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004384] focus:border-[#004384]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#004384] focus:border-[#004384]"
            >
              <option value="All">All Days</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#004384] focus:border-[#004384]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {(selectedDay !== 'All' || selectedStatus !== 'All' || localSearch) && (
              <button
                onClick={() => {
                  setSelectedDay('All');
                  setSelectedStatus('All');
                  setLocalSearch('');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 flex items-center gap-1 border border-slate-200 rounded-xl bg-white"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}

            <div className="w-px h-6 bg-slate-300 mx-1"></div>

            <button
              onClick={handleExportCSV}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Block</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Duration</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                    No time slots found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSlots.map((slot) => {
                  const isActive = slot.status === 'Active';
                  return (
                    <tr 
                      key={slot.id} 
                      className={`hover:bg-slate-50 transition-colors ${
                        !isActive ? 'opacity-70 bg-slate-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-sm text-slate-900">
                        {slot.day}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-800 font-medium">
                        <div className="flex items-center gap-2">
                          <span>{slot.formattedTime}</span>
                          {slot.notes && (
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded truncate max-w-[150px]" title={slot.notes}>
                              {slot.notes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 hidden sm:table-cell font-mono">
                        {slot.durationHours} hrs
                      </td>
                      <td className="py-3.5 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === slot.id ? null : slot.id)}
                            className="text-slate-400 hover:text-[#004384] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === slot.id && (
                            <div className="origin-top-right absolute right-4 mt-1 w-40 rounded-xl bg-white shadow-lg border border-slate-200 z-30 py-1 text-xs">
                              <button
                                onClick={() => handleOpenEdit(slot)}
                                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                                Edit Time Slot
                              </button>
                              <button
                                onClick={() => {
                                  onToggleStatus(slot.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                              >
                                <Power className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-emerald-600'}`} />
                                {isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete time slot ${slot.day} (${slot.formattedTime})?`)) {
                                    onDeleteTimeSlot(slot.id);
                                  }
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-over Drawer (Add / Edit Time Slot) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-end backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">
                {editingSlot ? 'Edit Time Slot' : 'Add Time Slot'}
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Form */}
            <form onSubmit={handleSaveSlot} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Overlap / Validation Banner */}
              {overlapWarning && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-3 text-amber-800 items-start text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-slate-900 block mb-0.5">Time Block Notice:</strong>
                    <span>{overlapWarning}</span>
                  </div>
                </div>
              )}

              {/* Day of Week */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Day of Week
                </label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(e.target.value as Day | 'Saturday')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-[#004384] focus:border-[#004384]"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-[#004384] focus:border-[#004384]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    {formatTime12h(formStartTime)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    required
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 ${
                      overlapWarning ? 'border-amber-400 focus:ring-amber-500' : 'border-slate-300 focus:ring-[#004384]'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                    {formatTime12h(formEndTime)}
                  </span>
                </div>
              </div>

              {/* Calculated Duration */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Calculated Duration
                </label>
                <input
                  type="text"
                  disabled
                  value={currentDuration > 0 ? `${currentDuration} hours` : 'Invalid range'}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-semibold cursor-not-allowed"
                />
              </div>

              {/* Status Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Status
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formStatus === 'Active'}
                    onChange={(e) => setFormStatus(e.target.checked ? 'Active' : 'Inactive')}
                    className="rounded text-[#004384] border-slate-300 focus:ring-[#004384] h-4 w-4"
                  />
                  <span className="text-xs font-medium text-slate-700">Active (Available for Timetable)</span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Notes / Usage Tag (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g., Reserved for practical lab sessions..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-[#004384] focus:border-[#004384]"
                />
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#004384] text-white hover:bg-blue-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingSlot ? 'Update Time Slot' : 'Save Time Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
