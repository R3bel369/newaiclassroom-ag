// src/types.ts

export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  id: number;
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'suspended';
  passwordFallback?: string;
  createdAt?: string;
}

export interface Classroom {
  id: number;
  name: string;
  subject: string;
  description: string;
  grade: string;
  academicYear: string;
  batchName: string;
  joinCode: string;
  teacherId: number | null;
  archived: boolean;
  createdAt?: string;
  studentsCount?: number;
  teacherName?: string;
}

export interface LearningMaterial {
  id: number;
  classId: number;
  title: string;
  type: 'pdf' | 'docx' | 'ppt' | 'image' | 'video' | 'link';
  fileUrl: string;
  description: string;
  organizeType: 'unit' | 'chapter' | 'topic' | 'week';
  organizeValue: string;
  folder?: string;
  createdAt?: string;
}

export interface Assignment {
  id: number;
  classId: number;
  title: string;
  description: string;
  instructions: string | null;
  dueDate: string | null;
  maxMarks: number;
  type: 'homework' | 'quiz' | 'practice_test' | 'act_test' | 'ap_test' | 'essay' | 'worksheet';
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt: string | null;
  lateAllowed: boolean;
  rubric: string | null;
  createdAt?: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  fileUrl: string | null;
  textContent: string | null;
  linkUrl: string | null;
  grade: string | null;
  feedback: string | null;
  aiSuggestedGrade: string | null;
  aiSuggestedFeedback: string | null;
  aiWeakAreas: string | null; // JSON string array
  status: 'submitted' | 'graded';
  submittedAt: string;
  gradedAt: string | null;
}

export interface Meeting {
  id: number;
  classId: number;
  title: string;
  date: string;
  time: string;
  duration: number; // in minutes
  description: string;
  type: 'live_class' | 'revision_session' | 'doubt_session' | 'parent_meeting';
  joinLink: string;
  recordingUrl: string | null;
  createdAt?: string;
}

export interface AttendanceRecord {
  id: number;
  classId: number;
  meetingId: number | null;
  studentId: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  date: string;
  markedAt?: string;
}

export interface AppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'material' | 'meeting' | 'system';
  isRead: boolean;
  createdAt: string;
}
