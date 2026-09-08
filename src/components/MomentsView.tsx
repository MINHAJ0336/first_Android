import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { FamilyMoment } from '../types';
import { Sparkles, Plus, Eye, X, Send, Heart, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MomentsView: React.FC = () => {
  const { moments, addMoment, currentUser } = useFamily();
  const [activeStory, setActiveStory] = useState<FamilyMoment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMomentUrl, setNewMomentUrl] = useState('');
  const [newMomentCaption, setNewMomentCaption] = useState('');

  const handlePostMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMomentUrl) return;

    addMoment(newMomentUrl, newMomentCaption.trim() || 'Daily Family Moment ✨');
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });

    setNewMomentUrl('');
    setNewMomentCaption('');
    setShowAddModal(false);
  };

  return (
    <div id="moments-view-container" className="flex flex-col h-full bg-neutral-950 overflow-y-auto p-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Family Moments
          </h2>
          <p className="text-xs text-neutral-400">
            24-hour status updates from family members
          </p>
        </div>

        <button
          id="btn-add-moment-open"
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Status</span>
        </button>
      </div>

      {/* Stories Carousel Cards */}
      <div className="mt-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Active Statuses
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Post your own status card */}
          <div
            onClick={() => setShowAddModal(true)}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-800 hover:border-emerald-500 bg-neutral-900/50 flex flex-col items-center justify-center p-4 cursor-pointer text-center group transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-white">Share Your Day</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Post photo or thought</p>
          </div>

          {/* Active Family Moments */}
          {moments.map((moment) => (
            <div
              key={moment.id}
              onClick={() => setActiveStory(moment)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-800 cursor-pointer group hover:border-emerald-500/80 transition-all shadow-md"
            >
              <img
                src={moment.imageUrl}
                alt={moment.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

              {/* Creator Pill top left */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-neutral-950/70 backdrop-blur-sm px-2 py-1 rounded-full border border-neutral-700">
                <img
                  src={moment.userAvatar}
                  alt={moment.userName}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="text-[10px] font-semibold text-white">
                  {moment.userName.split(' ')[0]}
                </span>
              </div>

              {/* Caption bottom */}
              <div className="absolute bottom-2.5 inset-x-2.5">
                <p className="text-xs font-medium text-white line-clamp-2 drop-shadow-sm">
                  {moment.caption}
                </p>
                <div className="flex items-center justify-between mt-1 text-[9px] text-neutral-400">
                  <span>{moment.createdAt}</span>
                  <span className="flex items-center gap-0.5">
                    <Eye className="w-3 h-3 text-emerald-400" />
                    {moment.views.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Moment Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2">
          <div className="relative w-full max-w-sm h-[80vh] bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 flex flex-col">
            {/* Top progress bar */}
            <div className="absolute top-3 inset-x-4 z-20 flex gap-1">
              <div className="h-1 bg-emerald-400 flex-1 rounded-full animate-pulse" />
            </div>

            {/* Story Header */}
            <div className="absolute top-6 inset-x-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.userAvatar}
                  alt={activeStory.userName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400"
                />
                <div>
                  <p className="text-xs font-bold text-white">{activeStory.userName}</p>
                  <p className="text-[10px] text-neutral-300">{activeStory.createdAt}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="p-1.5 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image */}
            <img
              src={activeStory.imageUrl}
              alt="Story"
              className="w-full h-full object-cover"
            />

            {/* Caption & Quick Reaction */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex flex-col gap-2">
              <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/80 p-3 rounded-2xl">
                <p className="text-xs font-semibold text-white text-center">
                  {activeStory.caption}
                </p>
              </div>

              {/* Quick Reply Bar */}
              <div className="flex items-center gap-1.5 justify-center">
                {['❤️', '😍', '👏', '🤲', '🔥'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      confetti({ particleCount: 30, spread: 40 });
                      setActiveStory(null);
                    }}
                    className="p-2 bg-neutral-900/90 border border-neutral-700 rounded-full text-base hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Moment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                New 24h Family Moment
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostMoment} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Choose Photo
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
                  ].map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewMomentUrl(url)}
                      className={`h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        newMomentUrl === url ? 'border-emerald-500 scale-95' : 'border-neutral-700'
                      }`}
                    >
                      <img src={url} alt="Option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Or paste custom image URL"
                  value={newMomentUrl}
                  onChange={(e) => setNewMomentUrl(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon tea & cookies! 🍪☕"
                  value={newMomentCaption}
                  onChange={(e) => setNewMomentCaption(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newMomentUrl}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  Post Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
