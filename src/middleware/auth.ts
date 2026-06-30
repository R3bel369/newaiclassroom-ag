// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: any;     // Raw user decoded object
  dbUser?: any;   // Database model user
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Check for Demo Header first to simplify local evaluation inside preview frames
  const demoRole = req.headers['x-demo-user-role'];
  const demoEmail = req.headers['x-demo-user-email'];
  
  if (demoRole) {
    const roleStr = String(demoRole);
    const emailStr = demoEmail ? String(demoEmail) : `demo_${roleStr}@classroom.com`;
    // Find or create demo user in DB
    try {
      const existing = await db.select().from(users).where(eq(users.email, emailStr)).limit(1);
      if (existing.length > 0) {
        let needsUpdate = false;
        let correctRole = existing[0].role;
        let correctName = existing[0].name;

        if (emailStr === "sarah.taylor@classroom.com" && existing[0].role !== "teacher") {
          correctRole = "teacher";
          correctName = "Dr. Sarah Taylor";
          needsUpdate = true;
        } else if (emailStr === "admin@classroom.com" && existing[0].role !== "admin") {
          correctRole = "admin";
          correctName = "Institution Administrator";
          needsUpdate = true;
        } else if (emailStr === "emily.johnson@classroom.com" && existing[0].role !== "student") {
          correctRole = "student";
          correctName = "Emily Johnson";
          needsUpdate = true;
        }

        if (needsUpdate) {
          const updated = await db.update(users)
            .set({ role: correctRole, name: correctName })
            .where(eq(users.id, existing[0].id))
            .returning();
          req.dbUser = updated[0];
        } else {
          req.dbUser = existing[0];
        }
        
        req.user = { uid: req.dbUser.uid, email: req.dbUser.email, name: req.dbUser.name };
        return next();
      } else {
        // Create demo profile
        let finalRole = roleStr;
        let finalName = `${roleStr.charAt(0).toUpperCase() + roleStr.slice(1)} Demo Account`;

        if (emailStr === "sarah.taylor@classroom.com") {
          finalRole = "teacher";
          finalName = "Dr. Sarah Taylor";
        } else if (emailStr === "admin@classroom.com") {
          finalRole = "admin";
          finalName = "Institution Administrator";
        } else if (emailStr === "emily.johnson@classroom.com") {
          finalRole = "student";
          finalName = "Emily Johnson";
        } else if (emailStr === "michael.chang@classroom.com") {
          finalRole = "student";
          finalName = "Michael Chang";
        }

        const inserted = await db.insert(users).values({
          uid: `demo_uid_${finalRole}_${Date.now()}`,
          email: emailStr,
          name: finalName,
          role: finalRole,
        }).returning();
        req.dbUser = inserted[0];
        req.user = { uid: inserted[0].uid, email: inserted[0].email, name: inserted[0].name };
        return next();
      }
    } catch (err) {
      console.error("Error setting up demo user:", err);
    }
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    // Search or register the user in the database
    const userRecords = await db.select().from(users).where(eq(users.uid, decodedToken.uid)).limit(1);
    
    if (userRecords.length > 0) {
      if (userRecords[0].status === 'suspended') {
        return res.status(403).json({ error: 'Access forbidden: User account is suspended' });
      }
      
      // Auto upgrade if matched
      let needsUpdate = false;
      let correctRole = userRecords[0].role;
      let correctName = userRecords[0].name;

      if (decodedToken.email === "sarah.taylor@classroom.com" && userRecords[0].role !== "teacher") {
        correctRole = "teacher";
        correctName = "Dr. Sarah Taylor";
        needsUpdate = true;
      } else if (decodedToken.email === "admin@classroom.com" && userRecords[0].role !== "admin") {
        correctRole = "admin";
        correctName = "Institution Administrator";
        needsUpdate = true;
      } else if (decodedToken.email === "emily.johnson@classroom.com" && userRecords[0].role !== "student") {
        correctRole = "student";
        correctName = "Emily Johnson";
        needsUpdate = true;
      }

      if (needsUpdate) {
        const updated = await db.update(users)
          .set({ role: correctRole, name: correctName })
          .where(eq(users.id, userRecords[0].id))
          .returning();
        req.dbUser = updated[0];
      } else {
        req.dbUser = userRecords[0];
      }
    } else {
      // Lazy register
      let defaultRole = 'student';
      let defaultName = decodedToken.name || 'Anonymous Learner';
      if (decodedToken.email === 'sarah.taylor@classroom.com') {
        defaultRole = 'teacher';
        defaultName = 'Dr. Sarah Taylor';
      } else if (decodedToken.email === 'admin@classroom.com') {
        defaultRole = 'admin';
        defaultName = 'Institution Administrator';
      } else if (decodedToken.email === 'emily.johnson@classroom.com') {
        defaultRole = 'student';
        defaultName = 'Emily Johnson';
      }

      const inserted = await db.insert(users).values({
        uid: decodedToken.uid,
        email: decodedToken.email || `user_${decodedToken.uid.slice(0, 5)}@classroom.com`,
        name: defaultName,
        role: defaultRole,
      }).returning();
      req.dbUser = inserted[0];
    }
    
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
