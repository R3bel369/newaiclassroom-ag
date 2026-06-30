// src/components/MeetingRoom.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, VideoOff, Mic, MicOff, Hand, MessageSquare, Users, 
  Monitor, Circle, Activity, Play, Square, X, Send, Award, Eraser, PenTool, ExternalLink,
  Copy, Check, Loader2, PhoneOff
} from 'lucide-react';
import { Meeting, UserProfile } from '../types.ts';

interface MeetingRoomProps {
  meeting: Meeting;
  currentUser: UserProfile;
  onLeave: () => void;
  classroomStudents?: any[];
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Participant {
  id: number | string;
  name: string;
  role: string;
  isMuted: boolean;
  isVideoOff: boolean;
  handRaised: boolean;
  avatarColor: string;
}

export default function MeetingRoom({ meeting, currentUser, onLeave, classroomStudents = [] }: MeetingRoomProps) {
  // MiroTalk Integration states
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [miroTalkType, setMiroTalkType] = useState<'sfu' | 'p2p'>('sfu');

  // Media States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasHandRaised, setHasHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  
  // Board Canvas
  const [whiteboardNotes, setWhiteboardNotes] = useState<string>("");
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  const [isEmbeddedCallActive, setIsEmbeddedCallActive] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMiroTalkLink, setCopiedMiroTalkLink] = useState(false);

  const cleanTitleVal = meeting.title.replace(/[^a-zA-Z0-9]/g, '');
  const cleanRoomName = `EduStage-${meeting.id}-${cleanTitleVal || 'ClassRoom'}`;

  const getMiroTalkUrl = (type: 'sfu' | 'p2p' = miroTalkType) => {
    if (meeting.joinLink && (meeting.joinLink.includes('mirotalk.com') || meeting.joinLink.includes('meet.jit.si') || meeting.joinLink.includes('meet.ffmuc.net') || meeting.joinLink.includes('jitsi.belnet.be'))) {
      if (meeting.joinLink.includes('mirotalk.com')) {
        return meeting.joinLink;
      }
      const jitsiRoomMatch = meeting.joinLink.match(/(?:meet\.jit\.si|meet\.ffmuc\.net|jitsi\.belnet\.be)\/join\/([^?#/\s]+)/) || meeting.joinLink.match(/(?:meet\.jit\.si|meet\.ffmuc\.net|jitsi\.belnet\.be)\/([^?#/\s]+)/);
      const hostRoomId = jitsiRoomMatch ? jitsiRoomMatch[1] : cleanRoomName;
      return type === 'sfu' 
        ? `https://sfu.mirotalk.com/join/${hostRoomId}`
        : `https://p2p.mirotalk.com/join/${hostRoomId}`;
    }
    return type === 'sfu' 
      ? `https://sfu.mirotalk.com/join/${cleanRoomName}`
      : `https://p2p.mirotalk.com/join/${cleanRoomName}`;
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}?meetingId=${meeting.id}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMiroTalkLink = () => {
    const miroUrl = getMiroTalkUrl();
    navigator.clipboard.writeText(miroUrl);
    setCopiedMiroTalkLink(true);
    setTimeout(() => setCopiedMiroTalkLink(false), 2500);
  };

  // Chat/Participants Simulator lists
  const [chats, setChats] = useState<ChatMessage[]>([
    { id: '1', sender: 'Emily Johnson', text: "Hello Dr. Taylor! Ready for grammar exercises.", time: "14:02", isMe: false },
    { id: '2', sender: 'Michael Chang', text: "Is the slide deck uploaded in Unit 1?", time: "14:03", isMe: false },
  ]);
  const [inputText, setInputText] = useState("");

  const [participants, setParticipants] = useState<Participant[]>([
    { id: 101, name: "Emily Johnson", role: "student", isMuted: false, isVideoOff: false, handRaised: false, avatarColor: "bg-emerald-500" },
    { id: 102, name: "Michael Chang", role: "student", isMuted: true, isVideoOff: false, handRaised: false, avatarColor: "bg-blue-500" },
    { id: 103, name: "Dr. Sarah Taylor", role: "teacher", isMuted: false, isVideoOff: false, handRaised: false, avatarColor: "bg-purple-600" },
  ]);

  // Handle loading state reset when MiroTalk type changes
  useEffect(() => {
    setIframeLoaded(false);
  }, [miroTalkType, meeting.id]);

  // Log incoming simulation chats
  useEffect(() => {
    // Add current user to participants on join if not already present
    setParticipants(prev => {
      if (prev.some(p => p.id === currentUser.id || p.name.toLowerCase() === currentUser.name.toLowerCase())) {
        // If already exists (e.g. as seed teacher/student), update their ID/properties to use the active currentUser's actual DB ID
        return prev.map(p => p.name.toLowerCase() === currentUser.name.toLowerCase() ? {
          ...p,
          id: currentUser.id,
          role: currentUser.role
        } : p);
      }
      return [
        ...prev,
        { 
          id: currentUser.id, 
          name: currentUser.name, 
          role: currentUser.role, 
          isMuted, 
          isVideoOff, 
          handRaised: hasHandRaised,
          avatarColor: currentUser.role === 'teacher' ? "bg-indigo-600" : (currentUser.role === 'admin' ? "bg-amber-600" : "bg-teal-500")
        }
      ];
    });

    const timers = [
      setTimeout(() => {
        addSystemChat("Michael Chang", "Yes, I can confirm the audio is working fine!");
      }, 5000),
      setTimeout(() => {
        setParticipants(prev => 
          prev.map(p => p.name === "Emily Johnson" ? { ...p, handRaised: true } : p)
        );
        addSystemChat("Emily Johnson", "I have a quick question about relative pronoun clauses.", undefined, true);
      }, 10000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const addSystemChat = (sender: string, text: string, isMe = false, raiseHand = false) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats(prev => [...prev, {
      id: Math.random().toString(),
      sender,
      text,
      time: timeStr,
      isMe
    }]);

    if (raiseHand) {
      // Trigger a visual banner
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    addSystemChat(currentUser.name, inputText, true);
    setInputText("");
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    setParticipants(prev => prev.map(p => p.id === currentUser.id ? { ...p, isMuted: nextMute } : p));
  };

  const toggleVideo = () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);
    setParticipants(prev => prev.map(p => p.id === currentUser.id ? { ...p, isVideoOff: nextVideoOff } : p));
  };

  const toggleHandRaise = () => {
    const newHand = !hasHandRaised;
    setHasHandRaised(newHand);
    setParticipants(prev => prev.map(p => p.id === currentUser.id ? { ...p, handRaised: newHand } : p));
    if (newHand) {
      addSystemChat(currentUser.name, "Raised hand ✋", true);
    }
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  // Live Whiteboard sketch
  const [boardDrawings, setBoardDrawings] = useState<Array<{x: number, y: number, color: string}>>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#4f46e5");

  useEffect(() => {
    if (isWhiteboardActive && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let j = 0; j < canvas.height; j += 20) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(canvas.width, j);
          ctx.stroke();
        }
      }
    }
  }, [isWhiteboardActive]);

  const drawOnCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = brushColor;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-slate-100 select-none">
      {/* Top Title Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
          <span className="font-mono text-xs text-red-500 tracking-wider font-bold">LIVE STAGE</span>
          {meeting.joinLink && meeting.joinLink.includes('meet.google.com') ? (
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold py-0.5 px-2 rounded-md flex items-center shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              GOOGLE MEET SPACE
            </span>
          ) : (
            <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold py-0.5 px-2 rounded-md flex items-center shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5 animate-pulse" />
              INTEGRATED MIROTALK
            </span>
          )}
          <span className="text-slate-400">|</span>
          <h2 className="font-medium text-sm text-slate-200 tracking-tight">{meeting.title}</h2>
          <span className="bg-slate-800 text-xs text-slate-400 py-0.5 px-2 rounded-full font-mono">{meeting.type.replace('_', ' ')}</span>
          <button 
            onClick={handleCopyLink}
            className={`flex items-center space-x-1 border py-0.5 px-2.5 rounded-md text-[10px] font-mono font-bold tracking-tight uppercase transition-all duration-150 active:scale-95 cursor-pointer ${copiedLink ? 'bg-emerald-650/20 border-emerald-500/40 text-emerald-400 animate-pulse' : 'bg-slate-850/40 border-slate-750 text-indigo-400 hover:border-indigo-500/50 hover:text-indigo-300'}`}
            title="Copy Student Invite Link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Invite Link</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {meeting.joinLink && meeting.joinLink.includes('meet.google.com') ? (
            <a 
              href={meeting.joinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded-md transition-all active:scale-95 shadow-md shrink-0"
            >
              <span>Join Official Meet Room</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          ) : (
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopyMiroTalkLink}
                className={`flex items-center space-x-1.5 border py-1 px-3 rounded-md text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${copiedMiroTalkLink ? 'bg-emerald-650/20 border-emerald-500/40 text-emerald-400' : 'bg-slate-850/40 border-slate-750 text-indigo-400 hover:border-indigo-500 hover:text-indigo-300'}`}
                title="Copy Direct MiroTalk URL to clipboard"
              >
                {copiedMiroTalkLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Direct MiroTalk!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy MiroTalk Link</span>
                  </>
                )}
              </button>

              <a 
                href={getMiroTalkUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-md transition-all active:scale-95 shadow-md border border-indigo-550/30"
              >
                <span>Open Standalone MiroTalk</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {isRecording ? (
            <span className="flex items-center text-xs text-red-500 font-bold bg-red-950/40 border border-red-800/60 py-1 px-2.5 rounded-md animate-pulse">
              <Circle className="w-2 h-2 fill-red-500 stroke-none mr-1.5" />
              REC 00:12:35
            </span>
          ) : (
            <button 
              onClick={() => setIsRecording(true)} 
              className="flex items-center text-xs text-slate-400 hover:text-red-500 hover:bg-slate-800 py-1 px-2.5 rounded-md transition-all border border-transparent hover:border-slate-700"
            >
              <Play className="w-3.5 h-3.5 mr-1" />
              Record Class
            </button>
          )}

          <button 
            onClick={onLeave} 
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs px-3.5 py-1.5 rounded-md transition-all shadow-md active:scale-95"
          >
            <span>Leave Stage</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main stage section */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Video Grid or Whiteboard */}
        <div className="flex-1 p-6 flex flex-col space-y-4 justify-between bg-slate-950 overflow-y-auto">
          {isWhiteboardActive ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 bg-white rounded-xl border border-slate-800 flex flex-col overflow-hidden text-slate-800 shadow-xl"
            >
              {/* Whiteboard Controls */}
              <div className="h-12 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PenTool className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">COLLABORATIVE CLASS WHITEBOARD</span>
                </div>
                <div className="flex items-center space-x-2">
                  {['#4f46e5', '#16a34a', '#dc2626', '#d97706', '#000000'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setBrushColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${brushColor === c ? 'border-indigo-600 ring-2 ring-indigo-200 scale-110' : 'border-white hover:scale-105'}`}
                    />
                  ))}
                  <div className="w-px h-6 bg-slate-200 mx-1"></div>
                  <button 
                    onClick={() => {
                      const canvas = canvasRef.current;
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.fillStyle = '#ffffff';
                          ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }
                      }
                    }}
                    className="flex items-center text-xs text-red-500 bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-md transition-all font-medium"
                  >
                    <Eraser className="w-3.5 h-3.5 mr-1" />
                    Clear All
                  </button>
                </div>
              </div>
              <div className="flex-1 relative bg-slate-200 flex items-center justify-center p-3">
                <canvas 
                  ref={canvasRef}
                  width={800}
                  height={450}
                  onMouseDown={() => setIsDrawing(true)}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                  onMouseMove={drawOnCanvas}
                  className="bg-white rounded-lg border border-slate-300 shadow cursor-crosshair"
                />
              </div>
            </motion.div>
          ) : isEmbeddedCallActive ? (
            <div className="flex-1 flex flex-col space-y-2 h-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    REAL-TIME INTEGRATED MIROTALK ACTIVE
                  </span>
                  <span className="text-slate-700">|</span>
                  
                  {/* MiroTalk Mode switcher */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-md">
                    <button
                      type="button"
                      onClick={() => { setMiroTalkType('sfu'); setIframeLoaded(false); }}
                      className={`text-[9px] px-2 py-0.5 font-bold font-mono rounded-xs transition-all cursor-pointer ${miroTalkType === 'sfu' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                      title="SFU (Selective Forwarding Unit) - Recommended for groups"
                    >
                      SFU Classroom
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMiroTalkType('p2p'); setIframeLoaded(false); }}
                      className={`text-[9px] px-2 py-0.5 font-bold font-mono rounded-xs transition-all cursor-pointer ${miroTalkType === 'p2p' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                      title="Peer-to-Peer - Ideal for 1-on-1 sessions"
                    >
                      P2P Mode
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={getMiroTalkUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-bold font-mono bg-slate-850 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-slate-750 rounded px-2 py-0.5 transition flex items-center space-x-1"
                    title="Open in external browser window to avoid iframe blockers or permission limits"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open in Standalone Tab</span>
                  </a>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    Room: {meeting.title}
                  </span>
                </div>
              </div>

              <div className="flex-1 relative h-[500px] w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-850">
                {!iframeLoaded && (
                  <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-sans">Connecting MiroTalk {miroTalkType.toUpperCase()} Server...</h4>
                      <p className="text-xs text-slate-400 max-w-sm mt-1 mx-auto font-sans leading-relaxed">
                        Establishing direct video, audio, shared board, and screen-sharing channels. This may take a moment.
                      </p>
                      <div className="mt-4">
                        <a
                          href={getMiroTalkUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                        >
                          <span>Click here to launch directly in a new tab</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                
                <iframe 
                  src={getMiroTalkUrl()}
                  allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write; clipboard-read"
                  className="absolute top-0 left-0 w-full"
                  style={{ height: 'calc(100% + 72px)' }}
                  onLoad={() => setIframeLoaded(true)}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Render dynamic participant feeds */}
              {participants.map((person) => (
                <div 
                  key={person.id} 
                  className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between p-4 group transition-all hover:border-slate-700 shadow-lg min-h-[160px]"
                >
                  {/* Status Badges */}
                  <div className="flex justify-between items-center z-10">
                    <span className="bg-slate-950/80 text-[10px] text-slate-300 py-0.5 px-2 rounded-full font-medium tracking-tight">
                      {person.role.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1.5">
                      {person.handRaised && (
                        <span className="bg-amber-500 text-slate-950 text-xs py-0.5 px-2 rounded-md font-bold flex items-center animate-bounce">
                          <Hand className="w-3 h-3 mr-1 fill-slate-950" />
                          Raised Hand
                        </span>
                      )}
                      {person.isMuted ? (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-1 rounded-md">
                          <MicOff className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 p-1 rounded-md">
                          <Mic className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Central Avatar feed or Simulated video element */}
                  <div className="flex-1 flex items-center justify-center py-6">
                    {person.isVideoOff ? (
                      <div className={`w-16 h-16 rounded-full ${person.avatarColor} text-white flex items-center justify-center text-xl font-bold uppercase shadow-inner`}>
                        {person.name.charAt(0)}
                      </div>
                    ) : (
                      <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
                        {/* Static Camera Placeholder Pattern with glowing frequency */}
                        <div className="absolute inset-0 bg-linear-to-tr from-slate-900/90 to-slate-800/40 z-1" />
                        <div className={`w-14 h-14 rounded-full ${person.avatarColor} text-white flex items-center justify-center text-lg font-bold uppercase border-4 border-slate-800 z-10 shadow-lg mb-2`}>
                          {person.name.charAt(0)}
                        </div>
                        <span className="text-slate-400 font-mono text-xs z-10 tracking-widest flex items-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-ping" />
                          CAMERA LIVE
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom bar inside tiles */}
                  <div className="flex justify-between items-center z-10 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-800/40 mt-2">
                    <span className="text-xs font-semibold text-slate-100 truncate max-w-[120px]">
                      {person.name} {person.id === currentUser.id && "(You)"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">1080p • 60 FPS</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Controller Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex justify-between items-center sm:px-8">
            {isEmbeddedCallActive ? (
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-mono tracking-wider text-indigo-400 font-bold uppercase">
                    Live Video Conference Connected • Use MiroTalk's internal control buttons for Mic, Camera, and Share
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsEmbeddedCallActive(false);
                    if (isWhiteboardActive) setIsWhiteboardActive(false);
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-5 rounded-lg transition-all active:scale-95 text-xs flex items-center space-x-1.5 shadow-md cursor-pointer self-end sm:self-auto"
                  title="Disconnect and return to simulation workspace"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Exit Live Meeting</span>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={toggleMute}
                    className={`p-3 rounded-lg border transition-all active:scale-95 ${isMuted ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30' : 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700'}`}
                    title={isMuted ? "Unmute Mic" : "Mute Mic"}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button 
                    onClick={toggleVideo}
                    className={`p-3 rounded-lg border transition-all active:scale-95 ${isVideoOff ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30' : 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700'}`}
                    title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  {meeting.joinLink && (
                    <button 
                      onClick={() => {
                        setIsEmbeddedCallActive(!isEmbeddedCallActive);
                        if (isWhiteboardActive) setIsWhiteboardActive(false);
                      }}
                      className={`p-3 rounded-lg border transition-all active:scale-95 flex items-center space-x-2 text-xs font-semibold ${isEmbeddedCallActive ? 'bg-red-600/20 border-red-500/40 text-red-400 hover:bg-red-500/30' : 'bg-slate-800 border-slate-700 text-indigo-400 hover:text-indigo-300'}`}
                      title="Toggle between real active video conference room and simulated playground"
                    >
                      {isEmbeddedCallActive ? <PhoneOff className="w-5 h-5 text-red-400" /> : <Video className="w-5 h-5" />}
                      <span className="hidden sm:inline">{isEmbeddedCallActive ? "Exit Live Meeting" : "Live Video Call"}</span>
                    </button>
                  )}

                  <button 
                    onClick={toggleHandRaise}
                    className={`p-3 rounded-lg border transition-all active:scale-95 ${hasHandRaised ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-100'}`}
                    title="Raise Hand"
                  >
                    <Hand className={`w-5 h-5 ${hasHandRaised ? 'fill-amber-400' : ''}`} />
                  </button>

                  <button 
                    onClick={() => setIsWhiteboardActive(!isWhiteboardActive)}
                    className={`p-3 rounded-lg border transition-all active:scale-95 flex items-center space-x-2 text-xs font-semibold ${isWhiteboardActive ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-indigo-400'}`}
                  >
                    <PenTool className="w-5 h-5" />
                    <span className="hidden sm:inline">{isWhiteboardActive ? "Whiteboard Live" : "Open Whiteboard"}</span>
                  </button>

                  <button 
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`p-3 rounded-lg border transition-all active:scale-95 ${isScreenSharing ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-100'}`}
                    title="Share Screen"
                  >
                    <Monitor className="w-5 h-5" />
                  </button>
                </div>

                <div className="w-[1px] h-8 bg-slate-800 hidden sm:block"></div>

                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xs text-slate-500 font-mono tracking-tight">
                    Latency: 12ms | Ingress: 4.2 MB/s
                  </span>
                  {isEmbeddedCallActive && (
                    <span className="text-[9px] text-emerald-500 font-mono font-bold uppercase tracking-wider animate-pulse mt-0.5">
                      • Live WebRTC Link
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar - Chat & Participants */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col justify-between overflow-hidden">
          {/* Tab Selection */}
          <div className="h-12 bg-slate-950/80 flex border-b border-slate-800 font-medium">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center space-x-2 text-xs font-semibold transition-all border-b-2 ${activeTab === 'chat' ? 'border-indigo-500 text-white bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Feed</span>
            </button>
            <button 
              onClick={() => setActiveTab('participants')}
              className={`flex-1 flex items-center justify-center space-x-2 text-xs font-semibold transition-all border-b-2 ${activeTab === 'participants' ? 'border-indigo-500 text-white bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Users className="w-4 h-4" />
              <span>Students ({participants.length})</span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
            {activeTab === 'chat' ? (
              <AnimatePresence initial={false}>
                {chats.map((c) => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col max-w-[90%] rounded-lg p-2.5 text-xs ${c.isMe ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/30 ml-auto align-end' : 'bg-slate-850 text-slate-200 mr-auto border border-slate-800/60'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[10px] text-slate-400 mr-2 truncate">{c.sender}</span>
                      <span className="text-[9px] text-slate-500">{c.time}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{c.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="flex flex-col space-y-4">
                {/* Section 1: Live in Meeting */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Live in Call ({participants.length})</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  {participants.map((p) => (
                    <div key={`${p.id}-${p.name}`} className="flex items-center justify-between bg-slate-950/40 border border-slate-800/40 p-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={`w-7 h-7 rounded-md ${p.avatarColor} text-white text-[10px] flex items-center justify-center font-bold uppercase`}>
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-slate-250 truncate max-w-[120px]">{p.name}</span>
                          <span className="text-[9px] text-slate-500 capitalize">{p.role === 'teacher' ? 'Faculty' : p.role}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {p.handRaised && <Hand className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                        <div className={`w-1.5 h-1.5 rounded-full ${p.isMuted ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section 2: Classroom Roster Attendances */}
                {classroomStudents && classroomStudents.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Classroom Roster Ranks</span>
                      <span className="text-[9.5px] font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/40 px-2 py-0.5 rounded-sm">
                        {classroomStudents.filter(student => participants.some(p => p.name.toLowerCase() === student.name.toLowerCase() || p.email === student.email)).length}/{classroomStudents.length} Connected
                      </span>
                    </div>
                    {classroomStudents.map((student) => {
                      const isConnected = participants.some(p => p.name.toLowerCase() === student.name.toLowerCase() || p.email === student.email);
                      return (
                        <div key={`roster-${student.id}`} className="flex items-center justify-between bg-slate-950/20 border border-slate-900/60 p-2 rounded-lg text-xs opacity-85 hover:opacity-100 transition-all">
                          <div className="flex items-center space-x-2">
                            <div className="w-6.5 h-6.5 rounded-md bg-slate-800 text-slate-300 text-[9px] flex items-center justify-center font-bold uppercase shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-slate-300 truncate max-w-[125px]">{student.name}</span>
                              <span className="text-[9px] text-slate-500 truncate max-w-[125px]">{student.email}</span>
                            </div>
                          </div>
                          <div className="shrink-0 leading-none">
                            {isConnected ? (
                              <span className="inline-block text-[8px] font-black text-emerald-450 bg-emerald-950/40 border border-emerald-900/50 py-0.5 px-1.5 rounded-sm tracking-wider uppercase">
                                Present
                              </span>
                            ) : (
                              <span className="inline-block text-[8px] font-black text-slate-400 bg-slate-900/30 border border-slate-850 py-0.5 px-1.5 rounded-sm tracking-wider uppercase">
                                Absent
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Chat Input */}
          {activeTab === 'chat' && (
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-2">
              <input 
                type="text"
                placeholder="Send a classroom comment..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-850 text-slate-100 border border-slate-750 text-xs px-3.5 py-2 rounded-md outline-hidden focus:border-indigo-500 transition-all placeholder:text-slate-500"
              />
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
