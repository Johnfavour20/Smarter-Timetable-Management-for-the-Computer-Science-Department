import React, { useState } from 'react';
import { 
  UserCog, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  MoreVertical, 
  ShieldAlert, 
  History, 
  X, 
  User, 
  Key, 
  Check, 
  RefreshCw,
  Building,
  Sparkles
} from 'lucide-react';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'HOD' | 'Super Admin' | 'Administrator' | 'Officer' | 'Faculty';
  status: 'Active' | 'Inactive' | 'Invited';
  lastLogin: string;
  mfaEnabled: boolean;
  avatarUrl?: string;
  department: string;
}

interface UserManagementViewProps {
  globalSearchQuery?: string;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  globalSearchQuery = '',
}) => {
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: 'u1',
      name: 'Dr. Emmanuel Oti',
      email: 'e.oti@uniport.edu.ng',
      role: 'HOD',
      status: 'Active',
      lastLogin: 'Today, 08:15 AM',
      mfaEnabled: true,
      department: 'Computer Science',
    },
    {
      id: 'u2',
      name: 'Dr. Chukwu',
      email: 'chukwu@uniport.edu.ng',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: '2 hours ago',
      mfaEnabled: true,
      department: 'Computer Science',
    },
    {
      id: 'u3',
      name: 'Mary Briggs',
      email: 'mary.b@uniport.edu.ng',
      role: 'Administrator',
      status: 'Active',
      lastLogin: 'Yesterday, 14:30',
      mfaEnabled: true,
      department: 'Computer Science',
    },
    {
      id: 'u4',
      name: 'Prof. Adebayo',
      email: 'adebayo@uniport.edu.ng',
      role: 'Faculty',
      status: 'Active',
      lastLogin: '3 days ago',
      mfaEnabled: false,
      department: 'Computer Science',
    },
    {
      id: 'u5',
      name: 'Dr. Okeke',
      email: 'okeke@uniport.edu.ng',
      role: 'Faculty',
      status: 'Active',
      lastLogin: 'Yesterday, 09:12',
      mfaEnabled: true,
      department: 'Computer Science',
    },
    {
      id: 'u6',
      name: 'John Doe',
      email: 'j.doe@uniport.edu.ng',
      role: 'Officer',
      status: 'Invited',
      lastLogin: 'Never',
      mfaEnabled: false,
      department: 'Computer Science',
    },
    {
      id: 'u7',
      name: 'Dr. Nwachukwu',
      email: 'nwachukwu@uniport.edu.ng',
      role: 'Faculty',
      status: 'Inactive',
      lastLogin: 'Oct 14, 2025',
      mfaEnabled: false,
      department: 'Computer Science',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState(globalSearchQuery);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'HOD' | 'Super Admin' | 'Administrator' | 'Officer' | 'Faculty'>('Officer');

  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handler: Add new invite
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;

    const newUser: UserAccount = {
      id: 'u-' + Date.now(),
      name: newUserName.trim() || newUserEmail.split('@')[0],
      email: newUserEmail.trim(),
      role: newUserRole,
      status: 'Invited',
      lastLogin: 'Never',
      mfaEnabled: false,
      department: 'Computer Science',
    };

    setUsers([newUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    setIsInviteModalOpen(false);
    showToast(`Invitation sent to ${newUser.email}`);
  };

  // Handler: Toggle status
  const handleToggleStatus = (id: string) => {
    setUsers(users.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`${u.name}'s account is now ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Handler: Save Role Edit
  const handleSaveEditRole = () => {
    if (!editingUser) return;
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    showToast('User permissions and role updated');
  };

  // Handler: Export CSV
  const handleExportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Email,Role,Status,MFA,Last Login"]
      .concat(filteredUsers.map(u => `"${u.name}","${u.email}","${u.role}","${u.status}","${u.mfaEnabled ? 'Yes' : 'No'}","${u.lastLogin}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Chronos_CS_User_List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported user list to CSV");
  };

  // KPIs
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const adminUsers = users.filter((u) => u.role === 'HOD' || u.role === 'Super Admin' || u.role === 'Administrator').length;
  const pendingInvites = users.filter((u) => u.status === 'Invited').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserCog className="w-6 h-6 text-[#004384]" />
            User Management & Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage departmental administrators, timetable officers, role permissions, and account status.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2.5 bg-[#004384] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            Total Users
            <User className="w-4 h-4 text-[#004384]" />
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2">{totalUsers}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            Active Accounts
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2">{activeUsers}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            Administrators
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2">{adminUsers}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 flex items-center justify-between">
            Pending Invites
            <Mail className="w-4 h-4 text-blue-500" />
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2">{pendingInvites}</span>
        </div>
      </div>

      {/* Content Layout: Table + Activity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Table Column (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or email..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#004384]"
              >
                <option value="All">Role: All</option>
                <option value="HOD">HOD</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Administrator">Administrator</option>
                <option value="Officer">Officer</option>
                <option value="Faculty">Faculty</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#004384]"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Invited">Invited</option>
              </select>

              <button
                onClick={handleExportUsers}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Export User List"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">MFA</th>
                    <th className="p-4">Last Login</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No users found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#004384] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{user.name}</span>
                              <span className="text-[11px] text-slate-400">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            user.role === 'HOD'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : user.role === 'Super Admin'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : user.role === 'Administrator'
                              ? 'bg-blue-50 text-[#004384] border-blue-200'
                              : user.role === 'Officer'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            user.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : user.status === 'Invited'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Invited' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            {user.status}
                          </span>
                        </td>

                        <td className="p-4">
                          {user.mfaEnabled ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5" /> Enabled
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Disabled</span>
                          )}
                        </td>

                        <td className="p-4 text-slate-500 text-[11px]">
                          {user.lastLogin}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-[#004384] transition-colors cursor-pointer"
                              title="Edit Role & Permissions"
                            >
                              <UserCog className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                user.status === 'Active'
                                  ? 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                                  : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'
                              }`}
                              title={user.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                            >
                              {user.status === 'Active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
              <span>Showing {filteredUsers.length} of {users.length} registered accounts</span>
              <span className="font-semibold text-slate-700">Chronos Security Protocol v2.4</span>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Log (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-[#004384]" />
                Recent Audit Trail
              </h3>
              <span className="text-[10px] font-extrabold bg-blue-50 text-[#004384] px-2 py-0.5 rounded-full border border-blue-200">
                Live
              </span>
            </div>

            <div className="space-y-3.5 relative border-l-2 border-slate-100 ml-2 pl-4 pt-1">
              {[
                { user: 'Dr. Emmanuel Oti', action: 'Published 2026/2027 First Semester Timetable', time: '10 mins ago' },
                { user: 'Dr. Chukwu', action: 'Modified room capacity for LT1', time: '1 hour ago' },
                { user: 'Mary Briggs', action: 'Assigned CSC301 to Dr. Okeke', time: 'Yesterday' },
                { user: 'System Auto-Audit', action: 'Resolved 2 schedule collisions using AI Engine', time: '2 days ago' },
              ].map((item, i) => (
                <div key={i} className="relative space-y-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#004384] border-2 border-white absolute -left-[21px] top-1" />
                  <p className="text-xs font-bold text-slate-800">{item.user}</p>
                  <p className="text-xs text-slate-600 leading-snug">{item.action}</p>
                  <span className="text-[10px] font-medium text-slate-400 block pt-0.5">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#004384]" /> Invite New User
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Dr. John Nwosu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. j.nwosu@uniport.edu.ng"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#004384]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned System Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#004384]"
                >
                  <option value="Officer">Officer (Timetable Drafting)</option>
                  <option value="Administrator">Administrator (Manage Data)</option>
                  <option value="Faculty">Faculty (View & Request Changes)</option>
                  <option value="Super Admin">Super Admin (Full Rights)</option>
                  <option value="HOD">HOD (Head of Department)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#004384] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserCog className="w-5 h-5 text-[#004384]" /> Edit Role & Permissions
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 block">User Account</span>
                <span className="font-bold text-slate-900 text-sm block">{editingUser.name}</span>
                <span className="text-slate-400">{editingUser.email}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">System Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#004384]"
                >
                  <option value="HOD">HOD (Head of Department)</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Officer">Officer</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">Scope of Permissions:</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {editingUser.role === 'HOD' && 'Full administrative rights, final timetable publication, user management, and department override privileges.'}
                  {editingUser.role === 'Super Admin' && 'Complete access to timetable solver, constraints, database records, and system reports.'}
                  {editingUser.role === 'Administrator' && 'Manage courses, lecturers, venues, academic sessions, and draft schedules.'}
                  {editingUser.role === 'Officer' && 'Generate drafts, review collisions, and submit schedules for approval.'}
                  {editingUser.role === 'Faculty' && 'Read-only access to published timetables and workload statistics.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditRole}
                  className="px-4 py-2 bg-[#004384] text-white font-bold text-xs rounded-xl hover:bg-blue-800 shadow-md transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
