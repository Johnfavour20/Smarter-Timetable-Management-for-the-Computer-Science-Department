import { 
  Course, 
  Lecturer, 
  Venue, 
  ScheduleItem, 
  ActivityLog, 
  LevelItem, 
  AcademicSession, 
  TimeSlotConfig 
} from '../types';
import { 
  INITIAL_COURSES, 
  INITIAL_LECTURERS, 
  INITIAL_VENUES, 
  INITIAL_SCHEDULE, 
  INITIAL_ACTIVITIES, 
  INITIAL_LEVELS, 
  INITIAL_SESSIONS, 
  INITIAL_TIME_SLOTS 
} from '../data/mockData';

const STORAGE_KEYS = {
  COURSES: 'chronos_cs_courses_v1',
  LECTURERS: 'chronos_cs_lecturers_v1',
  VENUES: 'chronos_cs_venues_v1',
  LEVELS: 'chronos_cs_levels_v1',
  SESSIONS: 'chronos_cs_sessions_v1',
  TIME_SLOTS: 'chronos_cs_timeslots_v1',
  SCHEDULES: 'chronos_cs_schedules_v1',
  PUBLISHED_SCHEDULES: 'chronos_cs_published_schedules_v1',
  ACTIVITIES: 'chronos_cs_activities_v1',
  SETTINGS: 'chronos_cs_settings_v1',
};

// Helper for initial load with fallback
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.warn(`[StorageService] Failed to parse key ${key}`, e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[StorageService] Failed to save key ${key}`, e);
  }
}

export const StorageService = {
  // Load initial states
  loadCourses: (): Course[] => loadFromStorage(STORAGE_KEYS.COURSES, INITIAL_COURSES),
  saveCourses: (courses: Course[]) => saveToStorage(STORAGE_KEYS.COURSES, courses),

  loadLecturers: (): Lecturer[] => loadFromStorage(STORAGE_KEYS.LECTURERS, INITIAL_LECTURERS),
  saveLecturers: (lecturers: Lecturer[]) => saveToStorage(STORAGE_KEYS.LECTURERS, lecturers),

  loadVenues: (): Venue[] => loadFromStorage(STORAGE_KEYS.VENUES, INITIAL_VENUES),
  saveVenues: (venues: Venue[]) => saveToStorage(STORAGE_KEYS.VENUES, venues),

  loadLevels: (): LevelItem[] => loadFromStorage(STORAGE_KEYS.LEVELS, INITIAL_LEVELS),
  saveLevels: (levels: LevelItem[]) => saveToStorage(STORAGE_KEYS.LEVELS, levels),

  loadSessions: (): AcademicSession[] => loadFromStorage(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS),
  saveSessions: (sessions: AcademicSession[]) => saveToStorage(STORAGE_KEYS.SESSIONS, sessions),

  loadTimeSlots: (): TimeSlotConfig[] => loadFromStorage(STORAGE_KEYS.TIME_SLOTS, INITIAL_TIME_SLOTS),
  saveTimeSlots: (slots: TimeSlotConfig[]) => saveToStorage(STORAGE_KEYS.TIME_SLOTS, slots),

  loadSchedules: (): ScheduleItem[] => loadFromStorage(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULE),
  saveSchedules: (schedules: ScheduleItem[]) => saveToStorage(STORAGE_KEYS.SCHEDULES, schedules),

  loadPublishedSchedules: (): ScheduleItem[] => loadFromStorage(STORAGE_KEYS.PUBLISHED_SCHEDULES, INITIAL_SCHEDULE),
  savePublishedSchedules: (schedules: ScheduleItem[]) => saveToStorage(STORAGE_KEYS.PUBLISHED_SCHEDULES, schedules),

  loadActivities: (): ActivityLog[] => loadFromStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  saveActivities: (activities: ActivityLog[]) => saveToStorage(STORAGE_KEYS.ACTIVITIES, activities),

  // Reset demo database to original seed state
  resetToDefaults: () => {
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.LECTURERS);
    localStorage.removeItem(STORAGE_KEYS.VENUES);
    localStorage.removeItem(STORAGE_KEYS.LEVELS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.TIME_SLOTS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.PUBLISHED_SCHEDULES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  }
};

/**
 * Simulated Backend Async Service (Mimics HTTP endpoint calls with network latency)
 */
export async function simulateBackendCall<T>(actionName: string, payload: any, delayMs: number = 400): Promise<{ success: boolean; data?: T; message: string; timestamp: string }> {
  console.log(`[Chronos CS Backend API] Request: POST /api/v1/${actionName}`, payload);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return {
    success: true,
    data: payload as T,
    message: `Database transaction completed successfully. HTTP 200 OK.`,
    timestamp: new Date().toISOString(),
  };
}
