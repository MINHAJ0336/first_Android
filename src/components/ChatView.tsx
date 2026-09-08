import React, { useState, useRef, useEffect } from 'react';
import { useFamily } from '../context/FamilyContext';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Video, 
  Phone, 
  Smile, 
  Pin, 
  CheckCheck, 
  Play, 
  Pause, 
  Plus, 
  X,
  Sparkles,
  Users,
  ChevronRight
} from 'lucide-react';
import { QUICK_FAMILY_PHRASES } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';

export const ChatView: React.FC = () => {
  const { 
    currentUser, 
    familyMembers, 
    selectedChatUserId, 
    setSelectedChatUserId, 
    messages, 
    sendMessage, 
    toggleReaction,
    startCall,
    triggerSimulatedIncomingCall
  } = useFamily();

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChatUserId]);

  // Audio recording simulation/real timer
  useEffect(() => {
    if (isRecording) {
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [isRecording]);

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPhrase = (phrase: string) => {
    sendMessage(phrase);
  };

  const handleFinishVoiceRecord = () => {
    setIsRecording(false);
    const duration = recordSeconds || 5;
    sendMessage(`Voice Note (${duration}s)`, undefined, 'audio', duration);
    setRecordSeconds(0);
  };

  const handleCancelVoiceRecord = () => {
    setIsRecording(false);
    setRecordSeconds(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      sendMessage('Shared a family photo 📷', result, 'image');
      setShowAttachModal(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSendCustomPhoto = () => {
    if (!customPhotoUrl.trim()) return;
    sendMessage('Shared a photo 📷', customPhotoUrl.trim(), 'image');
    setCustomPhotoUrl('');
    setShowAttachModal(false);
  };

  const currentChatPartner = selectedChatUserId 
    ? familyMembers.find(m => m.id === selectedChatUserId) 
    : null;

  // Filter messages for current view (null = group chat, or 1-on-1 between currentUser & selectedChatUserId)
  const filteredMessages = messages.filter(msg => {
    if (!selectedChatUserId) {
      return !msg.recipientId; // group chat
    }
    // direct chat: either sent to recipient from current user, or sent from recipient to current user
    return (
      (msg.recipientId === selectedChatUserId && msg.senderId === currentUser.id) ||
      (msg.recipientId === currentUser.id && msg.senderId === selectedChatUserId)
    );
  });

  const pinnedMessage = messages.find(m => m.isPinned);

  const emojiOptions = ['❤️', '😂', '🤲', '👍', '😍', '🎉', '☕', '🌸'];

  return (
    <div id="chat-view-container" className="flex flex-col h-full bg-neutral-950 relative overflow-hidden">
      {/* Top Chat Header */}
      <header id="chat-header" className="bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            {currentChatPartner ? (
              <img
                src={currentChatPartner.avatar}
                alt={currentChatPartner.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/50"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/40">
                <Users className="w-5 h-5 text-emerald-100" />
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-neutral-900" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5 leading-tight">
              {currentChatPartner ? currentChatPartner.name : 'Khan Family Hub ❤️'}
            </h2>
            <p className="text-[11px] text-emerald-400 font-medium">
              {currentChatPartner 
                ? `${currentChatPartner.relation} • ${currentChatPartner.status === 'online' ? 'Online' : 'Offline'}`
                : '6 family members online'}
            </p>
          </div>
        </div>

        {/* Video Call & Audio Call Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-header-start-video"
            onClick={() => startCall(selectedChatUserId || undefined, true)}
            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 active:scale-95 transition-all flex items-center gap-1 text-xs font-semibold"
            title="Start Family Video Call"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Call</span>
          </button>

          <button
            id="btn-header-start-audio"
            onClick={() => startCall(selectedChatUserId || undefined, false)}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 active:scale-95 transition-all"
            title="Start Audio Call"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Member / Chat Switcher Bar */}
      <div id="chat-members-switcher" className="bg-neutral-900/60 border-b border-neutral-800/50 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <button
          id="tab-group-chat"
          onClick={() => setSelectedChatUserId(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedChatUserId === null
              ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm shadow-emerald-500/30'
              : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Family (Group)</span>
        </button>

        {familyMembers
          .filter(m => m.id !== currentUser.id)
          .map(member => (
            <button
              id={`tab-member-${member.id}`}
              key={member.id}
              onClick={() => setSelectedChatUserId(member.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedChatUserId === member.id
                  ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm shadow-emerald-500/30'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>{member.name.split(' ')[0]}</span>
            </button>
          ))}
      </div>

      {/* Pinned Message Notice */}
      {pinnedMessage && (
        <div id="chat-pinned-message" className="bg-neutral-900/95 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between text-xs text-neutral-300 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-emerald-400 shrink-0 rotate-45" />
            <span className="font-semibold text-emerald-400 shrink-0">Family Notice:</span>
            <span className="truncate">{pinnedMessage.text}</span>
          </div>
          <span className="text-[10px] text-neutral-500 shrink-0 ml-2">Sunday</span>
        </div>
      )}

      {/* Messages Feed */}
      <div id="chat-messages-feed" className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <Sparkles className="w-8 h-8 text-emerald-400/60 mb-2" />
            <p className="text-sm font-medium text-neutral-300">
              No private messages yet with {currentChatPartner?.name}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Say Salam or send a photo to start chatting!
            </p>
          </div>
        )}

        {filteredMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isAudio = msg.mediaType === 'audio';
          const isPlayingThisAudio = playingAudioId === msg.id;

          return (
            <div
              key={msg.id}
              id={`message-${msg.id}`}
              className={`flex items-end gap-2 group ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                />
              )}

              <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && !selectedChatUserId && (
                  <span className="text-[11px] font-semibold text-emerald-400/90 ml-1 mb-0.5">
                    {msg.senderName}
                  </span>
                )}

                <div
                  className={`relative rounded-2xl px-3.5 py-2.5 text-sm shadow-sm transition-all ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-neutral-800 text-neutral-100 rounded-bl-xs border border-neutral-700/50'
                  }`}
                >
                  {/* Photo attachment */}
                  {msg.mediaType === 'image' && msg.mediaUrl && (
                    <div className="mb-2 overflow-hidden rounded-xl bg-neutral-900/50 max-w-xs">
                      <img
                        src={msg.mediaUrl}
                        alt="Shared media"
                        className="w-full max-h-56 object-cover hover:scale-102 transition-transform duration-300 cursor-pointer"
                        onClick={() => window.open(msg.mediaUrl, '_blank')}
                      />
                    </div>
                  )}

                  {/* Audio Voice Note Bubble */}
                  {isAudio ? (
                    <div className="flex items-center gap-3 py-1 min-w-[200px]">
                      <button
                        onClick={() => {
                          setPlayingAudioId(isPlayingThisAudio ? null : msg.id);
                        }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
                          isMe ? 'bg-white text-emerald-700' : 'bg-emerald-500 text-neutral-950'
                        }`}
                      >
                        {isPlayingThisAudio ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-0.5 h-5">
                          {[4, 12, 18, 8, 14, 20, 16, 10, 15, 8, 18, 12, 6, 14].map((h, i) => (
                            <span
                              key={i}
                              className={`w-1 rounded-full transition-all duration-200 ${
                                isPlayingThisAudio ? 'animate-pulse bg-emerald-300' : isMe ? 'bg-emerald-200/60' : 'bg-neutral-400'
                              }`}
                              style={{ height: `${h}px` }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] mt-1 opacity-80">
                          <span>0:{isPlayingThisAudio ? '03' : '00'}</span>
                          <span>0:{msg.audioDuration ? String(msg.audioDuration).padStart(2, '0') : '07'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    msg.text && <p className="leading-relaxed break-words">{msg.text}</p>
                  )}

                  {/* Footer with time & read status */}
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-emerald-200' : 'text-neutral-400'}`}>
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                  </div>

                  {/* Reactions Badge */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => toggleReaction(msg.id, r.emoji)}
                          className="bg-neutral-900/80 border border-neutral-700 px-1.5 py-0.5 rounded-full text-xs flex items-center gap-1 hover:scale-110 transition-transform"
                          title={`Reacted by ${r.userName}`}
                        >
                          <span>{r.emoji}</span>
                          <span className="text-[10px] text-neutral-300 font-semibold">1</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Emoji Reaction Hover Trigger */}
                <div className="relative mt-0.5">
                  <button
                    onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-neutral-400 hover:text-white rounded-full bg-neutral-900/60"
                  >
                    <Smile className="w-3.5 h-3.5" />
                  </button>

                  {showEmojiPicker === msg.id && (
                    <div className="absolute top-0 right-0 z-30 bg-neutral-900 border border-neutral-700 rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
                      {emojiOptions.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            toggleReaction(msg.id, emoji);
                            setShowEmojiPicker(null);
                          }}
                          className="hover:scale-125 transition-transform text-sm p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Family Phrases Bar */}
      <div id="quick-family-phrases" className="bg-neutral-900/70 border-t border-neutral-800/60 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] uppercase font-bold text-emerald-400 shrink-0">
          Quick:
        </span>
        {QUICK_FAMILY_PHRASES.map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPhrase(phrase)}
            className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors active:scale-95"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <div id="chat-input-bar" className="bg-neutral-900 border-t border-neutral-800/80 px-3 py-2.5 shrink-0 z-20">
        {isRecording ? (
          <div className="flex items-center justify-between bg-neutral-800 px-3 py-2 rounded-2xl">
            <div className="flex items-center gap-2 text-rose-400 animate-pulse text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Recording Voice Note: 0:{String(recordSeconds).padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelVoiceRecord}
                className="p-1.5 text-neutral-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishVoiceRecord}
                className="p-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendText} className="flex items-center gap-2">
            {/* Attachment Button */}
            <button
              type="button"
              id="btn-open-attach"
              onClick={() => setShowAttachModal(true)}
              className="p-2 rounded-xl text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 transition-colors"
              title="Send Photo"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Hidden real file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Input field */}
            <input
              id="input-chat-message"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${currentChatPartner ? currentChatPartner.name : 'family'}...`}
              className="flex-1 bg-neutral-800 border border-neutral-700/60 rounded-xl px-3.5 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />

            {/* Voice record or Send button */}
            {inputText.trim().length > 0 ? (
              <button
                type="submit"
                id="btn-send-message"
                className="p-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl transition-transform active:scale-95 shadow-md shadow-emerald-500/20"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-record-voice"
                onClick={() => setIsRecording(true)}
                className="p-2 text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 rounded-xl transition-colors active:scale-95"
                title="Record Voice Note"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        )}
      </div>

      {/* Attach Photo Modal */}
      {showAttachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Share Family Photo</h3>
              <button
                onClick={() => setShowAttachModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                Upload from Phone / Gallery
              </button>

              <div className="relative flex items-center justify-center text-xs text-neutral-500 my-2">
                <span className="bg-neutral-900 px-2 z-10">or paste image URL</span>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800" />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="https://example.com/family-pic.jpg"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAttachModal(false)}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendCustomPhoto}
                  disabled={!customPhotoUrl.trim()}
                  className="px-4 py-1.5 bg-emerald-500 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs"
                >
                  Send Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
