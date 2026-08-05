export type Level = '100' | '200' | '300' | '400' | 'MSc' | 'PhD';
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type TimeSlot = '08:00 - 10:00' | '10:00 - 12:00' | '12:00 - 14:00' | '14:00 - 16:00' | '16:00 - 18:00';

export interface LevelItem {
  id: string;
  name: string;
  shortCode: string;
  description: string;
  estimatedStudents: number;
  coursesAssignedCount?: number;
  status: 'Active' | 'Inactive';
  academicSession?: string;
}

export interface AcademicSession {
  id: string;
  name: string; // e.g. "2026/2027"
  semester: 'First Semester' | 'Second Semester';
  status: 'Active' | 'Archived' | 'Upcoming';
  timetableStatus: 'Draft' | 'Published';
  startDate?: string;
  endDate?: string;
  createdDate: string;
  notes?: string;
}

export interface ScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturerId: string;
  lecturerName: string;
  venueId: string;
  venueName: string;
  day: Day;
  timeSlot: TimeSlot;
  level: Level;
  studentCount: number;
  isLab?: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  level: Level;
  semester: 'First Semester' | 'Second Semester';
  assignedLecturerId: string;
  assignedLecturerName: string;
  preferredVenueId: string;
  preferredVenueName: string;
  enrolledStudents: number;
  maxStudents?: number;
  requiresLab: boolean;
  status?: 'Active' | 'Inactive';
}

export interface Lecturer {
  id: string;
  title: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  maxWeeklyHours: number;
  currentWeeklyHours: number;
  assignedCourseCodes: string[];
  availableDays: Day[];
  avatarUrl?: string;
  staffId?: string;
  rank?: string;
  status?: 'Active' | 'Sabbatical' | 'On Leave';
  department?: string;
}

export interface Venue {
  id: string;
  name: string;
  code: string;
  capacity: number;
  building: string;
  hasProjector: boolean;
  hasAC: boolean;
  hasSmartboard: boolean;
  isLab: boolean;
  utilizationPercentage: number;
  type?: 'Lecture Hall' | 'Laboratory' | 'Classroom';
  status?: 'Active' | 'Maintenance' | 'Inactive';
  hasComputers?: boolean;
  hasInternet?: boolean;
}

export interface ConflictItem {
  id: string;
  type: 'venue_overlap' | 'lecturer_overlap' | 'capacity_exceeded' | 'lecturer_unavail';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedScheduleIds: string[];
  suggestedSolution?: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'edit' | 'create' | 'ai' | 'resolve';
}

export interface TimeSlotConfig {
  id: string;
  day: Day | 'Saturday';
  startTime: string;
  endTime: string;
  formattedTime: string;
  durationHours: number;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export type AppViewMode = 'landing' | 'app' | 'admin-setup';
export type AppTab = 
  | 'dashboard' 
  | 'courses' 
  | 'lecturers' 
  | 'venues' 
  | 'sessions' 
  | 'timeslots'
  | 'levels' 
  | 'generator' 
  | 'published' 
  | 'reports' 
  | 'users' 
  | 'settings' 
  | 'schedules' 
  | 'export';
