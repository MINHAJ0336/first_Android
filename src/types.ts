export type TabType = 'chats' | 'calls' | 'gallery' | 'moments' | 'hub';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string; // e.g., 'Ammi (Mother)', 'Abu (Father)', 'Bhai (Brother)'
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
  location?: string;
  isCurrentUser?: boolean;
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId?: string; // undefined means group chat 'family-group'
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  audioDuration?: number; // in seconds
  timestamp: string;
  reactions: Reaction[];
  isPinned?: boolean;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedByAvatar: string;
  date: string;
  album: string;
  likes: string[]; // array of userIds
  comments: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    time: string;
  }[];
}

export interface FamilyMoment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  createdAt: string;
  views: string[];
}

export interface FamilyPoll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: string[]; // userIds
  }[];
  createdBy: string;
  isClosed?: boolean;
  createdAt: string;
}

export interface FamilyEvent {
  id: string;
  title: string;
  date: string;
  type: 'birthday' | 'anniversary' | 'gathering' | 'celebration';
  person?: string;
  daysRemaining: number;
}

export interface SafetyCheckIn {
  userId: string;
  userName: string;
  userAvatar: string;
  statusText: string; // e.g. "Safe at Home", "Reached Airport"
  time: string;
  type: 'safe' | 'traveling' | 'need_help';
}

export interface ActiveCall {
  active: boolean;
  type: 'video' | 'audio';
  isGroup: boolean;
  participantIds: string[];
  duration: number;
  isMuted: boolean;
  isVideoOff: boolean;
  activeFilter: 'none' | 'sepia' | 'warm' | 'sparkle' | 'confetti';
}
