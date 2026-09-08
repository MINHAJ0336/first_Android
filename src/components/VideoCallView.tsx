import React, { useEffect, useRef, useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Camera, 
  Sparkles, 
  RotateCw, 
  Users, 
  ShieldCheck, 
  Volume2,
  Maximize2,
  Clock,
  PhoneCall,
  Flame,
  CameraOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

export const VideoCallView: React.FC = () => {
  const { 
    activeCall, 
    startCall, 
    endCall, 
    toggleMute, 
    toggleVideo, 
    setCallFilter, 
    takeCallSnapshot, 
    localStream, 
    cameraError, 
    familyMembers, 
    currentUser,
    triggerSimulatedIncomingCall
  } = useFamily();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('user-ammi');
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [snapshotTakenNotice, setSnapshotTakenNotice] = useState(false);

  // Attach local media stream to video element when active
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, activeCall.active, activeCall.isVideoOff]);

  // Simulate family members speaking rotation for visual vibrancy
  useEffect(() => {
    if (!activeCall.active) return;
    const speakers = ['user-ammi', 'user-abu', 'user-hamza'];
    const interval = setInterval(() => {
      const random = speakers[Math.floor(Math.random() * speakers.length)];
      setActiveSpeakerId(random);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeCall.active]);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSec).padStart(2, '0')}`;
  };

  const handleSnapshot = () => {
    takeCallSnapshot();
    setSnapshotTakenNotice(true);
    setTimeout(() => setSnapshotTakenNotice(false), 2500);
  };

  // If call is NOT currently active, show the Call Lobby / Contacts to initiate call
  if (!activeCall.active) {
    return (
      <div id="video-call-lobby" className="flex flex-col h-full bg-neutral-950 p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-400" />
              Family Video Calls
            </h2>
            <p className="text-xs text-neutral-400">
              Instant high quality group & 1-on-1 video calls
            </p>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            HD Encrypted
          </span>
        </div>

        {/* Big Start Family Group Call Action Card */}
        <div className="mt-4 bg-gradient-to-br from-emerald-900/60 via-neutral-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-5 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-center -space-x-3 mb-4">
            {familyMembers.slice(0, 5).map(m => (
              <img
                key={m.id}
                src={m.avatar}
                alt={m.name}
                className="w-12 h-12 rounded-full border-2 border-neutral-900 object-cover ring-2 ring-emerald-500/50"
              />
            ))}
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            Khan Family Group Call
          </h3>
          <p className="text-xs text-neutral-300 max-w-xs mx-auto mb-4">
            Ring Ammi, Abu, Hamza & Ayesha simultaneously with one click.
          </p>

          <button
            id="btn-start-family-group-call"
            onClick={() => startCall(undefined, true)}
            className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-neutral-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all text-sm"
          >
            <Video className="w-5 h-5" />
            Start Family Group Video Call
          </button>
        </div>

        {/* Simulate Incoming Call Demo Trigger */}
        <div className="mt-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-200">Test Incoming Call UI</p>
              <p className="text-[11px] text-neutral-400">Simulate Ammi calling your phone</p>
            </div>
          </div>
          <button
            id="btn-simulate-incoming-call"
            onClick={() => triggerSimulatedIncomingCall('user-ammi')}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl text-xs font-semibold border border-amber-500/20 active:scale-95 transition-all"
          >
            Simulate Call
          </button>
        </div>

        {/* 1-on-1 Call Direct Member List */}
        <div className="mt-6">
          <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-3">
            Direct 1-on-1 Video Call
          </h4>
          <div className="space-y-2">
            {familyMembers
              .filter(m => m.id !== currentUser.id)
              .map(member => (
                <div
                  key={member.id}
                  id={`member-call-row-${member.id}`}
                  className="flex items-center justify-between bg-neutral-900/90 border border-neutral-800/80 hover:border-neutral-700 p-3 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-11 h-11 rounded-full object-cover border border-neutral-700"
                      />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-neutral-900 ${
                        member.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{member.name}</p>
                      <p className="text-xs text-neutral-400">{member.relation} • {member.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-call-video-${member.id}`}
                      onClick={() => startCall(member.id, true)}
                      className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-all active:scale-95"
                      title="Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button
                      id={`btn-call-audio-${member.id}`}
                      onClick={() => startCall(member.id, false)}
                      className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-all active:scale-95"
                      title="Audio Call"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Call History section */}
        <div className="mt-6 mb-4">
          <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Recent Family Calls
          </h4>
          <div className="bg-neutral-900/50 rounded-2xl border border-neutral-800/60 divide-y divide-neutral-800/50 text-xs">
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-semibold text-neutral-200">Family Sunday Catchup</p>
                  <p className="text-[10px] text-neutral-400">4 Participants • 34 mins</p>
                </div>
              </div>
              <span className="text-neutral-500">Yesterday</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-semibold text-neutral-200">Ammi Jaan</p>
                  <p className="text-[10px] text-neutral-400">Incoming Video Call • 12 mins</p>
                </div>
              </div>
              <span className="text-neutral-500">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE VIDEO CALL VIEW
  return (
    <div id="active-video-call-screen" className="flex flex-col h-full bg-neutral-950 relative overflow-hidden select-none">
      {/* Top Call Info Bar */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 flex items-center justify-between bg-gradient-to-b from-neutral-950/90 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              {activeCall.isGroup ? 'Family Group Call' : 'Private Family Call'}
            </h3>
            <p className="text-[11px] font-mono text-emerald-400">
              {formatDuration(activeCall.duration)}
            </p>
          </div>
        </div>

        {/* Snapshot Notification Toast */}
        {snapshotTakenNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500 text-neutral-950 font-bold text-xs px-3 py-1 rounded-full shadow-lg"
          >
            📸 Saved to Family Gallery!
          </motion.div>
        )}

        <div className="flex items-center gap-2">
          {/* AR Filter Button */}
          <button
            id="btn-call-filter"
            onClick={() => setShowFilterPicker(!showFilterPicker)}
            className={`p-2 rounded-full border transition-all ${
              activeCall.activeFilter !== 'none'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-neutral-900/80 text-white border-neutral-700'
            }`}
            title="Fun AR Effects"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Snapshot Button */}
          <button
            id="btn-call-snapshot"
            onClick={handleSnapshot}
            className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 transition-all active:scale-95"
            title="Take Family Screenshot"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AR Filter Selection Drawer */}
      {showFilterPicker && (
        <div className="absolute top-16 right-4 z-40 bg-neutral-900/95 border border-neutral-700 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-bold text-neutral-400 px-2">Video Filter</span>
          {(['none', 'warm', 'sepia', 'sparkle', 'confetti'] as const).map(f => (
            <button
              key={f}
              onClick={() => {
                setCallFilter(f);
                setShowFilterPicker(false);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg text-left capitalize transition-colors ${
                activeCall.activeFilter === f
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {f === 'none' ? 'Normal' : f === 'warm' ? 'Warm Sunlight' : f === 'sepia' ? 'Family Retro' : f === 'sparkle' ? 'Golden Glow' : 'Celebration Confetti 🎉'}
            </button>
          ))}
        </div>
      )}

      {/* Video Participants Grid */}
      <div className="flex-1 p-3 pt-16 pb-24 grid grid-cols-2 gap-2.5 h-full overflow-hidden">
        {/* Tile 1: Current User (Real Webcam or Interactive simulated feed) */}
        <div className={`relative bg-neutral-900 rounded-2xl overflow-hidden border-2 transition-all ${
          activeCall.isVideoOff ? 'border-neutral-800' : 'border-emerald-500/60'
        }`}>
          {!activeCall.isVideoOff ? (
            <div className="w-full h-full relative">
              {/* Local Real Stream video */}
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover -scale-x-100 ${
                  activeCall.activeFilter === 'warm' ? 'sepia-[0.3] brightness-105' :
                  activeCall.activeFilter === 'sepia' ? 'sepia contrast-125' :
                  activeCall.activeFilter === 'sparkle' ? 'brightness-110 saturate-125' : ''
                }`}
              />
              {/* If camera stream not loaded, show clear fallback overlay */}
              {!localStream && (
                <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center p-3 text-center">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 mb-2 shadow-lg"
                  />
                  <p className="text-xs font-semibold text-white">Your Camera Feed</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">Live Preview Ready</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900">
              <CameraOff className="w-8 h-8 text-neutral-500 mb-2" />
              <p className="text-xs text-neutral-400">Camera Off</p>
            </div>
          )}

          {/* User Tag & Audio Status */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-neutral-950/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px]">
            <span className="font-semibold text-white truncate">You (Muneeb)</span>
            <div className="flex items-center gap-1">
              {activeCall.isMuted ? (
                <MicOff className="w-3 h-3 text-rose-400" />
              ) : (
                <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Tile 2: Ammi Jaan */}
        <div className={`relative bg-neutral-900 rounded-2xl overflow-hidden border-2 transition-all ${
          activeSpeakerId === 'user-ammi' ? 'border-emerald-400 ring-2 ring-emerald-500/30' : 'border-neutral-800'
        }`}>
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80"
            alt="Ammi Jaan"
            className="w-full h-full object-cover"
          />
          {activeSpeakerId === 'user-ammi' && (
            <div className="absolute top-2 right-2 bg-emerald-500 text-neutral-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-ping" />
              Speaking
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-neutral-950/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px]">
            <span className="font-semibold text-white truncate">Ammi Jaan ❤️</span>
            <Volume2 className="w-3 h-3 text-emerald-400" />
          </div>
        </div>

        {/* Tile 3: Abu Jaan */}
        <div className={`relative bg-neutral-900 rounded-2xl overflow-hidden border-2 transition-all ${
          activeSpeakerId === 'user-abu' ? 'border-emerald-400 ring-2 ring-emerald-500/30' : 'border-neutral-800'
        }`}>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"
            alt="Abu Jaan"
            className="w-full h-full object-cover"
          />
          {activeSpeakerId === 'user-abu' && (
            <div className="absolute top-2 right-2 bg-emerald-500 text-neutral-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-ping" />
              Speaking
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-neutral-950/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px]">
            <span className="font-semibold text-white truncate">Abu Jaan 👔</span>
            <Volume2 className="w-3 h-3 text-emerald-400" />
          </div>
        </div>

        {/* Tile 4: Hamza / Ayesha */}
        <div className={`relative bg-neutral-900 rounded-2xl overflow-hidden border-2 transition-all ${
          activeSpeakerId === 'user-hamza' ? 'border-emerald-400 ring-2 ring-emerald-500/30' : 'border-neutral-800'
        }`}>
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80"
            alt="Hamza"
            className="w-full h-full object-cover"
          />
          {activeSpeakerId === 'user-hamza' && (
            <div className="absolute top-2 right-2 bg-emerald-500 text-neutral-950 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-ping" />
              Speaking
            </div>
          )}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-neutral-950/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px]">
            <span className="font-semibold text-white truncate">Hamza ⚡</span>
            <Volume2 className="w-3 h-3 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Floating Bottom Call Controls Bar */}
      <div className="absolute bottom-4 inset-x-0 z-30 flex items-center justify-center gap-3 px-4">
        <div className="bg-neutral-900/90 backdrop-blur-lg border border-neutral-700/80 rounded-full px-4 py-2.5 flex items-center gap-4 shadow-2xl">
          {/* Mute Mic */}
          <button
            id="btn-call-toggle-mic"
            onClick={toggleMute}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              activeCall.isMuted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-neutral-800 text-white hover:bg-neutral-700'
            }`}
            title={activeCall.isMuted ? 'Unmute' : 'Mute'}
          >
            {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video */}
          <button
            id="btn-call-toggle-video"
            onClick={toggleVideo}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              activeCall.isVideoOff
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-neutral-800 text-white hover:bg-neutral-700'
            }`}
            title={activeCall.isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {activeCall.isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* End Call Hangup */}
          <button
            id="btn-call-end"
            onClick={endCall}
            className="w-13 h-13 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-transform"
            title="End Video Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
