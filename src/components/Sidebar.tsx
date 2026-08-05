import React from 'react';
import { AppTab } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Building, 
  Calendar, 
  Clock,
  Layers, 
  Sparkles, 
  CheckCircle,
  CalendarCheck, 
  BarChart3, 
  UserCog, 
  Settings, 
  User, 
  HelpCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  School
} from 'lucide-react';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenGenerator: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onOpenGenerator,
  onLogout,
}) => {
  const mainNavItems = [
    { id: 'dashboard' as AppTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses' as AppTab, label: 'Courses', icon: BookOpen },
    { id: 'lecturers' as AppTab, label: 'Lecturers', icon: Users },
    { id: 'venues' as AppTab, label: 'Venues', icon: Building },
    { id: 'sessions' as AppTab, label: 'Academic Sessions', icon: Calendar },
    { id: 'timeslots' as AppTab, label: 'Time Slots', icon: Clock },
    { id: 'levels' as AppTab, label: 'Levels', icon: Layers },
    { id: 'generator' as AppTab, label: 'Generate Timetable', icon: Sparkles, action: onOpenGenerator, isSpecial: true },
    { id: 'review' as AppTab, label: 'Review Timetable', icon: CheckCircle },
    { id: 'published' as AppTab, label: 'Published Timetables', icon: CalendarCheck },
    { id: 'reports' as AppTab, label: 'Reports', icon: BarChart3 },
    { id: 'users' as AppTab, label: 'Users', icon: UserCog },
    { id: 'settings' as AppTab, label: 'Settings', icon: Settings },
  ];

  const bottomNavItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <aside 
      className={`bg-[#081C3A] text-slate-300 flex flex-col justify-between transition-all duration-300 z-40 shrink-0 border-r border-slate-800 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Brand */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-[#004384] border border-blue-400/30 flex items-center justify-center shrink-0 shadow-md">
            <School className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-white text-base tracking-tight leading-none">Chronos CS</span>
              <span className="text-[10px] font-medium text-blue-300 tracking-wider uppercase mt-1">UNIPORT CS Dept</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {!isCollapsed && (
          <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Navigation
          </span>
        )}

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setActiveTab(item.id);
                }
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#004384] text-white shadow-md font-bold'
                  : item.isSpecial
                  ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${
                isActive ? 'text-white' : item.isSpecial ? 'text-amber-400 animate-pulse' : 'text-slate-400 group-hover:text-white'
              }`} />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.isSpecial && (
                <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase">AI</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AppTab)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
            >
              <Icon className="w-4 h-4 text-slate-400" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        <button
          onClick={onLogout}
          title={isCollapsed ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all cursor-pointer mt-1 ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
