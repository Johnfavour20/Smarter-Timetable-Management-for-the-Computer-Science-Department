import React, { useState } from 'react';
import { 
  Calendar, 
  Archive, 
  CheckCircle2, 
  Download, 
  GraduationCap, 
  UploadCloud, 
  Filter, 
  ArrowUpDown, 
  MoreVertical, 
  Eye, 
  FileText, 
  Table, 
  History, 
  Check, 
  X, 
  Info, 
  Sparkles,
  Search,
  Share2,
  FileSpreadsheet
} from 'lucide-react';
import { AcademicSession } from '../types';

interface PublishedTimetablesProps {
  sessions?: AcademicSession[];
  onNavigateToSchedule?: () => void;
  onOpenGenerator?: () => void;
  globalSearchQuery?: string;
}

interface TimetableVersion {
  id: string;
  version: string;
  session: string;
  semester: string;
  publishedDate: string;
  status: 'Current' | 'Archived';
  downloads: number;
  releaseNotes?: string;
}

const INITIAL_VERSIONS: TimetableVersion[] = [
  {
    id: 'v3.2',
    version: 'v3.2',
    session: '2026/2027',
    semester: 'First Semester',
    publishedDate: 'Jul 24, 2026',
    status: 'Current',
    downloads: 1243,
    releaseNotes: 'Resolved CS401 laboratory venue conflict and updated Dr. Briggs Thursday schedule.',
  },
  {
    id: 'v3.1',
    version: 'v3.1',
    session: '2026/2027',
    semester: 'First Semester',
    publishedDate: 'Jun 14, 2026',
    status: 'Archived',
    downloads: 850,
    releaseNotes: 'Initial draft version for First Semester 2026/2027.',
  },
  {
    id: 'v3.0',
    version: 'v3.0',
    session: '2025/2026',
    semester: 'Second Semester',
    publishedDate: 'Jan 10, 2026',
    status: 'Archived',
    downloads: 2150,
    releaseNotes: 'Final official schedule for Second Semester 2025/2026.',
  },
  {
    id: 'v2.9',
    version: 'v2.9',
    session: '2025/2026',
    semester: 'First Semester',
    publishedDate: 'Aug 18, 2025',
    status: 'Archived',
    downloads: 1980,
    releaseNotes: 'First semester final timetable.',
  },
];

export const PublishedTimetables: React.FC<PublishedTimetablesProps> = ({
  onNavigateToSchedule,
  onOpenGenerator,
  globalSearchQuery = '',
}) => {
  const [versions, setVersions] = useState<TimetableVersion[]>(INITIAL_VERSIONS);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('v3.2');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Publish drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [releaseNotes, setReleaseNotes] = useState<string>('');
  const [nextVersionTag, setNextVersionTag] = useState<string>('v3.3');

  // Filter versions based on search query
  const query = (searchQuery || globalSearchQuery).toLowerCase();
  const filteredVersions = versions.filter(
    (v) =>
      v.version.toLowerCase().includes(query) ||
      v.session.toLowerCase().includes(query) ||
      v.semester.toLowerCase().includes(query) ||
      v.status.toLowerCase().includes(query)
  );

  const selectedVersion = versions.find((v) => v.id === selectedVersionId) || versions[0];

  // Handle publishing a new version
  const handlePublishNewVersion = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Archive previous current versions
    const updated = versions.map((v) => ({
      ...v,
      status: 'Archived' as const,
    }));

    const newEntry: TimetableVersion = {
      id: nextVersionTag.toLowerCase().replace('.', '-'),
      version: nextVersionTag,
      session: '2026/2027',
      semester: 'First Semester',
      publishedDate: 'Just now',
      status: 'Current',
      downloads: 0,
      releaseNotes: releaseNotes || 'Official released timetable version.',
    };

    setVersions([newEntry, ...updated]);
    setSelectedVersionId(newEntry.id);
    setIsDrawerOpen(false);
    setReleaseNotes('');
    
    // Increment next tag
    const major = parseFloat(nextVersionTag.replace('v', '')) + 0.1;
    setNextVersionTag(`v${major.toFixed(1)}`);
  };

  const handleDownloadFile = (type: 'pdf' | 'excel' | 'txt') => {
    const content = `
CHRONOS CS - PUBLISHED TIMETABLE ${selectedVersion.version}
Session: ${selectedVersion.session} | Semester: ${selectedVersion.semester}
Published Date: ${selectedVersion.publishedDate}
Status: ${selectedVersion.status}
Downloads: ${selectedVersion.downloads}
Release Notes: ${selectedVersion.releaseNotes || 'N/A'}

--- COMPUTER SCIENCE DEPARTMENTAL TIMETABLE ---
CSC101 - Intro to Computing (Mon 08:00 - 10:00, Hall 1)
CSC201 - Data Structures (Tue 10:00 - 12:00, Lab A)
CSC301 - Operating Systems (Wed 12:00 - 14:00, Hall 2)
CSC401 - Software Engineering (Thu 08:00 - 10:00, LT1)
CSC413 - Artificial Intelligence (Fri 10:00 - 12:00, Lab B)
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chronos_CS_Timetable_${selectedVersion.version}.${type === 'excel' ? 'csv' : type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Published Timetables
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage official departmental timetables, version releases, and publication history.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="px-5 py-2.5 bg-[#004384] text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-800 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          Publish New Version
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#004384] mb-2">
            <span className="text-xs font-semibold text-slate-500">Published Timetables</span>
            <Archive className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900">{versions.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-semibold text-slate-500">Current Version</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {versions.find((v) => v.status === 'Current')?.version || 'v3.2'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Downloads</span>
            <Download className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900">
            {(versions.reduce((acc, v) => acc + v.downloads, 0) / 1000).toFixed(1)}k
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#004384] mb-2">
            <span className="text-xs font-semibold text-slate-500">Active Session</span>
            <GraduationCap className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-slate-900">2026/2027</p>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Repository Table (Span 8) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/50 gap-3">
              <h3 className="font-bold text-sm text-slate-900">Timetable Repository</h3>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search version..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#004384]"
                  />
                </div>
                <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Version</th>
                    <th className="px-4 py-3">Session</th>
                    <th className="px-4 py-3">Semester</th>
                    <th className="px-4 py-3">Published</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Downloads</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredVersions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No published timetables match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredVersions.map((v) => {
                      const isSelected = v.id === selectedVersionId;
                      return (
                        <tr
                          key={v.id}
                          onClick={() => setSelectedVersionId(v.id)}
                          className={`cursor-pointer transition-colors border-l-4 ${
                            isSelected
                              ? 'bg-blue-50/60 border-[#004384] font-medium'
                              : 'hover:bg-slate-50 border-transparent'
                          }`}
                        >
                          <td className="px-4 py-3.5 font-bold text-slate-900">{v.version}</td>
                          <td className="px-4 py-3.5 text-slate-600">{v.session}</td>
                          <td className="px-4 py-3.5 text-slate-600">{v.semester}</td>
                          <td className="px-4 py-3.5 text-slate-600">{v.publishedDate}</td>
                          <td className="px-4 py-3.5">
                            {v.status === 'Current' ? (
                              <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                Current
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                Archived
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">{v.downloads.toLocaleString()}</td>
                          <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => handleDownloadFile('pdf')}
                              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-[#004384] transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Panels (Span 4) */}
        <div className="lg:col-span-4 flex flex-col space-y-5">
          {/* Quick Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Quick Preview ({selectedVersion.version})
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-md">
                Read-only
              </span>
            </div>

            <div className="p-4 bg-slate-50">
              {/* Miniature Mock Timetable Grid */}
              <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-inner h-44 overflow-hidden pointer-events-none opacity-80 flex flex-col justify-between">
                <div className="grid grid-cols-5 gap-1 text-[9px] font-bold text-slate-400 text-center border-b pb-1">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 h-full pt-1">
                  <div className="bg-blue-100 rounded-sm p-1 text-[8px] font-bold text-blue-900">CSC401</div>
                  <div className="bg-slate-50 rounded-sm"></div>
                  <div className="bg-amber-100 rounded-sm p-1 text-[8px] font-bold text-amber-900">MTH401</div>
                  <div className="bg-slate-50 rounded-sm"></div>
                  <div className="bg-blue-100 rounded-sm p-1 text-[8px] font-bold text-blue-900">CSC413</div>

                  <div className="bg-slate-50 rounded-sm"></div>
                  <div className="bg-blue-100 rounded-sm p-1 text-[8px] font-bold text-blue-900">CSC301</div>
                  <div className="bg-slate-50 rounded-sm"></div>
                  <div className="bg-amber-100 rounded-sm p-1 text-[8px] font-bold text-amber-900">CSC410</div>
                  <div className="bg-slate-50 rounded-sm"></div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  if (onNavigateToSchedule) onNavigateToSchedule();
                }}
                className="w-full py-2 bg-[#004384] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-2xs cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                View Full Timetable Grid
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadFile('pdf')}
                  className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-500" />
                  PDF
                </button>
                <button
                  onClick={() => handleDownloadFile('excel')}
                  className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Excel
                </button>
              </div>
            </div>
          </div>

          {/* Publication Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Publication Timeline
            </h3>

            <div className="space-y-4 relative pl-2">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-200"></div>

              {versions.slice(0, 3).map((item, idx) => (
                <div key={item.id} className="flex gap-3 relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white ${
                      item.status === 'Current' ? 'bg-[#004384] text-white' : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {item.status === 'Current' ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <History className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {item.version} Published
                    </p>
                    <p className="text-[11px] text-slate-500">{item.publishedDate}</p>
                    {item.status === 'Current' && (
                      <p className="text-[10px] text-[#004384] font-bold mt-0.5">
                        Official Active Repository
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Publish Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Publish Slide-Out Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 border-l border-slate-200 flex flex-col ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-900">Publish Timetable</h2>
            <p className="text-xs text-slate-500">Finalize and release version {nextVersionTag}</p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <form onSubmit={handlePublishNewVersion} className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata</p>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Academic Session</span>
              <span className="font-bold text-slate-900">2026/2027</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Semester</span>
              <span className="font-bold text-slate-900">First Semester</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Release Version</span>
              <span className="font-bold text-[#004384] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {nextVersionTag}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validation Status</p>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Validation Success</p>
                <p className="text-[11px] text-emerald-700">All hard and soft rules satisfied</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">0 Conflicts Detected</p>
                <p className="text-[11px] text-slate-500">No overlapping lectures or double-booked venues</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900">Release Notes / Changelog</label>
            <textarea
              required
              rows={4}
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              placeholder="e.g., Added Friday afternoon laboratory sessions for CS201 and adjusted Dr. Briggs Thursday hours..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:ring-2 focus:ring-[#004384] focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#004384] shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-900 leading-relaxed">
              Publishing this will automatically set {nextVersionTag} as the active current version, archive the previous version, and update student views across Chronos CS.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#004384] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Publish Timetable ({nextVersionTag})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
