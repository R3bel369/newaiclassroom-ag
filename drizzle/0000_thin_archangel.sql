CREATE TABLE "assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"instructions" text,
	"due_date" text,
	"max_marks" integer DEFAULT 100 NOT NULL,
	"type" text DEFAULT 'homework' NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"scheduled_at" timestamp,
	"late_allowed" boolean DEFAULT true NOT NULL,
	"rubric" text,
	"attachment_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"meeting_id" integer,
	"student_id" integer NOT NULL,
	"status" text DEFAULT 'present' NOT NULL,
	"date" text NOT NULL,
	"marked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"grade" text NOT NULL,
	"academic_year" text NOT NULL,
	"batch_name" text NOT NULL,
	"join_code" text NOT NULL,
	"teacher_id" integer,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "classes_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"file_url" text NOT NULL,
	"description" text NOT NULL,
	"organize_type" text NOT NULL,
	"organize_value" text NOT NULL,
	"folder" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meetings" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"duration" integer NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"join_link" text NOT NULL,
	"recording_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"assignment_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"file_url" text,
	"text_content" text,
	"link_url" text,
	"grade" text,
	"feedback" text,
	"ai_suggested_grade" text,
	"ai_suggested_feedback" text,
	"ai_weak_areas" text,
	"status" text DEFAULT 'submitted' NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"graded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "teacher_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"content" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"password_fallback" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materials" ADD CONSTRAINT "materials_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_notes" ADD CONSTRAINT "teacher_notes_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_notes" ADD CONSTRAINT "teacher_notes_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;