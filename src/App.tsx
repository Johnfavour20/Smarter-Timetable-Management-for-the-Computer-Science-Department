import React, { useState } from 'react';
import { AppViewMode, AppTab, ScheduleItem, Course, Lecturer, Venue, ActivityLog, LevelItem, AcademicSession, TimeSlotConfig } from './types';
import { 
  INITIAL_COURSES, 
  INITIAL_LECTURERS, 
  INITIAL_VENUES, 
  INITIAL_SCHEDULE, 
  INITIAL_ACTIVITIES,
  INITIAL_LEVELS,
  INITIAL_SESSIONS,
  INITIAL_TIME_SLOTS
} from './data/mockData';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { AdminSetupView } from './components/AdminSetupView';
import { DashboardView } from './components/DashboardView';
import { SchedulesView } from './components/SchedulesView';
import { CoursesView } from './components/CoursesView';
import { LecturersView } from './components/LecturersView';
import { VenuesView } from './components/VenuesView';
import { AcademicSessionsView } from './components/AcademicSessionsView';
import { TimeSlotsView } from './components/TimeSlotsView';
import { ReviewTimetable } from './components/ReviewTimetable';
import { PublishedTimetables } from './components/PublishedTimetables';
import { ReportsView } from './components/ReportsView';
import { UserManagementView } from './components/UserManagementView';
import { ProfileView } from './components/ProfileView';
import { SystemSettingsView } from './components/SystemSettingsView';
import { PublicPortalView } from './components/PublicPortalView';
import { LevelsView } from './components/LevelsView';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { ExportModal } from './components/ExportModal';
import { 
  Calendar, 
  Layers, 
  BarChart3, 
  UserCog, 
  Settings as SettingsIcon,
  HelpCircle,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

import { StorageService } from './services/storage';

export function App() {
  const [viewMode, setViewMode] = useState<AppViewMode>('landing');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Domain state with local storage persistence
  const [courses, setCourses] = useState<Course[]>(() => StorageService.loadCourses());
  const [lecturers, setLecturers] = useState<Lecturer[]>(() => StorageService.loadLecturers());
  const [venues, setVenues] = useState<Venue[]>(() => StorageService.loadVenues());
  const [levels, setLevels] = useState<LevelItem[]>(() => StorageService.loadLevels());
  const [sessions, setSessions] = useState<AcademicSession[]>(() => StorageService.loadSessions());
  const [timeSlots, setTimeSlots] = useState<TimeSlotConfig[]>(() => StorageService.loadTimeSlots());
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => StorageService.loadSchedules());
  const [activities, setActivities] = useState<ActivityLog[]>(() => StorageService.loadActivities());

  // Auto-persist changes to local storage
  React.useEffect(() => { StorageService.saveCourses(courses); }, [courses]);
  React.useEffect(() => { StorageService.saveLecturers(lecturers); }, [lecturers]);
  React.useEffect(() => { StorageService.saveVenues(venues); }, [venues]);
  React.useEffect(() => { StorageService.saveLevels(levels); }, [levels]);
  React.useEffect(() => { StorageService.saveSessions(sessions); }, [sessions]);
  React.useEffect(() => { StorageService.saveTimeSlots(timeSlots); }, [timeSlots]);
  React.useEffect(() => { StorageService.saveSchedules(schedules); }, [schedules]);
  React.useEffect(() => { StorageService.saveActivities(activities); }, [activities]);

  const showSystemToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Modal controls
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Helper to switch view to App mode and set active tab
  const handleOpenSystem = (tab: AppTab = 'dashboard') => {
    setViewMode('app');
    setActiveTab(tab);
  };

  // Add Level handlers
  const handleAddLevel = (newLevel: LevelItem) => {
    setLevels((prev) => [newLevel, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: 'Dr. Chukwu',
        action: `added academic level ${newLevel.shortCode}`,
        target: newLevel.shortCode,
        timestamp: 'Just now',
        type: 'edit',
      },
      ...prev,
    ]);
  };

  const handleUpdateLevel = (updatedLevel: LevelItem) => {
    setLevels((prev) => prev.map((l) => (l.id === updatedLevel.id ? updatedLevel : l)));
  };

  const handleDeleteLevel = (id: string) => {
    setLevels((prev) => prev.filter((l) => l.id !== id));
  };

  // Add Course handler
  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: 'Dr. Chukwu',
        action: `added new course ${newCourse.code}`,
        target: newCourse.code,
        timestamp: 'Just now',
        type: 'edit',
      },
      ...prev,
    ]);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Add Lecturer handler
  const handleAddLecturer = (newLecturer: Lecturer) => {
    setLecturers((prev) => [newLecturer, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: 'Dr. Chukwu',
        action: `registered lecturer ${newLecturer.title} ${newLecturer.name}`,
        target: newLecturer.name,
        timestamp: 'Just now',
        type: 'edit',
      },
      ...prev,
    ]);
  };

  const handleDeleteLecturer = (id: string) => {
    setLecturers((prev) => prev.filter((l) => l.id !== id));
  };

  // Add Venue handler
  const handleAddVenue = (newVenue: Venue) => {
    setVenues((prev) => [newVenue, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: 'Dr. Chukwu',
        action: `added venue ${newVenue.name}`,
        target: newVenue.code,
        timestamp: 'Just now',
        type: 'edit',
      },
      ...prev,
    ]);
  };

  const handleUpdateVenue = (updatedVenue: Venue) => {
    setVenues((prev) => prev.map((v) => (v.id === updatedVenue.id ? updatedVenue : v)));
  };

  const handleDeleteVenue = (id: string) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
  };

  // Academic Session Handlers
  const handleAddSession = (newSession: AcademicSession) => {
    setSessions((prev) => {
      if (newSession.status === 'Active') {
        return [newSession, ...prev.map((s) => ({ ...s, status: 'Archived' as const }))];
      }
      return [newSession, ...prev];
    });
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: 'Dr. Chukwu',
        action: `created academic session ${newSession.name} (${newSession.semester})`,
        target: newSession.name,
        timestamp: 'Just now',
        type: 'create',
      },
      ...prev,
    ]);
  };

  const handleUpdateSession = (updatedSession: AcademicSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSetActiveSession = (activeId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId ? { ...s, status: 'Active' as const } : { ...s, status: 'Archived' as const }
      )
    );
  };

  // Time Slots Handlers
  const handleAddTimeSlot = (newSlot: TimeSlotConfig) => {
    setTimeSlots((prev) => [newSlot, ...prev]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: 'Dr. Chukwu',
        action: `added time slot ${newSlot.day} (${newSlot.formattedTime})`,
        target: newSlot.day,
        timestamp: 'Just now',
        type: 'create',
      },
      ...prev,
    ]);
  };

  const handleUpdateTimeSlot = (updatedSlot: TimeSlotConfig) => {
    setTimeSlots((prev) => prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)));
  };

  const handleDeleteTimeSlot = (id: string) => {
    setTimeSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleTimeSlotStatus = (id: string) => {
    setTimeSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
    );
  };

  // Add Schedule slot
  const handleAddSchedule = (newItem: Omit<ScheduleItem, 'id'>) => {
    const created: ScheduleItem = {
      ...newItem,
      id: `s-${Date.now()}`,
    };
    setSchedules((prev) => [...prev, created]);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: 'Dr. Chukwu',
        action: `scheduled ${created.courseCode} in ${created.venueName}`,
        target: created.courseCode,
        timestamp: 'Just now',
        type: 'edit',
      },
      ...prev,
    ]);
  };

  const handleUpdateSchedule = (updated: ScheduleItem) => {
    setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  // AI Timetable Apply
  const handleApplyAISchedule = (newScheduleItems: ScheduleItem[]) => {
    setSchedules(newScheduleItems);
    StorageService.savePublishedSchedules(newScheduleItems);
    showSystemToast(`AI Solver generated & saved ${newScheduleItems.length} conflict-free course slots.`);
    setActiveTab('schedules');
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: 'ChronosCS AI Engine',
        action: 'generated optimized conflict-free timetable layout',
        target: 'All Courses',
        timestamp: 'Just now',
        type: 'ai',
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-[#004384] selection:text-white flex flex-col">
      {viewMode === 'landing' ? (
        <>
          <TopNavbar
            viewMode={viewMode}
            setViewMode={setViewMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <LandingView 
            onOpenSystem={handleOpenSystem} 
            onOpenAdminSetup={() => setViewMode('admin-setup')}
          />
        </>
      ) : viewMode === 'admin-setup' ? (
        <>
          <TopNavbar
            viewMode={viewMode}
            setViewMode={setViewMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <AdminSetupView
            onSuccess={(adminName) => {
              setActivities((prev) => [
                {
                  id: `act-${Date.now()}`,
                  user: adminName || 'Dr. Chukwu',
                  action: 'configured & authenticated administrator account',
                  target: 'Chronos CS System',
                  timestamp: 'Just now',
                  type: 'create',
                },
                ...prev,
              ]);
              handleOpenSystem('dashboard');
            }}
            onNavigateLanding={() => setViewMode('landing')}
          />
        </>
      ) : (
        /* AUTHENTICATED APP LAYOUT WITH LEFT SIDEBAR */
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
          {/* Collapsible Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
            onLogout={() => setViewMode('landing')}
          />

          {/* Main Area (Top Bar + Scrollable Content) */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopNavbar
              viewMode={viewMode}
              setViewMode={setViewMode}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenGenerator={() => setIsGeneratorOpen(true)}
              onOpenExport={() => setIsExportOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
            />

            {/* Scrollable Tab Views Container */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {activeTab === 'dashboard' && (
                <DashboardView
                  schedules={schedules}
                  courses={courses}
                  lecturers={lecturers}
                  venues={venues}
                  activities={activities}
                  conflictsCount={0}
                  setActiveTab={setActiveTab}
                  onOpenGenerator={() => setIsGeneratorOpen(true)}
                  onOpenExport={() => setIsExportOpen(true)}
                  onSelectSchedule={() => setActiveTab('schedules')}
                />
              )}

              {(activeTab === 'schedules' || activeTab === 'published' || activeTab === 'generator') && (
                <SchedulesView
                  schedules={schedules}
                  courses={courses}
                  lecturers={lecturers}
                  venues={venues}
                  onAddSchedule={handleAddSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                  onDeleteSchedule={handleDeleteSchedule}
                  onOpenGenerator={() => setIsGeneratorOpen(true)}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'review' && (
                <ReviewTimetable
                  schedules={schedules}
                  courses={courses}
                  lecturers={lecturers}
                  venues={venues}
                  onUpdateSchedule={handleUpdateSchedule}
                  onDeleteSchedule={handleDeleteSchedule}
                  onOpenGenerator={() => setIsGeneratorOpen(true)}
                  onNavigateToSchedule={() => setActiveTab('schedules')}
                />
              )}

              {activeTab === 'courses' && (
                <CoursesView
                  courses={courses}
                  lecturers={lecturers}
                  venues={venues}
                  onAddCourse={handleAddCourse}
                  onDeleteCourse={handleDeleteCourse}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'lecturers' && (
                <LecturersView
                  lecturers={lecturers}
                  courses={courses}
                  onAddLecturer={handleAddLecturer}
                  onDeleteLecturer={handleDeleteLecturer}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'venues' && (
                <VenuesView
                  venues={venues}
                  onAddVenue={handleAddVenue}
                  onUpdateVenue={handleUpdateVenue}
                  onDeleteVenue={handleDeleteVenue}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'sessions' && (
                <AcademicSessionsView
                  sessions={sessions}
                  onAddSession={handleAddSession}
                  onUpdateSession={handleUpdateSession}
                  onDeleteSession={handleDeleteSession}
                  onSetActiveSession={handleSetActiveSession}
                  searchQuery={searchQuery}
                  onNavigateToSchedule={() => setActiveTab('dashboard')}
                />
              )}

              {activeTab === 'timeslots' && (
                <TimeSlotsView
                  timeSlots={timeSlots}
                  onAddTimeSlot={handleAddTimeSlot}
                  onUpdateTimeSlot={handleUpdateTimeSlot}
                  onDeleteTimeSlot={handleDeleteTimeSlot}
                  onToggleStatus={handleToggleTimeSlotStatus}
                  globalSearchQuery={searchQuery}
                />
              )}

              {activeTab === 'levels' && (
                <LevelsView
                  levels={levels}
                  courses={courses}
                  onAddLevel={handleAddLevel}
                  onUpdateLevel={handleUpdateLevel}
                  onDeleteLevel={handleDeleteLevel}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'published' && (
                <PublishedTimetables
                  sessions={sessions}
                  onNavigateToSchedule={() => setActiveTab('schedules')}
                  onOpenGenerator={() => setIsGeneratorOpen(true)}
                  globalSearchQuery={searchQuery}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  sessions={sessions}
                  lecturers={lecturers}
                  venues={venues}
                  courses={courses}
                  schedules={schedules}
                  globalSearchQuery={searchQuery}
                />
              )}

              {activeTab === 'users' && (
                <UserManagementView globalSearchQuery={searchQuery} />
              )}

              {activeTab === 'profile' && (
                <ProfileView />
              )}

              {activeTab === 'public-portal' && (
                <PublicPortalView 
                  onBackToAdmin={() => setActiveTab('dashboard')} 
                  schedules={schedules}
                  courses={courses}
                  venues={venues}
                />
              )}

              {activeTab === 'settings' && (
                <SystemSettingsView />
              )}

              {activeTab === 'help' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5 text-[#004384]" /> Chronos CS Help & Support Center
                      </h2>
                      <p className="text-xs text-slate-500">Documentation, algorithm guides, and contact support.</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs text-slate-700 max-w-lg">
                    <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Department Support Email</span>
                      <p className="text-slate-500">support.cs@uniport.edu.ng</p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">Timetable Generation Engine</span>
                      <p className="text-slate-500">Powered by Gemini AI Constraint Satisfaction Solver (v2.4)</p>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* Global System Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* AI Timetable Generator Modal */}
      <AIGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        courses={courses}
        lecturers={lecturers}
        venues={venues}
        onApplySchedule={handleApplyAISchedule}
      />

      {/* Export & Publish Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        schedules={schedules}
      />
    </div>
  );
}

export default App;
