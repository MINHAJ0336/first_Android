import React from 'react';
import { useFamily } from '../context/FamilyContext';
import { TabType } from '../types';
import { MessageCircle, Video, Image as ImageIcon, Sparkles, Users, Heart } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, messages, photos } = useFamily();

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'chats',
      label: 'Chats',
      icon: <MessageCircle className="w-5 h-5" />,
      badge: 2,
    },
    {
      id: 'calls',
      label: 'Video Call',
      icon: <Video className="w-5 h-5" />,
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: <ImageIcon className="w-5 h-5" />,
      badge: photos.length > 6 ? photos.length : undefined,
    },
    {
      id: 'moments',
      label: 'Moments',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'hub',
      label: 'Family Hub',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800/80 px-2 py-1.5 flex items-center justify-around select-none z-30"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            id={`nav-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'text-emerald-400 font-semibold scale-105'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge && !isActive && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-neutral-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-neutral-900">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            {isActive && (
              <span className="w-1 h-1 bg-emerald-400 rounded-full mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
