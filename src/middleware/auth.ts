// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

let supabase: any;

export interface AuthRequest extends Request {
  user?: any;     // Raw user decoded object
  dbUser?: any;   // Database model user
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!supabase) {
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_ANON_KEY) {
      return res.status(500).json({ error: "Server Configuration Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY Environment Variables in Vercel." });
    }
    supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    // Verify Supabase Token using the Supabase Client (handles ES256/JWKS automatically)
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Supabase token verification error:', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = user;
    const uid = user.id;
    const decodedToken = { 
      email: user.email, 
      name: user.user_metadata?.full_name || user.user_metadata?.name 
    };
    
    // Search or register the user in the database
    const userRecords = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    
    if (userRecords.length > 0) {
      if (userRecords[0].status === 'suspended') {
        return res.status(403).json({ error: 'Access forbidden: User account is suspended' });
      }
      
      // Auto upgrade if matched
      let needsUpdate = false;
      let correctRole = userRecords[0].role;
      let correctName = userRecords[0].name;

      if (decodedToken.email === "software3369@gmail.com" && userRecords[0].role !== "teacher") {
        correctRole = "teacher";
        correctName = "Dr. Sarah Taylor";
        needsUpdate = true;
      } else if (decodedToken.email === "admink338@gmail.com" && userRecords[0].role !== "admin") {
        correctRole = "admin";
        correctName = "Institution Administrator";
        needsUpdate = true;
      } else if (decodedToken.email === "kssg8790@gmail.com" && userRecords[0].role !== "student") {
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
      if (decodedToken.email === 'software3369@gmail.com') {
        defaultRole = 'teacher';
        defaultName = 'Dr. Sarah Taylor';
      } else if (decodedToken.email === 'admink338@gmail.com') {
        defaultRole = 'admin';
        defaultName = 'Institution Administrator';
      } else if (decodedToken.email === 'kssg8790@gmail.com') {
        defaultRole = 'student';
        defaultName = 'Emily Johnson';
      }

      const inserted = await db.insert(users).values({
        uid: uid,
        email: decodedToken.email || `user_${uid.slice(0, 5)}@classroom.com`,
        name: defaultName,
        role: defaultRole,
      }).returning();
      req.dbUser = inserted[0];
    }
    
    next();
  } catch (error) {
    console.error('Error verifying Supabase token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
