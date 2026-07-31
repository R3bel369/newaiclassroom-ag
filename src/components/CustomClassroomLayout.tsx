import React, { useState } from 'react';
import {
  ParticipantTile,
  GridLayout,
  ControlBar,
  Chat,
  useParticipants,
  useLocalParticipant,
  RoomAudioRenderer,
  useTracks,
  useChat,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { 
  MessageSquare, Users, Sparkles, Edit3, Hand, PanelRightClose, PanelRightOpen, LayoutDashboard
} from 'lucide-react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

type SidebarTab = 'chat' | 'participants' | 'ai';
type LayoutMode = 'video' | 'whiteboard';

export function CustomClassroomLayout() {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  
  const [activeTab, setActiveTab] = useState<SidebarTab>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('video');

  // Identify Teacher
  const teacherParticipant = participants.find((p) => {
    try {
      const meta = p.metadata ? JSON.parse(p.metadata) : {};
      return meta.role === 'teacher' || meta.role === 'admin';
    } catch {
      return false;
    }
  });

  // Get all camera/screen share tracks in the room
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // Filter tracks for teacher and students
  const teacherTrackRef = teacherParticipant 
    ? tracks.find((t) => t.participant.identity === teacherParticipant.identity) 
    : undefined;

  const studentTracks = tracks.filter((t) => t.participant.identity !== teacherParticipant?.identity);

  // Toggle Raise Hand
  const toggleRaiseHand = async () => {
    try {
      const meta = localParticipant.metadata ? JSON.parse(localParticipant.metadata) : {};
      const isRaised = !meta.raisedHand;
      const newMeta = { ...meta, raisedHand: isRaised };
      console.log('Toggle raise hand to:', isRaised);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 overflow-hidden relative font-sans">
      
      {/* LEFT: Main Area */}
      <div className={`flex-1 flex flex-col min-w-0 p-4 pb-24 transition-all duration-300 ${isSidebarOpen ? 'mr-0' : ''}`}>
        
        {layoutMode === 'whiteboard' ? (
          <div className="flex h-full gap-4">
             {/* Whiteboard Area */}
             <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative">
               <Tldraw />
             </div>
             
             {/* Side Video Strip */}
             <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto no-scrollbar">
                {teacherTrackRef && (
                  <div className="h-48 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-black">
                     <ParticipantTile trackRef={teacherTrackRef} className="h-full w-full object-contain" />
                  </div>
                )}
                {studentTracks.length > 0 && (
                  <div className="flex-1 min-h-[300px] rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-slate-950">
                    <GridLayout tracks={studentTracks} className="h-full w-full">
                      <ParticipantTile />
                    </GridLayout>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="flex flex-col h-full gap-4">
            {/* Teacher Spotlight */}
            <div className={`${studentTracks.length > 0 ? 'h-[50%] min-h-[250px]' : 'flex-1'} w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative flex items-center justify-center [&_video]:!object-contain`}>
              {teacherTrackRef ? (
                 <ParticipantTile trackRef={teacherTrackRef} className="h-full w-full" />
              ) : (
                <div className="text-slate-500 flex flex-col items-center justify-center h-full">
                  <Users className="w-12 h-12 mb-2 opacity-30" />
                  <p>Waiting for Teacher...</p>
                </div>
              )}
            </div>

            {/* Student Grid */}
            {studentTracks.length > 0 && (
              <div className="flex-1 min-h-0 bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800 p-2">
                <GridLayout tracks={studentTracks} className="h-full w-full">
                  <ParticipantTile />
                </GridLayout>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center space-x-2 bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-slate-700">
           
           <ControlBar variation="minimal" controls={{ camera: true, microphone: true, screenShare: true, chat: false, leave: true }} className="bg-transparent shadow-none p-0 flex-1 [&>div]:bg-slate-700 hover:[&>div]:bg-slate-600 [&>div]:rounded-full [&>button]:rounded-full" />
           
           <div className="h-8 w-px bg-slate-600 mx-2"></div>
           
           {/* Custom Action Buttons */}
           <button onClick={() => setLayoutMode(layoutMode === 'video' ? 'whiteboard' : 'video')} 
                   className={`flex items-center justify-center w-11 h-11 rounded-full transition-colors ${layoutMode === 'whiteboard' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                   title="Toggle Whiteboard">
              <Edit3 className="w-5 h-5" />
           </button>

           <button onClick={toggleRaiseHand} 
                   className="flex items-center justify-center w-11 h-11 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
                   title="Raise Hand">
              <Hand className="w-5 h-5" />
           </button>

           <div className="h-8 w-px bg-slate-600 mx-2"></div>

           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                   className={`flex items-center justify-center w-11 h-11 rounded-full transition-colors ${isSidebarOpen ? 'bg-slate-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                   title="Toggle Sidebar">
              {isSidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
           </button>
        </div>
      </div>

      {/* RIGHT: Sliding Sidebar Area */}
      <div className={`shrink-0 bg-slate-800 border-l border-slate-700 flex flex-col h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[320px] translate-x-0' : 'w-[320px] absolute right-0 translate-x-[320px]'}`}>
        
        {/* Sidebar Header / Tabs */}
        <div className="flex items-center bg-slate-900 overflow-x-auto no-scrollbar border-b border-slate-700 p-2 space-x-1 shrink-0">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex-1 ${activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <MessageSquare className="w-4 h-4 mr-1.5" />
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('participants')}
            className={`flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex-1 ${activeTab === 'participants' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Users className="w-4 h-4 mr-1.5" />
            Users
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex items-center justify-center py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex-1 ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            AI
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto relative min-h-0 bg-slate-900/50">
          {activeTab === 'chat' && (
            <CustomChatArea localIdentity={localParticipant.identity} />
          )}

          {activeTab === 'participants' && (
            <div className="p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">In this room ({participants.length})</h3>
              {participants.map(p => {
                let role = 'Student';
                try {
                  const meta = p.metadata ? JSON.parse(p.metadata) : {};
                  role = meta.role === 'teacher' ? 'Teacher' : meta.role === 'admin' ? 'Admin' : 'Student';
                } catch(e) {}

                return (
                  <div key={p.identity} className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700/50 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-inner">
                        {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{p.name} {p.identity === localParticipant.identity && '(You)'}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'ai' && (
             <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Sparkles className="w-12 h-12 text-indigo-500 mb-4 opacity-40" />
                <h3 className="text-sm font-bold text-slate-200 mb-2">AI Teaching Assistant</h3>
                <p className="text-xs text-slate-400 leading-relaxed">The AI assistant can help you summarize the class, generate quizzes, or answer questions. This feature will be integrated soon.</p>
             </div>
          )}
        </div>
      </div>
      
      <RoomAudioRenderer />
    </div>
  );
}

function CustomChatArea({ localIdentity }: { localIdentity: string }) {
  const { chatMessages, send, isSending } = useChat();
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      send(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full absolute inset-0">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-2">
        {chatMessages.length === 0 ? (
          <div className="text-center text-slate-500 text-sm mt-10">No messages yet... Start the conversation!</div>
        ) : (
          chatMessages.map((msg, i) => {
            const isLocal = msg.from?.identity === localIdentity;
            return (
              <div key={i} className={`flex flex-col ${isLocal ? 'items-end' : 'items-start'}`}>
                <span className="text-[11px] text-slate-400 mb-1">{msg.from?.name || msg.from?.identity || 'Guest'}</span>
                <div className={`px-3 py-2 rounded-xl text-sm max-w-[90%] break-words shadow-sm ${isLocal ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-sm'}`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="p-3 pb-6 bg-slate-900 border-t border-slate-800 shrink-0 z-10 relative">
        <form onSubmit={handleSend} className="flex flex-col gap-3">
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type a message..." 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          <div className="flex justify-end pr-20">
            <button type="submit" disabled={!message.trim() || isSending} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
