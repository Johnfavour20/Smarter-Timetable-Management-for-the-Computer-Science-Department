import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Key, 
  Bell, 
  Globe, 
  Clock, 
  Calendar, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Save, 
  Camera, 
  Smartphone, 
  Laptop, 
  History, 
  Download, 
  FileText,
  Lock,
  RefreshCw
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  // Form states
  const [fullName, setFullName] = useState('Dr. Emmanuel Oti');
  const [staffId] = useState('UNIP/CS/001');
  const [email, setEmail] = useState('e.oti@uniport.edu.ng');
  const [phone, setPhone] = useState('+234 803 123 4567');
  const [officeAddress, setOfficeAddress] = useState('Block B, Room 204');
  const [department] = useState('Computer Science');

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [recoveryEmail, setRecoveryEmail] = useState('emmanuel.personal@gmail.com');

  // Preferences
  const [language, setLanguage] = useState('English (UK)');
  const [timeZone, setTimeZone] = useState('(GMT+01:00) West Central Africa');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  // Status/Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Profile information updated successfully');
    }, 600);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      showToast('Password changed successfully');
    }, 600);
  };

  const handleDownloadPersonalData = () => {
    const data = `
======================================================
CHRONOS CS - PERSONAL PROFILE EXPORT
Staff ID: ${staffId}
Name: ${fullName}
Role: Head of Department
Department: ${department}
Email: ${email}
Phone: ${phone}
Office: ${officeAddress}
Date Exported: ${new Date().toLocaleDateString()}
======================================================
Security Status: MFA ${mfaEnabled ? 'Enabled' : 'Disabled'}
Recovery Email: ${recoveryEmail}
    `;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chronos_CS_Profile_${fullName.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Personal data file downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-[#004384]" />
            My Profile & Preferences
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your account details, security settings, system preferences, and login security.
          </p>
        </div>

        <button
          onClick={handleDownloadPersonalData}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto border border-slate-200"
        >
          <Download className="w-4 h-4 text-[#004384]" />
          Download Personal Data
        </button>
      </div>

      {/* Profile Banner / Summary Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-[#004384] text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md">
              EO
            </div>
            <button
              onClick={() => showToast('Avatar update feature triggered')}
              className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-xs hover:text-[#004384] transition-colors cursor-pointer"
              title="Change Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-black text-slate-900">{fullName}</h2>
                <p className="text-xs font-bold text-[#004384] mt-0.5">Head of Department • Department of Computer Science</p>
              </div>

              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 self-center md:self-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Account Active
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Staff ID</span>
                <span className="font-bold text-slate-800">{staffId}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                <span className="font-bold text-slate-800 truncate block">{email}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Member Since</span>
                <span className="font-bold text-slate-800">Jan 2024</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Login</span>
                <span className="font-bold text-slate-800">Today, 08:15 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Personal Information Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#004384]" />
                Personal Information
              </h3>
            </div>

            <form onSubmit={handleSavePersonalInfo} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff ID</label>
                  <input
                    type="text"
                    value={staffId}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Office Address</label>
                  <input
                    type="text"
                    value={officeAddress}
                    onChange={(e) => setOfficeAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#004384] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Information
                </button>
              </div>
            </form>
          </div>

          {/* System Preferences Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#004384]" />
                System Preferences & Localization
              </h3>
            </div>

            <div className="p-5 space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  >
                    <option>English (UK)</option>
                    <option>English (US)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Zone</label>
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  >
                    <option>(GMT+01:00) West Central Africa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date Format</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">Notification Channels</h4>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Email Schedule Notifications</span>
                    <span className="text-[11px] text-slate-500">Receive timetable publication & collision alerts via email.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={(e) => {
                        setEmailNotifs(e.target.checked);
                        showToast(`Email alerts ${e.target.checked ? 'enabled' : 'disabled'}`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#004384]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Browser Push Notifications</span>
                    <span className="text-[11px] text-slate-500">Get instant popups when another admin modifies venues or schedules.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushNotifs}
                      onChange={(e) => {
                        setPushNotifs(e.target.checked);
                        showToast(`Browser alerts ${e.target.checked ? 'enabled' : 'disabled'}`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#004384]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Security & Passwords */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#004384]" />
                Security & Authentication
              </h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 chars"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                />
              </div>

              <button
                type="submit"
                disabled={!currentPassword || !newPassword}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-2xs disabled:opacity-40 cursor-pointer"
              >
                Update Password
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Two-Factor Auth (2FA)</span>
                  <span className="text-[11px] text-slate-500">Google Authenticator</span>
                </div>
                <button
                  onClick={() => {
                    setMfaEnabled(!mfaEnabled);
                    showToast(`2FA is now ${!mfaEnabled ? 'Enabled' : 'Disabled'}`);
                  }}
                  className={`px-3 py-1 font-bold rounded-lg border text-[11px] cursor-pointer ${
                    mfaEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {mfaEnabled ? 'Enabled' : 'Enable'}
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recovery Email</label>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                />
              </div>
            </div>
          </div>

          {/* Active Sessions & Devices */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#004384]" />
                Recent Login Devices
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Laptop className="w-5 h-5 text-[#004384]" />
                  <div>
                    <span className="font-bold text-slate-900 block">Chrome on Windows 11</span>
                    <span className="text-[10px] text-slate-500">Port Harcourt, NG • Current Session</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between opacity-80">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-500" />
                  <div>
                    <span className="font-bold text-slate-900 block">Chronos Mobile App</span>
                    <span className="text-[10px] text-slate-500">Port Harcourt, NG • 2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
