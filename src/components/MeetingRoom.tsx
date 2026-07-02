// src/components/MeetingRoom.tsx
import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, Loader2, PhoneOff } from 'lucide-react';
import { Meeting, UserProfile } from '../types.ts';

interface MeetingRoomProps {
  meeting: Meeting;
  currentUser: UserProfile;
  onLeave: () => void;
  classroomStudents?: any[];
}

export default function MeetingRoom({ meeting, currentUser, onLeave, classroomStudents = [] }: MeetingRoomProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [miroTalkType, setMiroTalkType] = useState<'sfu' | 'p2p'>('sfu');
  const [copiedLink, setCopiedLink] = useState(false);
  const [iframeLoadCount, setIframeLoadCount] = useState(0);

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
        ? `https://sfu.mirotalk.com/join/${hostRoomId}?hideLeaveButton=1&leaveButton=0`
        : `https://p2p.mirotalk.com/join/${hostRoomId}?hideLeaveButton=1&leaveButton=0`;
    }
    return type === 'sfu' 
      ? `https://sfu.mirotalk.com/join/${cleanRoomName}?hideLeaveButton=1&leaveButton=0`
      : `https://p2p.mirotalk.com/join/${cleanRoomName}?hideLeaveButton=1&leaveButton=0`;
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}?meetingId=${meeting.id}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  useEffect(() => {
    setIframeLoaded(false);
    setIframeLoadCount(0);
  }, [miroTalkType, meeting.id]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-slate-100 select-none">
      {/* Top Title Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
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
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-md mr-2">
                <button
                  type="button"
                  onClick={() => { setMiroTalkType('sfu'); setIframeLoaded(false); setIframeLoadCount(0); }}
                  className={`text-[9px] px-2 py-0.5 font-bold font-mono rounded-xs transition-all cursor-pointer ${miroTalkType === 'sfu' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  title="SFU (Selective Forwarding Unit) - Recommended for groups"
                >
                  SFU Classroom
                </button>
                <button
                  type="button"
                  onClick={() => { setMiroTalkType('p2p'); setIframeLoaded(false); setIframeLoadCount(0); }}
                  className={`text-[9px] px-2 py-0.5 font-bold font-mono rounded-xs transition-all cursor-pointer ${miroTalkType === 'p2p' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  title="Peer-to-Peer - Ideal for 1-on-1 sessions"
                >
                  P2P Mode
                </button>
              </div>
            </div>
          )}
          
          <button 
            onClick={onLeave}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-md transition-all active:scale-95 shadow-md shrink-0"
          >
            <span>Leave Stage</span>
            <PhoneOff className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Main content - 100% MiroTalk Iframe */}
      <div className="flex-1 relative bg-slate-950 w-full h-full">
        {!iframeLoaded && (
          <div className="absolute inset-0 bg-slate-900 z-10 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <div>
              <h4 className="text-sm font-bold text-slate-100 font-sans">Connecting MiroTalk...</h4>
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
          allow="camera *; microphone *; fullscreen *; display-capture *; autoplay *; clipboard-write *; clipboard-read *"
          className="absolute top-0 left-0 w-full h-full border-0"
          onLoad={() => {
            setIframeLoaded(true);
            setIframeLoadCount(prev => {
              if (prev >= 1) {
                // If it loads a second time, it means MiroTalk navigated to the feedback/leave page!
                // We immediately close the meeting.
                onLeave();
              }
              return prev + 1;
            });
          }}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
