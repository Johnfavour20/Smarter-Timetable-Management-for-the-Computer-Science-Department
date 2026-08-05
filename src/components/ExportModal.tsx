import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { Download, Share2, FileText, FileSpreadsheet, Calendar, Link, Check, X } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedules: ScheduleItem[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, schedules }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const publicUrl = "https://chronoscs.uniport.edu.ng/public/timetable-2023-sem1";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateDownload = (format: string) => {
    setDownloadingFormat(format);
    setTimeout(() => {
      setDownloadingFormat(null);
      // Generate standard CSV download if CSV requested
      if (format === 'CSV') {
        const headers = ["Course Code", "Course Title", "Lecturer", "Venue", "Day", "Time Slot", "Level"];
        const rows = schedules.map(s => [
          s.courseCode,
          `"${s.courseTitle}"`,
          `"${s.lecturerName}"`,
          `"${s.venueName}"`,
          s.day,
          s.timeSlot,
          `${s.level}L`
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "UniPort_CS_Timetable.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(`${format} schedule exported successfully!`);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-[#0F5BAA] rounded-lg">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Export & Publish Timetable</h3>
              <p className="text-xs text-slate-500">University of Port Harcourt CS Department</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formats Grid */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-700">Choose Export Format:</span>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => handleSimulateDownload('PDF')}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0F5BAA] rounded-xl text-left transition-all flex flex-col gap-2 group cursor-pointer"
            >
              <div className="p-2 bg-red-100 text-red-600 rounded-lg w-fit group-hover:bg-[#0F5BAA] group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Printable PDF</div>
                <div className="text-[10px] text-slate-500">Official noticeboard layout</div>
              </div>
            </button>

            <button
              onClick={() => handleSimulateDownload('CSV')}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0F5BAA] rounded-xl text-left transition-all flex flex-col gap-2 group cursor-pointer"
            >
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg w-fit group-hover:bg-[#0F5BAA] group-hover:text-white transition-colors">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">CSV Spreadsheet</div>
                <div className="text-[10px] text-slate-500">Import to Excel or Google Sheets</div>
              </div>
            </button>

            <button
              onClick={() => handleSimulateDownload('iCal')}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0F5BAA] rounded-xl text-left transition-all flex flex-col gap-2 group cursor-pointer"
            >
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg w-fit group-hover:bg-[#0F5BAA] group-hover:text-white transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">iCal Calendar</div>
                <div className="text-[10px] text-slate-500">Sync with Google Calendar / Outlook</div>
              </div>
            </button>

            <button
              onClick={() => handleSimulateDownload('JSON')}
              className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0F5BAA] rounded-xl text-left transition-all flex flex-col gap-2 group cursor-pointer"
            >
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg w-fit group-hover:bg-[#0F5BAA] group-hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Raw JSON Data</div>
                <div className="text-[10px] text-slate-500">Database backup archive</div>
              </div>
            </button>
          </div>
        </div>

        {/* Student Portal Link Share */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700">Public Portal Shareable Link:</span>
          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 text-xs">
            <Link className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="bg-transparent text-slate-600 w-full focus:outline-none font-mono text-[11px]"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1 bg-[#0F5BAA] text-white font-semibold rounded-lg shrink-0 transition-all text-xs flex items-center gap-1 active:scale-95"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                'Copy Link'
              )}
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
