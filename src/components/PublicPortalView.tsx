import React, { useState } from 'react';
import { 
  School, 
  Printer, 
  FileText, 
  Table, 
  Calendar, 
  Upload, 
  BookOpen, 
  MapPin, 
  Filter, 
  Search, 
  User, 
  Utensils, 
  Clock, 
  ArrowLeft, 
  Mail, 
  Phone,
  CheckCircle2,
  Sparkles,
  Download
} from 'lucide-react';

interface PublicPortalViewProps {
  onBackToAdmin?: () => void;
}

export const PublicPortalView: React.FC<PublicPortalViewProps> = ({ onBackToAdmin }) => {
  const [selectedSession, setSelectedSession] = useState('2026/2027');
  const [selectedSemester, setSelectedSemester] = useState('First Semester');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [viewMode, setViewMode] = useState('By Level (Default)');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = (format: 'print' | 'pdf' | 'excel') => {
    if (format === 'print') {
      window.print();
    } else {
      showToast(`Exporting timetable as ${format.toUpperCase()}...`);
    }
  };

  // Level colors
  const getLevelStyle = (level: string) => {
    switch (level) {
      case '100L':
      case '100':
        return 'border-l-4 border-blue-400 bg-blue-50/70 text-blue-900';
      case '200L':
      case '200':
        return 'border-l-4 border-amber-400 bg-amber-50/70 text-amber-900';
      case '300L':
      case '300':
        return 'border-l-4 border-emerald-500 bg-emerald-50/70 text-emerald-900';
      case '400L':
      case '400':
        return 'border-l-4 border-rose-500 bg-rose-50/70 text-rose-900';
      default:
        return 'border-l-4 border-purple-500 bg-purple-50/70 text-purple-900';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 static shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#004384] text-white rounded-xl flex items-center justify-center shadow-md">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                Computer Science Timetable Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Official Departmental Master Schedule • University of Port Harcourt
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {onBackToAdmin && (
              <button
                onClick={onBackToAdmin}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4 text-[#004384]" />
                Admin View
              </button>
            )}

            <button
              onClick={() => handleExport('print')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Print
            </button>

            <button
              onClick={() => handleExport('pdf')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              PDF
            </button>

            <button
              onClick={() => handleExport('excel')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs"
            >
              <Table className="w-3.5 h-3.5 text-emerald-600" />
              Excel
            </button>
          </div>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Summary Cards Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-[#004384] rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Session</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">{selectedSession}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
              <Upload className="w-5 h-5 text-[#004384]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Publication Date</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">24 July 2026</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Courses</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">42 Courses</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Venues in Use</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">12 Halls / Labs</span>
            </div>
          </div>
        </div>

        {/* Filter Section Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Session</label>
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-[#004384]"
              >
                <option value="2026/2027">2026/2027</option>
                <option value="2025/2026">2025/2026</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-[#004384]"
              >
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-[#004384]"
              >
                <option value="All Levels">All Levels</option>
                <option value="100 Level">100 Level</option>
                <option value="200 Level">200 Level</option>
                <option value="300 Level">300 Level</option>
                <option value="400 Level">400 Level</option>
                <option value="500 Level">500 Level</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">View Mode</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-[#004384]"
              >
                <option value="By Level (Default)">By Level (Default)</option>
                <option value="By Lecturer">By Lecturer</option>
                <option value="By Venue">By Venue</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => showToast('Filters applied')}
                className="w-full py-2 bg-[#004384] hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer h-[38px]"
              >
                <Filter className="w-3.5 h-3.5" />
                Apply Filters
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lecturer, course code (e.g. CSC201), course title, or venue..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
              />
            </div>
          </div>
        </div>

        {/* Master Timetable Grid Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Top Bar of Grid */}
          <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-black text-sm text-slate-900">Weekly Master Timetable Grid</h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-blue-400" /> 100L
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-amber-400" /> 200L
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> 300L
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-600">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> 400L
              </span>
            </div>
          </div>

          {/* Scrollable Schedule Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] w-full">
              {/* Timeline Header Row */}
              <div className="grid grid-cols-11 bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 text-center">
                <div className="p-3 border-r border-slate-200">Day / Time</div>
                <div className="p-3 border-r border-slate-200">08:00 - 09:00</div>
                <div className="p-3 border-r border-slate-200">09:00 - 10:00</div>
                <div className="p-3 border-r border-slate-200">10:00 - 11:00</div>
                <div className="p-3 border-r border-slate-200">11:00 - 12:00</div>
                <div className="p-3 border-r border-slate-200">12:00 - 13:00</div>
                <div className="p-3 border-r border-slate-200">13:00 - 14:00</div>
                <div className="p-3 border-r border-slate-200">14:00 - 15:00</div>
                <div className="p-3 border-r border-slate-200">15:00 - 16:00</div>
                <div className="p-3 border-r border-slate-200">16:00 - 17:00</div>
                <div className="p-3">17:00 - 18:00</div>
              </div>

              {/* MONDAY */}
              <div className="grid grid-cols-11 border-b border-slate-100 min-h-[96px] text-xs">
                <div className="p-3 font-black text-slate-800 bg-slate-50 flex items-center justify-center border-r border-slate-200">
                  Mon
                </div>

                {/* CSC201 (08:00 - 10:00, 2 hrs -> span 2) */}
                <div className="col-span-2 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('200L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">CSC201</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-amber-300">200L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Computer Programming I</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Dr. Amadi</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">LT1</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 p-1.5 border-r border-slate-100" />
                <div className="col-span-1 p-1.5 border-r border-slate-100" />

                {/* BREAK (12:00 - 13:00) */}
                <div className="col-span-1 p-1.5 border-r border-slate-100 bg-slate-100/50 flex flex-col items-center justify-center text-slate-400">
                  <Utensils className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Break</span>
                </div>

                {/* CSC401 (13:00 - 15:00, 2 hrs -> span 2) */}
                <div className="col-span-2 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('400L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">CSC401</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-rose-300">400L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Software Engineering</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Prof. Briggs</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">CS Lab 2</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-3 p-1.5" />
              </div>

              {/* TUESDAY */}
              <div className="grid grid-cols-11 border-b border-slate-100 min-h-[96px] text-xs">
                <div className="p-3 font-black text-slate-800 bg-slate-50 flex items-center justify-center border-r border-slate-200">
                  Tue
                </div>

                <div className="col-span-1 p-1.5 border-r border-slate-100" />

                {/* MTH110 (09:00 - 12:00, 3 hrs -> span 3) */}
                <div className="col-span-3 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('100L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">MTH110</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-blue-300">100L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Algebra and Trigonometry</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Dr. Okon</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">Ofrima Hall</span>
                    </div>
                  </div>
                </div>

                {/* BREAK */}
                <div className="col-span-1 p-1.5 border-r border-slate-100 bg-slate-100/50 flex flex-col items-center justify-center text-slate-400">
                  <Utensils className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Break</span>
                </div>

                <div className="col-span-1 p-1.5 border-r border-slate-100" />

                {/* CSC313 (14:00 - 16:00, 2 hrs -> span 2) */}
                <div className="col-span-2 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('300L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">CSC313</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-emerald-300">300L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Data Structures & Algorithms</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Dr. Nwafor</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">LT2</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 p-1.5" />
              </div>

              {/* WEDNESDAY */}
              <div className="grid grid-cols-11 border-b border-slate-100 min-h-[96px] text-xs">
                <div className="p-3 font-black text-slate-800 bg-slate-50 flex items-center justify-center border-r border-slate-200">
                  Wed
                </div>

                {/* CSC101 (08:00 - 10:00) */}
                <div className="col-span-2 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('100L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">CSC101</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-blue-300">100L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Intro to Computer Science</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Dr. Okeke</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">Ofrima Hall</span>
                    </div>
                  </div>
                </div>

                {/* CSC301 (10:00 - 12:00) */}
                <div className="col-span-2 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('300L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">CSC301</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-emerald-300">300L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Operating Systems</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Dr. E. Oti</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">LT1</span>
                    </div>
                  </div>
                </div>

                {/* BREAK */}
                <div className="col-span-1 p-1.5 border-r border-slate-100 bg-slate-100/50 flex flex-col items-center justify-center text-slate-400">
                  <Utensils className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Break</span>
                </div>

                <div className="col-span-2 p-1.5 border-r border-slate-100" />

                {/* CSC203 (15:00 - 17:00) */}
                <div className="col-span-2 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('200L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">CSC203</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-amber-300">200L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Discrete Structures</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Dr. Chukwu</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">LT2</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 p-1.5" />
              </div>

              {/* THURSDAY */}
              <div className="grid grid-cols-11 border-b border-slate-100 min-h-[96px] text-xs">
                <div className="p-3 font-black text-slate-800 bg-slate-50 flex items-center justify-center border-r border-slate-200">
                  Thu
                </div>

                <div className="col-span-2 p-1.5 border-r border-slate-100" />

                {/* CSC403 (10:00 - 12:00) */}
                <div className="col-span-2 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('400L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">CSC403</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-rose-300">400L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Artificial Intelligence</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Prof. Adebayo</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">CS Lab 1</span>
                    </div>
                  </div>
                </div>

                {/* BREAK */}
                <div className="col-span-1 p-1.5 border-r border-slate-100 bg-slate-100/50 flex flex-col items-center justify-center text-slate-400">
                  <Utensils className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Break</span>
                </div>

                {/* CSC205 (13:00 - 15:00) */}
                <div className="col-span-2 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('200L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">CSC205</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-amber-300">200L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Digital Logic Design</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Mary Briggs</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">Hardware Lab</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-4 p-1.5" />
              </div>

              {/* FRIDAY */}
              <div className="grid grid-cols-11 border-b border-slate-100 min-h-[96px] text-xs">
                <div className="p-3 font-black text-slate-800 bg-slate-50 flex items-center justify-center border-r border-slate-200">
                  Fri
                </div>

                {/* CSC305 (08:00 - 10:00) */}
                <div className="col-span-2 p-1.5 border-r border-slate-100">
                  <div className={`h-full rounded-xl p-2.5 flex flex-col justify-between shadow-2xs ${getLevelStyle('300L')}`}>
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sm">CSC305</span>
                        <span className="text-[9px] font-bold bg-white/80 px-1.5 py-0.5 rounded border border-emerald-300">300L</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-90 truncate mt-0.5">Database Management Systems</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
                      <span className="flex items-center gap-1 opacity-80"><User className="w-3 h-3" /> Dr. Chukwu</span>
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">CS Lab 2</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 p-1.5 border-r border-slate-100" />

                {/* BREAK */}
                <div className="col-span-1 p-1.5 border-r border-slate-100 bg-slate-100/50 flex flex-col items-center justify-center text-slate-400">
                  <Utensils className="w-4 h-4 mb-1" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Break</span>
                </div>

                <div className="col-span-6 p-1.5" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 text-right border-t border-slate-100 text-[11px] text-slate-400">
            Last updated: 24 July 2026, 14:30 GMT • Certified by Department of Computer Science, UNIPORT
          </div>
        </div>
      </main>

      {/* Footer Removed as requested */}
    </div>
  );
};
