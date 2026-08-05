import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  BookOpen, 
  Users, 
  MapPin, 
  PieChart as PieChartIcon, 
  CheckCircle2, 
  UploadCloud, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  Lightbulb, 
  FileText, 
  Table as TableIcon, 
  Eye, 
  X, 
  ArrowRight, 
  Sparkles, 
  Check, 
  FileSpreadsheet,
  Building,
  RefreshCw,
  Search,
  ChevronDown
} from 'lucide-react';
import { AcademicSession, Lecturer, Venue, Course, ScheduleItem } from '../types';

interface ReportsViewProps {
  sessions?: AcademicSession[];
  lecturers?: Lecturer[];
  venues?: Venue[];
  courses?: Course[];
  schedules?: ScheduleItem[];
  globalSearchQuery?: string;
}

interface KeyInsight {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  text: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  sessions = [],
  lecturers = [],
  venues = [],
  courses = [],
  schedules = [],
  globalSearchQuery = '',
}) => {
  // Filter States
  const [selectedSession, setSelectedSession] = useState('2026/2027');
  const [selectedSemester, setSelectedSemester] = useState('First Semester');
  const [dateRange, setDateRange] = useState('Oct 1 - Jan 31');
  const [reportType, setReportType] = useState('Comprehensive Overview');

  // Export Drawer State
  const [isExportDrawerOpen, setIsExportDrawerOpen] = useState(false);
  const [exportReportType, setExportReportType] = useState('comprehensive');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(true);
  const [addCoverPage, setAddCoverPage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // View Report Modal State
  const [previewReportTitle, setPreviewReportTitle] = useState<string | null>(null);

  // AI Insights list
  const insights: KeyInsight[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High Venue Occupancy',
      text: 'LT1 (Large Lecture Theatre) is critically over-utilized at 96% capacity. Consider redistributing 100L general courses to LT2 or Hall 1.',
    },
    {
      id: '2',
      type: 'info',
      title: 'Peak Density Day',
      text: 'Wednesday has the highest lecture density (88% slot occupation), which may cause student and facility fatigue.',
    },
    {
      id: '3',
      type: 'warning',
      title: 'Workload Overflow',
      text: 'Dr. Briggs exceeds the departmental recommended maximum workload by 15% (23 hrs/week). Consider reallocating GST sessions.',
    },
    {
      id: '4',
      type: 'success',
      title: 'Optimal Lab Schedule',
      text: 'All Computer Science practical sessions are balanced across CS Lab A and Lab B with zero double-booking.',
    },
  ];

  // Lecturer Workload Data
  const workloadData = [
    { name: 'Dr. Briggs', hours: 23, max: 24, percent: 95, status: 'high' },
    { name: 'Dr. Okeke', hours: 17, max: 24, percent: 71, status: 'normal' },
    { name: 'Prof. Adebayo', hours: 16, max: 24, percent: 68, status: 'normal' },
    { name: 'Dr. Nwachukwu', hours: 20, max: 24, percent: 83, status: 'warning' },
    { name: 'Prof. Okafor', hours: 19, max: 24, percent: 79, status: 'normal' },
  ];

  // Venue Utilization Data
  const venueData = [
    { name: 'LT1 (Lecture Theatre 1)', capacity: 250, util: 95, color: 'bg-rose-500' },
    { name: 'Lab A (CS Main Lab)', capacity: 60, util: 88, color: 'bg-[#004384]' },
    { name: 'Lab B (AI Research Lab)', capacity: 40, util: 92, color: 'bg-amber-500' },
    { name: 'Room 204 (Classroom)', capacity: 80, util: 75, color: 'bg-blue-400' },
  ];

  // Course distribution data by level
  const levelDistribution = [
    { level: '100L', count: 12, percent: 40, color: 'bg-blue-200' },
    { level: '200L', count: 18, percent: 60, color: 'bg-blue-400' },
    { level: '300L', count: 24, percent: 100, color: 'bg-[#004384]' },
    { level: '400L', count: 15, percent: 50, color: 'bg-slate-900' },
  ];

  // Handle Export File Generation
  const handleGenerateExport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsExportDrawerOpen(false);

      // Trigger automatic text file download
      const content = `
======================================================
CHRONOS CS - DEPARTMENTAL ANALYTICS & REPORTS
Academic Session: ${selectedSession} | ${selectedSemester}
Date Generated: ${new Date().toLocaleDateString()}
Report Format: ${exportFormat.toUpperCase()}
Report Scope: ${exportReportType}
======================================================

1. SUMMARY KEY METRICS
- Total Courses Scheduled: 42
- Active Lecturers: 18
- Venues Utilized: 12
- Average Facility Occupancy Rate: 91%
- Total Conflicts Resolved: 18
- Published Timetable Versions: 7

2. LECTURER WORKLOAD ANALYSIS
${workloadData.map((l) => `- ${l.name}: ${l.hours}/${l.max} hrs (${l.percent}%)`).join('\n')}

3. VENUE UTILIZATION ANALYSIS
${venueData.map((v) => `- ${v.name} (Cap: ${v.capacity}): ${v.util}% utilization`).join('\n')}

4. KEY RECOMMENDATIONS & INSIGHTS
${insights.map((ins) => `* [${ins.type.toUpperCase()}] ${ins.title}: ${ins.text}`).join('\n')}
      `;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Chronos_CS_Analytics_Report_${exportFormat}.${exportFormat === 'excel' ? 'csv' : 'txt'}`;
      a.click();
      URL.revokeObjectURL(url);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#004384]" />
            Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor timetable performance, lecturer workload, venue utilization, and departmental scheduling insights.
          </p>
        </div>

        <button
          onClick={() => setIsExportDrawerOpen(true)}
          className="px-4 py-2.5 bg-[#004384] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Academic Session</label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#004384]"
          >
            <option>2026/2027</option>
            <option>2025/2026</option>
            <option>2024/2025</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#004384]"
          >
            <option>First Semester</option>
            <option>Second Semester</option>
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Date Range</label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#004384]"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#004384]"
          >
            <option>Comprehensive Overview</option>
            <option>Lecturer Specific</option>
            <option>Venue Utilization</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => {
              setSelectedSession('2026/2027');
              setSelectedSemester('First Semester');
              setReportType('Comprehensive Overview');
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Reset
          </button>
          <button className="px-4 py-2 bg-[#004384] hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer">
            Apply Filters
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#004384]" />
            Courses Scheduled
          </span>
          <span className="text-2xl font-black text-slate-900">42</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-[#004384]" />
            Lecturers
          </span>
          <span className="text-2xl font-black text-slate-900">18</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#004384]" />
            Venues
          </span>
          <span className="text-2xl font-black text-slate-900">12</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
            <PieChartIcon className="w-3.5 h-3.5 text-amber-500" />
            Occupancy Rate
          </span>
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-black text-slate-900">91%</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center mb-0.5">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2%
            </span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Conflicts Resolved
          </span>
          <span className="text-2xl font-black text-slate-900">18</span>
        </div>

        {/* KPI 6 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
            <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
            Published Versions
          </span>
          <span className="text-2xl font-black text-slate-900">7</span>
        </div>
      </div>

      {/* Main Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Span 8) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Top Row: Lecturer Workload & Venue Utilization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lecturer Workload */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#004384]" />
                  Lecturer Workload
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hrs / Wk</span>
              </div>

              <div className="space-y-3.5">
                {workloadData.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{item.name}</span>
                      <span className={item.percent >= 90 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {item.hours}h ({item.percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.percent >= 90
                            ? 'bg-rose-500'
                            : item.percent >= 80
                            ? 'bg-amber-500'
                            : 'bg-[#004384]'
                        }`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Utilization Ring */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#004384]" />
                  Venue Utilization
                </h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  91% Avg
                </span>
              </div>

              {/* Donut Chart Visual */}
              <div className="flex items-center justify-center my-2">
                <div className="w-32 h-32 rounded-full border-[14px] border-[#004384] border-t-rose-500 border-r-amber-500 relative flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <span className="block text-2xl font-black text-slate-900">91%</span>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Occupancy</span>
                  </div>
                </div>
              </div>

              {/* Venue Key Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {venueData.map((v) => (
                  <div key={v.name} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-sm ${v.color} shrink-0`}></span>
                    <span className="text-slate-700 font-medium truncate">{v.name.split(' ')[0]} ({v.util}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timetable Occupancy Heatmap Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Timetable Occupancy Density</h3>
                <p className="text-[11px] text-slate-500">Weekly schedule utilization heatmap across time slots</p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <span>Low Density</span>
                <div className="flex h-3 rounded overflow-hidden border border-slate-200">
                  <div className="w-3 bg-blue-100"></div>
                  <div className="w-3 bg-blue-300"></div>
                  <div className="w-3 bg-[#004384]"></div>
                  <div className="w-3 bg-slate-900"></div>
                </div>
                <span>High Density</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[500px] space-y-2">
                <div className="grid grid-cols-6 gap-2 text-[11px] font-bold text-slate-500 text-center">
                  <span></span>
                  <span>Monday</span>
                  <span>Tuesday</span>
                  <span>Wednesday</span>
                  <span>Thursday</span>
                  <span>Friday</span>
                </div>

                {[
                  { slot: '08:00', density: ['bg-[#004384]', 'bg-slate-900', 'bg-slate-900', 'bg-blue-300', 'bg-blue-100'] },
                  { slot: '10:00', density: ['bg-slate-900', 'bg-[#004384]', 'bg-slate-900', 'bg-[#004384]', 'bg-blue-300'] },
                  { slot: '12:00', density: ['bg-blue-300', 'bg-blue-100', 'bg-[#004384]', 'bg-blue-300', 'bg-blue-100'] },
                  { slot: '14:00', density: ['bg-[#004384]', 'bg-slate-900', 'bg-[#004384]', 'bg-[#004384]', 'bg-blue-100'] },
                  { slot: '16:00', density: ['bg-blue-100', 'bg-blue-300', 'bg-blue-300', 'bg-blue-100', 'bg-slate-100'] },
                ].map((row) => (
                  <div key={row.slot} className="grid grid-cols-6 gap-2 items-center">
                    <span className="text-xs font-mono font-semibold text-slate-500 text-right pr-2">{row.slot}</span>
                    {row.density.map((bg, idx) => (
                      <div
                        key={idx}
                        className={`h-9 rounded-xl ${bg} transition-all hover:scale-102 hover:shadow-xs cursor-pointer flex items-center justify-center text-[10px] font-bold text-white/80`}
                        title={`Slot occupancy level`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 4) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Key Insights Panel */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
              <h3 className="font-bold text-sm text-white">AI Key Insights</h3>
            </div>

            <div className="space-y-3">
              {insights.map((item) => (
                <div key={item.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                      item.type === 'warning'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : item.type === 'info'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Course Distribution Bar Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex-1 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Course Distribution by Cohort</h3>
              <p className="text-[11px] text-slate-500">Active assigned courses per academic level</p>
            </div>

            <div className="flex items-end justify-between gap-3 pt-6 pb-2 h-44">
              {levelDistribution.map((item) => (
                <div key={item.level} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-xs font-bold text-slate-800 opacity-80 group-hover:opacity-100">
                    {item.count}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full ${item.color} rounded-t-xl transition-all duration-500 group-hover:brightness-110`}
                      style={{ height: `${item.percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700">{item.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report Library Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">Report Library</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004384] flex items-center justify-center shrink-0 font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Lecturer Workload Report</h4>
                <p className="text-xs text-slate-500 mt-0.5">Detailed hours and course assignments per lecturer.</p>
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setPreviewReportTitle('Lecturer Workload Report')}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button
                onClick={() => handleGenerateExport()}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" /> PDF
              </button>
              <button
                onClick={() => handleGenerateExport()}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004384] flex items-center justify-center shrink-0 font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Venue Utilization Report</h4>
                <p className="text-xs text-slate-500 mt-0.5">Capacity vs actual usage analysis for all spaces.</p>
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setPreviewReportTitle('Venue Utilization Report')}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button
                onClick={() => handleGenerateExport()}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" /> PDF
              </button>
              <button
                onClick={() => handleGenerateExport()}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004384] flex items-center justify-center shrink-0 font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Course Allocation Report</h4>
                <p className="text-xs text-slate-500 mt-0.5">Summary of assigned vs unassigned courses by level.</p>
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setPreviewReportTitle('Course Allocation Report')}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
              <button
                onClick={() => handleGenerateExport()}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" /> PDF
              </button>
              <button
                onClick={() => handleGenerateExport()}
                className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Report Drawer Overlay */}
      {isExportDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setIsExportDrawerOpen(false)}
        />
      )}

      {/* Export Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 border-l border-slate-200 flex flex-col ${
          isExportDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#004384]" />
            <h2 className="text-base font-black text-slate-900">Export Report</h2>
          </div>
          <button
            onClick={() => setIsExportDrawerOpen(false)}
            className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Report Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900">Report Selection</label>
            <div className="space-y-2">
              {[
                { id: 'comprehensive', label: 'Comprehensive Overview' },
                { id: 'lecturer', label: 'Lecturer Workload Only' },
                { id: 'venue', label: 'Venue Utilization Only' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setExportReportType(opt.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    exportReportType === opt.id
                      ? 'border-[#004384] bg-blue-50/60 font-bold text-[#004384]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    checked={exportReportType === opt.id}
                    onChange={() => setExportReportType(opt.id)}
                    className="text-[#004384]"
                  />
                  <span className="text-xs">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Format Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900">Format Options</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pdf', label: 'PDF', icon: FileText, color: 'text-rose-500' },
                { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'text-emerald-600' },
                { id: 'csv', label: 'CSV', icon: TableIcon, color: 'text-blue-600' },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSel = exportFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportFormat(fmt.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSel
                        ? 'border-[#004384] bg-blue-50 text-[#004384] font-bold shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${fmt.color}`} />
                    <span className="text-xs">{fmt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inclusions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900">Inclusions</label>
            <div className="space-y-2 text-xs text-slate-700">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="rounded text-[#004384]"
                />
                <span>Include Charts & Visualizations</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRawData}
                  onChange={(e) => setIncludeRawData(e.target.checked)}
                  className="rounded text-[#004384]"
                />
                <span>Include Raw Data Tables</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addCoverPage}
                  onChange={(e) => setAddCoverPage(e.target.checked)}
                  className="rounded text-[#004384]"
                />
                <span>Add Cover Page with Department Branding</span>
              </label>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button
            onClick={() => setIsExportDrawerOpen(false)}
            className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateExport}
            disabled={isGenerating}
            className="flex-1 py-2.5 bg-[#004384] hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Export'}
          </button>
        </div>
      </div>

      {/* Preview Report Modal */}
      {previewReportTitle && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">{previewReportTitle}</h3>
                <p className="text-xs text-slate-500">Department of Computer Science • Session {selectedSession}</p>
              </div>
              <button
                onClick={() => setPreviewReportTitle(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span>Generated Date: {new Date().toLocaleDateString()}</span>
                <span className="font-bold text-[#004384]">Status: Verified</span>
              </div>

              <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2 border-b">Item / Subject</th>
                    <th className="p-2 border-b">Allocated Hours</th>
                    <th className="p-2 border-b">Capacity / Max</th>
                    <th className="p-2 border-b">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr><td className="p-2">Dr. Briggs (CSC401, CSC301)</td><td className="p-2">23 hrs/wk</td><td className="p-2">24 hrs</td><td className="p-2 font-bold text-rose-600">95%</td></tr>
                  <tr><td className="p-2">Dr. Okeke (CSC201)</td><td className="p-2">17 hrs/wk</td><td className="p-2">24 hrs</td><td className="p-2 font-bold text-slate-800">71%</td></tr>
                  <tr><td className="p-2">Prof. Adebayo (CSC101)</td><td className="p-2">16 hrs/wk</td><td className="p-2">24 hrs</td><td className="p-2 font-bold text-slate-800">68%</td></tr>
                  <tr><td className="p-2">LT1 (Lecture Theatre)</td><td className="p-2">38 hrs/wk</td><td className="p-2">40 hrs</td><td className="p-2 font-bold text-rose-600">95%</td></tr>
                  <tr><td className="p-2">Lab A (CS Practical Lab)</td><td className="p-2">35 hrs/wk</td><td className="p-2">40 hrs</td><td className="p-2 font-bold text-blue-800">88%</td></tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setPreviewReportTitle(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setPreviewReportTitle(null);
                  handleGenerateExport();
                }}
                className="px-4 py-2 bg-[#004384] text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
