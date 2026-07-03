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

import jwt from 'jsonwebtoken';

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // We still initialize Supabase just in case other parts of the app need the client,
  // but we won't use it for the slow getUser() network call anymore.
  if (!supabase) {
    const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      return res.status(500).json({ error: "Server Configuration Error: Missing Supabase Environment Variables in Vercel (Tried VITE_ and NEXT_PUBLIC_ prefixes)." });
    }
    supabase = createClient(url, key);
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    let user;
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    
    // OPTIMIZATION: Local JWT Verification for Serverless (Vercel)
    // By verifying the token locally using the JWT Secret, we eliminate a 200-500ms 
    // network request to the Supabase Auth server on EVERY SINGLE API call.
    if (jwtSecret) {
      try {
        const decoded = jwt.verify(token, jwtSecret) as any;
        user = {
          id: decoded.sub,
          email: decoded.email,
          user_metadata: {
            full_name: decoded.user_metadata?.full_name || decoded.name,
            name: decoded.user_metadata?.name || decoded.name
          }
        };
      } catch (jwtErr) {
        console.error('Local JWT verification failed:', jwtErr);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    } else {
      // Fallback to slow network verification if secret is missing
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error || !data.user) {
        console.error('Supabase token verification error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
      user = data.user;
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
      
      req.dbUser = userRecords[0];
    } else {
      // Lazy register
      let defaultRole = 'student';
      let defaultName = decodedToken.name || 'Student';
      
      if (decodedToken.email === 'software3369@gmail.com') {
        defaultRole = 'teacher';
      } else if (decodedToken.email === 'admink338@gmail.com') {
        defaultRole = 'admin';
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
