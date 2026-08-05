import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Calendar, 
  ShieldCheck, 
  Bell, 
  Database, 
  Info, 
  Save, 
  RefreshCw, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Lock, 
  Download, 
  Check,
  Building,
  School,
  Mail,
  HelpCircle
} from 'lucide-react';

interface SystemSettingsViewProps {
  onSaveSuccess?: () => void;
}

export const SystemSettingsView: React.FC<SystemSettingsViewProps> = ({ onSaveSuccess }) => {
  const [activeSection, setActiveSection] = useState<'general' | 'academic' | 'rules' | 'notifications' | 'security' | 'backup' | 'system'>('general');

  // General Settings
  const [deptName, setDeptName] = useState('Computer Science');
  const [university, setUniversity] = useState('University of Port Harcourt');
  const [contactEmail, setContactEmail] = useState('admin@cs.uniport.edu.ng');
  const [faculty, setFaculty] = useState('Faculty of Computing & Physical Sciences');

  // Academic Configuration
  const [currentSession, setCurrentSession] = useState('2026/2027');
  const [activeSemester, setActiveSemester] = useState('First Semester');
  const [maxStudentCreditLoad, setMaxStudentCreditLoad] = useState('24');
  const [minStudentCreditLoad, setMinStudentCreditLoad] = useState('15');

  // Timetable Rules
  const [maxLecturesPerDay, setMaxLecturesPerDay] = useState(4);
  const [conflictTolerance, setConflictTolerance] = useState('strict');
  const [consecutiveLimitHours, setConsecutiveLimitHours] = useState(3);
  const [defaultDurationMinutes, setDefaultDurationMinutes] = useState<45 | 60 | 120>(60);
  const [allowWeekendScheduling, setAllowWeekendScheduling] = useState(false);

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [collisionNotifs, setCollisionNotifs] = useState(true);
  const [publishPushNotifs, setPublishPushNotifs] = useState(true);

  // Security
  const [mfaMandatory, setMfaMandatory] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState('30');
  const [ipWhitelist, setIpWhitelist] = useState('10.201.0.0/16, 192.168.1.0/24');

  // UI state
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>('Settings Updated Successfully');
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('System settings saved successfully');
      if (onSaveSuccess) onSaveSuccess();
    }, 600);
  };

  const handleDiscard = () => {
    setDeptName('Computer Science');
    setUniversity('University of Port Harcourt');
    setContactEmail('admin@cs.uniport.edu.ng');
    setMaxLecturesPerDay(4);
    setConflictTolerance('strict');
    setConsecutiveLimitHours(3);
    setDefaultDurationMinutes(60);
    showToast('Changes discarded');
  };

  return (
    <div className="space-y-6">
      {/* Success / Alert Banner */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-emerald-500 hover:text-emerald-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#004384]" />
            System Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure departmental preferences, timetable defaults, security, and engine rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDiscard}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-4 py-2.5 bg-[#004384] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Settings Card Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row min-h-[580px] overflow-hidden">
        {/* Left Side Navigation */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/60 p-3 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {[
              { id: 'general', label: 'General', icon: Sliders },
              { id: 'academic', label: 'Academic Config', icon: Calendar },
              { id: 'rules', label: 'Timetable Rules', icon: Settings },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: ShieldCheck },
              { id: 'backup', label: 'Backup & Recovery', icon: Database },
              { id: 'system', label: 'System Info', icon: Info },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#004384] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* SECTION: GENERAL */}
          {activeSection === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">General Information</h2>
                <p className="text-xs text-slate-500">Basic identification and contact details for the Department of Computer Science.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Department Name</label>
                  <input
                    type="text"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">University</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-700">Faculty / College</label>
                  <input
                    type="text"
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-700">Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>
              </div>

              {/* Logo Card */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-4 hover:border-[#004384] transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs group-hover:border-[#004384] transition-colors shrink-0">
                  <School className="w-8 h-8 text-[#004384]" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xs font-bold text-slate-900">Department Crest / Logo</h3>
                  <p className="text-[11px] text-slate-500">PNG, JPG up to 2MB. Displayed on public portal and exported PDFs.</p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Logo upload triggered')}
                  className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-slate-700 font-bold text-xs hover:border-[#004384] transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload New
                </button>
              </div>
            </div>
          )}

          {/* SECTION: ACADEMIC CONFIGURATION */}
          {activeSection === 'academic' && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">Academic Session Defaults</h2>
                <p className="text-xs text-slate-500">Set default parameters for active teaching sessions and student credit limits.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Active Academic Session</label>
                  <select
                    value={currentSession}
                    onChange={(e) => setCurrentSession(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-[#004384]"
                  >
                    <option value="2026/2027">2026/2027 Academic Session</option>
                    <option value="2025/2026">2025/2026 Academic Session</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Active Semester</label>
                  <select
                    value={activeSemester}
                    onChange={(e) => setActiveSemester(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-[#004384]"
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Max Student Credit Load</label>
                  <input
                    type="number"
                    value={maxStudentCreditLoad}
                    onChange={(e) => setMaxStudentCreditLoad(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Min Student Credit Load</label>
                  <input
                    type="number"
                    value={minStudentCreditLoad}
                    onChange={(e) => setMinStudentCreditLoad(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: TIMETABLE RULES */}
          {activeSection === 'rules' && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">Timetable Rules & Engine Constraints</h2>
                <p className="text-xs text-slate-500">Global constraints used by Chronos AI solver for automated schedule generation.</p>
              </div>

              {/* Styled Card for Engine Controls */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 shadow-2xs space-y-5 text-xs">
                {/* Range Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-800">Max Lectures per Level per Day</label>
                    <span className="font-mono font-bold bg-[#004384] text-white px-2 py-0.5 rounded-md text-[11px]">
                      {maxLecturesPerDay} lectures
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={maxLecturesPerDay}
                    onChange={(e) => setMaxLecturesPerDay(Number(e.target.value))}
                    className="w-full accent-[#004384] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>1 lecture</span>
                    <span>8 lectures</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Conflict Tolerance</label>
                    <select
                      value={conflictTolerance}
                      onChange={(e) => setConflictTolerance(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-[#004384] shadow-2xs"
                    >
                      <option value="strict">Strict (0 Overlaps Allowed)</option>
                      <option value="moderate">Moderate (Soft Venue Conflicts)</option>
                      <option value="flexible">Flexible (Draft Testing)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">Consecutive Lecture Limit (Hours)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={consecutiveLimitHours}
                      onChange={(e) => setConsecutiveLimitHours(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-[#004384] shadow-2xs"
                    />
                  </div>
                </div>

                {/* Duration Button Toggle */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 block">Default Slot Duration (Minutes)</label>
                  <div className="flex bg-slate-200/70 p-1 rounded-xl gap-1">
                    {[45, 60, 120].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setDefaultDurationMinutes(dur as any)}
                        className={`flex-1 py-1.5 text-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
                          defaultDurationMinutes === dur
                            ? 'bg-white shadow-xs text-[#004384]'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {dur} mins
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Engine Warning Trigger */}
                <div className="pt-3 border-t border-slate-200/80 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowConfirmationDialog(true)}
                    className="text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Advanced Engine Tuning
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">Notification Preferences</h2>
                <p className="text-xs text-slate-500">Manage automated system alerts and publication broadcasts.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Email Schedule Alerts</span>
                    <span className="text-[11px] text-slate-500">Send automatic emails when a draft schedule is modified.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-[#004384] focus:ring-[#004384] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Real-time Collision Warning</span>
                    <span className="text-[11px] text-slate-500">Notify admins immediately when lecturer or venue overlap occurs.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={collisionNotifs}
                    onChange={(e) => setCollisionNotifs(e.target.checked)}
                    className="w-4 h-4 rounded text-[#004384] focus:ring-[#004384] cursor-pointer"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Timetable Publication Broadcast</span>
                    <span className="text-[11px] text-slate-500">Notify students & faculty on public portal release.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={publishPushNotifs}
                    onChange={(e) => setPublishPushNotifs(e.target.checked)}
                    className="w-4 h-4 rounded text-[#004384] focus:ring-[#004384] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: SECURITY */}
          {activeSection === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">Security & Access Policy</h2>
                <p className="text-xs text-slate-500">Set administrative security constraints and session timeouts.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Enforce Multi-Factor Auth (2FA)</label>
                  <select
                    value={mfaMandatory ? 'yes' : 'no'}
                    onChange={(e) => setMfaMandatory(e.target.value === 'yes')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800"
                  >
                    <option value="yes">Mandatory for All Admins</option>
                    <option value="no">Optional</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Session Inactivity Timeout</label>
                  <select
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-700">Admin Subnet / IP Whitelist</label>
                  <input
                    type="text"
                    value={ipWhitelist}
                    onChange={(e) => setIpWhitelist(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION: BACKUP & RECOVERY */}
          {activeSection === 'backup' && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">Database Backup & System Recovery</h2>
                <p className="text-xs text-slate-500">Export departmental records or restore system configurations.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Download Full System Backup</span>
                    <span className="text-[11px] text-slate-500">Export JSON archive containing courses, lecturers, venues, and schedules.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('System backup downloaded (.json)')}
                    className="px-4 py-2 bg-[#004384] text-white font-bold rounded-xl shadow-2xs hover:bg-blue-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Export Data
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Automatic Cloud Snapshots</span>
                    <span className="text-[11px] text-slate-500">Daily midnight snapshot to isolated Cloud Run storage.</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                    Enabled
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: SYSTEM INFO */}
          {activeSection === 'system' && (
            <div className="space-y-6 max-w-2xl">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">System Diagnostics & Environment Specs</h2>
                <p className="text-xs text-slate-500">Technical telemetry for Chronos CS deployment.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Chronos Platform</span>
                  <span className="font-black text-slate-900 text-sm">v2.4 (Enterprise)</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">AI Solver Engine</span>
                  <span className="font-black text-emerald-600 text-sm">Gemini 2.5 Active</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Runtime Container</span>
                  <span className="font-bold text-slate-800">Cloud Run (0.0.0.0:3000)</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Storage Usage</span>
                  <span className="font-bold text-slate-800">14.2 MB / 5 GB</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationDialog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Confirm Rule Changes</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Modifying engine constraints like Conflict Tolerance will re-evaluate all draft schedules and invalidate 12 manual overrides. Proceed?
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmationDialog(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmationDialog(false);
                  showToast('Engine rules updated & re-validated');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Apply & Re-validate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
