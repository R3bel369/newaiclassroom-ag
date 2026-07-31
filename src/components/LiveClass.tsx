import React, { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { supabase } from '../lib/supabase.ts';
import { CustomClassroomLayout } from './CustomClassroomLayout';

export function LiveClass({ roomName, onClose, participantName, participantId, participantRole }: { roomName: string, onClose: () => void, participantName?: string, participantId?: string, participantRole?: string }) {
  const [token, setToken] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers = new Headers();
        if (session?.access_token) {
          headers.set('Authorization', `Bearer ${session.access_token}`);
        }
        
        let url = `/api/livekit/token?room=${roomName}`;
        if (participantName) url += `&participantName=${encodeURIComponent(participantName)}`;
        if (participantId) url += `&participantId=${encodeURIComponent(participantId)}`;
        if (participantRole) url += `&participantRole=${encodeURIComponent(participantRole)}`;
        
        const resp = await fetch(url, { headers });
        if (!resp.ok) throw new Error('Failed to fetch token');
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [roomName]);

  if (token === '') {
    return <div className="p-8 text-center text-gray-500">Connecting to classroom...</div>;
  }

  // Uses local server by default, or falls back to an env var if set
  const serverUrl = import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880';

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
        <h2 className="text-xl font-semibold">Live Class: {roomName}</h2>
        <button onClick={onClose} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
          Leave Class
        </button>
      </div>
      <div className="flex-1 relative min-h-0 overflow-hidden" data-lk-theme="default">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={serverUrl}
          connect={true}
          onDisconnected={onClose}
          className="h-full w-full"
          data-lk-theme="default"
        >
          <CustomClassroomLayout />
        </LiveKitRoom>
      </div>
    </div>
  );
}
