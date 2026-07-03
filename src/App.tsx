// src/App.tsx
import React, { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Users, FolderOpen, Calendar, GraduationCap, Folder, FolderPlus, Home, 
  Search, Bell, LogIn, User, Settings, Layers, Star, Plus, 
  Trash2, Edit, AlertCircle, CheckCircle, Video, Clock, 
  ChevronRight, ArrowRight, Sparkles, Send, Award, FileText, 
  Tv, ClipboardCheck, ArrowUpRight, BarChart3, CloudLightning,
  ChevronDown, ExternalLink, RefreshCw, Upload, Check, UserMinus, PlusCircle, Copy, ChevronLeft, HelpCircle, RotateCcw, TrendingUp, CalendarRange, Sun, Moon, Lock, NotebookPen, X, Trophy, Medal, Download, Eye,
  Megaphone, MessageSquare, ThumbsUp, Pin, Shuffle, LayoutGrid, Paperclip
} from 'lucide-react';
import { 
  UserProfile, Classroom, LearningMaterial, 
  Assignment, Submission, Meeting, AttendanceRecord, AppNotification 
} from './types.ts';
import MeetingRoom from './components/MeetingRoom.tsx';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { supabase } from './lib/supabase.ts';

// Intercept all fetch requests to inject Supabase auth headers dynamically without modifying read-only window.fetch
const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  if (typeof window === 'undefined') {
    return (globalThis as any).fetch(input, init);
  }
  
  const newInit = { ...init };
  const headers = new Headers(newInit.headers as any);
  
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }
  
  newInit.headers = headers;
  return window.fetch(input, newInit);
};

// Shadow custom fetch helper
const fetch = customFetch;

// Primary client-side application container
export default function App() {
  // Navigation & User Context States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('demo_logged_in') === 'true';
    }
    return false;
  });
  const [activeRole, setActiveRole] = useState<'admin' | 'teacher' | 'student'>(() => {
    if (typeof window !== 'undefined') {
      const r = localStorage.getItem('demo_logged_role');
      if (r === 'admin' || r === 'teacher' || r === 'student') return r;
    }
    return 'admin';
  });
  const [activeEmail, setActiveEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('demo_logged_email') || '';
    }
// src/App.tsx
import React, { useState, useEffect, startTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Users, FolderOpen, Calendar, GraduationCap, Folder, FolderPlus, Home, 
  Search, Bell, LogIn, User, Settings, Layers, Star, Plus, 
  Trash2, Edit, AlertCircle, CheckCircle, Video, Clock, 
  ChevronRight, ArrowRight, Sparkles, Send, Award, FileText, 
  Tv, ClipboardCheck, ArrowUpRight, BarChart3, CloudLightning,
  ChevronDown, ExternalLink, RefreshCw, Upload, Check, UserMinus, PlusCircle, Copy, ChevronLeft, HelpCircle, RotateCcw, TrendingUp, CalendarRange, Sun, Moon, Lock, NotebookPen, X, Trophy, Medal, Download, Eye,
  Megaphone, MessageSquare, ThumbsUp, Pin, Shuffle, LayoutGrid, Paperclip
} from 'lucide-react';
import { 
  UserProfile, Classroom, LearningMaterial, 
  Assignment, Submission, Meeting, AttendanceRecord, AppNotification 
} from './types.ts';
import MeetingRoom from './components/MeetingRoom.tsx';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { supabase } from './lib/supabase.ts';

// Intercept all fetch requests to inject Supabase auth headers dynamically without modifying read-only window.fetch
const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  if (typeof window === 'undefined') {
    return (globalThis as any).fetch(input, init);
  }
  
  const newInit = { ...init };
  const headers = new Headers(newInit.headers as any);
  
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }
  
  newInit.headers = headers;
  return window.fetch(input, newInit);
};

// Shadow custom fetch helper
const fetch = customFetch;

// Primary client-side application container
export default function App() {
  // Navigation & User Context States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('demo_logged_in') === 'true';
    }
    return false;
  });
  const [activeRole, setActiveRole] = useState<'admin' | 'teacher' | 'student'>(() => {
    if (typeof window !== 'undefined') {
      const r = localStorage.getItem('demo_logged_role');
      if (r === 'admin' || r === 'teacher' || r === 'student') return r;
    }
    return 'admin';
  });
  const [activeEmail, setActiveEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('demo_logged_email') || '';
    }
    return '';
  });
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400 font-extrabold shadow-sm ring-1 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100/50 hover:border-slate-300 dark:hover:bg-slate-900/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>

              {/* Form fields */}
              <form onSubmit={isSignUp ? handleSignUp : handleDemoLogin} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition outline-none"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder=""
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-900 dark:text-white transition outline-none"
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="flex items-center space-x-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-xl border border-red-100 dark:border-red-950/50">
                    <AlertCircle className="w-3.5 h-3.5 flex-none" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loginLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {isSignUp ? "Create Account" : "Authenticate Securely"}
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                  <button 
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setLoginError(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                  >
                    {isSignUp ? "Log in here" : "Sign up here"}
                  </button>
                </p>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-[10px] uppercase font-mono text-slate-400 dark:text-slate-500 tracking-wider">
                Authorized Sandbox • SSL Active
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Embedded Meeting Room Screen overlay */}
          {selectedMeeting && (currentUser || isGuestParticipant) && (
            <MeetingRoom 
              meeting={selectedMeeting}
              currentUser={currentUser || { id: 9999, uid: 'guest', email: 'guest@classroom.com', name: 'Guest Participant', role: 'student', status: 'active' } as any}
              onLeave={() => {
                setSelectedMeeting(null);
                if (isGuestParticipant) {
                  setIsGuestParticipant(false);
                  window.history.replaceState({}, document.title, window.location.pathname);
                }
              }}
              classroomStudents={classroomStudents}
            />
          )}

      {/* Primary Navigation Header */}
      <header className="h-16 bg-white border-b border-slate-200/90 shadow-xs flex items-center justify-between px-6 sticky top-0 z-35">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedClass(null)}>
          <div className="w-9 h-9 rounded-lg bg-linear-to-tr from-indigo-600 to-indigo-500 shadow-md flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">AI CLASSROOM</h1>
            <span className="text-[10px] text-slate-400 tracking-wider font-mono font-bold">MANAGEMENT OS</span>
          </div>
        </div>

        {/* Global search entry */}
        <div className="flex-1 max-w-sm mx-6 hidden md:block">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search classes, materials, assignments..." 
              value={globalSearchQuery}
              onChange={(e) => {
                setGlobalSearchQuery(e.target.value);
                handleGlobalSearch();
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-md text-xs pl-8.5 pr-4 py-2 outline-hidden focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Navigation user panel */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-all active:scale-95 flex items-center justify-center relative"
            title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-500 fill-amber-305 transition-transform duration-200 rotate-0 hover:rotate-12" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-200 rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationInbox(!showNotificationInbox)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95 relative"
            >
              <Bell className="w-4 h-4" />
              {notificationList.filter(n => !n.isRead).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 animate-ping" />
              )}
            </button>

            {/* Notification drop menu */}
            <AnimatePresence>
              {showNotificationInbox && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-2.5 w-76 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-40"
                >
                  <div className="p-3 bg-slate-900 text-white flex justify-between items-center text-xs">
                    <span className="font-bold tracking-tight">Notifications Inbox</span>
                    <span className="bg-indigo-600 text-[10px] font-mono py-0.5 px-2 rounded-full">
                      {notificationList.filter(n => !n.isRead).length} new
                    </span>
                  </div>
                  <div className="max-h-76 overflow-y-auto divide-y divide-slate-100">
                    {notificationList.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">No notifications yet.</div>
                    ) : (
                      notificationList.map((n, idx) => (
                        <div 
                          key={`${n.id}-${idx}`} 
                          className={`p-3 text-[11px] leading-relaxed transition-all hover:bg-slate-50 ${!n.isRead ? 'bg-indigo-50/40 border-l-2 border-indigo-500' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-800">{n.title}</span>
                            {!n.isRead && (
                              <button 
                                onClick={() => markNotificationRead(n.id)}
                                className="text-[9px] text-indigo-600 font-bold hover:underline"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                          <p className="text-slate-600 text-xs mb-1">{n.message}</p>
                          <span className="text-[9px] text-slate-400 font-mono block">Just now</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-px bg-slate-200"></div>

          {/* User Badge Profile */}
          {currentUser && (
            <div className="flex items-center space-x-3 bg-slate-50 border border-slate-100 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase shadow-inner">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</span>
                <span className="text-[9px] font-mono text-indigo-650 capitalize font-bold">{currentUser.role} Account</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-white transition-all cursor-pointer flex items-center justify-center"
                title="Sign Out / Switch Mode"
              >
                <UserMinus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Primary Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col space-y-6">
        
        {/* Render Global search overlay if typed */}
        {searchResults && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-linear-to-b from-indigo-50 to-white border border-indigo-100 rounded-xl shadow-sm space-y-4 text-left"
          >
            <div className="flex justify-between items-center border-b border-indigo-150 pb-3">
              <span className="text-xs font-bold text-indigo-700 tracking-wide uppercase">Global Search Results</span>
              <button 
                onClick={() => {
                  setGlobalSearchQuery("");
                  setSearchResults(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold"
              >
                Clear Search
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 underline">Classrooms ({searchResults.classes.length})</h4>
                {searchResults.classes.map((c: any, idx: number) => (
                  <div key={`${c.id}-${idx}`} className="p-2 border border-slate-200 rounded-md bg-white hover:border-indigo-300 cursor-pointer mb-2" onClick={() => { fetchClassDetails(c.id); setSelectedClass(c); setSearchResults(null); }}>
                    <strong>{c.name}</strong> <span className="text-slate-400 font-mono">({c.subject})</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 underline">Users / Faculty ({searchResults.users.length})</h4>
                {searchResults.users.map((u: any, idx: number) => (
                  <div key={`${u.id}-${idx}`} className="p-2 border border-slate-200 rounded-md bg-white mb-2">
                    <strong>{u.name}</strong> - <span className="capitalize">{u.role}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 underline">Assignments ({searchResults.assignments.length})</h4>
                {searchResults.assignments.map((a: any, idx: number) => (
                  <div key={`${a.id}-${idx}`} className="p-2 border border-slate-200 rounded-md bg-white mb-2">
                    <strong>{a.title}</strong>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2 underline">Meetings Scheduled ({searchResults.meetings.length})</h4>
                {searchResults.meetings.map((m: any, idx: number) => (
                  <div key={`${m.id}-${idx}`} className="p-2 border border-slate-200 rounded-md bg-white mb-2">
                    <strong>{m.title}</strong> <span className="text-indigo-600">({m.time})</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Dashboard Sections below depending on selected view */}
        {!selectedClass ? (
          <>
            {/* Intro Header Cards */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white text-left overflow-hidden relative shadow-lg">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-indigo-600/30 to-transparent pointer-events-none hidden md:block"></div>
              <div className="relative z-10 max-w-2xl space-y-2.5">
                <span className="bg-indigo-600 text-[10px] text-white tracking-widest font-mono font-bold py-1 px-3 rounded-md uppercase">
                  Workspace Dashboard
                </span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  Welcome back, {currentUser?.name || "Educator"}!
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect student registers, optimize ACT/AP test schedules, publish learning units, and utilize true server-side Gemini AI models for personalized, accelerated assignment creation or student feedback reviews.
                </p>
                
                {currentUser?.role === 'student' && (
                  <form onSubmit={joinClassroom} className="flex items-center space-x-2 pt-2 max-w-sm">
                    <input 
                      type="text" 
                      placeholder="Enter classroom joining code (e.g. ACT-ENG-A)..." 
                      value={classJoinCode}
                      onChange={(e) => setClassJoinCode(e.target.value)}
                      className="bg-slate-800 text-white border border-slate-700 text-xs px-3 py-2 rounded-md focus:border-indigo-500 placeholder:text-slate-500 w-full"
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-705 px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap">
                      Join Class
                    </button>
                  </form>
                )}

                {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                  <div className="pt-2">
                    <button 
                      onClick={() => setShowClassModal(true)} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-4 rounded-md inline-flex items-center space-x-1.5 transition-all active:scale-95 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Establish A New Class</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Admin metrics strip */}
            {activeRole === 'admin' && instStats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active Classrooms", val: instStats.totalClasses, sub: "All curriculums", icon: BookOpen, col: "text-indigo-600" },
                  { label: "Appointed Teachers", val: instStats.totalTeachers, sub: "Faculty profile listings", icon: Users, col: "text-teal-600" },
                  { label: "Enrolled Students", val: instStats.totalStudents, sub: "Cumulative logs", icon: GraduationCap, col: "text-blue-600" },
                  { label: "Institution Attendance", val: `${instStats.attendanceOverview}%`, sub: "Average present rate", icon: ClipboardCheck, col: "text-emerald-600" }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-white border border-slate-200/90 rounded-xl p-4 text-left shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                        <Icon className={`w-4 h-4 ${stat.col}`} />
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.val}</h3>
                      <p className="text-[10px] text-slate-400 mt-1">{stat.sub}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dual column: Classes register & user details manage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: List of class cards (2 cols wide on large screens) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Your Appended Classes</h3>
                  <span className="text-xs text-slate-400 font-mono">({classList.length} total)</span>
                </div>

                {classList.length === 0 ? (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-xl text-slate-400 text-xs flex flex-col items-center justify-center space-y-4">
                    <BookOpen className="w-10 h-10 text-slate-300" />
                    <p className="max-w-md leading-relaxed">No classrooms established yet. Establish your first digital workspace to schedule lesson calendars, upload study sheets, and run interactive streaming sessions.</p>
                    {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') ? (
                      <button 
                        onClick={() => setShowClassModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-4 rounded-md transition active:scale-95 shadow-md flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Establish First Class</span>
                      </button>
                    ) : (
                      <form onSubmit={joinClassroom} className="flex items-center space-x-2 w-full max-w-xs">
                        <input 
                          type="text" 
                          placeholder="Class Join Code..." 
                          value={classJoinCode}
                          onChange={(e) => setClassJoinCode(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-md focus:border-indigo-500 placeholder:text-slate-400 w-full text-slate-800"
                        />
                        <button 
                          type="submit" 
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition whitespace-nowrap"
                        >
                          Join Class
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {classList.map((cls, idx) => (
                      <div 
                        key={`${cls.id}-${idx}`} 
                        className="bg-white border border-slate-200/90 rounded-xl p-5 text-left flex flex-col justify-between hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all duration-200 shadow-xs ring-offset-background"
                        onClick={() => fetchClassDetails(cls.id)}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                              {cls.subject}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{cls.academicYear}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight tracking-tight hover:text-indigo-600 transition-colors">
                              {cls.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{cls.description}</p>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4.5 mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-5.5 h-5.5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                              {cls.batchName.charAt(0)}
                            </div>
                            <span className="text-[11px] text-slate-400 font-semibold">{cls.batchName}</span>
                          </div>
                          <span className="text-[11px] font-mono font-bold bg-slate-900 text-white rounded-md px-2 py-0.5 mt-0.5 select-all">
                            Code: {cls.joinCode}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: User Management Console (Admin only) or AI recommendations (Others) */}
              <div className="space-y-4">
                {activeRole === 'admin' ? (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Institution Accounts</h3>
                      <button 
                        onClick={() => {
                          setSelectedUserToEdit(null);
                          setNewUserData({ name: "", email: "", role: "student", status: "active", passwordFallback: "" });
                          setShowUserModal(true);
                        }}
                        className="text-xs text-indigo-600 font-bold flex items-center hover:underline"
                      >
                        <PlusCircle className="w-4.5 h-4.5 mr-1" />
                        Create
                      </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-left max-h-128 overflow-y-auto divide-y divide-slate-100">
                      {userList.map((u, idx) => (
                        <div key={`${u.id}-${idx}`} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 min-w-0">
                            <div className={`w-7 h-7 rounded-sm flex items-center justify-center font-bold text-white uppercase text-[10px] ${u.role === 'admin' ? 'bg-amber-600' : (u.role === 'teacher' ? 'bg-purple-600' : 'bg-teal-500')}`}>
                              {u.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate">{u.name}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{u.email}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            <span className={`text-[9px] font-bold py-0.5 px-1.5 rounded-sm ${u.status === 'suspended' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {u.status}
                            </span>
                            <button 
                              onClick={() => {
                                setSelectedUserToEdit(u);
                                setNewUserData({ name: u.name, email: u.email, role: u.role, status: u.status, passwordFallback: u.passwordFallback || "" });
                                setShowUserModal(true);
                              }}
                              className="text-slate-400 hover:text-slate-700 transition"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => deleteUserAccount(u.id)}
                              className="text-slate-400 hover:text-red-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Copilot insights</h3>
                    <div className="bg-linear-to-b from-slate-900 to-slate-950 text-white rounded-xl p-5 text-left border border-slate-800 shadow-md space-y-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse fill-indigo-400" />
                        <span className="font-bold text-xs tracking-wider text-indigo-300 uppercase">AI REGULATOR SUGGESTION</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        The cumulative analytical summaries show that starting <strong>ACT Vocabulary lists</strong> within English classes elevates reading scores by an average of 14%. Click on individual classrooms to trigger direct, real-time AP and ACT test generators below.
                      </p>
                      <div className="h-px bg-slate-800"></div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>API Status: ACTIVE</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Classroom Detail view panels */
          <div className="space-y-6 text-left">
            {/* Header navigator */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSelectedClass(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-1.5 px-3 rounded-md text-xs font-semibold"
                >
                  Back to Classes
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <div className="flex items-center space-x-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center">{selectedClass.name}
                      {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                        <button 
                          onClick={() => { setEditClassData({ name: selectedClass.name, description: selectedClass.description || "" }); setShowEditClassModal(true); }}
                          className="ml-2 text-slate-400 hover:text-indigo-600 transition"
                          title="Edit Classroom Details"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      )}
                    </h2>
                    <span className="text-[11px] text-slate-400 block font-mono">Join Code: {selectedClass.joinCode} | {selectedClass.grade}</span>
                  </div>
                </div>
              </div>

              {/* Action utilities depending on role */}
              <div className="flex items-center space-x-2">
                {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                  <>
                    {/* Bulk students import sim buttons */}
                    <button 
                      onClick={async () => {
                        const emails = prompt("Enter student emails, comma-separated to bulk import into this classroom (e.g., student1@test.com, student2@test.com):");
                        if (!emails) return;
                        const emailsArr = emails.split(',').map(e => e.trim());
                        const res = await fetch(`/api/classes/${selectedClass.id}/add-students-bulk`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            "x-demo-user-role": activeRole
                          },
                          body: JSON.stringify({ emails: emailsArr })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          triggerAlert(`Bulk import completed! Successfully enrolled: ${data.successCount} other students.`);
                          fetchClassDetails(selectedClass.id);
                        }
                      }}
                      className="bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-700 text-xs font-semibold py-1.5 px-3.5 rounded-md flex items-center transition active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1" />
                      Bulk Import Students
                    </button>

                    <button 
                      onClick={() => {
                        if (activeClassTab === 'materials') openMaterialUploadModal();
                        else if (activeClassTab === 'assignments') setShowAssignmentModal(true);
                        else if (activeClassTab === 'meetings') setShowMeetingModal(true);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-3.5 rounded-md flex items-center transition active:scale-95 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add to {activeClassTab.charAt(0).toUpperCase() + activeClassTab.slice(1)}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Classtab selection headers */}
            <div className="border-b border-slate-200 flex space-x-6 text-xs font-semibold text-slate-500 overflow-x-auto">
              {[
                { key: 'materials', label: 'Learning Units', icon: FolderOpen },
                { key: 'assignments', label: 'Assignments', icon: FileText },
                { key: 'meetings', label: 'Live Conferences', icon: Video },
                { key: 'attendance', label: 'Student Registers', icon: ClipboardCheck },
                { key: 'board', label: 'Class Notice Board', icon: Megaphone },
                { key: 'analytics', label: 'Copilot Analytics', icon: BarChart3 },
                { key: 'student_summary', label: 'Student Summary', icon: TrendingUp },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button 
                    key={tab.key}
                    onClick={() => {
                      startTransition(() => {
                        setActiveClassTab(tab.key as any);
                      });
                    }}
                    className={`flex items-center space-x-2 py-3 border-b-2 font-bold select-none cursor-pointer transition-all ${activeClassTab === tab.key ? 'border-indigo-600 text-indigo-600 bg-linear-to-b from-transparent to-indigo-50/20' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tap Panel Contents */}
            <div className="pt-2">
              <AnimatePresence>
                {/* Materials tab panel */}
                {activeClassTab === 'materials' && (() => {
                  // Get folder list array for a material
                  const getFolderArray = (mat: any): string[] => {
                    if (!mat.folder) return [];
                    return mat.folder.split(' > ').map((p: string) => p.trim()).filter(Boolean);
                  };

                  // Unique folders list for tree sidebar
                  const allUniqueFolders: string[][] = Array.from(new Set(
                    activeClassMaterials.map(mat => mat.folder || "")
                  ))
                  .filter(Boolean)
                  .map(folderStr => (folderStr as string).split(' > ').map(s => s.trim()).filter(Boolean))
                  .sort((a, b) => a.join(' > ').localeCompare(b.join(' > ')));

                  // Filtered by search query if any
                  const isSearchActive = materialsSearchQuery.trim().length > 0;
                  const searchedMaterials = isSearchActive
                    ? activeClassMaterials.filter(mat => {
                        if (mat.type === 'folder') return false;
                        return mat.title.toLowerCase().includes(materialsSearchQuery.toLowerCase()) || 
                          (mat.description && mat.description.toLowerCase().includes(materialsSearchQuery.toLowerCase())) ||
                          mat.organizeValue.toLowerCase().includes(materialsSearchQuery.toLowerCase());
                      })
                    : [];

                  // If standard folder navigation is active
                  // Compute direct subfolders in current folder path
                  const directSubfolders = Array.from(new Set(
                    activeClassMaterials
                      .map(mat => getFolderArray(mat))
                      .filter(p => {
                        if (p.length <= currentFolderPath.length) return false;
                        for (let i = 0; i < currentFolderPath.length; i++) {
                          if (p[i] !== currentFolderPath[i]) return false;
                        }
                        return true;
                      })
                      .map(p => p[currentFolderPath.length])
                  ))
                  .sort((a, b) => (a as string).localeCompare(b as string));

                  // Compute files in current folder path
                  const filesInCurrentFolder = activeClassMaterials.filter(mat => {
                    if (mat.type === 'folder') return false;
                    const p = getFolderArray(mat);
                    if (p.length !== currentFolderPath.length) return false;
                    for (let i = 0; i < p.length; i++) {
                      if (p[i] !== currentFolderPath[i]) return false;
                    }
                    return true;
                  });

                  return (
                    <motion.div
                      key="materials"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15, ease: "easeInOut" }}
                      className="space-y-4 text-left"
                    >
                      {/* Search Bar & Actions Container */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-3xs">
                        <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search study sheets globally..."
                            value={materialsSearchQuery}
                            onChange={(e) => setMaterialsSearchQuery(e.target.value)}
                            className="pl-9 pr-8 py-2 w-full text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-805"
                          />
                          {isSearchActive && (
                            <button
                              onClick={() => setMaterialsSearchQuery("")}
                              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {/* Folder creator for teachers */}
                        {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setShowAddFolderInline(!showAddFolderInline)}
                              className="bg-white border hover:bg-slate-50 border-slate-205 text-slate-700 text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center space-x-1 cursor-pointer transition shadow-3xs"
                            >
                              <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
                              <span>New Folder</span>
                            </button>
                            <button
                              type="button"
                              onClick={openMaterialUploadModal}
                              className="bg-indigo-605 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center space-x-1 cursor-pointer transition shadow-3xs"
                            >
                              <Plus className="w-3.5 h-3.5 text-white" />
                              <span>Upload Document</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Inline Subfolder Form */}
                      {showAddFolderInline && (
                        <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-3xs animate-in fade-in-50 duration-200">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <FolderPlus className="w-5 h-5 text-indigo-650 shrink-0" />
                            <div className="text-left min-w-0">
                              <h4 className="text-xs font-bold text-slate-800">Create a subfolder here</h4>
                              <p className="text-[10px] text-slate-450 truncate">
                                Under: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded font-bold">{currentFolderPath.join(' > ') || 'Root'}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-1 max-w-sm">
                            <input
                              type="text"
                              maxLength={35}
                              value={newInlineFolderName}
                              onChange={e => setNewInlineFolderName(e.target.value)}
                              placeholder="Folder name (e.g., Sub-topic A)"
                              className="bg-white border text-xs rounded-lg p-1.5 flex-1 outline-hidden focus:ring-1 focus:ring-indigo-400"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateSubfolder(newInlineFolderName);
                                if (e.key === 'Escape') { setShowAddFolderInline(false); setNewInlineFolderName(""); }
                              }}
                            />
                            <button
                              onClick={() => handleCreateSubfolder(newInlineFolderName)}
                              disabled={!newInlineFolderName.trim()}
                              className="bg-indigo-600 disabled:opacity-50 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 px-3.5 rounded-lg transition shrink-0 cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setShowAddFolderInline(false); setNewInlineFolderName(""); }}
                              className="text-slate-500 hover:text-slate-800 text-xs font-bold shrink-0 px-2 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Directory Navigation Tree Sidebar */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-3xs h-fit space-y-4">
                          <div className="border-b pb-2.5">
                            <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Directory Index</h4>
                          </div>

                          <div className="space-y-1">
                            {/* Root Folder Link */}
                            <button
                              onClick={() => setCurrentFolderPath([])}
                              className={`w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition flex items-center space-x-2 text-[11px] ${currentFolderPath.length === 0 ? 'bg-indigo-50/70 text-indigo-700 font-bold' : 'text-slate-600'}`}
                            >
                              <Home className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">📁 Root Directory (/)</span>
                            </button>

                            {/* Folders hierarchy tree display */}
                            {allUniqueFolders.length === 0 ? (
                              <p className="text-[10px] text-slate-400 italic px-2.5 py-4">No folders created yet.</p>
                            ) : (
                              allUniqueFolders.map((pathArr, idx) => {
                                const depth = pathArr.length;
                                const isSelected = currentFolderPath.join(' > ') === pathArr.join(' > ');
                                const displayName = pathArr[pathArr.length - 1];
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => setCurrentFolderPath(pathArr)}
                                    style={{ paddingLeft: `${10 + depth * 12}px` }}
                                    className={`w-full text-left py-1.5 px-2 rounded-lg hover:bg-slate-50 cursor-pointer transition flex items-center space-x-1.5 text-[11px] ${isSelected ? 'bg-indigo-50/70 text-indigo-700 font-bold' : 'text-slate-600'}`}
                                  >
                                    <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-600 fill-indigo-100' : 'text-slate-400'}`} />
                                    <span className="truncate">{displayName}</span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Nested Folder Grid & Material Listings */}
                        <div className="md:col-span-3 space-y-5">
                          {/* Top Breadcrumbs / Folder Level Info */}
                          {!isSearchActive && (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider select-none pr-1">Current Path:</span>
                              <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium py-1 px-2.5 bg-slate-50 border border-slate-150 rounded-lg shadow-3xs w-fit select-none shrink-0 font-mono">
                                <button onClick={() => setCurrentFolderPath([])} className="hover:text-indigo-650 flex items-center space-x-1 cursor-pointer">
                                  <span>Root</span>
                                </button>
                                {currentFolderPath.map((folder, index) => (
                                  <React.Fragment key={index}>
                                    <ChevronRight className="w-3 h-3 text-slate-300" />
                                    <button
                                      onClick={() => setCurrentFolderPath(currentFolderPath.slice(0, index + 1))}
                                      className={`hover:text-indigo-655 cursor-pointer ${index === currentFolderPath.length - 1 ? 'text-slate-800 font-bold' : 'text-slate-500'}`}
                                    >
                                      {folder}
                                    </button>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          )}

                          {isSearchActive ? (
                            /* Global Search Results view */
                            <div className="space-y-3">
                              <div className="px-1">
                                <p className="text-xs text-slate-500">
                                  Found <strong className="text-slate-850 font-bold">{searchedMaterials.length}</strong> matches for query "<span className="italic">{materialsSearchQuery}</span>" across folders:
                                </p>
                              </div>

                              {searchedMaterials.length === 0 ? (
                                <div className="p-10 border border-slate-205 bg-white rounded-xl text-center text-slate-400 text-xs">
                                  No study materials found matching "{materialsSearchQuery}".
                                </div>
                              ) : (
                                searchedMaterials.map((mat, idx) => (
                                  <div key={`${mat.id}-${idx}`} className="bg-white border border-slate-200/90 rounded-xl p-4 flex justify-between items-center shadow-xs">
                                    <div className="flex items-center space-x-3.5 min-w-0 text-left">
                                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                        <FileText className="w-5 h-5" />
                                      </div>
                                      <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-slate-900 truncate">{mat.title}</h4>
                                        <div className="flex items-center space-x-2 mt-0.5 max-w-full">
                                          <span className="text-[9.5px] text-indigo-650 bg-indigo-50 border border-indigo-100 font-mono font-bold tracking-tight uppercase px-1.5 py-0.2 rounded">{mat.organizeValue}</span>
                                          {mat.folder && (
                                            <span className="text-[9.5px] text-slate-500 font-mono font-medium truncate max-w-[200px]">📁 {mat.folder}</span>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-slate-400 truncate mt-1">{mat.description}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0">
                                      <button
                                        onClick={() => handleGenerateFlashcards(mat)}
                                        className="text-xs bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-semibold py-1.5 px-3 rounded-lg flex items-center space-x-1 transition-colors border border-indigo-250/30 cursor-pointer"
                                      >
                                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-400" />
                                        <span>AI Flashcards</span>
                                      </button>
                                      <a 
                                        href={mat.fileUrl} 
                                        download
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-xs text-indigo-600 font-bold hover:underline flex items-center hover:bg-slate-50 py-1.5 px-3 rounded-md"
                                      >
                                        <span>Download</span>
                                        <Download className="w-3.5 h-3.5 ml-1" />
                                      </a>
                                      {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                        <button
                                          onClick={() => handleDeleteMaterial(mat.id)}
                                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                          title="Delete Material"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          ) : (
                            /* standard hierarchical browser view */
                            <div className="space-y-5">
                              {/* Direct Subfolders grid list */}
                              {directSubfolders.length > 0 && (
                                <div className="space-y-2">
                                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Folders</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {directSubfolders.map((folderName, fidx) => {
                                      const exactPathStr = [...currentFolderPath, folderName].join(' > ');
                                      const folderAnchor = activeClassMaterials.find(mat => mat.type === 'folder' && mat.folder === exactPathStr);

                                      // count files in this subfolder
                                      const filesCountInFolder = activeClassMaterials.filter(m => {
                                        if (m.type === 'folder') return false;
                                        return m.folder && (m.folder === exactPathStr || m.folder.startsWith(exactPathStr + ' > '));
                                      }).length;

                                      return (
                                        <div
                                          key={fidx}
                                          onClick={() => setCurrentFolderPath([...currentFolderPath, folderName])}
                                          className="bg-white border border-slate-205 hover:border-indigo-400 hover:shadow-xs rounded-xl p-3 flex justify-between items-center transition cursor-pointer group"
                                        >
                                          <div className="flex items-center space-x-2.5 min-w-0 text-left">
                                            <div className="w-8.5 h-8.5 rounded-lg bg-amber-50 group-hover:bg-amber-100/80 flex items-center justify-center text-amber-500 shrink-0 transition">
                                              <Folder className="w-4.5 h-4.5 fill-amber-300/40 text-amber-500" />
                                            </div>
                                            <div className="min-w-0">
                                              <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-750 transition">{folderName}</h4>
                                              <p className="text-[9.5px] text-slate-400">{filesCountInFolder} resource{filesCountInFolder === 1 ? '' : 's'}</p>
                                            </div>
                                          </div>

                                          {/* Actions for teachers/admins */}
                                          {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                            <div className="flex items-center space-x-1 shrink-0" onClick={e => e.stopPropagation()}>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRenameFolder(exactPathStr);
                                                }}
                                                className="text-slate-400 hover:text-indigo-600 p-1.5 rounded bg-slate-50 hover:bg-slate-100 transition shrink-0 cursor-pointer text-xs"
                                                title="Rename folder"
                                              >
                                                <Edit className="w-3.5 h-3.5" />
                                              </button>

                                              {folderAnchor && (
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteMaterial(folderAnchor.id);
                                                  }}
                                                  className="text-slate-400 hover:text-red-650 p-1 rounded hover:bg-slate-100 transition shrink-0 cursor-pointer"
                                                  title="Delete folder anchor"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Files inside folder */}
                              <div className="space-y-2">
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">Study Materials</h5>
                                {filesInCurrentFolder.length === 0 ? (
                                  <div className="p-12 border border-dashed border-slate-200 bg-white rounded-xl text-center text-slate-400 text-xs italic">
                                    No lesson reference documents in this folder.
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {filesInCurrentFolder.map((mat, idx) => (
                                      <div key={`${mat.id}-${idx}`} className="bg-white border border-slate-200/90 rounded-xl p-4 flex justify-between items-center shadow-xs transition hover:border-slate-350">
                                        <div className="flex items-center space-x-3.5 min-w-0 text-left">
                                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                            <FileText className="w-5 h-5" />
                                          </div>
                                          <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-slate-900 truncate">{mat.title}</h4>
                                            <span className="text-[9.5px] text-indigo-650 bg-indigo-50 border border-indigo-100 font-mono font-bold tracking-tight uppercase px-1.5 py-0.2 rounded inline-block mt-0.5">{mat.organizeValue}</span>
                                            <p className="text-[11px] text-slate-400 truncate mt-1">{mat.description}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-1.5 shrink-0">
                                          {movingMaterialId === mat.id ? (
                                            <div className="flex items-center space-x-1.5 bg-slate-50 border p-1 rounded-lg" onClick={e => e.stopPropagation()}>
                                              <select 
                                                defaultValue={mat.folder || ""}
                                                onChange={async (e) => {
                                                  const targetFolderStr = e.target.value;
                                                  try {
                                                    const res = await fetch(`/api/materials/${mat.id}/move`, {
                                                      method: "POST",
                                                      headers: {
                                                        "Content-Type": "application/json",
                                                        "x-demo-user-role": activeRole
                                                      },
                                                      body: JSON.stringify({ folder: targetFolderStr })
                                                    });
                                                    if (res.ok) {
                                                      triggerAlert("Moved material successfully!");
                                                      setMovingMaterialId(null);
                                                      fetchClassDetails(selectedClass!.id);
                                                    } else {
                                                      triggerAlert("Failed to move material", "err");
                                                    }
                                                  } catch (err: any) {
                                                    triggerAlert(err.message, "err");
                                                  }
                                                }}
                                                className="text-[11px] border rounded px-1.5 py-0.5 bg-white text-slate-800"
                                              >
                                                <option value="">📁 Root (None)</option>
                                                {allUniqueFolders.map((pathArr, indexStr) => {
                                                  const pathVal = pathArr.join(' > ');
                                                  return (
                                                    <option key={indexStr} value={pathVal}>
                                                      📁 {pathVal}
                                                    </option>
                                                  );
                                                })}
                                              </select>
                                              <button 
                                                onClick={() => setMovingMaterialId(null)}
                                                className="text-[10px] text-slate-500 font-bold px-1.5 hover:text-slate-800"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          ) : (
                                            <>
                                              <button
                                                onClick={() => handleGenerateFlashcards(mat)}
                                                className="text-xs bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-semibold py-1.5 px-3 rounded-lg flex items-center space-x-1 transition-colors border border-indigo-250/30 cursor-pointer"
                                              >
                                                <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-400" />
                                                <span>AI Flashcards</span>
                                              </button>
                                              <a 
                                                href={mat.fileUrl} 
                                                download
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-xs text-indigo-600 font-bold hover:underline flex items-center hover:bg-slate-50 py-1.5 px-3 rounded-md"
                                              >
                                                <span>Download</span>
                                                <Download className="w-3.5 h-3.5 ml-1" />
                                              </a>
                                              {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                                <>
                                                  <button
                                                    onClick={() => setMovingMaterialId(mat.id)}
                                                    className="text-slate-400 hover:text-indigo-650 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                                                    title="Move folder location"
                                                  >
                                                    <FolderOpen className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                    onClick={() => handleDeleteMaterial(mat.id)}
                                                    className="text-slate-400 hover:text-red-655 p-1.5 rounded-lg hover:bg-red-50/50 transition cursor-pointer"
                                                    title="Delete Material"
                                                  >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                  </button>
                                                </>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

              {/* Assignments tab panel */}
              {activeClassTab === 'assignments' && (
                <motion.div
                  key="assignments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  
                  {/* AI Creator Panel for teachers */}
                  {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                    <div className="bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-4 text-left">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-indigo-400 fill-indigo-400 animate-pulse" />
                          <span className="font-bold text-xs tracking-wider text-indigo-300 uppercase">AI ASSIGNMENT GENERATOR</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Power: Gemini 3.5 Flash</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Assignment Standard Model</label>
                          <div className="relative">
                            <input 
                              list="assignment-models"
                              value={aiPrompts.type}
                              onChange={(e) => setAiPrompts({ ...aiPrompts, type: e.target.value })}
                              placeholder="Type or select a model..."
                              className="bg-slate-850 border border-slate-700 text-white rounded-md p-2.5 outline-hidden focus:border-indigo-400 w-full"
                            />
                            <datalist id="assignment-models">
                              <option value="ACT English Standard Template" />
                              <option value="AP Biology Structured Quiz" />
                              <option value="Comprehensive Practice Worksheet" />
                              <option value="Thematic Analysis Essay" />
                              <option value="Custom Topic Model" />
                            </datalist>
                          </div>
                        </div>
                        <div className="sm:col-span-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Source Document</label>
                          <div className="flex items-center space-x-2">
                            <label className="bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 rounded-md py-2.5 px-3 flex-1 flex items-center justify-center space-x-2 cursor-pointer transition">
                              {assignmentUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                              <span className="text-xs truncate">{aiPrompts.attachmentUrl ? "Attached" : "Upload Reference"}</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleAiReferenceUpload(e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                            {aiPrompts.attachmentUrl && (
                              <button 
                                onClick={() => setAiPrompts({...aiPrompts, attachmentUrl: ""})}
                                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 p-2.5 rounded-md transition"
                                title="Remove Attachment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="sm:col-span-2 md:col-span-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Target Topic String</label>
                          <div className="flex space-x-2">
                            <input 
                              type="text" 
                              placeholder="e.g., Relative clauses with who vs whom, or cellular meiosis mechanisms..." 
                              value={aiPrompts.topic}
                              onChange={(e) => setAiPrompts({...aiPrompts, topic: e.target.value})}
                              className="bg-slate-850 border border-slate-700 text-white rounded-md p-2.5 outline-hidden focus:border-indigo-400 w-full"
                            />
                            <button 
                              type="button" 
                              disabled={aiGenerating}
                              onClick={triggerAiAssignmentGenerator}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-md transition duration-200 shadow-lg active:scale-95 disabled:bg-slate-800 flex items-center space-x-1 whitespace-nowrap"
                            >
                              {aiGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CloudLightning className="w-4 h-4 mr-0.5" />}
                              <span>{aiGenerating ? "Drafting..." : "Generate Test"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Main List of assignments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Assignment list selector */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Class assignments list</h4>
                      {activeClassAssignments.length === 0 ? (
                        <div className="p-10 border border-slate-200 bg-white rounded-xl text-center text-slate-400 text-xs">No assignments published.</div>
                      ) : (
                        activeClassAssignments.map((asg, idx) => (
                          <div 
                            key={`${asg.id}-${idx}`} 
                            onClick={() => {
                              setSelectedAssignment(asg);
                              if (currentUser?.role !== 'student') fetchSubmissionLists(asg.id);
                            }}
                            className={`p-4 bg-white border rounded-xl hover:border-indigo-400 cursor-pointer text-left transition-all shadow-xs ${selectedAssignment?.id === asg.id ? 'border-indigo-500 ring-2 ring-indigo-50' : 'border-slate-200/90'}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">{asg.type.replace('_', ' ')}</span>
                              <span className="text-[10px] text-slate-400 font-mono">Max: {asg.maxMarks} Marks</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">{asg.title}</h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{asg.description}</p>
                            <div className="border-t border-slate-100 pt-3 mt-3 flex items-center text-[10px] text-slate-500 font-medium">
                              <Clock className="w-3 h-3 mr-1 text-slate-400" />
                              <span>Due Date: {asg.dueDate ? new Date(asg.dueDate).toLocaleDateString() : "Unlimited"}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Submissions reviewer / submission panel detail */}
                    <div>
                      {selectedAssignment ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                            <div>
                              <span className="text-[10px] font-bold text-indigo-600 uppercase font-mono block">Reviewing Assignment Workspace</span>
                              <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedAssignment.title}</h3>
                              <div className="flex items-center space-x-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => exportAssignmentToPdf(selectedAssignment.title, selectedAssignment.description, selectedAssignment.instructions, selectedAssignment.rubric, selectedAssignment.dueDate, selectedAssignment.maxMarks)}
                                  className="text-[10px] font-bold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded px-2.5 py-1.5 flex items-center space-x-1.5 transition cursor-pointer"
                                  title="Export this assignment sheet as a printable vector PDF document"
                                >
                                  <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                  <span>Export PDF</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => exportAssignmentToDoc(selectedAssignment.title, selectedAssignment.description, selectedAssignment.instructions, selectedAssignment.rubric, selectedAssignment.dueDate, selectedAssignment.maxMarks)}
                                  className="text-[10px] font-bold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded px-2.5 py-1.5 flex items-center space-x-1.5 transition cursor-pointer"
                                  title="Export this assignment sheet as a Microsoft Word Document"
                                >
                                  <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                  <span>Export DOC</span>
                                </button>
                              </div>
                            </div>
                            <button className="text-xs text-slate-400 hover:text-slate-600" onClick={() => setSelectedAssignment(null)}>Close</button>
                          </div>

                          <div className="bg-slate-50 border border-slate-250 p-4 rounded-xl space-y-3.5 text-left">
                            <div className="space-y-1">
                              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">Assignment Task & details</span>
                              <p className="text-[11.5px] text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">{selectedAssignment.description}</p>
                            </div>

                            {selectedAssignment.instructions && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">Student Instructions</span>
                                <p className="text-[11.5px] text-slate-650 leading-relaxed whitespace-pre-wrap">{selectedAssignment.instructions}</p>
                              </div>
                            )}

                            {selectedAssignment.rubric && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">Grading Rubric</span>
                                <div className="text-[10.5px] font-bold text-indigo-650 bg-indigo-50/50 border border-indigo-100/40 rounded-lg p-2.5 whitespace-pre-wrap">
                                  {selectedAssignment.rubric}
                                </div>
                              </div>
                            )}

                            {selectedAssignment.attachmentUrl && (
                              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-3">
                                <div className="flex items-center space-x-2.5 min-w-0">
                                  <div className="p-1 px-1.5 bg-indigo-50 text-indigo-600 rounded">
                                    <FileText className="w-4 h-4 shrink-0" />
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-750 truncate max-w-[150px]" title={selectedAssignment.attachmentUrl.split("/").pop()}>
                                    Reference file: {selectedAssignment.attachmentUrl.split("/").pop() || "Attached Worksheet"}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 shrink-0">
                                  <a 
                                    href={selectedAssignment.attachmentUrl} 
                                    download
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-750 py-1.5 px-3 rounded-lg shadow-2xs hover:shadow-xs flex items-center space-x-1 cursor-pointer transition-all duration-150"
                                  >
                                    <span>Download</span>
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            )}
                                        {currentUser?.role === 'student' ? (() => {
                            const actualStudentId = classroomStudents.find(s => s.email === currentUser?.email)?.id || currentUser?.id;
                            const existingSub = activeClassSubmissions.find(sub => sub.assignmentId === selectedAssignment.id && sub.studentId === actualStudentId);
                            if (existingSub) {
                              return (
                                <div className="space-y-4 text-left">
                                  <div className="bg-emerald-50/20 border border-emerald-200 rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between items-center border-b border-emerald-100/60 pb-2">
                                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">✓ Assignment Handed In</span>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {existingSub.submittedAt ? new Date(existingSub.submittedAt).toLocaleDateString() : ""}
                                      </span>
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Your Response text</span>
                                      <div className="bg-white border border-slate-150 p-3 rounded-md text-xs text-slate-755 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                                        {existingSub.textContent || <span className="text-slate-400 italic font-medium">No text content submitted.</span>}
                                      </div>
                                    </div>

                                    {existingSub.fileUrl && (
                                      <div className="bg-white border border-slate-150 rounded-lg p-2.5 flex items-center justify-between gap-3">
                                        <div className="flex items-center space-x-2 min-w-0">
                                          <div className="p-1 bg-indigo-50/60 text-indigo-600 rounded">
                                            <FileText className="w-3.5 h-3.5" />
                                          </div>
                                          <span className="text-[10.5px] font-bold text-slate-700 truncate max-w-[150px]" title={existingSub.fileUrl.split("/").pop()}>
                                            Submitted file: {existingSub.fileUrl.split("/").pop() || "homework.pdf"}
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {existingSub.status === 'graded' ? (
                                      <div className="bg-indigo-50/60 border border-indigo-150 rounded-lg p-3 mt-2 space-y-1">
                                        <div className="flex justify-between text-xs font-bold text-slate-800">
                                          <span>Graded Evaluation:</span>
                                          <span className="text-indigo-700 font-extrabold">{existingSub.grade} Marks</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 leading-relaxed italic">
                                          "{existingSub.feedback || "No feedback left."}"
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3 mt-2 text-center text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                        ⏳ Pending Teacher Evaluation
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <form onSubmit={submitAssignmentWork} className="space-y-4">
                                <div>
                                  <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Your Submission Contents (Write or copy/paste response)</label>
                                    {draftSavedStatus && (
                                      <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-150/50 rounded px-1.5 py-0.5 flex items-center space-x-1 animate-pulse">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping absolute" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative" />
                                        <span>{draftSavedStatus}</span>
                                      </span>
                                    )}
                                  </div>
                                  <textarea 
                                    rows={5}
                                    placeholder="Begin typing your assignment solutions here..."
                                    value={studentSubmissionText}
                                    onChange={(e) => setStudentSubmissionText(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-md text-xs p-3.5 outline-hidden focus:border-indigo-500 placeholder:text-slate-400 text-slate-800"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Supporting Homework Documents (PDF, Doc, Image, Spreadsheet)</label>
                                  
                                  <div 
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      setIsDragging(false);
                                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                        handleFileUpload(e.dataTransfer.files[0]);
                                      }
                                    }}
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 mt-1 relative overflow-hidden ${isDragging ? 'border-indigo-650 bg-indigo-50/70 shadow-xs' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'}`}
                                  >
                                    {isUploading ? (
                                      <div className="flex flex-col items-center justify-center py-2 space-y-2.5">
                                        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                                        <span className="text-[11px] font-bold text-slate-550 font-mono tracking-tight">Uploading work file, please hold...</span>
                                      </div>
                                    ) : studentSubmissionFile ? (
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-center space-x-2.5">
                                          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                            <FileText className="w-6 h-6 animate-bounce" />
                                          </div>
                                          <div className="text-left min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]" title={uploadedFileName || "your-homework.pdf"}>
                                              {uploadedFileName || "Uploaded Document"}
                                            </p>
                                            <p className="text-[9.5px] font-mono text-slate-450 truncate max-w-[200px]">{studentSubmissionFile}</p>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-center space-x-2.5 pt-1.5 border-t border-slate-200/50">
                                          <button 
                                            type="button" 
                                            onClick={() => {
                                              setStudentSubmissionFile("");
                                              setUploadedFileName("");
                                            }} 
                                            className="text-[10px] uppercase tracking-wider font-bold text-red-500 hover:text-red-700 flex items-center space-x-1 cursor-pointer bg-transparent border-0"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                            <span>Delete</span>
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center space-y-2 py-1">
                                        <div className="p-3 bg-white border border-slate-150 rounded-full shadow-2xs text-indigo-600">
                                          <Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-bold text-slate-700">Drag & drop your homework attachment</p>
                                          <p className="text-[10px] text-slate-450 mt-0.5 font-medium">Valid files: PDFs, Office sheets, images, and texts</p>
                                        </div>
                                        <label className="text-[10.5px] font-bold bg-white text-indigo-650 hover:bg-slate-50 border border-slate-200 py-1.5 px-3.5 rounded-lg shadow-2xs cursor-pointer active:scale-95 transition-all duration-150 inline-block mt-1">
                                          <span>Select Work File</span>
                                          <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={(e) => {
                                              if (e.target.files && e.target.files[0]) {
                                                handleFileUpload(e.target.files[0]);
                                              }
                                            }} 
                                          />
                                        </label>
                                      </div>
                                    )}
                                    {uploadError && (
                                      <div className="text-[10px] text-red-650 font-bold mt-2.5 flex items-center justify-center space-x-1 bg-red-50 border border-red-150 p-2 rounded-lg">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                                        <span className="truncate max-w-[240px]">{uploadError}</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="mt-3">
                                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Or paste custom resource URL directly</span>
                                    <input 
                                      type="text" 
                                      placeholder="e.g. https://drive.google.com/file/d/your-homework-doc"
                                      value={studentSubmissionFile}
                                      onChange={(e) => {
                                        setStudentSubmissionFile(e.target.value);
                                        if (e.target.value) {
                                          setUploadedFileName(e.target.value.split("/").pop() || "Custom Link");
                                        } else {
                                          setUploadedFileName("");
                                        }
                                      }}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-md text-xs p-2.5 outline-hidden focus:border-indigo-500 placeholder:text-slate-450 text-slate-800"
                                    />
                                  </div>
                                </div>

                                <button 
                                  type="submit" 
                                  className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-semibold text-xs py-2.5 rounded-md transition shadow-md active:scale-95 cursor-pointer"
                                >
                                  Upload & Hand in homework
                                </button>
                              </form>
                            );
                          })()
                          : (
                            /* TEACHER PANEL: REVIEW SUBMISSIONS */
                            <div className="space-y-4">
                              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1.5">Student Answer papers hand-in</h4>
                              
                              {submissionList.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-xs">No entries submitted yet.</div>
                              ) : (
                                <div className="space-y-3.5">
                                  {submissionList.map((subItem, idx) => {
                                    // subItem contains { submission, student }
                                    const sub = subItem.submission;
                                    const student = subItem.student;
                                    const isGradingSuggestionLoading = aiGradePending === sub.id;

                                    return (
                                      <div key={`${sub.id}-${idx}`} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-3 text-left">
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <span className="font-bold text-slate-900 block">{student.name}</span>
                                            <span className="text-[10px] text-slate-400">{student.email}</span>
                                          </div>
                                          <span className={`text-[9px] font-bold py-0.5 px-2 rounded-sm uppercase ${sub.status === 'graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {sub.status}
                                          </span>
                                        </div>

                                        <div className="bg-white border p-3 rounded-md max-h-32 overflow-y-auto leading-relaxed text-slate-700 whitespace-pre-wrap">
                                          {sub.textContent || <span className="text-slate-450 italic">No text solutions provided.</span>}
                                        </div>

                                        {sub.fileUrl && (
                                          <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-3">
                                            <div className="flex items-center space-x-2.5 min-w-0">
                                              <div className="p-1 bg-indigo-50 text-indigo-600 rounded">
                                                <FileText className="w-3.5 h-3.5 shrink-0" />
                                              </div>
                                              <span className="text-[10.5px] font-bold text-slate-700 truncate max-w-[155px]" title={sub.fileUrl.split("/").pop()}>
                                                Homework PDF: {sub.fileUrl.split("/").pop() || "homework.pdf"}
                                              </span>
                                            </div>
                                            <div className="flex items-center space-x-1.5 shrink-0">
                                              <a 
                                                href={sub.fileUrl} 
                                                download
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="text-[9.5px] font-bold text-slate-600 hover:text-indigo-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded transition flex items-center gap-1 cursor-pointer"
                                              >
                                                <Download className="w-3 h-3" />
                                                <span>Download</span>
                                              </a>
                                            </div>
                                          </div>
                                        )}

                                        {sub.grade ? (
                                          <div className="bg-indigo-50 border border-indigo-100 p-2.5 text-indigo-950 rounded-lg">
                                            <strong>Evaluated Grade:</strong> {sub.grade} | <strong>Feedback:</strong> {sub.feedback}
                                          </div>
                                        ) : (
                                          <div className="space-y-3 pt-2 border-t border-slate-200/50">
                                            {/* AI assist triggers */}
                                            <div className="flex items-center justify-between">
                                              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Evaluation & Grades</span>
                                              <button 
                                                onClick={() => triggerAiGradingSuggest(sub.id)}
                                                disabled={isGradingSuggestionLoading}
                                                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold p-1 px-2.5 rounded-sm text-[10px] active:scale-95 transition flex items-center space-x-1"
                                              >
                                                <Sparkles className="w-3 h-3 text-indigo-300" />
                                                <span>{isGradingSuggestionLoading ? "Querying AI..." : "Assist with AI Grading"}</span>
                                              </button>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2">
                                              <input 
                                                type="text" 
                                                placeholder="Score (e.g. 45 or A)"
                                                value={selectedSub?.id === sub.id ? evaluationData.grade : ""}
                                                onChange={(e) => {
                                                  setSelectedSub(sub);
                                                  setEvaluationData({ ...evaluationData, grade: e.target.value });
                                                }}
                                                className="bg-white border rounded-sm p-1.5 focus:border-indigo-500 text-xs col-span-1"
                                              />
                                              <input 
                                                type="text" 
                                                placeholder="Constructive feedback..."
                                                value={selectedSub?.id === sub.id ? evaluationData.feedback : ""}
                                                onChange={(e) => {
                                                  setSelectedSub(sub);
                                                  setEvaluationData({ ...evaluationData, feedback: e.target.value });
                                                }}
                                                className="bg-white border rounded-sm p-1.5 focus:border-indigo-500 text-xs col-span-2"
                                              />
                                            </div>

                                            <button 
                                              onClick={() => saveManualEvaluation(sub.id)}
                                              className="w-full bg-slate-900 hover:bg-black text-white py-1.5 text-xs font-semibold rounded-sm transition cursor-pointer"
                                            >
                                              Save grade & Release to student
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      ) : (
                        <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs min-h-[220px]">
                          <FileText className="w-12 h-12 text-slate-305 mb-2" />
                          <p>Click on active assignments on the left side panel to trigger homework uploads or answer review registers.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Meetings tab panel */}
              {activeClassTab === 'meetings' && (
                <motion.div
                  key="meetings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Live indicator Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-left h-fit space-y-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Video className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">Video classrooms</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Schedule revision meetings or doubted question forums list. Joining a meeting automatically brings up full audio/video tiles, raised hand tracking boards, collaborative sketches, and chats.
                      </p>
                      {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                        <button
                          onClick={() => setShowMeetingModal(true)}
                          className="w-full bg-indigo-600 hover:bg-indigo-705 text-white text-xs font-semibold py-2 px-3 rounded-md transition active:scale-95 shadow-xs flex items-center justify-center space-x-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Schedule New Meeting</span>
                        </button>
                      )}
                    </div>

                    {/* Meeting schedules listings */}
                    <div className="md:col-span-2 space-y-3 text-left">
                      {activeClassMeetings.length === 0 ? (
                        <div className="p-10 bg-white border border-slate-200 rounded-xl text-center text-slate-404 text-xs flex flex-col items-center justify-center space-y-3">
                          <Video className="w-10 h-10 text-slate-300" />
                          <p className="font-medium text-slate-550">No live meetings scheduled yet.</p>
                          {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                            <button
                              onClick={() => setShowMeetingModal(true)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold py-1.5 px-4 rounded-md transition active:scale-95 shadow-sm"
                            >
                              Schedule First Meeting Now
                            </button>
                          )}
                        </div>
                      ) : (
                        activeClassMeetings.map((mt, idx) => (
                          <div key={`${mt.id}-${idx}`} className="bg-white border border-slate-200/90 rounded-xl p-5 flex justify-between items-center shadow-xs">
                            <div className="flex items-center space-x-3.5 min-w-0">
                              <div className="bg-indigo-50 text-indigo-700 w-11 h-11 rounded-lg flex flex-col items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold block leading-none">{mt.date.split('-')[2]}</span>
                                <span className="text-[8px] font-mono font-bold tracking-tight uppercase">{new Date(mt.date).toLocaleString('en', {month: 'short'})}</span>
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 truncate">{mt.title}</h4>
                                <span className="text-[10px] text-indigo-600 font-bold block mb-0.5">{mt.time} | Duration: {mt.duration} mins</span>
                                <p className="text-[11px] text-slate-400 truncate">{mt.description}</p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                              <button 
                                onClick={() => {
                                  const link = `${window.location.origin}?meetingId=${mt.id}`;
                                  navigator.clipboard.writeText(link);
                                  triggerAlert("Direct meeting invite link copied to clipboard!", "ok");
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 text-[11px] font-bold py-2 px-3.5 rounded-md transition duration-200 shrink-0 shadow-xs active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
                                title="Copy Invitation Link"
                              >
                                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Copy Invite Link</span>
                              </button>

                              {mt.joinLink && mt.joinLink.includes('meet.google.com') && (
                                <a 
                                  href={mt.joinLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2 px-3.5 rounded-md transition duration-200 shrink-0 shadow-sm active:scale-95 flex items-center justify-center space-x-1.5"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Official Google Meet</span>
                                </a>
                              )}

                              <button 
                                onClick={() => setSelectedMeeting(mt)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-2 px-4 rounded-md transition duration-200 shrink-0 shadow-sm active:scale-95 flex items-center justify-center space-x-1.5"
                              >
                                {mt.joinLink ? (
                                  <>
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Interactive Studio</span>
                                  </>
                                ) : (
                                  <>
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Join Session</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Attendance tab panel */}
              {activeClassTab === 'attendance' && (
                <motion.div
                  key="attendance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-left">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Class registers logs</h3>
                    
                    {currentUser?.role === 'student' ? (
                      /* Student sees their own attendance logs */
                      <div className="space-y-3 text-xs text-slate-700">
                        <p className="font-semibold text-slate-800">Your Attendance History Records in this class:</p>
                        {activeClassAttendance.filter(a => a.student.email === currentUser?.email).length === 0 ? (
                          <div className="p-8 text-center text-slate-405 font-mono text-xs">No attendance marked yet.</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {activeClassAttendance.filter(a => a.student.email === currentUser?.email).map((r, i) => (
                              <div key={i} className="p-3 border border-slate-150 bg-slate-50/50 rounded-lg flex justify-between items-center">
                                <span className="font-bold text-slate-800">{r.record.date}</span>
                                <span className={`text-[9px] font-bold py-0.5 px-2 rounded-sm ${r.record.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-650'}`}>
                                  {r.record.status.toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Teachers/Admins mark and logs */
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-650">Select Session Date:</span>
                            <input 
                              type="date" 
                              value={attendanceDate}
                              onChange={(e) => setAttendanceDate(e.target.value)}
                              className="border border-slate-200 rounded p-1"
                            />
                          </div>
                          <button 
                            onClick={saveAttendanceSheet} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 active:scale-95 shadow-xs"
                          >
                            Save Attendance registry
                          </button>
                        </div>

                        {classroomStudents.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-xs">Roster registry of classroom students loaded is empty. Add profiles.</div>
                        ) : (
                          <table className="w-full text-left text-xs divide-y divide-slate-100">
                            <thead>
                              <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                <th className="py-2.5">Student Username</th>
                                <th className="py-2.5 text-center">Status Indicators</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {classroomStudents.map((std, idx) => (
                                <tr key={`${std.id}-${idx}`}>
                                  <td className="py-3">
                                    <span className="font-bold text-slate-900 block">{std.name}</span>
                                    <span className="text-[10px] text-slate-400 block">{std.email}</span>
                                  </td>
                                  <td className="py-3 text-center">
                                    <div className="inline-flex rounded-md p-1 bg-slate-100 border text-[10px] font-bold">
                                      {(['present', 'absent', 'late', 'excused'] as const).map(option => (
                                        <button 
                                          key={option}
                                          onClick={() => setAttendanceGrid({ ...attendanceGrid, [std.id]: option })}
                                          className={`py-1 px-3.5 rounded-sm capitalize transition ${attendanceGrid[std.id] === option ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                          {option}
                                        </button>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Class Notice Board Tab Panel */}
              {activeClassTab === 'board' && (
                <motion.div
                  key="board"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="space-y-6 text-left"
                >
                  {/* Notice Board Header */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2.5">
                        <Megaphone className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">Class Notice Board & Discussion Hub</h3>
                      </div>
                      <p className="text-xs text-slate-400">
                        Post course announcements, pin critical reminders, ask curriculum questions, and upvote student solutions.
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {/* Search Notice Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                          <Search className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search notices..."
                          value={noticeSearchQuery}
                          onChange={(e) => setNoticeSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 w-full sm:w-44 border border-slate-700 rounded-lg text-xs bg-slate-800 text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium placeholder:text-slate-500"
                        />
                      </div>

                      {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                        <button
                          onClick={() => setShowNewNoticeForm(!showNewNoticeForm)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center space-x-1 transition active:scale-95 shadow-md cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>New Post</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* New Notice Form Card */}
                  <AnimatePresence>
                    {showNewNoticeForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs overflow-hidden"
                      >
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Create General Notice or Question</h4>
                        <div className="space-y-4 text-xs">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Notice Title</label>
                              <input
                                type="text"
                                placeholder="e.g. Diagnostic Assessment or Chapter 4 Study Guide Updates..."
                                value={newNoticeData.title}
                                onChange={(e) => setNewNoticeData({ ...newNoticeData, title: e.target.value })}
                                className="w-full border rounded-lg p-2 bg-slate-50 text-slate-800 focus:bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Category Badge</label>
                              <select
                                value={newNoticeData.category}
                                onChange={(e) => setNewNoticeData({ ...newNoticeData, category: e.target.value })}
                                className="w-full border rounded-lg p-2 bg-white text-slate-700"
                              >
                                <option value="general">General Notification</option>
                                <option value="important">🚨 Urgent Alert</option>
                                <option value="homework">📝 Homework / Task Guide</option>
                                <option value="q_and_a">❓ Student Question Board</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Notice Body Content</label>
                            <textarea
                              rows={4}
                              placeholder="Describe assignment modifications, pin schedules, or write specific questions for the class cohort..."
                              value={newNoticeData.content}
                              onChange={(e) => setNewNoticeData({ ...newNoticeData, content: e.target.value })}
                              className="w-full border rounded-lg p-2.5 bg-slate-50 text-slate-800 focus:bg-white"
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setShowNewNoticeForm(false)}
                              className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg font-bold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleAddNotice}
                              disabled={!newNoticeData.title.trim() || !newNoticeData.content.trim()}
                              className="px-4 py-2 bg-indigo-600 disabled:opacity-50 text-white rounded-lg font-bold hover:bg-indigo-700 cursor-pointer"
                            >
                              Publish to Board
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Notice Posts Feed */}
                  {(() => {
                    // Filter based on selected class and search query
                    const classIdFilter = selectedClass?.id || 1;
                    const query = noticeSearchQuery.toLowerCase().trim();
                    const filtered = classNoticePosts.filter(post => {
                      if (post.classId !== classIdFilter) return false;
                      if (!query) return true;
                      return (
                        post.title.toLowerCase().includes(query) ||
                        post.content.toLowerCase().includes(query) ||
                        post.authorName.toLowerCase().includes(query)
                      );
                    });

                    // Sort: pinned first, then newest first
                    const sorted = [...filtered].sort((a, b) => {
                      if (a.pinned && !b.pinned) return -1;
                      if (!a.pinned && b.pinned) return 1;
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });

                    if (sorted.length === 0) {
                      return (
                        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs flex flex-col items-center justify-center space-y-4 shadow-3xs">
                          <MessageSquare className="w-10 h-10 text-slate-300" />
                          <p className="max-w-md leading-relaxed font-mono text-center">
                            No notifications or questions matching filter criteria. Create your first announcement to begin discussion!
                          </p>
                          {currentUser?.role !== 'student' && (
                            <button
                              onClick={() => setShowNewNoticeForm(true)}
                              className="bg-indigo-600 text-white font-bold py-1.5 px-4 rounded-lg flex items-center space-x-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Create First Announcement</span>
                            </button>
                          )}
                        </div>
                      );
                    }

                    const getCategoryStyle = (cat: string) => {
                      switch (cat) {
                        case 'important':
                          return 'bg-red-50 text-red-600 border-red-100';
                        case 'homework':
                          return 'bg-amber-50 text-amber-700 border-amber-100';
                        case 'q_and_a':
                          return 'bg-indigo-50 text-indigo-700 border-indigo-100';
                        default:
                          return 'bg-slate-50 text-slate-600 border-slate-150';
                      }
                    };

                    const getCategoryLabel = (cat: string) => {
                      switch (cat) {
                        case 'important': return '🚨 Urgent Alert';
                        case 'homework': return '📝 Homework Guide';
                        case 'q_and_a': return '❓ Peer Q&A';
                        default: return '📢 Notice';
                      }
                    };

                    return (
                      <div className="space-y-4">
                        {sorted.map((post) => {
                          const hasUpvoted = currentUser && post.upvotedBy?.includes(currentUser.id);
                          const commentsList = post.comments || [];
                          // Sort verified answers to the top
                          const sortedComments = [...commentsList].sort((a, b) => {
                            if (a.isAnswer && !b.isAnswer) return -1;
                            if (!a.isAnswer && b.isAnswer) return 1;
                            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                          });

                          return (
                            <div
                              key={post.id}
                              className={`bg-white border rounded-2xl shadow-3xs transition-all overflow-hidden ${post.pinned ? 'border-indigo-400 ring-1 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                              {/* Post Header */}
                              <div className="p-5 pb-4 border-b border-slate-50">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${getCategoryStyle(post.category)}`}>
                                      {getCategoryLabel(post.category)}
                                    </span>
                                    {post.pinned && (
                                      <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black py-0.5 px-2 rounded-full flex items-center border border-indigo-100">
                                        <Pin className="w-2.5 h-2.5 mr-1 text-indigo-500 fill-indigo-500" />
                                        PINNED
                                      </span>
                                    )}
                                  </div>

                                  {/* Author and Date metadata */}
                                  <div className="text-[10px] text-slate-450 font-mono">
                                    Posted by <strong>{post.authorName}</strong> • {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>

                                <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                                  {post.title}
                                </h4>
                                <p className="text-xs text-slate-650 leading-relaxed whitespace-pre-line select-text">
                                  {post.content}
                                </p>
                              </div>

                              {/* Interactive Bar */}
                              <div className="bg-slate-50/50 px-5 py-2.5 flex items-center justify-between text-xs border-b border-slate-50">
                                <div className="flex items-center space-x-4">
                                  {/* Upvote Button */}
                                  <button
                                    onClick={() => handleUpvoteNotice(post.id)}
                                    className={`flex items-center space-x-1.5 font-bold text-[10.5px] py-1 px-2.5 rounded-lg border transition active:scale-95 cursor-pointer ${hasUpvoted ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white hover:bg-slate-105 border-slate-200 text-slate-650'}`}
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>{post.upvotes || 0} Upvotes</span>
                                  </button>

                                  {/* Comments Counter */}
                                  <span className="text-slate-500 font-medium flex items-center space-x-1.5 text-[10.5px]">
                                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{commentsList.length} Responses</span>
                                  </span>
                                </div>

                                {/* Educator controls */}
                                {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                  <div className="flex items-center space-x-1.5">
                                    <button
                                      onClick={() => handleTogglePinNotice(post.id)}
                                      className={`p-1.5 border hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-indigo-600 cursor-pointer ${post.pinned ? 'bg-indigo-50 border-indigo-150 text-indigo-600' : 'bg-white border-slate-200'}`}
                                      title={post.pinned ? "Unpin Announcement" : "Pin Announcement to Top"}
                                    >
                                      <Pin className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteNotice(post.id)}
                                      className="p-1.5 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded-lg transition cursor-pointer"
                                      title="Delete Announcement"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Comments Section */}
                              <div className="bg-slate-50/35 p-5 space-y-4">
                                {/* Comment list */}
                                {sortedComments.length > 0 && (
                                  <div className="space-y-2.5">
                                    {sortedComments.map((comm) => (
                                      <div
                                        key={comm.id}
                                        className={`p-3 rounded-xl border text-xs text-left transition-all ${comm.isAnswer ? 'bg-emerald-50/45 border-emerald-200 shadow-3xs' : 'bg-white border-slate-150'}`}
                                      >
                                        <div className="flex justify-between items-start mb-1.5">
                                          <div>
                                            <span className="font-bold text-slate-900 mr-1.5">{comm.authorName}</span>
                                            {comm.isAnswer && (
                                              <span className="bg-emerald-100 text-emerald-800 text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                ✓ Verified Educator Answer
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-[9.5px] text-slate-400 font-mono">
                                            {new Date(comm.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>

                                        <p className="text-slate-700 leading-relaxed text-[11px] select-text">
                                          {comm.content}
                                        </p>

                                        {/* Verification Action (Teacher-only) */}
                                        {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                          <div className="flex justify-end pt-1.5">
                                            <button
                                              onClick={() => handleToggleCommentAnswer(post.id, comm.id)}
                                              className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border flex items-center space-x-1 transition active:scale-95 cursor-pointer ${comm.isAnswer ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100/50' : 'bg-white hover:bg-slate-50 border-slate-200 text-emerald-650 hover:text-emerald-700'}`}
                                            >
                                              {comm.isAnswer ? (
                                                <span>Remove Verification</span>
                                              ) : (
                                                <>
                                                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                                                  <span>Verify as Official Answer</span>
                                                </>
                                              )}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Write a reply field */}
                                <div className="flex items-start space-x-2">
                                  <textarea
                                    rows={1}
                                    placeholder="Write a reply or answer this student question..."
                                    value={noticeReplyTexts[post.id] || ""}
                                    onChange={(e) => setNoticeReplyTexts({ ...noticeReplyTexts, [post.id]: e.target.value })}
                                    className="w-full text-[11px] text-slate-850 placeholder-slate-400 rounded-lg border border-slate-200 bg-white p-2 outline-hidden focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition"
                                  />
                                  <button
                                    onClick={() => handleAddNoticeComment(post.id)}
                                    disabled={!(noticeReplyTexts[post.id] || "").trim()}
                                    className="bg-indigo-600 disabled:opacity-50 text-white hover:bg-indigo-700 px-3 py-2 text-[10.5px] font-bold rounded-lg transition shrink-0 cursor-pointer flex items-center space-x-1"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Reply</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {/* Analytics tab panel with AI recommendations */}
              {activeClassTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="space-y-4 text-left"
                >
                  {activeClassAnalytics ? (
                    <div className="space-y-5">
                      {/* KPI stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="bg-white border rounded-xl p-4">
                          <span className="text-[10px] text-slate-450 uppercase tracking-widest font-bold">Total rosters Enrolls</span>
                          <h4 className="text-2xl font-black text-slate-900 mt-1">{activeClassAnalytics.studentsCount} Students</h4>
                        </div>
                        <div className="bg-white border rounded-xl p-4">
                          <span className="text-[10px] text-slate-455 uppercase tracking-widest font-bold">Asg. registers count</span>
                          <h4 className="text-2xl font-black text-slate-900 mt-1">{activeClassAnalytics.assignmentsCount} Units</h4>
                        </div>
                        <div className="bg-white border rounded-xl p-4">
                          <span className="text-[10px] text-slate-450 uppercase tracking-widest font-bold">Meetings broadcasted</span>
                          <h4 className="text-2xl font-black text-slate-900 mt-1">{activeClassAnalytics.meetingsCount} session logs</h4>
                        </div>
                      </div>

                      {/* AI recommendations card */}
                      <div className="bg-linear-to-b from-slate-950 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-indigo-300 flex items-center">
                            <Sparkles className="w-4.5 h-4.5 text-indigo-400 fill-indigo-400 mr-2 animate-bounce" />
                            AI REGULATOR ANOMALIES & RECOMMENDER
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">Gemini 3.5 Flash engine</span>
                        </div>

                        {/* At risk records table output */}
                        <div className="space-y-3.5 text-xs text-slate-350">
                          <div>
                            <span className="font-bold text-indigo-200 block mb-1">Detected Risk Profiles:</span>
                            {activeClassAnalytics.aiAnalytics.atRiskStudents && activeClassAnalytics.aiAnalytics.atRiskStudents.length > 0 ? (
                              activeClassAnalytics.aiAnalytics.atRiskStudents.map((ar: any, i: number) => (
                                <div key={i} className="p-2 border border-slate-805 bg-slate-900/60 rounded-md mb-2 flex justify-between items-center text-[11px]">
                                  <div>
                                    <strong className="text-white">{ar.studentName}</strong>: <span className="text-slate-400">{ar.reason}</span>
                                  </div>
                                  <span className="bg-red-900/50 border border-red-750 text-red-300 py-0.5 px-2 rounded-sm text-[9px] font-bold">
                                    Risk: {ar.riskLevel}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-[11px] text-slate-500 italic">No critical student risk alerts flagged.</p>
                            )}
                          </div>

                          <div className="h-px bg-slate-800"></div>

                          <div>
                            <span className="font-bold text-emerald-300 block mb-1">Educational Cohort Strengths:</span>
                            <ul className="list-disc list-inside space-y-1 text-[11px]">
                              {activeClassAnalytics.aiAnalytics.cohortStrengths.map((str: any, i: number) => (
                                <li key={i}>{str}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="h-px bg-slate-800"></div>

                          <div>
                            <span className="font-bold text-indigo-200 block mb-1">AI Recommender steps:</span>
                            <ul className="list-disc list-inside space-y-1 text-[11px]">
                              {activeClassAnalytics.aiAnalytics.recommendations.map((rec: any, i: number) => (
                                <li key={i}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Class Leaderboard Component */}
                      {(() => {
                        const totalAsgs = activeClassAssignments?.length || 0;
                        
                        // Compute performance metrics for each student
                        const leaderboardData = classroomStudents.map(student => {
                          const studentSubmissions = activeClassSubmissions.filter(sub => sub.studentId === student.id);
                          const gradedSubs = studentSubmissions.filter(sub => sub.status === 'graded' && sub.grade);
                          
                          const gradesArray = gradedSubs.map(sub => {
                            const parsed = parseFloat(sub.grade);
                            return isNaN(parsed) ? null : parsed;
                          }).filter(g => g !== null) as number[];

                          const avgGrade = gradesArray.length > 0
                            ? Math.round(gradesArray.reduce((acc, curr) => acc + curr, 0) / gradesArray.length)
                            : null;

                          const submittedCount = studentSubmissions.length;
                          const submissionRate = totalAsgs > 0 ? Math.round((submittedCount / totalAsgs) * 100) : 0;

                          return {
                            student,
                            avgGrade,
                            gradedCount: gradesArray.length,
                            submittedCount,
                            submissionRate,
                          };
                        });

                        // Filter based on search query
                        const filteredLeaderboard = leaderboardData.filter(item => {
                          const query = leaderboardSearch.toLowerCase().trim();
                          if (!query) return true;
                          return (
                            item.student.name?.toLowerCase().includes(query) ||
                            item.student.email?.toLowerCase().includes(query)
                          );
                        });

                        // Sort based on sort option
                        const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => {
                          if (leaderboardSortBy === 'grade') {
                            if (a.avgGrade === null && b.avgGrade !== null) return 1;
                            if (a.avgGrade !== null && b.avgGrade === null) return -1;
                            if (a.avgGrade !== null && b.avgGrade !== null) {
                              if (b.avgGrade !== a.avgGrade) {
                                return b.avgGrade - a.avgGrade;
                              }
                            }
                            if (b.submissionRate !== a.submissionRate) {
                              return b.submissionRate - a.submissionRate;
                            }
                          } else if (leaderboardSortBy === 'rate') {
                            if (b.submissionRate !== a.submissionRate) {
                              return b.submissionRate - a.submissionRate;
                            }
                            if (a.avgGrade === null && b.avgGrade !== null) return 1;
                            if (a.avgGrade !== null && b.avgGrade === null) return -1;
                            if (a.avgGrade !== null && b.avgGrade !== null) {
                              return b.avgGrade - a.avgGrade;
                            }
                          }
                          return (a.student.name || '').localeCompare(b.student.name || '');
                        });

                        const getGradeDetails = (score: number | null) => {
                          if (score === null) return { letter: '—', color: 'bg-slate-100 text-slate-550 border-slate-200' };
                          if (score >= 90) return { letter: 'A', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
                          if (score >= 80) return { letter: 'B', color: 'bg-blue-50 text-blue-700 border-blue-200' };
                          if (score >= 70) return { letter: 'C', color: 'bg-amber-50 text-amber-700 border-amber-200' };
                          if (score >= 60) return { letter: 'D', color: 'bg-orange-50 text-orange-700 border-orange-200' };
                          return { letter: 'F', color: 'bg-red-50 text-red-700 border-red-200' };
                        };

                        return (
                          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                            {/* Card Header */}
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center">
                                  <Trophy className="w-4 h-4 text-amber-550 mr-2" />
                                  Class Leaderboard
                                </h3>
                                <p className="text-[11px] text-slate-550">
                                  Rankings based on average evaluated assignment scores and overall work completion rate.
                                </p>
                              </div>

                              {/* Search & Sorting Controls */}
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
                                    <Search className="w-3.5 h-3.5" />
                                  </span>
                                  <input 
                                    type="text"
                                    placeholder="Search student..."
                                    value={leaderboardSearch}
                                    onChange={(e) => setLeaderboardSearch(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 w-full sm:w-44 border border-slate-200 rounded-lg text-xs bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                                  />
                                </div>

                                <div className="flex items-center space-x-1 border border-slate-200 rounded-lg p-0.5 bg-slate-100">
                                  <button
                                    onClick={() => setLeaderboardSortBy('grade')}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${leaderboardSortBy === 'grade' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
                                  >
                                    Grade Avg
                                  </button>
                                  <button
                                    onClick={() => setLeaderboardSortBy('rate')}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${leaderboardSortBy === 'rate' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
                                  >
                                    Completion
                                  </button>
                                  <button
                                    onClick={() => setLeaderboardSortBy('name')}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${leaderboardSortBy === 'name' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-550 hover:text-slate-850'}`}
                                  >
                                    Name
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Leaderboard Table */}
                            {sortedLeaderboard.length === 0 ? (
                              <div className="p-10 text-center text-slate-450 text-xs italic">
                                {leaderboardSearch ? "No students match your search filter." : "No students have grades or submissions in this classroom."}
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs divide-y divide-slate-100">
                                  <thead className="bg-slate-50/30">
                                    <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                      <th className="py-3 px-5 text-center w-16">Rank</th>
                                      <th className="py-3 px-4">Student</th>
                                      <th className="py-3 px-4 text-center">Submission Status</th>
                                      <th className="py-3 px-4 text-center">Average Grade</th>
                                      <th className="py-3 px-4 text-center">Tier</th>
                                      <th className="py-3 px-5 text-right">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50">
                                    {sortedLeaderboard.map((item, index) => {
                                      const isCurrentUser = currentUser?.id === item.student.id;
                                      const gradeDetails = getGradeDetails(item.avgGrade);
                                      const rank = index + 1;

                                      let rankBadge;
                                      if (rank === 1) {
                                        rankBadge = (
                                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs">
                                            <Trophy className="w-4 h-4 fill-amber-400 text-amber-500" />
                                          </div>
                                        );
                                      } else if (rank === 2) {
                                        rankBadge = (
                                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs">
                                            <Medal className="w-4 h-4 fill-slate-300 text-slate-400" />
                                          </div>
                                        );
                                      } else if (rank === 3) {
                                        rankBadge = (
                                          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-50 border border-orange-100 text-orange-750 shadow-2xs">
                                            <Award className="w-4 h-4 text-orange-500 fill-orange-250" />
                                          </div>
                                        );
                                      } else {
                                        rankBadge = (
                                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 border border-slate-100 text-slate-500 font-bold text-[10px]">
                                            {rank}
                                          </div>
                                        );
                                      }

                                      return (
                                        <tr 
                                          key={item.student.id} 
                                          className={`hover:bg-indigo-50/10 transition-all ${isCurrentUser ? 'bg-indigo-50/20' : ''}`}
                                        >
                                          <td className="py-3 px-5 text-center font-bold">
                                            {rankBadge}
                                          </td>

                                          <td className="py-3 px-4">
                                            <div>
                                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                {item.student.name}
                                                {isCurrentUser && (
                                                  <span className="bg-indigo-100 text-indigo-750 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                                    You
                                                  </span>
                                                )}
                                              </div>
                                              <div className="text-[10px] text-slate-450 font-mono">{item.student.email}</div>
                                            </div>
                                          </td>

                                          <td className="py-3 px-4">
                                            <div className="max-w-[150px] mx-auto space-y-1">
                                              <div className="flex justify-between items-center text-[10px]">
                                                <span className="font-bold text-slate-600">{item.submissionRate}% Done</span>
                                                <span className="text-slate-400">{item.submittedCount}/{totalAsgs} units</span>
                                              </div>
                                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                  className={`h-full rounded-full transition-all duration-500 ${
                                                    item.submissionRate >= 80 ? 'bg-emerald-500' :
                                                    item.submissionRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                                  }`}
                                                  style={{ width: `${item.submissionRate}%` }}
                                                ></div>
                                              </div>
                                            </div>
                                          </td>

                                          <td className="py-3 px-4 text-center">
                                            {item.avgGrade !== null ? (
                                              <span className="text-sm font-black text-slate-800 font-mono">
                                                {item.avgGrade}%
                                              </span>
                                            ) : (
                                              <span className="text-slate-400 italic font-mono">—</span>
                                            )}
                                          </td>

                                          <td className="py-3 px-4 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border uppercase ${gradeDetails.color}`}>
                                              {gradeDetails.letter}
                                            </span>
                                          </td>

                                          <td className="py-3 px-5 text-right">
                                            <button
                                              onClick={() => {
                                                setSelectedStudentIdForSummary(item.student.id);
                                                startTransition(() => {
                                                  setActiveClassTab('student_summary');
                                                });
                                              }}
                                              className="inline-flex items-center space-x-1 py-1 px-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition text-[10px] font-bold text-slate-650 active:scale-95 cursor-pointer"
                                              title="View student summary evaluation"
                                            >
                                              <span>Analyze</span>
                                              <ArrowUpRight className="w-3.5 h-3.5" />
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Visual Seating Grid & Smart Group Maker Dashboard */}
                      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
                        {/* Tab Headers inside the card */}
                        <div className="p-5 border-b border-slate-100 bg-slate-50/55 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center">
                              <LayoutGrid className="w-4.5 h-4.5 text-indigo-550 mr-2" />
                              Classroom Layout & Project Squad Planner
                            </h3>
                            <p className="text-[11px] text-slate-550">
                              Establish visual seat maps or generate academically balanced project group rosters instantly.
                            </p>
                          </div>
                        </div>

                        {/* Interactive Workspace Tools */}
                        <div className="p-6 space-y-6">
                          {/* Inner tools grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            
                            {/* Visual Seating Map Desk Grid */}
                            <div className="lg:col-span-7 space-y-4 text-left">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-slate-500" />
                                  Visual Seating Desk Map (4 × 5)
                                </span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={handleAutoAssignSeating}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-750 text-[10px] font-bold py-1 px-2.5 rounded transition cursor-pointer"
                                    title="Auto-fill seats sequentially"
                                  >
                                    Auto-Fill sequential
                                  </button>
                                  <button
                                    onClick={handleClearSeating}
                                    className="border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-500 hover:text-red-650 text-[10px] font-bold py-1 px-2.5 rounded transition cursor-pointer"
                                    title="Clear Seating Chart"
                                  >
                                    Reset Layout
                                  </button>
                                </div>
                              </div>

                              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                                <div className="grid grid-cols-5 gap-3">
                                  {Array.from({ length: 4 }).map((_, rIndex) => (
                                    Array.from({ length: 5 }).map((_, cIndex) => {
                                      const prefix = `${selectedClass?.id || 1}_`;
                                      // Find student seated here
                                      const seatedStudentId = Object.keys(classSeating).find(key => {
                                        if (!key.startsWith(prefix)) return false;
                                        const pos = classSeating[key];
                                        return pos.row === rIndex && pos.col === cIndex;
                                      })?.substring(prefix.length);

                                      const seatedStudentObj = seatedStudentId 
                                        ? classroomStudents.find(s => String(s.id) === String(seatedStudentId)) 
                                        : null;

                                      // Get list of unseated students
                                      const seatedStudentIds = Object.keys(classSeating)
                                        .filter(key => key.startsWith(prefix))
                                        .map(key => key.substring(prefix.length));

                                      const unseatedStudents = classroomStudents.filter(s => !seatedStudentIds.includes(String(s.id)));

                                      return (
                                        <div 
                                          key={`${rIndex}-${cIndex}`} 
                                          className={`relative border rounded-lg p-2.5 text-center min-h-[75px] flex flex-col items-center justify-center transition-all ${
                                            seatedStudentObj 
                                              ? 'bg-white border-indigo-200 shadow-3xs' 
                                              : 'bg-slate-100/50 border-dashed border-slate-250 hover:bg-slate-100'
                                          }`}
                                        >
                                          {/* Desk Coordinates label */}
                                          <span className="absolute top-1 right-1 text-[7.5px] font-mono font-bold text-slate-350">
                                            R{rIndex+1}C{cIndex+1}
                                          </span>

                                          {seatedStudentObj ? (
                                            <div className="w-full flex flex-col items-center justify-between h-full pt-1.5 text-center">
                                              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[9px] font-bold uppercase shrink-0">
                                                {seatedStudentObj.name.charAt(0)}
                                              </div>
                                              <div className="text-[9.5px] font-bold text-slate-800 truncate w-full text-center mt-1">
                                                {seatedStudentObj.name.split(' ')[0]}
                                              </div>
                                              <button
                                                onClick={() => {
                                                  const key = `${prefix}${seatedStudentObj.id}`;
                                                  setClassSeating(prev => {
                                                    const copy = { ...prev };
                                                    delete copy[key];
                                                    return copy;
                                                  });
                                                }}
                                                className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center text-[9px] font-bold transition shadow-3xs cursor-pointer"
                                                title="Unassign desk"
                                              >
                                                ×
                                              </button>
                                            </div>
                                          ) : (
                                            <div className="w-full pt-2">
                                              {unseatedStudents.length > 0 ? (
                                                <select
                                                  onChange={(e) => {
                                                    if (e.target.value) {
                                                      handleAssignSeat(e.target.value, rIndex, cIndex);
                                                    }
                                                  }}
                                                  className="w-full text-[8.5px] font-bold text-slate-400 bg-transparent border-0 focus:ring-0 cursor-pointer outline-hidden text-center truncate"
                                                  defaultValue=""
                                                >
                                                  <option value="" disabled>Desk Empty</option>
                                                  {unseatedStudents.map(std => (
                                                    <option key={std.id} value={std.id} className="text-slate-800">
                                                      Assign: {std.name.split(' ')[0]}
                                                    </option>
                                                  ))}
                                                </select>
                                              ) : (
                                                <span className="text-[8.5px] font-bold text-slate-350 italic">Full Desk</span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })
                                  ))}
                                </div>
                                <div className="mt-3 text-center">
                                  <div className="inline-block px-5 py-1 rounded bg-slate-200/80 border text-[9px] font-black tracking-wider uppercase text-slate-500">
                                    FRONT BOARD / INSTRUCTOR PODIUM
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Smart Group Maker planner */}
                            <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 pt-4 lg:pt-0 text-left">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <Shuffle className="w-4 h-4 text-slate-500" />
                                Roster Smart Team Maker (Balanced Metrics)
                              </span>

                              <div className="space-y-4">
                                <p className="text-[10.5px] text-slate-550 leading-relaxed">
                                  Distributes student cohorts into project study squads automatically. Balances assignments evaluation metrics to ensure performance levels are distributed evenly.
                                </p>

                                <div className="flex items-center space-x-3 text-xs bg-slate-50 p-3.5 border border-slate-150 rounded-xl">
                                  <div className="space-y-1">
                                    <label className="block text-[10px] font-bold uppercase text-slate-500">Max size per squad</label>
                                    <input
                                      type="number"
                                      min={2}
                                      max={10}
                                      value={groupSizeInput}
                                      onChange={(e) => setGroupSizeInput(parseInt(e.target.value) || 3)}
                                      className="border rounded p-1.5 w-16 text-center font-bold bg-white"
                                    />
                                  </div>

                                  <div className="flex-1 flex space-x-2 pt-4">
                                    <button
                                      onClick={() => handleGenerateGroups(groupSizeInput)}
                                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded text-[11px] transition active:scale-95 cursor-pointer shadow-3xs"
                                    >
                                      Create Squads
                                    </button>
                                    {classGroups.length > 0 && (
                                      <button
                                        onClick={handleClearGroups}
                                        className="border border-slate-200 hover:bg-slate-100 text-slate-650 font-bold py-2 px-3 rounded text-[11px] transition cursor-pointer"
                                      >
                                        Clear
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Generated groups display */}
                                {classGroups.length > 0 ? (
                                  <div className="space-y-2 max-h-[220px] overflow-y-auto">
                                    {classGroups.map((group) => {
                                      // Calculate group avg grade
                                      const groupGrades: number[] = [];
                                      group.members.forEach((m: any) => {
                                        const sub = activeClassSubmissions.filter(s => s.studentId === m.id);
                                        const graded = sub.filter(s => s.status === 'graded' && s.grade);
                                        graded.forEach(s => {
                                          const parsed = parseFloat(s.grade);
                                          if (!isNaN(parsed)) groupGrades.push(parsed);
                                        });
                                      });
                                      const groupAvg = groupGrades.length > 0
                                        ? Math.round(groupGrades.reduce((a, b) => a + b, 0) / groupGrades.length)
                                        : 75;

                                      return (
                                        <div key={group.id} className="p-3 border border-slate-200 bg-white rounded-xl shadow-3xs text-xs space-y-1.5 text-left">
                                          <div className="flex justify-between items-center border-b border-slate-50 pb-1">
                                            <span className="font-bold text-slate-800">{group.name}</span>
                                            <span className="bg-indigo-50 text-indigo-750 border border-indigo-100 px-2 py-0.5 rounded text-[9px] font-black">
                                              Avg Grade: {groupAvg}%
                                            </span>
                                          </div>
                                          <div className="flex flex-wrap gap-1.5 pt-1">
                                            {group.members.map((member: any) => (
                                              <span key={member.id} className="bg-slate-100 text-slate-750 px-2 py-1 rounded-md text-[9.5px] font-semibold flex items-center">
                                                {member.name.split(' ')[0]}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                    <button
                                      onClick={() => {
                                        const exportText = classGroups.map(g => `${g.name}: ${g.members.map((m: any) => m.name).join(', ')}`).join('\n');
                                        navigator.clipboard.writeText(exportText);
                                        triggerAlert("Balanced project rosters copied to clipboard!", "ok");
                                      }}
                                      className="w-full text-center border border-dashed border-indigo-200 hover:border-indigo-300 text-indigo-600 text-[10.5px] font-bold py-1.5 rounded-lg transition cursor-pointer"
                                    >
                                      Export Squad Roster list
                                    </button>
                                  </div>
                                ) : (
                                  <div className="p-6 border border-dashed rounded-xl text-center text-slate-400 text-[10.5px] font-mono">
                                    No squads formed yet. Choose squad size and click 'Create Squads' to launch distribution.
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 border border-slate-205 rounded-xl bg-white text-center text-slate-400 text-xs text-mono">Generating class recommendations...</div>
                  )}
                </motion.div>
              )}

              {/* Student Summary Subtab Panel */}
              {activeClassTab === 'student_summary' && (() => {
                const targetStudentId = currentUser?.role === 'student'
                  ? currentUser.id
                  : (selectedStudentIdForSummary || classroomStudents[0]?.id || 0);

                const targetStudentObj = currentUser?.role === 'student'
                  ? currentUser
                  : (classroomStudents.find(s => s.id === targetStudentId) || classroomStudents[0]);

                const relevantAssignments = activeClassAssignments || [];
                const studentSubmissionsForClass = activeClassSubmissions.filter(sub => sub.studentId === targetStudentId);

                const submittedCount = studentSubmissionsForClass.length;
                const totalAsgs = relevantAssignments.length;

                const gradedSubs = studentSubmissionsForClass.filter(sub => sub.status === 'graded' && sub.grade);
                const gradesArray = gradedSubs.map(sub => {
                  const parsed = parseFloat(sub.grade);
                  return isNaN(parsed) ? null : parsed;
                }).filter(g => g !== null) as number[];

                const avgMark = gradesArray.length > 0
                  ? Math.round(gradesArray.reduce((acc, curr) => acc + curr, 0) / gradesArray.length)
                  : 0;

                const studentAttendanceRecords = activeClassAttendance.filter(a => a.record.studentId === targetStudentId);
                const totalAttendance = studentAttendanceRecords.length;
                const presentCount = studentAttendanceRecords.filter(a => a.record.status === 'present').length;
                const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

                const chartData = [...relevantAssignments]
                  .sort((a, b) => {
                    const da = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                    const db = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                    return da - db || (a.id - b.id);
                  })
                  .map(asg => {
                    const sub = studentSubmissionsForClass.find(s => s.assignmentId === asg.id);
                    let score = null;
                    if (sub && sub.status === 'graded' && sub.grade) {
                      const parsed = parseFloat(sub.grade);
                      if (!isNaN(parsed)) score = parsed;
                    }
                    return {
                      title: asg.title.length > 15 ? asg.title.substring(0, 15) + "..." : asg.title,
                      fullTitle: asg.title,
                      Score: score,
                      Max: asg.maxMarks || 100,
                      status: sub ? (sub.status === 'graded' ? 'Graded' : 'Submitted (Pending Grade)') : 'Pending Submission'
                    };
                  });

                const finalChartData = chartData.length > 0 ? chartData.map(pt => ({
                  ...pt,
                  Score: pt.Score === null ? 0 : pt.Score
                })) : [
                  { title: "No Assignments", Score: 0, Max: 100, fullTitle: "No Assignments Published", status: "N/A" }
                ];

                const nowTime = Date.now();
                const deadlines = relevantAssignments
                  .filter(asg => asg.status === 'published' && asg.dueDate)
                  .map(asg => {
                    const sub = studentSubmissionsForClass.find(s => s.assignmentId === asg.id);
                    const dueDateObj = asg.dueDate ? new Date(asg.dueDate) : null;
                    const timeDiff = dueDateObj ? dueDateObj.getTime() - nowTime : 0;
                    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                    
                    let priority: 'urgent' | 'soon' | 'normal' | 'late' | 'completed' = 'normal';
                    if (sub) {
                      priority = 'completed';
                    } else if (timeDiff < 0) {
                      priority = 'late';
                    } else if (daysLeft <= 2) {
                      priority = 'urgent';
                    } else if (daysLeft <= 5) {
                      priority = 'soon';
                    }

                    return {
                      id: asg.id,
                      title: asg.title,
                      type: asg.type,
                      maxMarks: asg.maxMarks,
                      dueDate: dueDateObj ? dueDateObj.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No Date',
                      daysLeft,
                      priority,
                      sub
                    };
                  })
                  .sort((a, b) => {
                    if (a.priority === 'completed' && b.priority !== 'completed') return 1;
                    if (a.priority !== 'completed' && b.priority === 'completed') return -1;
                    return a.daysLeft - b.daysLeft;
                  });

                return (
                  <motion.div
                    key="student_summary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                    className="space-y-6 text-left"
                  >
                    {/* Top Header Card */}
                    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-indigo-400" />
                          <h3 className="text-sm font-black uppercase tracking-wider text-slate-100">Student Progress & Evaluation Summary</h3>
                        </div>
                        <p className="text-xs text-slate-400">
                          Tracks assignment submission trends, evaluated letter grades, and impending homework deadlines.
                        </p>
                      </div>

                      {/* Teacher / Admin Dropdown Selector */}
                      {currentUser?.role !== 'student' && classroomStudents.length > 0 && (
                        <div className="bg-slate-850 border border-slate-700 rounded-lg p-2 flex items-center space-x-2 text-xs">
                          <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Select Student:</label>
                          <select 
                            value={targetStudentId || ""}
                            onChange={(e) => setSelectedStudentIdForSummary(parseInt(e.target.value))}
                            className="bg-slate-900 border-none rounded text-white text-xs py-1 px-2 focus:ring-1 focus:ring-indigo-500 font-bold outline-hidden cursor-pointer"
                          >
                            {classroomStudents.map(std => (
                              <option key={std.id} value={std.id}>
                                {std.name} ({std.email})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {targetStudentObj ? (
                      <div className="space-y-6">
                        {/* Dashboard KPI cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
                          <div className="bg-white border text-left p-4 rounded-xl shadow-xs border-slate-200">
                            <span className="text-[9px] uppercase tracking-wider text-slate-405 font-bold">Target Evaluator</span>
                            <h4 className="text-md font-black text-slate-900 mt-1 truncate">{targetStudentObj.name}</h4>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">{targetStudentObj.email}</span>
                          </div>
                          <div className="bg-white border text-left p-4 rounded-xl shadow-xs border-slate-200">
                            <span className="text-[9px] uppercase tracking-wider text-slate-405 font-bold">Average Evaluated Grade</span>
                            <div className="flex items-baseline space-x-1.5 mt-1">
                              <h4 className="text-2xl font-black text-slate-900">{avgMark}%</h4>
                              <span className="text-[10px] text-slate-400">weighted avg</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center mt-1">
                              <Award className="w-3.5 h-3.5 mr-1" /> Based on {gradedSubs.length} graded task(s)
                            </span>
                          </div>
                          <div className="bg-white border text-left p-4 rounded-xl shadow-xs border-slate-200">
                            <span className="text-[9px] uppercase tracking-wider text-slate-405 font-bold">Submission Ratio</span>
                            <div className="flex items-baseline space-x-1.5 mt-1">
                              <h4 className="text-2xl font-black text-slate-900">{submittedCount}/{totalAsgs}</h4>
                              <span className="text-[10px] text-slate-405">tasks completed</span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {totalAsgs > 0 ? Math.round((submittedCount / totalAsgs) * 100) : 0}% completion status
                            </span>
                          </div>
                          <div className="bg-white border text-left p-4 rounded-xl shadow-xs border-slate-200">
                            <span className="text-[9px] uppercase tracking-wider text-slate-405 font-bold">Impending deadlines</span>
                            <h4 className="text-2xl font-black text-red-650 mt-1">
                              {deadlines.filter(d => d.priority === 'urgent' || d.priority === 'late').length} urgent / late
                            </h4>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Out of {deadlines.length} total upcoming tasks
                            </span>
                          </div>
                          <div className="bg-white border text-left p-4 rounded-xl shadow-xs border-slate-200">
                            <span className="text-[9px] uppercase tracking-wider text-slate-405 font-bold">Attendance Rate</span>
                            <div className="flex items-baseline space-x-1.5 mt-1">
                              <h4 className="text-2xl font-black text-slate-900">{attendancePercentage}%</h4>
                              <span className="text-[10px] text-slate-405">present</span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Based on {totalAttendance} marked session(s)
                            </span>
                          </div>
                        </div>

                        {/* Line Chart & Deadlines grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Assignment performance trend line chart */}
                          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                            <div className="flex justify-between items-center border-b pb-3">
                              <div className="space-y-0.5">
                                <h4 className="font-bold text-slate-900 text-xs text-left">Assignment Performance Trend</h4>
                                <p className="text-[10px] text-slate-400 text-left">Visualizes evaluated task history scores in sequential order.</p>
                              </div>
                              <span className="bg-indigo-50 text-indigo-700 font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
                                Direct DB Integration
                              </span>
                            </div>

                            {relevantAssignments.length === 0 ? (
                              <div className="py-16 text-center text-slate-400 text-xs">
                                No assignments published in this classroom to generate a trend analysis.
                              </div>
                            ) : gradesArray.length === 0 ? (
                              <div className="py-4 text-center rounded-lg bg-orange-50/50 border border-orange-100 text-orange-850 text-xs space-y-2">
                                <AlertCircle className="w-5 h-5 mx-auto text-orange-500" />
                                <p className="font-bold text-slate-800">No evaluated grades recorded yet.</p>
                                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                                  Publish submissions and grade student assignments using the "Assignments" tab to plot trend line stats.
                                </p>
                                <div className="pt-2 opacity-60">
                                  <span className="text-[10px] font-mono block">Simulating timeline preview representations:</span>
                                  <div className="h-16 w-fit mx-auto mt-2">
                                    <div className="flex items-end space-x-3 h-full pb-1 border-b">
                                      <div className="w-3 bg-indigo-300 h-8 rounded-xs"></div>
                                      <div className="w-3 bg-indigo-400 h-12 rounded-xs"></div>
                                      <div className="w-3 bg-indigo-500 h-10 rounded-xs"></div>
                                      <div className="w-3 bg-indigo-600 h-14 rounded-xs"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full pr-2">
                                <ResponsiveContainer width="100%" height={260}>
                                  <LineChart data={finalChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#f1f5f9"} />
                                    <XAxis dataKey="title" tick={{ fontSize: 9, fill: darkMode ? '#cbd5e1' : '#64748b' }} axisLine={false} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: darkMode ? '#cbd5e1' : '#64748b' }} axisLine={false} />
                                    <Tooltip
                                      content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                          const data = payload[0].payload;
                                          return (
                                            <div className="bg-slate-950 text-white text-[11px] p-2.5 rounded-lg border border-slate-800 shadow-xl space-y-1">
                                              <p className="font-bold">{data.fullTitle}</p>
                                              <p className="text-slate-400 font-mono">Max Grade allowable: {data.Max} marks</p>
                                              <p className="text-indigo-400 font-bold">
                                                Score: {data.Score !== undefined ? `${data.Score}%` : 'Pending valuation'}
                                              </p>
                                              <p className="text-[9px] bg-slate-800 text-slate-305 py-0.5 px-2 rounded-sm inline-block">
                                                Status: {data.status}
                                              </p>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Line 
                                      type="monotone" 
                                      dataKey="Score" 
                                      stroke="#4f46e5" 
                                      strokeWidth={3} 
                                      dot={{ r: 5, fill: '#fff', stroke: '#4f46e5', strokeWidth: 2 }} 
                                      activeDot={{ r: 8 }} 
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            )}
                          </div>

                          {/* Upcoming deadlines panel list */}
                          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                            <div className="space-y-1 pb-3 border-b text-left">
                              <h4 className="font-bold text-slate-900 text-xs">Impending Deadlines</h4>
                              <p className="text-[10px] text-slate-400">Classroom assignment deadlines tracked sequentially.</p>
                            </div>

                            <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-3">
                              {deadlines.length === 0 ? (
                                <div className="py-20 text-center text-slate-400 text-xs italic">
                                  No scheduled deadlines discovered.
                                </div>
                              ) : (
                                deadlines.map((dead, index) => (
                                  <div 
                                    key={`${dead.id}-${index}`} 
                                    className={`p-3 rounded-lg border text-left transition duration-150 ${
                                      dead.priority === 'completed' ? 'border-emerald-100 bg-emerald-50/20 opacity-80' :
                                      dead.priority === 'late' ? 'border-amber-100 bg-amber-50/30' :
                                      dead.priority === 'urgent' ? 'border-red-150 bg-red-50/30' :
                                      'border-slate-100 bg-slate-50/25'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-1 pb-2">
                                      <h5 className="font-bold text-slate-900 text-xs leading-tight line-clamp-1">{dead.title}</h5>
                                      {dead.priority === 'completed' && (
                                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                                          Completed
                                        </span>
                                      )}
                                      {dead.priority === 'late' && (
                                        <span className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                                          Overdue
                                        </span>
                                      )}
                                      {dead.priority === 'urgent' && (
                                        <span className="bg-red-100 text-red-800 text-[8px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                                          Urgent
                                        </span>
                                      )}
                                      {dead.priority === 'soon' && (
                                        <span className="bg-indigo-100 text-indigo-800 text-[8px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                                          Due soon
                                        </span>
                                      )}
                                      {dead.priority === 'normal' && (
                                        <span className="bg-slate-100 text-slate-700 text-[8px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                                          Scheduled
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                                      <div className="flex items-center space-x-1">
                                        <CalendarRange className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Due: {dead.dueDate}</span>
                                      </div>
                                      <span className="capitalize text-[10px] px-1.5 py-0.2 bg-slate-105 text-slate-600 rounded">
                                        {dead.type}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Daily Attendance Logs */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b dark:border-slate-800 pb-3">
                            <div className="space-y-0.5 text-left">
                              <div className="flex items-center space-x-2">
                                <ClipboardCheck className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs text-left">Daily Attendance Register History</h4>
                              </div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-left">
                                A complete daily track record of presence or absence for this individual.
                              </p>
                            </div>
                            
                            {/* Monthly Count Addition */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-lg py-1.5 px-3 flex items-center space-x-3">
                              {(() => {
                                const currDate = new Date();
                                const currMonth = currDate.getMonth();
                                const currYear = currDate.getFullYear();
                                const currentMonthRecords = studentAttendanceRecords.filter(a => {
                                  const d = new Date(a.record.date);
                                  return d.getMonth() === currMonth && d.getFullYear() === currYear;
                                });
                                const monthlyTotal = currentMonthRecords.length;
                                const monthlyPresent = currentMonthRecords.filter(a => a.record.status === 'present').length;
                                return (
                                  <>
                                    <div className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold text-right">
                                      {currDate.toLocaleString('default', { month: 'short' })} Attendance
                                    </div>
                                    <div className="text-sm font-black text-slate-800 dark:text-slate-200">
                                      {monthlyTotal > 0 ? `${monthlyPresent} / ${monthlyTotal}` : 'No Data'}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                          
                          <div className="max-h-[200px] overflow-y-auto pr-2">
                            {studentAttendanceRecords.length === 0 ? (
                              <div className="py-8 text-center text-slate-400 text-[11px] italic">
                                No daily attendance records found for {targetStudentObj.name}.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {studentAttendanceRecords.sort((a, b) => new Date(b.record.date).getTime() - new Date(a.record.date).getTime()).map((att, idx) => {
                                  const status = att.record.status.toLowerCase();
                                  let statusStyles = 'bg-slate-50 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300';
                                  if (status === 'present') statusStyles = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400';
                                  if (status === 'absent') statusStyles = 'bg-red-50 text-red-650 dark:bg-red-500/20 dark:text-red-400';
                                  if (status === 'late') statusStyles = 'bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
                                  if (status === 'excused') statusStyles = 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400';
                                  
                                  return (
                                    <div key={idx} className="p-3 border border-slate-150 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/40 rounded-lg flex justify-between items-center transition hover:border-slate-300 dark:hover:border-slate-600">
                                      <span className="font-bold text-slate-800 dark:text-slate-200 text-[10px]">{att.record.date}</span>
                                      <span className={`text-[8.5px] font-bold py-0.5 px-2 rounded-sm tracking-wider ${statusStyles}`}>
                                        {att.record.status.toUpperCase()}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Private Teacher Notes & QUALITATIVE EVALUATION LOGS */}
                        {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b pb-3">
                              <div className="space-y-0.5 text-left">
                                <div className="flex items-center space-x-2">
                                  <NotebookPen className="w-4.5 h-4.5 text-indigo-600" />
                                  <h4 className="font-bold text-slate-900 text-xs text-left">Internal Teacher Remarks & Behavioral Notes</h4>
                                </div>
                                <p className="text-[10px] text-slate-400 text-left">
                                  Qualitative performance logs visible only to class guides & administrators to document milestones, observations, or intervention alerts.
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 text-[9px] text-slate-400 select-none bg-white py-1 px-2.5 rounded-full border border-slate-100 font-mono shadow-3xs">
                                <Lock className="w-3 h-3 text-slate-400 mr-1" />
                                <span>🔒 Confidential Record</span>
                              </div>
                            </div>

                            {/* Existing Notes feed */}
                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                              {teacherNotesList.length === 0 ? (
                                <div className="py-8 text-center rounded-lg bg-white border border-slate-150 text-slate-400 text-[11px] italic">
                                  No internal records written yet for {targetStudentObj.name}. Use the form below to register performance warnings, recommendations, or qualitative summaries.
                                </div>
                              ) : (
                                teacherNotesList.map((note) => (
                                  <div key={note.id} className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-3xs flex justify-between items-start space-x-4 transition hover:border-slate-300">
                                    <div className="space-y-1.5 flex-1 select-text">
                                      <p className="text-slate-800 text-[11px] leading-relaxed whitespace-pre-line">{note.content}</p>
                                      <div className="flex items-center space-x-1 text-[9px] text-slate-405 font-mono">
                                        <span>Logged on {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteTeacherNote(note.id)}
                                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                      title="Delete note record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Create Note Input form */}
                            <div className="space-y-2 mt-4">
                              <textarea
                                value={newTeacherNoteContent}
                                onChange={(e) => setNewTeacherNoteContent(e.target.value)}
                                placeholder={`Write qualitative observation details or action items about ${targetStudentObj.name}...`}
                                rows={3}
                                className="w-full text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 bg-white p-3 shadow-3xs outline-hidden focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition"
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={handleAddTeacherNote}
                                  disabled={isSubmittingTeacherNote || !newTeacherNoteContent.trim()}
                                  className="bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-[10px] py-1.5 px-4 rounded-lg flex items-center space-x-1.5 shadow-xs transition hover:shadow-sm cursor-pointer disabled:cursor-not-allowed"
                                >
                                  {isSubmittingTeacherNote ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 h-3 border-2 border-white/30 border-t-white" />
                                      <span>Recording...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5 text-white" />
                                      <span>Add Internal Log</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 border border-slate-205 rounded-xl bg-white text-center text-slate-400 text-xs text-mono">
                        No active cohort or student detected. Enroll student user profiles to populate summary statistics.
                      </div>
                    )}
                  </motion.div>
                );
              })()}

              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Edit Class Modal */}
        {showEditClassModal && selectedClass && (
          <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800 flex items-center"><Settings className="w-4 h-4 mr-2 text-indigo-600" /> Edit Classroom</h3>
                <button onClick={() => setShowEditClassModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6">
                <form onSubmit={updateClassroom} className="space-y-4 text-left text-slate-700">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Class Name</label>
                    <input type="text" value={editClassData.name} onChange={e => setEditClassData({...editClassData, name: e.target.value})} className="w-full border rounded p-2 text-xs" required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea rows={3} value={editClassData.description} onChange={e => setEditClassData({...editClassData, description: e.target.value})} className="w-full border rounded p-2 text-xs" />
                  </div>
                  <div className="pt-4 flex justify-between">
                    <button type="button" onClick={deleteClassroom} className="text-red-500 hover:text-red-700 text-xs font-bold transition underline">Delete Classroom</button>
                    <div className="space-x-3">
                      <button type="button" onClick={() => setShowEditClassModal(false)} className="text-slate-500 hover:text-slate-700 text-xs font-semibold cursor-pointer transition">Cancel</button>
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-5 rounded-md shadow-md active:scale-95 cursor-pointer transition">Update</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200/90 py-6 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800">AI Education Operating System</span>
          </div>
          <span>&copy; {new Date().getFullYear()} Institution Admin Portal. All Rights Reserved.</span>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* CREATION MODALS BLOCK */}
      {/* ============================================================== */}
      <AnimatePresence>
        {/* Establish Class Modal */}
        {showClassModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-250 rounded-xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center border-b p-5 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Establish New Classroom</h3>
                <button 
                  type="button" 
                  onClick={() => setShowClassModal(false)}
                  className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={createClassroom} className="space-y-3 overflow-y-auto px-5 pb-5 text-xs flex-1 scrollbar-thin">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Classroom Name</label>
                  <input type="text" value={newClassData.name} onChange={e => setNewClassData({...newClassData, name: e.target.value})} placeholder="e.g. ACT English Batch A" className="w-full border rounded p-2 text-xs" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Subject</label>
                    <input type="text" value={newClassData.subject} onChange={e => setNewClassData({...newClassData, subject: e.target.value})} placeholder="e.g. Grammar Rhetoric" className="w-full border rounded p-2 text-xs" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Grade</label>
                    <input type="text" value={newClassData.grade} onChange={e => setNewClassData({...newClassData, grade: e.target.value})} placeholder="e.g. Grade 11" className="w-full border rounded p-2 text-xs" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Academic Year</label>
                    <input type="text" value={newClassData.academicYear} onChange={e => setNewClassData({...newClassData, academicYear: e.target.value})} placeholder="2026-2027" className="w-full border rounded p-2 text-xs" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Batch Name</label>
                    <input type="text" value={newClassData.batchName} onChange={e => setNewClassData({...newClassData, batchName: e.target.value})} placeholder="Batch A" className="w-full border rounded p-2 text-xs" required />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Classroom description</label>
                  <textarea rows={3} value={newClassData.description} onChange={e => setNewClassData({...newClassData, description: e.target.value})} placeholder="Describe strategies and rules for active learning units..." className="w-full border rounded p-2 text-xs" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition">Create Classroom</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Create/Edit User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border text-left border-slate-250 rounded-xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center border-b p-5 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{selectedUserToEdit ? "Modify User Account" : "Secure New Account Registry"}</h3>
                <button 
                  type="button" 
                  onClick={() => setShowUserModal(false)}
                  className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={manageUserAccount} className="space-y-3 overflow-y-auto px-5 pb-5 text-xs flex-1 scrollbar-thin">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Full Username</label>
                  <input type="text" value={newUserData.name} onChange={e => setNewUserData({...newUserData, name: e.target.value})} placeholder="e.g. John Doe" className="w-full border rounded p-2 text-xs" required />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Email link</label>
                  <input type="email" value={newUserData.email} onChange={e => setNewUserData({...newUserData, email: e.target.value})} placeholder="e.g. user@example.com" className="w-full border rounded p-2 text-xs" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">User Role</label>
                    <select value={newUserData.role} onChange={e => setNewUserData({...newUserData, role: e.target.value as any})} className="border rounded p-2 text-xs w-full bg-white">
                      <option value="student">Student Learner</option>
                      <option value="teacher">Classroom Teacher</option>
                      <option value="admin">Principal Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Access Status</label>
                    <select value={newUserData.status} onChange={e => setNewUserData({...newUserData, status: e.target.value as any})} className="border rounded p-2 text-xs w-full bg-white">
                      <option value="active">Active Access</option>
                      <option value="suspended">Suspended Access</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Custom Password Fallback indicator</label>
                  <input type="text" value={newUserData.passwordFallback} onChange={e => setNewUserData({...newUserData, passwordFallback: e.target.value})} placeholder="Pass123! fallback" className="w-full border rounded p-2 text-xs" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition">
                  {selectedUserToEdit ? "Modify Profile" : "Establish Account"}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Upload Material Modal */}
        {showMaterialModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border text-left rounded-xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in duration-200"
            >
              <div className="flex justify-between items-center border-b p-5 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Upload Lesson Reference Material</h3>
                <button 
                  type="button" 
                  onClick={() => setShowMaterialModal(false)}
                  className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={uploadStudyMaterial} className="space-y-3 overflow-y-auto px-5 pb-5 text-xs flex-1 scrollbar-thin">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Material Title</label>
                  <input type="text" value={newMaterialData.title} onChange={e => setNewMaterialData({...newMaterialData, title: e.target.value})} placeholder="e.g. Punctuation Handbook" className="w-full border rounded p-1.5" required />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Resource Type</label>
                    <select value={newMaterialData.type} onChange={e => setNewMaterialData({...newMaterialData, type: e.target.value})} className="border rounded p-1.5 w-full bg-white text-slate-800 font-medium">
                      <option value="pdf">PDF Document</option>
                      <option value="docx">Word DOCX File</option>
                      <option value="ppt">PowerPoint Slides</option>
                      <option value="video">MP4 Media Stream</option>
                      <option value="link">External URL Link</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Lesson Reference Document</label>
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsMaterialDragging(true);
                    }}
                    onDragLeave={() => setIsMaterialDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsMaterialDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleMaterialFileUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 mt-1 relative overflow-hidden ${isMaterialDragging ? 'border-indigo-650 bg-indigo-50/70 shadow-xs' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'}`}
                  >
                    {materialUploading ? (
                      <div className="flex flex-col items-center justify-center py-2 space-y-2.5">
                        <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin" />
                        <span className="text-[10.5px] font-bold text-slate-550 font-mono tracking-tight">Uploading learning reference, please hold...</span>
                      </div>
                    ) : newMaterialData.fileUrl ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2.5">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                            <FileText className="w-5.5 h-5.5" />
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={newMaterialData.fileUrl.split("/").pop()}>
                              {newMaterialData.fileUrl.split("/").pop() || "Uploaded Material Asset"}
                            </p>
                            <p className="text-[9.5px] font-mono text-slate-450 truncate max-w-[200px]">{newMaterialData.fileUrl}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2.5 pt-1.5 border-t border-slate-200/50">
                          <a 
                            href={newMaterialData.fileUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[9.5px] uppercase tracking-wider font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>View reference</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <span className="text-slate-350 font-light">|</span>
                          <button 
                            type="button" 
                            onClick={() => setNewMaterialData({...newMaterialData, fileUrl: ""})} 
                            className="text-[9.5px] uppercase tracking-wider font-bold text-red-500 hover:text-red-750 flex items-center space-x-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Reference</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2 py-1">
                        <div className="p-2.5 bg-white border border-slate-150 rounded-full shadow-2xs text-indigo-600">
                          <Upload className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-750">Drag & drop lesson files here</p>
                          <p className="text-[9.5px] text-slate-450 mt-0.5">PDF, docx, pptx slides, video media, and web assets</p>
                        </div>
                        <label className="text-[10px] font-bold bg-white text-indigo-650 hover:bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg shadow-2xs cursor-pointer active:scale-95 transition-all duration-150 inline-block mt-1">
                          <span>Select Material File</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleMaterialFileUpload(e.target.files[0]);
                              }
                            }} 
                          />
                        </label>
                      </div>
                    )}
                    {materialUploadError && (
                      <div className="text-[10px] text-red-650 font-bold mt-2 py-1.5 px-2 bg-red-50 rounded-lg border border-red-150">
                        {materialUploadError}
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Or paste custom resource URL directly</span>
                    <input 
                      type="text" 
                      placeholder="e.g. https://drive.google.com/file/d/your-study-doc"
                      value={newMaterialData.fileUrl} 
                      onChange={e => setNewMaterialData({...newMaterialData, fileUrl: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-md text-xs p-2 outline-hidden focus:border-indigo-500 placeholder:text-slate-450 text-slate-800 font-medium" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Target Folder Location (Optional)</label>
                  <div className="space-y-1.5 bg-slate-50 border p-2.5 rounded-lg">
                    <div>
                      <span className="text-[9px] text-slate-400 block mb-0.5">Select existing folder:</span>
                      <select
                        value={newMaterialData.folder}
                        onChange={e => {
                          const selected = e.target.value;
                          const lastPart = selected.split(' > ').pop() || "";
                          setNewMaterialData({
                            ...newMaterialData,
                            folder: selected,
                            organizeValue: lastPart || newMaterialData.organizeValue || "Unit 1"
                          });
                        }}
                        className="border rounded p-1 w-full bg-white text-xs select-none"
                      >
                        <option value="">📁 Root Directory (/)</option>
                        {Array.from(new Set(activeClassMaterials.map(mat => mat.folder || "")))
                          .filter(Boolean)
                          .sort((a, b) => (a as string).localeCompare(b as string))
                          .map((folderStr, idx) => (
                            <option key={idx} value={folderStr as string}>
                              📁 {folderStr as string}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block mb-0.5">Or create/type new hierarchic path:</span>
                      <input
                        type="text"
                        placeholder="e.g. Unit 1 > Sub-topic A"
                        value={newMaterialData.folder}
                        onChange={e => {
                          const val = e.target.value;
                          const lastPart = val.split(' > ').pop() || "";
                          setNewMaterialData({
                            ...newMaterialData,
                            folder: val,
                            organizeValue: lastPart || newMaterialData.organizeValue || "Unit 1"
                          });
                        }}
                        className="border rounded p-1 w-full bg-slate-50 text-xs placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <span className="text-[8.5px] text-slate-400 block mt-1">Leave empty for Root directory, otherwise use {"\" > \""} to create deeper subfolders.</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Organize Categorizer Type</label>
                    <select value={newMaterialData.organizeType} onChange={e => setNewMaterialData({...newMaterialData, organizeType: e.target.value as any})} className="border rounded p-1.5 w-full bg-white">
                      <option value="unit">Categorize by Unit</option>
                      <option value="chapter">Categorize by Chapter</option>
                      <option value="topic">Categorize by Topic</option>
                      <option value="week">Categorize by Week</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Organize Category Value</label>
                    <input type="text" value={newMaterialData.organizeValue} onChange={e => setNewMaterialData({...newMaterialData, organizeValue: e.target.value})} placeholder="e.g. Unit 1: Punctuations" className="w-full border rounded p-1.5" required />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Brief Description</label>
                  <textarea rows={2} value={newMaterialData.description} onChange={e => setNewMaterialData({...newMaterialData, description: e.target.value})} placeholder="Summary overview of pages..." className="w-full border rounded p-1.5" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-2 rounded">Upload study sheet</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Create Assignment Modal */}
        {showAssignmentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border text-left rounded-xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center border-b p-5 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Schedule New Lesson Assignment</h3>
                <button 
                  type="button" 
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={createAssignment} className="space-y-3 overflow-y-auto px-5 pb-5 text-xs flex-1 scrollbar-thin">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Assignment Title</label>
                  <input type="text" value={newAssignmentData.title} onChange={e => setNewAssignmentData({...newAssignmentData, title: e.target.value})} placeholder="e.g. Grammar Checkpoint 1" className="w-full border rounded p-1.5" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Max Marks scale</label>
                    <input type="number" value={newAssignmentData.maxMarks} onChange={e => setNewAssignmentData({...newAssignmentData, maxMarks: parseInt(e.target.value)})} className="w-full border rounded p-1.5" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Submission Due Date</label>
                    <input type="date" value={newAssignmentData.dueDate} onChange={e => setNewAssignmentData({...newAssignmentData, dueDate: e.target.value})} className="w-full border rounded p-1.5" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Assignment Type</label>
                  <select value={newAssignmentData.type} onChange={e => setNewAssignmentData({...newAssignmentData, type: e.target.value as any})} className="border rounded p-1.5 w-full bg-white">
                    <option value="homework">Homework</option>
                    <option value="quiz">Quiz</option>
                    <option value="practice_test">Practice Test</option>
                    <option value="act_test">ACT English Test Unit</option>
                    <option value="ap_test">AP Biology Test Unit</option>
                    <option value="essay">Thematic Analysis Essay</option>
                    <option value="worksheet">Practice Worksheet</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Assignment core body details</label>
                  <textarea rows={3} value={newAssignmentData.description} onChange={e => setNewAssignmentData({...newAssignmentData, description: e.target.value})} placeholder="Outline questions, or instructions..." className="w-full border rounded p-1.5" required />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Grading Rubrics (Criteria)</label>
                  <textarea rows={2} value={newAssignmentData.rubric} onChange={e => setNewAssignmentData({...newAssignmentData, rubric: e.target.value})} placeholder="e.g. 100% correct vocabulary choice, 50% partial structure..." className="w-full border rounded p-1.5" />
                </div>
                
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Attachment Worksheet / Reference (Drag-n-Drop or Select)</label>
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsAssignmentDragging(true);
                    }}
                    onDragLeave={() => setIsAssignmentDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsAssignmentDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleAssignmentFileUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 mt-1 relative overflow-hidden ${isAssignmentDragging ? 'border-indigo-650 bg-indigo-50/70 shadow-xs' : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300'}`}
                  >
                    {assignmentUploading ? (
                      <div className="flex flex-col items-center justify-center py-2 space-y-2.5">
                        <RefreshCw className="w-7 h-7 text-indigo-600 animate-spin" />
                        <span className="text-[10.5px] font-bold text-slate-550 font-mono tracking-tight">Uploading attachment, please hold...</span>
                      </div>
                    ) : newAssignmentData.attachmentUrl ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2.5">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                            <FileText className="w-5.5 h-5.5" />
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]" title={newAssignmentData.attachmentUrl.split("/").pop()}>
                              {newAssignmentData.attachmentUrl.split("/").pop() || "Uploaded Assignment Attachment"}
                            </p>
                            <p className="text-[9.5px] font-mono text-slate-450 truncate max-w-[200px]">{newAssignmentData.attachmentUrl}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2.5 pt-1.5 border-t border-slate-200/50">
                          <a 
                            href={newAssignmentData.attachmentUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[9.5px] uppercase tracking-wider font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>View attachment</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <span className="text-slate-350 font-light">|</span>
                          <button 
                            type="button" 
                            onClick={() => setNewAssignmentData({...newAssignmentData, attachmentUrl: ""})} 
                            className="text-[9.5px] uppercase tracking-wider font-bold text-red-500 hover:text-red-750 flex items-center space-x-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Attachment</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2 py-1">
                        <div className="p-2.5 bg-white border border-slate-150 rounded-full shadow-2xs text-indigo-600">
                          <Upload className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-750">Drag & drop sheet here</p>
                          <p className="text-[9.5px] text-slate-450 mt-0.5">Attach PDFs, exams, worksheets, or references</p>
                        </div>
                        <label className="text-[10px] font-bold bg-white text-indigo-650 hover:bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg shadow-2xs cursor-pointer active:scale-95 transition-all duration-150 inline-block mt-1">
                          <span>Select Attachment file</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleAssignmentFileUpload(e.target.files[0]);
                              }
                            }} 
                          />
                        </label>
                      </div>
                    )}
                    {assignmentUploadError && (
                      <div className="text-[10px] text-red-650 font-bold mt-2 py-1.5 px-2 bg-red-50 rounded-lg border border-red-150">
                        {assignmentUploadError}
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Or paste custom attachment URL directly</span>
                    <input 
                      type="text" 
                      placeholder="e.g. https://drive.google.com/file/d/your-assignment-doc"
                      value={newAssignmentData.attachmentUrl} 
                      onChange={e => setNewAssignmentData({...newAssignmentData, attachmentUrl: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-md text-xs p-2 outline-hidden focus:border-indigo-500 placeholder:text-slate-450 text-slate-800 font-medium" 
                    />
                  </div>
                </div>
                <div className="flex space-x-2 pt-1 pb-1">
                  <button
                    type="button"
                    disabled={!newAssignmentData.title || !newAssignmentData.description}
                    onClick={() => exportAssignmentToPdf(newAssignmentData.title, newAssignmentData.description, newAssignmentData.instructions, newAssignmentData.rubric, newAssignmentData.dueDate, newAssignmentData.maxMarks)}
                    className="flex-1 text-[10.5px] font-bold text-slate-700 hover:text-indigo-650 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2 rounded flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Export the current draft of this assignment worksheet as a printable vector PDF"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>Save Draft PDF</span>
                  </button>
                  <button
                    type="button"
                    disabled={!newAssignmentData.title || !newAssignmentData.description}
                    onClick={() => exportAssignmentToDoc(newAssignmentData.title, newAssignmentData.description, newAssignmentData.instructions, newAssignmentData.rubric, newAssignmentData.dueDate, newAssignmentData.maxMarks)}
                    className="flex-1 text-[10.5px] font-bold text-slate-700 hover:text-indigo-650 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 py-2 rounded flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Export the current draft of this assignment worksheet as a Microsoft Word document"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Save Draft DOC</span>
                  </button>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-2 rounded">Release study assignment</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Schedule Meeting Modal */}
        {showMeetingModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border text-left rounded-xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in duration-150"
            >
              <div className="flex justify-between items-center border-b p-5 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Schedule videoconference session</h3>
                <button 
                  type="button" 
                  onClick={() => setShowMeetingModal(false)}
                  className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={createMeeting} className="space-y-3 overflow-y-auto px-5 pb-5 text-xs flex-1 scrollbar-thin">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Conference Title</label>
                  <input type="text" value={newMeetingData.title} onChange={e => setNewMeetingData({...newMeetingData, title: e.target.value})} placeholder="e.g. ACT English Review Room" className="w-full border rounded p-1.5" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Session Date</label>
                    <input type="date" value={newMeetingData.date} onChange={e => setNewMeetingData({...newMeetingData, date: e.target.value})} className="w-full border rounded p-1.5" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Start Time (HH:MM)</label>
                    <input type="text" value={newMeetingData.time} onChange={e => setNewMeetingData({...newMeetingData, time: e.target.value})} placeholder="14:00" className="w-full border rounded p-1.5" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Duration minutes</label>
                    <input type="number" value={newMeetingData.duration} onChange={e => setNewMeetingData({...newMeetingData, duration: parseInt(e.target.value)})} className="w-full border rounded p-1.5" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Meeting Category</label>
                    <select value={newMeetingData.type} onChange={e => setNewMeetingData({...newMeetingData, type: e.target.value})} className="border rounded p-1.5 w-full bg-white">
                      <option value="live_class">Live Videoconference Class</option>
                      <option value="revision_session">Revision Session</option>
                      <option value="doubt_session">Remedial doubt session</option>
                      <option value="parent_meeting">Parent Teacher Consultation</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Agenda / Description</label>
                  <textarea rows={2} value={newMeetingData.description} onChange={e => setNewMeetingData({...newMeetingData, description: e.target.value})} placeholder="Agenda of review lessons..." className="w-full border rounded p-1.5" />
                </div>

                {/* Dynamic Videoconference Integration Panel */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-3">
                  <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
                    <span className="font-bold text-[10px] text-slate-700 uppercase tracking-tight flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5 text-indigo-600" />
                      Configure Video Service
                    </span>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => { setSelectedMeetProvider('jitsi'); setGeneratedMeetLink(''); }}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded transition ${selectedMeetProvider === 'jitsi' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-350'}`}
                      >
                        MiroTalk (Instant)
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSelectedMeetProvider('google'); setGeneratedMeetLink(''); }}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded transition ${selectedMeetProvider === 'google' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-350'}`}
                      >
                        Google Meet (Auth)
                      </button>
                    </div>
                  </div>

                   {generatedMeetLink ? (
                    <div className="flex items-center justify-between bg-white border border-indigo-200 p-2 rounded-md">
                      <div className="min-w-0 pr-2">
                        <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">
                          {selectedMeetProvider === 'jitsi' ? "MiroTalk Link Established" : "Meet Space Joined"}
                        </span>
                        <a href={generatedMeetLink} target="_blank" rel="noopener noreferrer" className="text-indigo-700 font-bold hover:underline truncate block text-[11px]">
                          {generatedMeetLink}
                        </a>
                      </div>
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedMeetLink);
                            triggerAlert("Copied meeting link to clipboard!", "ok");
                          }}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-1.5 rounded transition active:scale-95 cursor-pointer"
                          title="Copy meeting Link to clipboard"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setGeneratedMeetLink("")}
                          className="text-red-500 hover:text-red-750 hover:bg-red-50 p-1.5 rounded shrink-0 transition cursor-pointer"
                          title="Clear link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {selectedMeetProvider === 'jitsi' ? (
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={handleGenerateJitsiMeetLink}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded flex items-center justify-center space-x-1.5 transition active:scale-[0.98] text-[11px]"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Generate Instant MiroTalk Meeting Link</span>
                          </button>
                          <p className="text-[9px] text-slate-400 leading-normal">
                            Creates a secure, permanent, free conference room on MiroTalk (SFU/P2P). It lets you embed live, real-time audio and video directly within the app! No sign-in required.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            disabled={isGeneratingMeetSpace}
                            onClick={handleGenerateGoogleMeetLink}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded flex items-center justify-center space-x-1.5 transition active:scale-[0.98] disabled:opacity-50 text-[11px]"
                          >
                            {isGeneratingMeetSpace ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating Google Meet...</span>
                              </>
                            ) : (
                              <>
                                <Video className="w-3.5 h-3.5" />
                                <span>Generate & Link Google Meet Space</span>
                              </>
                            )}
                          </button>
                          <p className="text-[9px] text-slate-400 leading-normal">
                            Requires users to sign in with Google Workspace credentials to provision an official Google Meet room.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-2 rounded">Schedule meeting</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Interactive AI Flashcards Study Deck Modal */}
        {showFlashcardsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-xs p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 flex flex-col relative text-left"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b pb-4 mb-4 border-slate-100">
                <div>
                  <div className="flex items-center space-x-2 text-indigo-600">
                    <Sparkles className="w-5 h-5 fill-indigo-400" />
                    <span className="font-bold text-xs tracking-wider uppercase">Gemini AI Study Deck</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                    {activeMaterialForFlashcards?.title || "Key Concepts Review"}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {activeMaterialForFlashcards?.description || "Dynamic AI-generated revision cards."}
                  </p>
                </div>
                <button 
                  onClick={() => setShowFlashcardsModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full w-7 h-7 flex items-center justify-center transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Modal Content */}
              {isGeneratingFlashcards ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-300 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">Synthesizing Interactive Study Deck...</h4>
                    <p className="text-[11px] text-slate-400 max-w-xs leading-normal">
                      DeepMind Gemini is parsing your materials to extract high-yield questions & core concepts.
                    </p>
                  </div>
                </div>
              ) : flashcardsList.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">Failed to render study cards for this unit.</p>
                  <button 
                    onClick={() => handleGenerateFlashcards(activeMaterialForFlashcards)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-lg text-xs border border-indigo-200 cursor-pointer"
                  >
                    Retry Deck Generation
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cards Deck Container with 3D Flip */}
                  <div 
                    onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                    className="h-64 cursor-pointer select-none perspective-1000 bg-linear-to-b from-slate-50 to-slate-100/50 rounded-2xl border border-slate-200/80 shadow-xs relative flex items-center justify-center p-6 group transition-all duration-300 hover:shadow-md hover:border-slate-300/80"
                  >
                    {/* Animated rotation container */}
                    <div 
                      className="absolute inset-0 p-6 flex flex-col justify-between items-center transition-transform duration-600"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlashcardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* FRONT CARD SIDE */}
                      <div 
                        className="absolute inset-0 p-6 flex flex-col justify-between items-center backface-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono font-bold tracking-tight uppercase">
                          Question / Prompt
                        </div>
                        <p className="text-slate-900 font-bold text-center text-xs sm:text-sm px-4 leading-relaxed max-h-40 overflow-y-auto">
                          {flashcardsList[activeFlashcardIndex]?.front}
                        </p>
                        <div className="text-[10px] text-slate-400 font-semibold tracking-tight flex items-center gap-1 group-hover:text-indigo-600 transition">
                          Click card to flip and view explanation <RotateCcw className="w-3" />
                        </div>
                      </div>

                      {/* BACK CARD SIDE */}
                      <div 
                        className="absolute inset-0 p-6 flex flex-col justify-between items-center bg-indigo-950 rounded-2xl border border-indigo-900 text-white backface-hidden"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <div className="text-[10px] bg-indigo-900 text-indigo-300 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-tight uppercase">
                          AI Answer Key
                        </div>
                        <p className="text-indigo-50 font-medium text-center text-xs px-4 leading-relaxed max-y-40 overflow-y-auto">
                          {flashcardsList[activeFlashcardIndex]?.back}
                        </p>
                        <div className="text-[10px] text-indigo-400 font-semibold tracking-tight flex items-center gap-1">
                          Click card to flip back <RotateCcw className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deck Navigation Controls */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button 
                        disabled={activeFlashcardIndex === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFlashcardFlipped(false);
                          setTimeout(() => {
                            setActiveFlashcardIndex(prev => prev - 1);
                          }, 150);
                        }}
                        className="p-2 border rounded-xl hover:bg-slate-50 transition disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                        title="Previous Card"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                      </button>
                      <span className="text-xs font-semibold text-slate-600">
                        Card <span className="font-bold text-slate-900">{activeFlashcardIndex + 1}</span> of <span className="font-bold text-slate-900">{flashcardsList.length}</span>
                      </span>
                      <button 
                        disabled={activeFlashcardIndex === flashcardsList.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFlashcardFlipped(false);
                          setTimeout(() => {
                            setActiveFlashcardIndex(prev => prev + 1);
                          }, 150);
                        }}
                        className="p-2 border rounded-xl hover:bg-slate-50 transition disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                        title="Next Card"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFlashcardFlipped(false);
                          setTimeout(() => {
                            setActiveFlashcardIndex(0);
                          }, 150);
                        }}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 py-2 px-3 rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                        title="Restart study quiz"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Deck</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGenerateFlashcards(activeMaterialForFlashcards);
                        }}
                        className="text-[11px] bg-linear-to-r from-indigo-600 to-indigo-750 text-white font-bold py-2 px-3 rounded-xl transition hover:opacity-95 shadow-xs flex items-center gap-1.5 cursor-pointer"
                        title="Re-synthesize this study deck"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white/90 fill-white/20" />
                        <span>Re-Gen AI</span>
                      </button>
                    </div>
                  </div>

                  {/* High Quality Design Progress Gauge */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span>Deck Progress</span>
                      <span>{Math.round(((activeFlashcardIndex + (isFlashcardFlipped ? 1 : 0.5)) / flashcardsList.length) * 100)}% Mastered</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
                        style={{ width: `${((activeFlashcardIndex + (isFlashcardFlipped ? 1 : 0.5)) / flashcardsList.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Inline PDF / Document Previewer Modal */}
        {previewPdfUrl && (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 md:p-10">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 text-left rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Previewer Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 p-4 sm:px-6 bg-slate-950/40 gap-4 shrink-0">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                    <BookOpen className="w-5 h-5 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono block">Document Inline Previewer</span>
                    <h3 className="text-xs sm:text-sm font-black text-slate-150 truncate max-w-[280px] sm:max-w-md md:max-w-xl" title={previewPdfTitle}>
                      {previewPdfTitle}
                    </h3>
                  </div>
                </div>

                {/* Controls toolbar */}
                <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                  {/* Download button */}
                  <a 
                    href={previewPdfUrl} 
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-1.5 flex items-center space-x-1.5 transition-all shadow-3xs cursor-pointer"
                    title="Download original file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Download</span>
                  </a>

                  {/* Open in new tab */}
                  <a 
                    href={previewPdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-1.5 flex items-center space-x-1.5 transition-all shadow-3xs cursor-pointer"
                    title="Open document full size in a new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden xs:inline">Full Screen</span>
                  </a>

                  {/* Divider line */}
                  <div className="h-5 w-px bg-slate-800 mx-1"></div>

                  {/* Close button */}
                  <button 
                    type="button" 
                    onClick={handleClosePreview}
                    className="text-slate-400 hover:text-white p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg transition-all cursor-pointer shadow-3xs"
                    title="Close Previewer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Embed Workspace */}
              <div className="flex-1 bg-slate-950 p-3 sm:p-5 flex items-center justify-center overflow-hidden relative">
                {(() => {
                  const isImage = /\.(jpeg|jpg|gif|png|svg|webp)($|\?)/i.test(previewPdfUrl);
                  
                  if (isImage) {
                    return (
                      <div className="w-full h-full flex items-center justify-center p-4 bg-slate-900/40 rounded-xl border border-slate-850 overflow-auto">
                        <img 
                          src={previewPdfUrl} 
                          alt={previewPdfTitle}
                          className="max-h-full max-w-full object-contain rounded-lg shadow-lg select-none"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    );
                  }

                  // Standard Google Docs embed viewer URL fallback for non-PDFs (e.g., .docx, .xlsx, .pptx)
                  // Check if it's already a Google Drive or Google Docs link
                  const isGoogleDrive = previewPdfUrl.includes('drive.google.com') || previewPdfUrl.includes('docs.google.com');

                  // Standard Google Docs embed viewer URL fallback for non-PDFs (e.g., .docx, .xlsx, .pptx)
                  const isPdf = /\.(pdf)($|\?)/i.test(previewPdfUrl) || previewPdfUrl.includes("/vault/my-homework.pdf") || previewPdfUrl.includes("example.com");
                  
                  // For PDF, we can use the browser's high quality built-in viewer using iframe directly.
                  // For other office documents, we can wrap in google docs viewer to show inline preview.
                  let embedUrl = previewPdfUrl;
                  if (isGoogleDrive) {
                    embedUrl = previewPdfUrl.replace('/view', '/preview');
                  } else if (!isPdf) {
                    embedUrl = `https://docs.google.com/gview?url=${encodeURIComponent(previewPdfUrl)}&embedded=true`;
                  }

                  return (
                    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-850 shadow-inner bg-slate-900">
                      <iframe 
                        src={embedUrl} 
                        className="w-full h-full border-0 bg-slate-900" 
                        title="Document Viewer"
                        allow="autoplay"
                      />
                    </div>
                  );
                })()}
              </div>

              {/* Previewer Footer info */}
              <div className="bg-slate-950/60 border-t border-slate-800 px-6 py-3 flex justify-between items-center text-[10px] text-slate-500 font-mono shrink-0 select-none">
                <span>Secure Sandbox Preview Mode</span>
                <span className="hidden sm:inline">Press Esc or click top close button to exit</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
}
