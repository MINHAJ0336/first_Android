import React, { useState, useEffect } from 'react';
import { useFamily } from '../context/FamilyContext';
import { Navigation } from './Navigation';
import { ChatView } from './ChatView';
import { VideoCallView } from './VideoCallView';
import { GalleryView } from './GalleryView';
import { MomentsView } from './MomentsView';
import { FamilyHubView } from './FamilyHubView';
import { IncomingCallModal } from './IncomingCallModal';
import { 
  Smartphone, 
  Monitor, 
  Wifi, 
  Battery, 
  Signal, 
  PhoneCall, 
  Heart,
  ChevronDown
} from 'lucide-react';

export const MobileContainer: React.FC = () => {
  const { 
    activeTab, 
    currentUser, 
    setCurrentUser, 
    familyMembers, 
    triggerSimulatedIncomingCall,
    isPhoneFrame,
    setIsPhoneFrame
  } = useFamily();

  const [currentTime, setCurrentTime] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-start sm:p-4 md:p-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Testing Control Bar (Outside the phone screen for testing flexibility) */}
      <header className="w-full max-w-4xl mb-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Heart className="w-4 h-4 fill-emerald-500/40" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              FamConnect <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">Mobile App</span>
            </h1>
            <p className="text-[11px] text-neutral-400">
              Family Chatting, HD Video Calling & Shared Gallery
            </p>
          </div>
        </div>

        {/* Quick Testing Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active Profile Switcher */}
          <div className="relative">
            <button
              id="btn-switch-profile"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-200 border border-neutral-700 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>Role: <strong className="text-emerald-400">{currentUser.name.split(' ')[0]}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-1 w-52 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl py-1.5 z-50">
                <span className="block px-3 py-1 text-[10px] uppercase font-bold text-neutral-400 border-b border-neutral-800">
                  Switch Active Persona
                </span>
                {familyMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setCurrentUser(member);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs hover:bg-neutral-800 transition-colors ${
                      currentUser.id === member.id ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-neutral-300'
                    }`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <p className="leading-none">{member.name}</p>
                      <span className="text-[10px] text-neutral-500">{member.relation}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Test Call Simulator */}
          <button
            id="btn-quick-test-call"
            onClick={() => triggerSimulatedIncomingCall()}
            className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all"
            title="Test an incoming video call from Ammi"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Simulate Call</span>
          </button>

          {/* Frame Toggle */}
          <button
            id="btn-toggle-frame-mode"
            onClick={() => setIsPhoneFrame(prev => !prev)}
            className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-xl text-xs font-semibold border border-neutral-700 transition-colors"
            title={isPhoneFrame ? 'Switch to Full Screen Layout' : 'Switch to Mobile Frame'}
          >
            {isPhoneFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPhoneFrame ? 'Full View' : 'Phone View'}</span>
          </button>
        </div>
      </header>

      {/* Main Container: either Phone Mockup or Full Width Responsive View */}
      <div
        id="app-main-viewport"
        className={`w-full transition-all duration-300 flex flex-col ${
          isPhoneFrame
            ? 'max-w-[420px] h-[860px] max-h-[92vh] rounded-[44px] border-[8px] border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden bg-neutral-950 ring-1 ring-neutral-700'
            : 'max-w-4xl h-[86vh] rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden bg-neutral-950'
        }`}
      >
        {/* Mobile Phone Status Bar */}
        <div id="mobile-status-bar" className="h-11 px-6 pt-2 pb-1 bg-neutral-950 flex items-center justify-between text-neutral-200 text-xs font-semibold shrink-0 z-30 select-none">
          <span className="font-mono text-[13px] tracking-tight">{currentTime || '09:41'}</span>

          {/* Dynamic Island / Camera Notch */}
          {isPhoneFrame && (
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-inner border border-neutral-900">
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              <span className="w-2 h-2 rounded-full bg-neutral-800/80" />
            </div>
          )}

          {/* Status Icons */}
          <div className="flex items-center gap-2 text-neutral-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {activeTab === 'chats' && <ChatView />}
          {activeTab === 'calls' && <VideoCallView />}
          {activeTab === 'gallery' && <GalleryView />}
          {activeTab === 'moments' && <MomentsView />}
          {activeTab === 'hub' && <FamilyHubView />}
        </main>

        {/* Bottom Navigation */}
        <Navigation />

        {/* Mobile Home Bar Pill Indicator */}
        {isPhoneFrame && (
          <div className="h-4 bg-neutral-900/95 flex items-center justify-center shrink-0">
            <div className="w-28 h-1 bg-neutral-600 rounded-full" />
          </div>
        )}
      </div>

      {/* Global Incoming Video Call Popup */}
      <IncomingCallModal />
    </div>
  );
};
