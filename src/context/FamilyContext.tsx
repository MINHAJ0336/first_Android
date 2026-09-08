import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  FamilyMember, 
  ChatMessage, 
  GalleryPhoto, 
  FamilyMoment, 
  FamilyPoll, 
  FamilyEvent, 
  SafetyCheckIn, 
  TabType,
  ActiveCall
} from '../types';
import { 
  INITIAL_FAMILY_MEMBERS, 
  INITIAL_MESSAGES, 
  INITIAL_GALLERY_PHOTOS, 
  INITIAL_MOMENTS, 
  INITIAL_POLLS, 
  INITIAL_EVENTS, 
  INITIAL_CHECKINS 
} from '../mockData';
import confetti from 'canvas-confetti';

interface FamilyContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser: FamilyMember;
  setCurrentUser: (member: FamilyMember) => void;
  familyMembers: FamilyMember[];
  selectedChatUserId: string | null; // null = Family Group Chat
  setSelectedChatUserId: (id: string | null) => void;
  messages: ChatMessage[];
  sendMessage: (text: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'audio', audioDuration?: number) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  photos: GalleryPhoto[];
  addPhoto: (photo: Omit<GalleryPhoto, 'id' | 'likes' | 'comments' | 'uploadedBy' | 'uploadedByName' | 'uploadedByAvatar'>) => void;
  togglePhotoLike: (photoId: string) => void;
  addPhotoComment: (photoId: string, text: string) => void;
  moments: FamilyMoment[];
  addMoment: (imageUrl: string, caption: string) => void;
  polls: FamilyPoll[];
  votePoll: (pollId: string, optionId: string) => void;
  createPoll: (question: string, options: string[]) => void;
  events: FamilyEvent[];
  addEvent: (title: string, date: string, type: FamilyEvent['type']) => void;
  checkIns: SafetyCheckIn[];
  updateCheckIn: (statusText: string, type: SafetyCheckIn['type']) => void;
  // Video Call State
  activeCall: ActiveCall;
  startCall: (targetUserId?: string, isVideo?: boolean) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  setCallFilter: (filter: ActiveCall['activeFilter']) => void;
  takeCallSnapshot: () => void;
  incomingCall: { from: FamilyMember; isVideo: boolean } | null;
  triggerSimulatedIncomingCall: (memberId?: string) => void;
  acceptIncomingCall: () => void;
  declineIncomingCall: () => void;
  localStream: MediaStream | null;
  cameraError: string | null;
  // View mode
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean | ((prev: boolean) => boolean)) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [familyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [currentUser, setCurrentUser] = useState<FamilyMember>(INITIAL_FAMILY_MEMBERS[0]);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  
  // Local storage backed state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('fc_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('fc_photos');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_PHOTOS;
  });

  const [moments, setMoments] = useState<FamilyMoment[]>(() => {
    const saved = localStorage.getItem('fc_moments');
    return saved ? JSON.parse(saved) : INITIAL_MOMENTS;
  });

  const [polls, setPolls] = useState<FamilyPoll[]>(() => {
    const saved = localStorage.getItem('fc_polls');
    return saved ? JSON.parse(saved) : INITIAL_POLLS;
  });

  const [events, setEvents] = useState<FamilyEvent[]>(() => {
    const saved = localStorage.getItem('fc_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [checkIns, setCheckIns] = useState<SafetyCheckIn[]>(() => {
    const saved = localStorage.getItem('fc_checkins');
    return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
  });

  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Calls state
  const [activeCall, setActiveCall] = useState<ActiveCall>({
    active: false,
    type: 'video',
    isGroup: true,
    participantIds: [],
    duration: 0,
    isMuted: false,
    isVideoOff: false,
    activeFilter: 'none',
  });

  const [incomingCall, setIncomingCall] = useState<{ from: FamilyMember; isVideo: boolean } | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const callTimerRef = useRef<number | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fc_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('fc_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('fc_moments', JSON.stringify(moments));
  }, [moments]);

  useEffect(() => {
    localStorage.setItem('fc_polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('fc_checkins', JSON.stringify(checkIns));
  }, [checkIns]);

  // Handle Call Timer
  useEffect(() => {
    if (activeCall.active) {
      callTimerRef.current = window.setInterval(() => {
        setActiveCall(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [activeCall.active]);

  // Start real or graceful fallback camera stream
  const setupCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true,
        });
        setLocalStream(stream);
        setCameraError(null);
        return stream;
      }
    } catch (err) {
      console.warn('Camera access not granted or unavailable, using fallback:', err);
      setCameraError('Camera preview in fallback mode (Browser permissions or simulated container)');
    }
    return null;
  };

  const stopCamera = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  };

  const startCall = (targetUserId?: string, isVideo: boolean = true) => {
    const isGroup = !targetUserId;
    const participantIds = isGroup 
      ? familyMembers.filter(m => m.id !== currentUser.id).map(m => m.id)
      : [targetUserId!];

    setActiveCall({
      active: true,
      type: isVideo ? 'video' : 'audio',
      isGroup,
      participantIds,
      duration: 0,
      isMuted: false,
      isVideoOff: false,
      activeFilter: 'none',
    });

    if (isVideo) {
      setupCamera();
    }
  };

  const endCall = () => {
    stopCamera();
    setActiveCall(prev => ({ ...prev, active: false, duration: 0 }));
  };

  const toggleMute = () => {
    setActiveCall(prev => {
      const nextMuted = !prev.isMuted;
      if (localStream) {
        localStream.getAudioTracks().forEach(track => {
          track.enabled = !nextMuted;
        });
      }
      return { ...prev, isMuted: nextMuted };
    });
  };

  const toggleVideo = () => {
    setActiveCall(prev => {
      const nextVideoOff = !prev.isVideoOff;
      if (localStream) {
        localStream.getVideoTracks().forEach(track => {
          track.enabled = !nextVideoOff;
        });
      }
      return { ...prev, isVideoOff: nextVideoOff };
    });
  };

  const setCallFilter = (filter: ActiveCall['activeFilter']) => {
    setActiveCall(prev => ({ ...prev, activeFilter: filter }));
    if (filter === 'confetti') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const takeCallSnapshot = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });

    // Save snapshot into shared photo gallery
    const snapshotPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
      caption: `Family Video Call Screenshot 📸 (${new Date().toLocaleDateString()})`,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      uploadedByAvatar: currentUser.avatar,
      date: 'Just now',
      album: 'Celebrations',
      likes: [currentUser.id],
      comments: [
        {
          id: `c-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          text: 'Captured during our lively family video call! ❤️',
          time: 'Just now'
        }
      ]
    };

    setPhotos(prev => [snapshotPhoto, ...prev]);
  };

  const triggerSimulatedIncomingCall = (memberId?: string) => {
    const caller = familyMembers.find(m => m.id === (memberId || 'user-ammi')) || familyMembers[1];
    setIncomingCall({ from: caller, isVideo: true });
  };

  const acceptIncomingCall = () => {
    if (incomingCall) {
      startCall(incomingCall.from.id, incomingCall.isVideo);
      setIncomingCall(null);
    }
  };

  const declineIncomingCall = () => {
    setIncomingCall(null);
  };

  // Messaging
  const sendMessage = (
    text: string, 
    mediaUrl?: string, 
    mediaType?: 'image' | 'video' | 'audio',
    audioDuration?: number
  ) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      recipientId: selectedChatUserId || undefined,
      text: text.trim() || undefined,
      mediaUrl,
      mediaType,
      audioDuration,
      timestamp: timeString,
      reactions: [],
    };

    setMessages(prev => [...prev, newMsg]);

    // If sent to group, trigger pleasant auto-reply after 2.5s from another family member for realism!
    if (!selectedChatUserId && !text.includes('audio voice note')) {
      setTimeout(() => {
        const respondents = familyMembers.filter(m => m.id !== currentUser.id);
        const randomMember = respondents[Math.floor(Math.random() * respondents.length)];
        const warmReplies = [
          'Bohat khoob! MashAllah ❤️',
          'Haan bilkul theek kaha!',
          'Jee theek hai, note kar liya.',
          'Zabardast! Khush raho sab.',
          'Love you all! Dua mein yaad.',
        ];
        const replyText = warmReplies[Math.floor(Math.random() * warmReplies.length)];

        setMessages(current => [
          ...current,
          {
            id: `msg-${Date.now() + 1}`,
            senderId: randomMember.id,
            senderName: randomMember.name,
            senderAvatar: randomMember.avatar,
            recipientId: undefined,
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: [{ emoji: '❤️', userId: currentUser.id, userName: currentUser.name }],
          }
        ]);
      }, 2500);
    }
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      const existingReactionIndex = msg.reactions.findIndex(
        r => r.userId === currentUser.id && r.emoji === emoji
      );
      if (existingReactionIndex > -1) {
        return {
          ...msg,
          reactions: msg.reactions.filter((_, idx) => idx !== existingReactionIndex)
        };
      } else {
        return {
          ...msg,
          reactions: [...msg.reactions, { emoji, userId: currentUser.id, userName: currentUser.name }]
        };
      }
    }));
  };

  // Gallery
  const addPhoto = (photoData: Omit<GalleryPhoto, 'id' | 'likes' | 'comments' | 'uploadedBy' | 'uploadedByName' | 'uploadedByAvatar'>) => {
    const newPhoto: GalleryPhoto = {
      ...photoData,
      id: `photo-${Date.now()}`,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      uploadedByAvatar: currentUser.avatar,
      likes: [currentUser.id],
      comments: []
    };

    setPhotos(prev => [newPhoto, ...prev]);

    // Also share a notification message in the group chat!
    sendMessage(`Shared a new photo in ${newPhoto.album}: "${newPhoto.caption}" 📸`, newPhoto.url, 'image');
  };

  const togglePhotoLike = (photoId: string) => {
    setPhotos(prev => prev.map(p => {
      if (p.id !== photoId) return p;
      const isLiked = p.likes.includes(currentUser.id);
      if (!isLiked) {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.7 }
        });
      }
      return {
        ...p,
        likes: isLiked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id]
      };
    }));
  };

  const addPhotoComment = (photoId: string, text: string) => {
    if (!text.trim()) return;
    setPhotos(prev => prev.map(p => {
      if (p.id !== photoId) return p;
      return {
        ...p,
        comments: [
          ...p.comments,
          {
            id: `c-${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            text: text.trim(),
            time: 'Just now'
          }
        ]
      };
    }));
  };

  // Moments
  const addMoment = (imageUrl: string, caption: string) => {
    const newMoment: FamilyMoment = {
      id: `moment-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      imageUrl,
      caption,
      createdAt: 'Just now',
      views: [currentUser.id]
    };
    setMoments(prev => [newMoment, ...prev]);
  };

  // Polls
  const votePoll = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id !== pollId) return poll;
      const updatedOptions = poll.options.map(opt => {
        // Remove current user vote if exists
        const filtered = opt.votes.filter(uId => uId !== currentUser.id);
        if (opt.id === optionId) {
          filtered.push(currentUser.id);
        }
        return { ...opt, votes: filtered };
      });
      return { ...poll, options: updatedOptions };
    }));
  };

  const createPoll = (question: string, optionsText: string[]) => {
    const newPoll: FamilyPoll = {
      id: `poll-${Date.now()}`,
      question,
      options: optionsText.filter(t => t.trim().length > 0).map((t, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        text: t,
        votes: []
      })),
      createdBy: currentUser.id,
      createdAt: 'Just now'
    };
    setPolls(prev => [newPoll, ...prev]);
  };

  // Events
  const addEvent = (title: string, date: string, type: FamilyEvent['type']) => {
    const newEv: FamilyEvent = {
      id: `ev-${Date.now()}`,
      title,
      date,
      type,
      daysRemaining: 10,
    };
    setEvents(prev => [...prev, newEv]);
  };

  // CheckIn
  const updateCheckIn = (statusText: string, type: SafetyCheckIn['type']) => {
    const newCheckIn: SafetyCheckIn = {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      statusText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setCheckIns(prev => [newCheckIn, ...prev.filter(c => c.userId !== currentUser.id)]);
  };

  return (
    <FamilyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        familyMembers,
        selectedChatUserId,
        setSelectedChatUserId,
        messages,
        sendMessage,
        toggleReaction,
        photos,
        addPhoto,
        togglePhotoLike,
        addPhotoComment,
        moments,
        addMoment,
        polls,
        votePoll,
        createPoll,
        events,
        addEvent,
        checkIns,
        updateCheckIn,
        activeCall,
        startCall,
        endCall,
        toggleMute,
        toggleVideo,
        setCallFilter,
        takeCallSnapshot,
        incomingCall,
        triggerSimulatedIncomingCall,
        acceptIncomingCall,
        declineIncomingCall,
        localStream,
        cameraError,
        isPhoneFrame,
        setIsPhoneFrame,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
