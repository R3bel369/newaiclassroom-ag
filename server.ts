import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { 
  users, 
  classes, 
  enrollments, 
  materials, 
  assignments, 
  submissions, 
  meetings, 
  attendance, 
  notifications,
  teacherNotes
} from "./src/db/schema.ts";
import { eq, and, or, inArray, desc, like, sql } from "drizzle-orm";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { generateAssignmentAI, gradeSubmissionAI, generateAnalyticsReportAI, generateStudyFlashcardsAI } from "./src/lib/gemini.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Run database test on startup and log to file
  try {
    console.log("Running startup database test query...");
    const testResult = await db.select().from(users).limit(1);
    fs.writeFileSync("./db_test_status.log", JSON.stringify({
      status: "success",
      keys: {
        SQL_HOST: process.env.SQL_HOST,
        SQL_USER: process.env.SQL_USER,
        SQL_PASSWORD: process.env.SQL_PASSWORD ? "SET" : "NOT SET",
        SQL_DB_NAME: process.env.SQL_DB_NAME,
      },
      testResult
    }, null, 2));
    console.log("Startup database test query succeeded.");
  } catch (err: any) {
    console.error("Startup database test query failed:", err);
    fs.writeFileSync("./db_test_status.log", JSON.stringify({
      status: "error",
      message: err.message,
      stack: err.stack,
      cause: err.cause ? {
        message: err.cause.message,
        stack: err.cause.stack
      } : null,
      keys: {
        SQL_HOST: process.env.SQL_HOST,
        SQL_USER: process.env.SQL_USER,
        SQL_PASSWORD: process.env.SQL_PASSWORD ? "SET" : "NOT SET",
        SQL_DB_NAME: process.env.SQL_DB_NAME,
      }
    }, null, 2));
  }

  // Standard express body parsers
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Helper function to create standard notifications
  async function notifyUser(userId: number, title: string, message: string, type: string) {
    try {
      await db.insert(notifications).values({
        userId,
        title,
        message,
        type,
        isRead: false,
      });
    } catch (err) {
      console.error("Failed to notify user:", err);
    }
  }

  // Temporary test DB endpoint to fetch info
  app.get("/api/test-db", async (req, res) => {
    try {
      const keys = {
        SQL_HOST: process.env.SQL_HOST,
        SQL_USER: process.env.SQL_USER,
        SQL_PASSWORD: process.env.SQL_PASSWORD ? "SET (length: " + process.env.SQL_PASSWORD.length + ")" : "NOT SET",
        SQL_DB_NAME: process.env.SQL_DB_NAME,
      };
      
      const testResult = await db.select().from(users).limit(1);
      res.json({ status: "success", keys, testResult });
    } catch (err: any) {
      console.error("Test DB error:", err);
      res.status(500).json({ status: "error", message: err.message, stack: err.stack, cause: err.cause });
    }
  });

  // API Route: Authentication synchronization
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      res.json({ status: "success", user: req.dbUser });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve uploads directory statically so they can be viewed/downloaded
  app.use("/uploads", express.static(uploadsDir));

  // Upload endpoint
  app.post("/api/upload", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { filename, base64Data } = req.body;
      if (!filename || !base64Data) {
        return res.status(400).json({ error: "Missing filename or base64Data" });
      }

      // Remove prefix if any (e.g., "data:application/pdf;base64,")
      const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
      let dataString = base64Data;
      if (matches && matches.length === 3) {
        dataString = matches[2];
      }

      const buffer = Buffer.from(dataString, "base64");
      const cleanFilename = Date.now() + "_" + filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const filePath = path.join(uploadsDir, cleanFilename);
      
      fs.writeFileSync(filePath, buffer);

      res.json({
        url: `/uploads/${cleanFilename}`,
        filename: cleanFilename,
        originalName: filename,
      });
    } catch (err: any) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Quick Demo Profile creator
  app.post("/api/auth/demo", async (req, res) => {
    try {
      const { role, email, name } = req.body;
      if (!role) {
        return res.status(400).json({ error: "Role is required ('admin', 'teacher', 'student')" });
      }

      const userEmail = email ? String(email).toLowerCase().trim() : `demo_${role}@classroom.com`;
      let finalRole = role;
      let finalName = name || `${role.charAt(0).toUpperCase() + role.slice(1)} Demo Account`;

      if (userEmail === "sarah.taylor@classroom.com") {
        finalRole = "teacher";
        finalName = "Dr. Sarah Taylor";
      } else if (userEmail === "admin@classroom.com") {
        finalRole = "admin";
        finalName = "Institution Administrator";
      } else if (userEmail === "emily.johnson@classroom.com") {
        finalRole = "student";
        finalName = "Emily Johnson";
      } else if (userEmail === "michael.chang@classroom.com") {
        finalRole = "student";
        finalName = "Michael Chang";
      }

      const existing = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
      if (existing.length > 0) {
        // Auto upgrade/self-heal existing record if they were registered with wrong role earlier
        let needsUpdate = false;
        let correctRole = existing[0].role;
        let correctName = existing[0].name;

        if (userEmail === "sarah.taylor@classroom.com" && existing[0].role !== "teacher") {
          correctRole = "teacher";
          correctName = "Dr. Sarah Taylor";
          needsUpdate = true;
        } else if (userEmail === "admin@classroom.com" && existing[0].role !== "admin") {
          correctRole = "admin";
          correctName = "Institution Administrator";
          needsUpdate = true;
        } else if (userEmail === "emily.johnson@classroom.com" && existing[0].role !== "student") {
          correctRole = "student";
          correctName = "Emily Johnson";
          needsUpdate = true;
        }

        if (needsUpdate) {
          const updated = await db.update(users)
            .set({ role: correctRole, name: correctName })
            .where(eq(users.id, existing[0].id))
            .returning();
          return res.json({ status: "success", user: updated[0] });
        }
        return res.json({ status: "success", user: existing[0] });
      }

      const inserted = await db.insert(users).values({
        uid: `demo_uid_${finalRole}_${Date.now()}`,
        email: userEmail,
        name: finalName,
        role: finalRole,
      }).returning();

      // Send greeting notification
      await notifyUser(
        inserted[0].id,
        "Welcome to AI Classroom!",
        `You have logged in successfully as a Demo ${finalRole.charAt(0).toUpperCase() + finalRole.slice(1)}.`,
        "system"
      );

      res.json({ status: "success", user: inserted[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Login with password '123456' for admin, teacher, student simulation
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Both email and password are required" });
      }

      const cleanEmail = String(email).toLowerCase().trim();
      const cleanPassword = String(password).trim();

      // Password must be 123456 as requested by user
      if (cleanPassword !== "123456") {
        return res.status(401).json({ error: "Invalid password. Default password is '123456'" });
      }

      // Determine clean role and names
      let role: "admin" | "teacher" | "student" = "student";
      let name = "Alex Mercer (Student)";

      if (cleanEmail === "admin@classroom.com" || cleanEmail.startsWith("admin")) {
        role = "admin";
        name = "Institution Administrator";
      } else if (cleanEmail === "sarah.taylor@classroom.com" || cleanEmail.startsWith("teacher") || cleanEmail.includes("teacher") || cleanEmail.includes("taylor") || cleanEmail.includes("sarah")) {
        role = "teacher";
        name = "Dr. Sarah Taylor";
      } else if (cleanEmail === "emily.johnson@classroom.com" || cleanEmail === "michael.chang@classroom.com" || cleanEmail.startsWith("student") || cleanEmail.includes("student") || cleanEmail.includes("johnson") || cleanEmail.includes("emily")) {
        role = "student";
        name = cleanEmail === "michael.chang@classroom.com" ? "Michael Chang" : "Emily Johnson";
      } else {
        // Fallback for custom emails
        role = "student";
        name = cleanEmail.split("@")[0].replace(/[^a-zA-Z]/g, " ");
        name = name.charAt(0).toUpperCase() + name.slice(1);
      }

      const existing = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
      if (existing.length > 0) {
        // Ensure user is not suspended
        if (existing[0].status === 'suspended') {
          return res.status(403).json({ error: "Your account is suspended." });
        }
        
        // Auto upgrade/self-heal existing record if they were registered with wrong role earlier
        let needsUpdate = false;
        let correctRole = existing[0].role;
        let correctName = existing[0].name;

        if (cleanEmail === "sarah.taylor@classroom.com" && existing[0].role !== "teacher") {
          correctRole = "teacher";
          correctName = "Dr. Sarah Taylor";
          needsUpdate = true;
        } else if (cleanEmail === "admin@classroom.com" && existing[0].role !== "admin") {
          correctRole = "admin";
          correctName = "Institution Administrator";
          needsUpdate = true;
        } else if (cleanEmail === "emily.johnson@classroom.com" && existing[0].role !== "student") {
          correctRole = "student";
          correctName = "Emily Johnson";
          needsUpdate = true;
        }

        if (needsUpdate) {
          const updated = await db.update(users)
            .set({ role: correctRole, name: correctName })
            .where(eq(users.id, existing[0].id))
            .returning();
          return res.json({ status: "success", user: updated[0] });
        }

        return res.json({ status: "success", user: existing[0] });
      }

      // Else create dummy profile on demand with passwordFallback
      const inserted = await db.insert(users).values({
        uid: `demo_uid_${role}_${Date.now()}`,
        email: cleanEmail,
        name: name,
        role: role,
        passwordFallback: cleanPassword,
      }).returning();

      // Welcome notification
      await notifyUser(
        inserted[0].id,
        "Welcome to AI Classroom!",
        `You have successfully logged into your custom ${role.toUpperCase()} account.`,
        "system"
      );

      res.json({ status: "success", user: inserted[0] });
    } catch (err: any) {
      res.status(550).json({ error: err.message });
    }
  });

  // API Route: Global Search (Classes, Teachers, Students, Assignments, Meetings, Files)
  app.get("/api/search", requireAuth, async (req: AuthRequest, res) => {
    try {
      const q = String(req.query.q || "").trim();
      if (!q) {
        return res.json({ classes: [], users: [], assignments: [], meetings: [] });
      }

      const matchClasses = await db.select().from(classes).where(
        or(like(classes.name, `%${q}%`), like(classes.subject, `%${q}%`))
      ).limit(5);

      const matchUsers = await db.select().from(users).where(
        or(like(users.name, `%${q}%`), like(users.email, `%${q}%`))
      ).limit(5);

      const matchAssignments = await db.select().from(assignments).where(
        or(like(assignments.title, `%${q}%`), like(assignments.description, `%${q}%`))
      ).limit(5);

      const matchMeetings = await db.select().from(meetings).where(
        or(like(meetings.title, `%${q}%`), like(meetings.description, `%${q}%`))
      ).limit(5);

      res.json({
        classes: matchClasses,
        users: matchUsers,
        assignments: matchAssignments,
        meetings: matchMeetings
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Users Management (Admin view / modify)
  app.get("/api/users", requireAuth, async (req: AuthRequest, res) => {
    try {
      const allUsers = await db.select().from(users).orderBy(desc(users.id));
      res.json(allUsers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/users", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.dbUser.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Admin access details only" });
      }
      const { name, email, role, status, passwordFallback } = req.body;
      const uidTemp = `admin_created_${Date.now()}`;
      
      const inserted = await db.insert(users).values({
        uid: uidTemp,
        name,
        email,
        role: role || 'student',
        status: status || 'active',
        passwordFallback,
      }).returning();

      res.json(inserted[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/users/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.dbUser.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Admin details update only" });
      }
      const targetId = parseInt(req.params.id);
      const { name, email, role, status, passwordFallback } = req.body;
      
      const updated = await db.update(users).set({
        name,
        email,
        role,
        status,
        passwordFallback,
      }).where(eq(users.id, targetId)).returning();

      res.json(updated[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/users/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.dbUser.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Admin modification only" });
      }
      const targetId = parseInt(req.params.id);
      
      // Handle cascades manually or trust constraints
      await db.delete(users).where(eq(users.id, targetId));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Classes Management
  app.get("/api/classes", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userRole = req.dbUser.role;
      const userId = req.dbUser.id;

      if (userRole === "admin") {
        // Admins see all classes
        const list = await db.select().from(classes).orderBy(desc(classes.id));
        res.json(list);
      } else if (userRole === "teacher") {
        // Teachers see classes they teach
        const list = await db.select().from(classes).where(eq(classes.teacherId, userId)).orderBy(desc(classes.id));
        res.json(list);
      } else {
        // Students see classes they are enrolled in
        const enrolled = await db.select({
          classObj: classes
        })
        .from(enrollments)
        .innerJoin(classes, eq(enrollments.classId, classes.id))
        .where(eq(enrollments.studentId, userId));

        res.json(enrolled.map(item => item.classObj));
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/classes", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.dbUser.role === "student") {
        return res.status(403).json({ error: "Only teachers or administrators can create classes." });
      }
      const { name, subject, description, grade, academicYear, batchName } = req.body;
      const joinCode = `JOIN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const inserted = await db.insert(classes).values({
        name,
        subject,
        description: description || "No description provided.",
        grade,
        academicYear,
        batchName,
        joinCode,
        teacherId: req.dbUser.id,
      }).returning();

      res.json(inserted[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/classes/join", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { joinCode } = req.body;
      if (!joinCode) {
        return res.status(400).json({ error: "Class join code is required." });
      }

      const cleanCode = String(joinCode).trim().toUpperCase();
      const match = await db.select().from(classes).where(eq(classes.joinCode, cleanCode)).limit(1);

      if (match.length === 0) {
        return res.status(404).json({ error: "Class not found with the provided code." });
      }

      const classroom = match[0];
      // Check existing enrollment
      const existing = await db.select().from(enrollments).where(
        and(eq(enrollments.classId, classroom.id), eq(enrollments.studentId, req.dbUser.id))
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: "You are already enrolled in this class." });
      }

      await db.insert(enrollments).values({
        classId: classroom.id,
        studentId: req.dbUser.id,
      });

      // Send confirmation to students
      await notifyUser(
        req.dbUser.id,
        "Enrolled in Class",
        `You have successfully joined ${classroom.name}! Check out assignments and materials.`,
        "system"
      );

      res.json({ success: true, classroom });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/classes/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const match = await db.select().from(classes).where(eq(classes.id, cid)).limit(1);
      if (match.length === 0) {
        return res.status(404).json({ error: "Class not found" });
      }
      
      // Get teacher profile
      let teacherProfile = null;
      if (match[0].teacherId) {
        const tMatch = await db.select().from(users).where(eq(users.id, match[0].teacherId)).limit(1);
        if (tMatch.length > 0) teacherProfile = tMatch[0];
      }

      // Enrolled students count
      const studs = await db.select().from(enrollments).where(eq(enrollments.classId, cid));

      res.json({
        ...match[0],
        teacher: teacherProfile,
        studentsCount: studs.length,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Students enrolled in class details
  app.get("/api/classes/:id/students", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const studentsList = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        status: users.status,
      })
      .from(enrollments)
      .innerJoin(users, eq(enrollments.studentId, users.id))
      .where(eq(enrollments.classId, cid));

      res.json(studentsList);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bulk add students to class
  app.post("/api/classes/:id/add-students-bulk", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const { emails } = req.body; // array of emails
      if (!Array.isArray(emails)) {
        return res.status(400).json({ error: "Missing active list of user emails" });
      }

      let successCount = 0;
      let errorCount = 0;

      for (const email of emails) {
        const cleanEmail = String(email).trim().toLowerCase();
        if (!cleanEmail) continue;

        // Try to find user, otherwise create a mock student profile
        let stdUser;
        const match = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
        if (match.length > 0) {
          stdUser = match[0];
        } else {
          const inserted = await db.insert(users).values({
            uid: `bulk_student_${Math.random().toString(36).substring(3)}`,
            email: cleanEmail,
            name: cleanEmail.split('@')[0],
            role: 'student'
          }).returning();
          stdUser = inserted[0];
        }

        // Verify enrollment
        const enrollCheck = await db.select().from(enrollments).where(
          and(eq(enrollments.classId, cid), eq(enrollments.studentId, stdUser.id))
        );

        if (enrollCheck.length === 0) {
          await db.insert(enrollments).values({
            classId: cid,
            studentId: stdUser.id
          });
          successCount++;
        } else {
          errorCount++;
        }
      }

      res.json({ success: true, successCount, errorCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Archive or delete classes
  app.put("/api/classes/:id/archive", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const updated = await db.update(classes).set({ archived: true }).where(eq(classes.id, cid)).returning();
      res.json(updated[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/classes/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      await db.delete(classes).where(eq(classes.id, cid));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Materials Management
  app.get("/api/classes/:id/materials", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const list = await db.select().from(materials).where(eq(materials.classId, cid)).orderBy(desc(materials.id));
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/classes/:id/materials", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const { title, type, fileUrl, description, organizeType, organizeValue, folder } = req.body;

      const inserted = await db.insert(materials).values({
        classId: cid,
        title,
        type,
        fileUrl: fileUrl || "https://example.com/mock-doc.pdf",
        description: description || "",
        organizeType: organizeType || "unit",
        organizeValue: organizeValue || "Unit 1",
        folder: folder || "",
      }).returning();

      // Notify students
      const stds = await db.select().from(enrollments).where(eq(enrollments.classId, cid));
      for (const std of stds) {
        await notifyUser(
          std.studentId,
          "New Study Material",
          `Study materials "${title}" have been uploaded under ${organizeValue}${folder ? ` > ${folder}` : ""}.`,
          "material"
        );
      }

      res.json(inserted[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/materials/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.dbUser.role !== 'teacher' && req.dbUser.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Only teachers or admins can delete materials" });
      }
      const mid = parseInt(req.params.id);
      await db.delete(materials).where(eq(materials.id, mid));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/materials/:id/move", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.dbUser.role !== 'teacher' && req.dbUser.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Only teachers or admins can move materials" });
      }
      const mid = parseInt(req.params.id);
      const { folder } = req.body;
      await db.update(materials).set({ folder: folder || "" }).where(eq(materials.id, mid));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/classes/:id/rename-folder", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (req.dbUser.role !== 'teacher' && req.dbUser.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Only teachers or admins can rename folders" });
      }
      const cid = parseInt(req.params.id);
      const { oldFolder, newFolder } = req.body;
      
      if (!oldFolder || !newFolder) {
        return res.status(400).json({ error: "Missing oldFolder or newFolder parameter" });
      }

      const classMats = await db.select().from(materials).where(eq(materials.classId, cid));

      for (const mat of classMats) {
        let updatedFolder = mat.folder;
        let updatedOrganizeValue = mat.organizeValue;
        let needsUpdate = false;

        if (mat.folder) {
          if (mat.folder === oldFolder) {
            updatedFolder = newFolder;
            needsUpdate = true;
          } else if (mat.folder.startsWith(oldFolder + " > ")) {
            updatedFolder = newFolder + mat.folder.substring(oldFolder.length);
            needsUpdate = true;
          }
        }

        if (mat.type === 'folder' && mat.organizeValue === oldFolder.split(' > ').pop()) {
          const parts = newFolder.split(' > ');
          updatedOrganizeValue = parts[parts.length - 1];
          needsUpdate = true;
        }

        if (needsUpdate) {
          await db.update(materials)
            .set({ folder: updatedFolder, organizeValue: updatedOrganizeValue })
            .where(eq(materials.id, mat.id));
        }
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/materials/:id/flashcards", requireAuth, async (req: AuthRequest, res) => {
    try {
      const mid = parseInt(req.params.id);
      const material = await db.select().from(materials).where(eq(materials.id, mid)).limit(1);
      if (!material || material.length === 0) {
        return res.status(404).json({ error: "Material not found" });
      }
      
      const flashcardsData = await generateStudyFlashcardsAI(
        material[0].title,
        material[0].description || "General Study Concept"
      );

      res.json(flashcardsData);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Assignments & AI Generator
  app.get("/api/classes/:id/assignments", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const list = await db.select().from(assignments).where(eq(assignments.classId, cid)).orderBy(desc(assignments.id));
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/classes/:id/assignments", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const { title, description, instructions, dueDate, maxMarks, type, status, lateAllowed, rubric, attachmentUrl } = req.body;

      const inserted = await db.insert(assignments).values({
        classId: cid,
        title,
        description,
        instructions: instructions || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        maxMarks: maxMarks ? parseInt(maxMarks) : 100,
        type: type || "homework",
        status: status || "published",
        lateAllowed: lateAllowed ?? true,
        rubric: rubric || "",
        attachmentUrl: attachmentUrl || null,
      }).returning();

      if (status !== 'draft') {
        const stds = await db.select().from(enrollments).where(eq(enrollments.classId, cid));
        for (const std of stds) {
          await notifyUser(
            std.studentId,
            "Assignment Created",
            `A new assignment "${title}" has been published. Due date: ${dueDate ? new Date(dueDate).toLocaleString() : 'No Limit'}.`,
            "assignment"
          );
        }
      }

      res.json(inserted[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Trigger Gemini AI Assignment Generator
  app.post("/api/classes/:id/assignments/generate", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { type, topic } = req.body;
      if (!type || !topic) {
        return res.status(400).json({ error: "Assignment type and topic are required." });
      }

      const generated = await generateAssignmentAI(type, topic);
      res.json({ success: true, assignment: generated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Student Assignment Submissions fetch & create
  app.get("/api/assignments/:id/submissions", requireAuth, async (req: AuthRequest, res) => {
    try {
      const aid = parseInt(req.params.id);
      let list;
      
      if (req.dbUser.role === 'student') {
        // Students only find their own
        list = await db.select().from(submissions).where(
          and(eq(submissions.assignmentId, aid), eq(submissions.studentId, req.dbUser.id))
        ).orderBy(desc(submissions.id));
      } else {
        // Admins and Teachers see all
        list = await db.select({
          submission: submissions,
          student: users
        })
        .from(submissions)
        .innerJoin(users, eq(submissions.studentId, users.id))
        .where(eq(submissions.assignmentId, aid))
        .orderBy(desc(submissions.id));
      }
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/assignments/:id/submit", requireAuth, async (req: AuthRequest, res) => {
    try {
      const aid = parseInt(req.params.id);
      const { fileUrl, textContent, linkUrl } = req.body;

      // Check duplicate
      const existing = await db.select().from(submissions).where(
        and(eq(submissions.assignmentId, aid), eq(submissions.studentId, req.dbUser.id))
      ).limit(1);

      let result;
      if (existing.length > 0) {
        result = await db.update(submissions).set({
          fileUrl,
          textContent,
          linkUrl,
          status: "submitted",
          submittedAt: new Date()
        }).where(eq(submissions.id, existing[0].id)).returning();
      } else {
        result = await db.insert(submissions).values({
          assignmentId: aid,
          studentId: req.dbUser.id,
          fileUrl,
          textContent,
          linkUrl,
          status: "submitted",
        }).returning();
      }

      res.json(result[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Teacher manually grading Submission
  app.post("/api/submissions/:id/grade", requireAuth, async (req: AuthRequest, res) => {
    try {
      const sid = parseInt(req.params.id);
      const { grade, feedback } = req.body;

      const updated = await db.update(submissions).set({
        grade,
        feedback,
        status: "graded",
        gradedAt: new Date()
      }).where(eq(submissions.id, sid)).returning();

      // Retrieve submission context to notify student
      const sub = updated[0];
      await notifyUser(
        sub.studentId,
        "Assignment Graded",
        `Your submission has been evaluated. Score: ${grade}. View grading breakdowns and feedback details inside the assignment dashboard.`,
        "grade"
      );

      res.json(sub);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI Assistant: generate Grading Suggestion & Weak Areas Report
  app.post("/api/submissions/:id/ai-grade", requireAuth, async (req: AuthRequest, res) => {
    try {
      const sid = parseInt(req.params.id);
      const submissionMatch = await db.select().from(submissions).where(eq(submissions.id, sid)).limit(1);
      if (submissionMatch.length === 0) {
        return res.status(404).json({ error: "Submission not found" });
      }

      const submission = submissionMatch[0];
      const assignmentMatch = await db.select().from(assignments).where(eq(assignments.id, submission.assignmentId)).limit(1);
      
      const title = assignmentMatch.length > 0 ? assignmentMatch[0].title : "Subject Homework";
      const descText = assignmentMatch.length > 0 ? assignmentMatch[0].description : "Practice writing";
      const maxM = assignmentMatch.length > 0 ? assignmentMatch[0].maxMarks : 100;

      const submissionContent = submission.textContent || `Attached file URL: ${submission.fileUrl || submission.linkUrl || "Not applicable"}`;

      // Call Gemini Grading Assistant helper
      const aiResult = await gradeSubmissionAI(title, descText, submissionContent, maxM);

      // Save AI Suggestions to DB
      const updated = await db.update(submissions).set({
        aiSuggestedGrade: aiResult.suggestedGrade,
        aiSuggestedFeedback: aiResult.feedback,
        aiWeakAreas: JSON.stringify(aiResult.weakAreas),
      }).where(eq(submissions.id, sid)).returning();

      res.json({
        success: true,
        submission: updated[0],
        aiResult
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Meetings Schedule & simulated logs
  app.get("/api/classes/:id/meetings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const list = await db.select().from(meetings).where(eq(meetings.classId, cid)).orderBy(desc(meetings.id));
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get a specific meeting and classroom info for link-based joining
  app.get("/api/meetings/:meetingId", requireAuth, async (req: AuthRequest, res) => {
    try {
      const mid = parseInt(req.params.meetingId);
      const mtRows = await db.select().from(meetings).where(eq(meetings.id, mid)).limit(1);
      if (mtRows.length === 0) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      const meetingObj = mtRows[0];
      const classRows = await db.select().from(classes).where(eq(classes.id, meetingObj.classId)).limit(1);
      const classroomObj = classRows.length > 0 ? classRows[0] : null;

      // fetch registered students (classroom roster)
      const enrolled = await db.select({
        student: users
      })
      .from(enrollments)
      .innerJoin(users, eq(enrollments.studentId, users.id))
      .where(eq(enrollments.classId, meetingObj.classId));

      res.json({
        meeting: meetingObj,
        classroom: classroomObj,
        students: enrolled.map(item => item.student)
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/classes/:id/meetings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const { title, date, time, duration, description, type, joinLink } = req.body;
      const finalJoinLink = joinLink || `/classes/${cid}/meetings/live-${Math.random().toString(36).substring(3, 9)}`;

      const inserted = await db.insert(meetings).values({
        classId: cid,
        title,
        date,
        time,
        duration: duration ? parseInt(duration) : 60,
        description: description || "",
        type: type || "live_class",
        joinLink: finalJoinLink,
        recordingUrl: Math.random() > 0.3 ? `https://example.com/recordings/meeting-${Date.now()}.mp4` : null,
      }).returning();

      // Notify classroom enrolled students
      const stds = await db.select().from(enrollments).where(eq(enrollments.classId, cid));
      for (const std of stds) {
        await notifyUser(
          std.studentId,
          `Meeting Scheduled: ${title}`,
          `Join link added for: ${date} at ${time}. Type: ${type.replace('_', ' ')}.`,
          "meeting"
        );
      }

      res.json(inserted[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Attendance
  app.get("/api/classes/:id/attendance", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const records = await db.select({
        record: attendance,
        student: users
      })
      .from(attendance)
      .innerJoin(users, eq(attendance.studentId, users.id))
      .where(eq(attendance.classId, cid))
      .orderBy(desc(attendance.markedAt));

      res.json(records);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/classes/:id/attendance", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      const { date, records } = req.body; // records is an array of { studentId: number, status: string }
      if (!date || !Array.isArray(records)) {
        return res.status(400).json({ error: "Missing active date string or student records array" });
      }

      const results = [];
      for (const rec of records) {
        // Upsert standard attendance
        const existing = await db.select().from(attendance).where(
          and(
            eq(attendance.classId, cid),
            eq(attendance.studentId, rec.studentId),
            eq(attendance.date, date)
          )
        ).limit(1);

        let result;
        if (existing.length > 0) {
          result = await db.update(attendance).set({
            status: rec.status,
            markedAt: new Date()
          }).where(eq(attendance.id, existing[0].id)).returning();
        } else {
          result = await db.insert(attendance).values({
            classId: cid,
            studentId: rec.studentId,
            status: rec.status,
            date,
          }).returning();
        }
        results.push(result[0]);
      }

      res.json({ success: true, results });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Notifications Inbox
  app.get("/api/notifications", requireAuth, async (req: AuthRequest, res) => {
    try {
      const list = await db.select().from(notifications).where(eq(notifications.userId, req.dbUser.id)).orderBy(desc(notifications.id));
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/notifications/:id/read", requireAuth, async (req: AuthRequest, res) => {
    try {
      const nid = parseInt(req.params.id);
      const updated = await db.update(notifications).set({ isRead: true }).where(
        and(eq(notifications.id, nid), eq(notifications.userId, req.dbUser.id))
      ).returning();

      res.json(updated[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Institution Analytics (Admins Only)
  app.get("/api/analytics/institution", requireAuth, async (req: AuthRequest, res) => {
    try {
      const classCount = await db.select({ count: sql`count(*)` }).from(classes);
      const teacherCount = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.role, 'teacher'));
      const studentCount = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.role, 'student'));
      const assignmentCount = await db.select({ count: sql`count(*)` }).from(assignments);
      const submissionCount = await db.select({ count: sql`count(*)` }).from(submissions);
      const meetingCount = await db.select({ count: sql`count(*)` }).from(meetings);

      // Simple attendance percentage
      const totalAtt = await db.select({ count: sql`count(*)` }).from(attendance);
      const presentAtt = await db.select({ count: sql`count(*)` }).from(attendance).where(eq(attendance.status, 'present'));

      let attendancePct = 85; 
      if (Number(totalAtt[0].count) > 0) {
        attendancePct = Math.round((Number(presentAtt[0].count) / Number(totalAtt[0].count)) * 100);
      }

      res.json({
        totalClasses: Number(classCount[0].count),
        totalTeachers: Number(teacherCount[0].count),
        totalStudents: Number(studentCount[0].count),
        totalAssignments: Number(assignmentCount[0].count),
        totalSubmissions: Number(submissionCount[0].count),
        totalMeetings: Number(meetingCount[0].count),
        attendanceOverview: attendancePct,
        submissionRate: Number(assignmentCount[0].count) > 0 
          ? Math.round((Number(submissionCount[0].count) / (Number(assignmentCount[0].count) * Number(studentCount[0].count || 1))) * 100) 
          : 70
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Teacher Private Notes for individual student performance
  app.get("/api/classes/:classId/students/:studentId/notes", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userRole = req.dbUser.role;
      if (userRole !== 'teacher' && userRole !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Only teachers or admins can access private student notes" });
      }

      const cid = parseInt(req.params.classId);
      const studentId = parseInt(req.params.studentId);

      const notes = await db.select()
        .from(teacherNotes)
        .where(
          and(
            eq(teacherNotes.classId, cid),
            eq(teacherNotes.studentId, studentId)
          )
        )
        .orderBy(desc(teacherNotes.updatedAt));

      res.json(notes);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/classes/:classId/students/:studentId/notes", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userRole = req.dbUser.role;
      if (userRole !== 'teacher' && userRole !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Only teachers can keep internal records" });
      }

      const cid = parseInt(req.params.classId);
      const studentId = parseInt(req.params.studentId);
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: "Note content cannot be empty" });
      }

      const inserted = await db.insert(teacherNotes).values({
        classId: cid,
        studentId: studentId,
        content: content.trim(),
      }).returning();

      res.json(inserted[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/classes/:classId/notes/:noteId", requireAuth, async (req: AuthRequest, res) => {
    try {
      const userRole = req.dbUser.role;
      if (userRole !== 'teacher' && userRole !== 'admin') {
        return res.status(403).json({ error: "Forbidden: Only teachers can manage internal records" });
      }

      const noteId = parseInt(req.params.noteId);
      await db.delete(teacherNotes).where(eq(teacherNotes.id, noteId));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes: Class Analytics & AI risk student detector
  app.get("/api/classes/:id/analytics", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      
      const enrolled = await db.select({
        student: users
      })
      .from(enrollments)
      .innerJoin(users, eq(enrollments.studentId, users.id))
      .where(eq(enrollments.classId, cid));

      const studentsCount = enrolled.length;
      const classAssignments = await db.select().from(assignments).where(eq(assignments.classId, cid));
      const classMeetings = await db.select().from(meetings).where(eq(meetings.classId, cid));

      const performanceList = [];
      for (const std of enrolled) {
        // Attendance logs
        const attLogs = await db.select().from(attendance).where(
          and(eq(attendance.classId, cid), eq(attendance.studentId, std.student.id))
        );
        const presentCount = attLogs.filter(a => a.status === 'present').length;
        const totalMeetingsWithLogs = attLogs.length;
        const attRate = totalMeetingsWithLogs > 0 ? Math.round((presentCount / totalMeetingsWithLogs) * 100) : 100;

        // Submissions graded
        const subs = await db.select().from(submissions).innerJoin(assignments, eq(submissions.assignmentId, assignments.id)).where(
          and(eq(assignments.classId, cid), eq(submissions.studentId, std.student.id))
        );
        const grades = subs.map(s => parseFloat(s.submissions.grade || "0")).filter(g => !isNaN(g) && g > 0);
        const avgGrade = grades.length > 0 ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length) : 80;
        const missedCount = classAssignments.length - subs.length;

        performanceList.push({
          id: std.student.id,
          name: std.student.name,
          email: std.student.email,
          attendance: attRate,
          avgGrade,
          missedCount
        });
      }

      // Generate AI Analytics / recommendations
      const aiResponse = await generateAnalyticsReportAI(performanceList);

      res.json({
        studentsCount,
        assignmentsCount: classAssignments.length,
        meetingsCount: classMeetings.length,
        studentsData: performanceList,
        aiAnalytics: aiResponse
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/classes/:id/student-submissions", requireAuth, async (req: AuthRequest, res) => {
    try {
      const cid = parseInt(req.params.id);
      
      const classAssignments = await db.select().from(assignments).where(eq(assignments.classId, cid));
      if (classAssignments.length === 0) {
        return res.json([]);
      }
      
      const assignmentIds = classAssignments.map(a => a.id);
      
      let list;
      if (req.dbUser.role === 'student') {
        list = await db.select().from(submissions).where(
          and(
            inArray(submissions.assignmentId, assignmentIds),
            eq(submissions.studentId, req.dbUser.id)
          )
        );
      } else {
        list = await db.select().from(submissions).where(
          inArray(submissions.assignmentId, assignmentIds)
        );
      }
      
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // SEEDER: Auto Populate Database with default files on Clean Startup
  try {
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length === 0) {
      console.log("Empty database detected. Seeding defaults...");
      
      const seedUsers = await db.insert(users).values([
        { uid: "seed_admin", name: "Institution Administrator", email: "admin@classroom.com", role: "admin" },
        { uid: "seed_teacher", name: "Dr. Sarah Taylor", email: "sarah.taylor@classroom.com", role: "teacher" },
        { uid: "seed_student_1", name: "Emily Johnson", email: "emily.johnson@classroom.com", role: "student" },
        { uid: "seed_student_2", name: "Michael Chang", email: "michael.chang@classroom.com", role: "student" },
      ]).returning();

      const admin = seedUsers.find(u => u.role === 'admin')!;
      const teacher = seedUsers.find(u => u.role === 'teacher')!;
      const student1 = seedUsers.find(u => u.uid === 'seed_student_1')!;
      const student2 = seedUsers.find(u => u.uid === 'seed_student_2')!;

      // Create Classes
      const seedClasses = await db.insert(classes).values([
        { name: "ACT English Batch A", subject: "English", description: "Comprehensive grammar, punctuation, and rhetoric strategies.", grade: "Grade 11", academicYear: "2026-2027", batchName: "Batch A", joinCode: "ACT-ENG-A", teacherId: teacher.id },
        { name: "ACT Reading Batch B", subject: "English Reading", description: "Focused strategies for active reading, speed, and critical analysis.", grade: "Grade 11", academicYear: "2026-2027", joinCode: "ACT-READ-B", batchName: "Batch B", teacherId: teacher.id },
        { name: "ACT Math Batch D", subject: "Mathematics", description: "Algebra, geometry, trigonometry, and general problem solving.", grade: "Grade 12", academicYear: "2026-2027", joinCode: "ACT-MATH-D", batchName: "Batch D", teacherId: teacher.id },
      ]).returning();

      const actEng = seedClasses[0];
      const actMath = seedClasses[2];

      // Enroll students in Classes
      await db.insert(enrollments).values([
        { classId: actEng.id, studentId: student1.id },
        { classId: actEng.id, studentId: student2.id },
        { classId: actMath.id, studentId: student1.id },
      ]);

      // Add Study Materials
      await db.insert(materials).values([
        { classId: actEng.id, title: "English Grammar Bible", type: "pdf", fileUrl: "https://example.com/books/grammar-bible.pdf", description: "All rules needed to master English punctuations.", organizeType: "unit", organizeValue: "Unit 1: Punctuation Rules" },
        { classId: actEng.id, title: "Rhetorical Practice Questions", type: "docx", fileUrl: "https://example.com/exercises/rhetoric.docx", description: "Sentence flow and transitions workbook.", organizeType: "week", organizeValue: "Week 2 - Flow and Transitions" },
        { classId: actMath.id, title: "ACT Trigonometry Guide", type: "ppt", fileUrl: "https://example.com/slide/act-trig.pptx", description: "Mastering sin, cos, and tan identities with triangles.", organizeType: "chapter", organizeValue: "Chapter 3: Trigonometry Essentials" },
      ]);

      // Add Assignments
      const actEngAssignments = await db.insert(assignments).values([
        { classId: actEng.id, title: "Grammar Rules Practice Test", description: "Identify mistakes in subject-verb agreement and punctuation", instructions: "Please choose the correct alternative for each underlined section.", maxMarks: 50, type: "act_test", rubric: "50 pts - Complete and correct answers; 30 pts - Minor errors; 0 pts - Unsubmitted." },
        { classId: actEng.id, title: "Introductory Rhetoric Essay", description: "Write an introductory essay addressing dynamic themes", maxMarks: 100, type: "essay" },
      ]).returning();

      // Submit sample answers for student 1
      const sub1 = await db.insert(submissions).values({
        assignmentId: actEngAssignments[0].id,
        studentId: student1.id,
        textContent: "The rules of English grammar dictate that sentences must match. Here are my structural corrections: Q1 is option B, Q2 is option C.",
        grade: "45",
        feedback: "Outstanding command of punctuations. Revise rhetorical flow on transitions.",
        status: "graded",
        gradedAt: new Date(),
      }).returning();

      // Submit sample answers for student 2 (ungraded)
      await db.insert(submissions).values({
        assignmentId: actEngAssignments[0].id,
        studentId: student2.id,
        textContent: "Intro homework submitted here. English structure seems clear in these paragraphs.",
        status: "submitted",
      });

      // Schedule Meetings
      const meetingList = await db.insert(meetings).values([
        { classId: actEng.id, title: "Live Prep: English Mastery", date: "2026-06-15", time: "14:00", duration: 60, description: "Review punctuation rules live with feedback.", type: "live_class", joinLink: `/classes/${actEng.id}/meetings/live-room-1` },
        { classId: actEng.id, title: "Doubt Solving: Subject Verb Agreement", date: "2026-06-16", time: "16:00", duration: 45, description: "Personalized question reviews.", type: "doubt_session", joinLink: `/classes/${actEng.id}/meetings/live-room-2` },
      ]).returning();

      // Seed Attendance
      await db.insert(attendance).values([
        { classId: actEng.id, meetingId: meetingList[0].id, studentId: student1.id, status: "present", date: "2026-06-15" },
        { classId: actEng.id, meetingId: meetingList[0].id, studentId: student2.id, status: "absent", date: "2026-06-15" },
      ]);

      console.log("Seeding complete!");
    }
  } catch (err) {
    console.error("Failed to seed database defaults:", err);
  }


  // Vite Middleware Setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startServer();
