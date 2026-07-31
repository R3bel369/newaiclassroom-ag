// src/components/MeetingRoom.tsx
import React, { useState } from 'react';
import { Meeting, UserProfile } from '../types.ts';
import { LiveClass } from './LiveClass';

interface MeetingRoomProps {
  meeting: Meeting;
  currentUser: UserProfile;
  onLeave: () => void;
  classroomStudents?: any[];
}

export default function MeetingRoom({ meeting, currentUser, onLeave, classroomStudents = [] }: MeetingRoomProps) {
  const [participantName, setParticipantName] = useState(currentUser?.name || '');
  const [isJoined, setIsJoined] = useState(false);

  const cleanTitleVal = meeting.title.replace(/[^a-zA-Z0-9]/g, '');
  const cleanRoomName = `EduStage-${meeting.id}-${cleanTitleVal || 'ClassRoom'}`;

  if (!isJoined) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900/95 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 text-white max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
          <h2 className="text-2xl font-bold mb-2 text-center text-blue-400">Join Meeting</h2>
          <p className="text-gray-400 text-center mb-6 text-sm">{meeting.title}</p>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Your Name</label>
            <input 
              type="text" 
              value={participantName} 
              onChange={(e) => setParticipantName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && participantName.trim()) {
                  setIsJoined(true);
                }
              }}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              placeholder="Enter your name"
              autoFocus
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button 
              onClick={onLeave} 
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (participantName.trim()) {
                  setIsJoined(true);
                }
              }} 
              disabled={!participantName.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveClass 
      roomName={cleanRoomName} 
      onClose={onLeave} 
      participantName={participantName || 'Guest Participant'} 
      participantId={currentUser?.id?.toString() || currentUser?.uid?.toString() || `guest-${Math.floor(Math.random()*10000)}`} 
      participantRole={currentUser?.role || 'student'}
    />
  );
}
