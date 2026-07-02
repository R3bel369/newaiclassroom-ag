import { relations, sql } from 'drizzle-orm';
import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table (shares Firebase UID as the principal credential link)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Supabase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('student'), // 'admin' | 'teacher' | 'student'
  status: text('status').notNull().default('active'), // 'active' | 'suspended'
  passwordFallback: text('password_fallback'), // For direct sign-in fallback if needed
  createdAt: timestamp('created_at').defaultNow(),
});

// Classes table
export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  grade: text('grade').notNull(),
  academicYear: text('academic_year').notNull(),
  batchName: text('batch_name').notNull(),
  joinCode: text('join_code').notNull().unique(),
  teacherId: integer('teacher_id').references(() => users.id, { onDelete: 'cascade' }),
  archived: boolean('archived').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Enrollments (Many-to-Many relation between classes and students)
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  studentId: integer('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Learning Materials
export const materials = pgTable('materials', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  type: text('type').notNull(), // 'pdf' | 'docx' | 'ppt' | 'image' | 'video' | 'link'
  fileUrl: text('file_url').notNull(),
  description: text('description').notNull(),
  organizeType: text('organize_type').notNull(), // 'unit' | 'chapter' | 'topic' | 'week'
  organizeValue: text('organize_value').notNull(), // e.g. "Unit 1", "Week 3"
  folder: text('folder'), // E.g., "Unit 1", "Unit 1 > Sub-topic A", or null for root
  createdAt: timestamp('created_at').defaultNow(),
});

// Assignments table
export const assignments = pgTable('assignments', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions'),
  dueDate: text('due_date'),
  maxMarks: integer('max_marks').notNull().default(100),
  type: text('type').notNull().default('homework'), // 'homework' | 'quiz' | 'practice_test' | 'act_test' | 'ap_test' | 'essay' | 'worksheet'
  status: text('status').notNull().default('published'), // 'draft' | 'published' | 'scheduled'
  scheduledAt: timestamp('scheduled_at'),
  lateAllowed: boolean('late_allowed').notNull().default(true),
  rubric: text('rubric'), // JSON or plain text outlining rubric rules
  attachmentUrl: text('attachment_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Submissions table for Assignments
export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  assignmentId: integer('assignment_id').notNull().references(() => assignments.id, { onDelete: 'cascade' }),
  studentId: integer('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileUrl: text('file_url'),
  textContent: text('text_content'),
  linkUrl: text('link_url'),
  grade: text('grade'), // percentage, letter, or numeric (as text)
  feedback: text('feedback'),
  aiSuggestedGrade: text('ai_suggested_grade'),
  aiSuggestedFeedback: text('ai_suggested_feedback'),
  aiWeakAreas: text('ai_weak_areas'),
  status: text('status').notNull().default('submitted'), // 'submitted' | 'graded'
  submittedAt: timestamp('submitted_at').defaultNow(),
  gradedAt: timestamp('graded_at'),
});

// Meetings table
export const meetings = pgTable('meetings', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM
  duration: integer('duration').notNull(), // in minutes
  description: text('description').notNull(),
  type: text('type').notNull(), // 'live_class' | 'revision_session' | 'doubt_session' | 'parent_meeting'
  joinLink: text('join_link').notNull(),
  recordingUrl: text('recording_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Attendance tracking
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  classId: integer('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  meetingId: integer('meeting_id').references(() => meetings.id, { onDelete: 'set null' }),
  studentId: integer('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('present'), // 'present' | 'absent' | 'late' | 'excused'
  date: text('date').notNull(), // YYYY-MM-DD
  markedAt: timestamp('marked_at').defaultNow(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // 'assignment' | 'grade' | 'material' | 'meeting' | 'system'
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Teacher Notes for Students (kept private for teachers/admins internal reminders)
export const teacherNotes = pgTable('teacher_notes', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  classId: integer('class_id').notNull().references(() => classes.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations declarations

export const usersRelations = relations(users, ({ many }) => ({
  classesTeached: many(classes),
  enrollments: many(enrollments),
  submissions: many(submissions),
  attendanceRecords: many(attendance),
  notifications: many(notifications),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
  materials: many(materials),
  assignments: many(assignments),
  meetings: many(meetings),
  attendanceRecords: many(attendance),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  class: one(classes, {
    fields: [enrollments.classId],
    references: [classes.id],
  }),
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
  }),
}));

export const materialsRelations = relations(materials, ({ one }) => ({
  class: one(classes, {
    fields: [materials.classId],
    references: [classes.id],
  }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
  }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
  }),
}));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  class: one(classes, {
    fields: [meetings.classId],
    references: [classes.id],
  }),
  attendanceRecords: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  class: one(classes, {
    fields: [attendance.classId],
    references: [classes.id],
  }),
  meeting: one(meetings, {
    fields: [attendance.meetingId],
    references: [meetings.id],
  }),
  student: one(users, {
    fields: [attendance.studentId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const teacherNotesRelations = relations(teacherNotes, ({ one }) => ({
  student: one(users, {
    fields: [teacherNotes.studentId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [teacherNotes.classId],
    references: [classes.id],
  }),
}));
