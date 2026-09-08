import { FamilyMember, ChatMessage, GalleryPhoto, FamilyMoment, FamilyPoll, FamilyEvent, SafetyCheckIn } from './types';

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'user-muneeb',
    name: 'Muneeb (Me)',
    relation: 'You',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    location: 'Home / Islamabad',
    isCurrentUser: true,
  },
  {
    id: 'user-ammi',
    name: 'Ammi Jaan',
    relation: 'Mother ❤️',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    lastSeen: 'Active just now',
    location: 'Lahore (Home)',
  },
  {
    id: 'user-abu',
    name: 'Abu Jaan',
    relation: 'Father 👔',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    lastSeen: 'Active 10m ago',
    location: 'Office / Gulberg',
  },
  {
    id: 'user-ayesha',
    name: 'Ayesha',
    relation: 'Sister 🌸',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    lastSeen: 'Active 2m ago',
    location: 'University',
  },
  {
    id: 'user-hamza',
    name: 'Hamza',
    relation: 'Younger Brother ⚡',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    lastSeen: 'Active now',
    location: 'Library',
  },
  {
    id: 'user-dadi',
    name: 'Dadi Jaan',
    relation: 'Grandmother 👵✨',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    status: 'offline',
    lastSeen: 'Last seen yesterday at 9:00 PM',
    location: 'Home Garden',
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-ammi',
    senderName: 'Ammi Jaan',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    text: 'Assalam o Alaikum sab bachon ko! Kahan hain sab log? Aaj sham ki chai sath peeni hai.',
    timestamp: '4:15 PM',
    reactions: [{ emoji: '❤️', userId: 'user-muneeb', userName: 'Muneeb' }, { emoji: '🤲', userId: 'user-ayesha', userName: 'Ayesha' }],
    isPinned: true,
  },
  {
    id: 'msg-2',
    senderId: 'user-abu',
    senderName: 'Abu Jaan',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    text: 'Walaikum Assalam! Main 5:30 tak ghar pohnch jaunga inshaAllah. Samosay le kr aoon?',
    timestamp: '4:18 PM',
    reactions: [{ emoji: '😋', userId: 'user-hamza', userName: 'Hamza' }, { emoji: '👍', userId: 'user-muneeb', userName: 'Muneeb' }],
  },
  {
    id: 'msg-3',
    senderId: 'user-hamza',
    senderName: 'Hamza',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    text: 'Yes please Abu! Meethi chutney bhi zaroor!',
    timestamp: '4:20 PM',
    reactions: [{ emoji: '😂', userId: 'user-ammi', userName: 'Ammi Jaan' }],
  },
  {
    id: 'msg-4',
    senderId: 'user-ayesha',
    senderName: 'Ayesha',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    text: 'Dekhein Ammi, maine campus ma ye pyare phool dekhay! 🌸',
    timestamp: '4:22 PM',
    reactions: [{ emoji: '😍', userId: 'user-ammi', userName: 'Ammi Jaan' }, { emoji: '❤️', userId: 'user-muneeb', userName: 'Muneeb' }],
  },
  {
    id: 'msg-5',
    senderId: 'user-ammi',
    senderName: 'Ammi Jaan',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    mediaType: 'audio',
    audioDuration: 7,
    text: 'Audio voice note (0:07)',
    timestamp: '4:24 PM',
    reactions: [{ emoji: '❤️', userId: 'user-muneeb', userName: 'Muneeb' }],
  },
  {
    id: 'msg-6',
    senderId: 'user-muneeb',
    senderName: 'Muneeb (Me)',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    text: 'Main bhi bas nikal raha hoon. 5 baje video call krte hain sab mil kr!',
    timestamp: '4:28 PM',
    reactions: [{ emoji: '🎉', userId: 'user-hamza', userName: 'Hamza' }, { emoji: '👌', userId: 'user-abu', userName: 'Abu Jaan' }],
  }
];

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
    caption: 'Eid ul Fitr 2026 - Pure family gathering at home! MashAllah ❤️',
    uploadedBy: 'user-ammi',
    uploadedByName: 'Ammi Jaan',
    uploadedByAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    date: '2 days ago',
    album: 'Eid 2026',
    likes: ['user-muneeb', 'user-abu', 'user-ayesha', 'user-hamza'],
    comments: [
      {
        id: 'c1',
        userId: 'user-abu',
        userName: 'Abu Jaan',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Bohat pyari tasweer hai sabki! MashAllah',
        time: 'Yesterday 10:15 AM'
      },
      {
        id: 'c2',
        userId: 'user-ayesha',
        userName: 'Ayesha',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Mera dress sabse acha lag raha hai haha 👗✨',
        time: 'Yesterday 11:20 AM'
      }
    ]
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    caption: 'Sunday Special Dum Biryani cooked by Ammi & Ayesha! 🍲',
    uploadedBy: 'user-muneeb',
    uploadedByName: 'Muneeb (Me)',
    uploadedByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    date: '3 days ago',
    album: 'Family Dinners',
    likes: ['user-hamza', 'user-ammi', 'user-abu'],
    comments: [
      {
        id: 'c3',
        userId: 'user-hamza',
        userName: 'Hamza',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        text: 'Meri plate kahan hai? 😋',
        time: '3 days ago'
      }
    ]
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    caption: 'Trip to Murree Hills - fresh chilly breeze and hot chai ☕🏔️',
    uploadedBy: 'user-abu',
    uploadedByName: 'Abu Jaan',
    uploadedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: 'Last week',
    album: 'Vacations',
    likes: ['user-muneeb', 'user-ammi', 'user-ayesha'],
    comments: []
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    caption: 'Cousins laugh after winning the board game competition! 😂🏆',
    uploadedBy: 'user-ayesha',
    uploadedByName: 'Ayesha',
    uploadedByAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    date: '2 weeks ago',
    album: 'Old Memories',
    likes: ['user-muneeb', 'user-hamza'],
    comments: []
  },
  {
    id: 'photo-5',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
    caption: 'Dadi Jan 75th Birthday Celebration Cake & lights 🎂🎉',
    uploadedBy: 'user-muneeb',
    uploadedByName: 'Muneeb (Me)',
    uploadedByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    date: '1 month ago',
    album: 'Celebrations',
    likes: ['user-ammi', 'user-abu', 'user-ayesha', 'user-hamza'],
    comments: [
      {
        id: 'c4',
        userId: 'user-ammi',
        userName: 'Ammi Jaan',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        text: 'Allah Taala Dadi Jan ki umar daraz farmaye, Ameen 🤲',
        time: '1 month ago'
      }
    ]
  },
  {
    id: 'photo-6',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    caption: 'Evening lawn tea session with Dadi Jan telling old childhood stories ☕📖',
    uploadedBy: 'user-hamza',
    uploadedByName: 'Hamza',
    uploadedByAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    date: '1 month ago',
    album: 'Family Dinners',
    likes: ['user-ammi', 'user-muneeb'],
    comments: []
  }
];

export const INITIAL_MOMENTS: FamilyMoment[] = [
  {
    id: 'moment-1',
    userId: 'user-ammi',
    userName: 'Ammi Jaan',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
    caption: 'Subah ki taza hawa aur gulab k phool 🌹 Good morning!',
    createdAt: '3 hours ago',
    views: ['user-muneeb', 'user-ayesha']
  },
  {
    id: 'moment-2',
    userId: 'user-hamza',
    userName: 'Hamza',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    caption: 'Study break with fries & burger! 🍟',
    createdAt: '5 hours ago',
    views: ['user-muneeb', 'user-ammi']
  },
  {
    id: 'moment-3',
    userId: 'user-ayesha',
    userName: 'Ayesha',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    caption: 'Cute stray cat outside my hostel campus 🐱',
    createdAt: '7 hours ago',
    views: ['user-muneeb']
  }
];

export const INITIAL_POLLS: FamilyPoll[] = [
  {
    id: 'poll-1',
    question: 'Sunday ko dinner kahan karna hai ya kya pakana hai?',
    options: [
      { id: 'opt-1', text: 'Ghar ki Mutton Biryani 🍲', votes: ['user-ammi', 'user-hamza'] },
      { id: 'opt-2', text: 'Restaurant BBQ & Naan 🍢', votes: ['user-muneeb', 'user-ayesha'] },
      { id: 'opt-3', text: 'Desi Chicken Karahi 🥘', votes: ['user-abu'] }
    ],
    createdBy: 'user-ammi',
    createdAt: 'Today 2:00 PM'
  },
  {
    id: 'poll-2',
    question: 'Weekend movie night k liye konsi film dekhein?',
    options: [
      { id: 'm-1', text: 'Classic Comedy Drama 😂', votes: ['user-ammi', 'user-abu', 'user-dadi'] },
      { id: 'm-2', text: 'Sci-Fi Adventure 🚀', votes: ['user-hamza', 'user-muneeb'] }
    ],
    createdBy: 'user-hamza',
    createdAt: 'Yesterday'
  }
];

export const INITIAL_EVENTS: FamilyEvent[] = [
  {
    id: 'ev-1',
    title: 'Ammi Jaan Birthday 🎂',
    date: 'September 15',
    type: 'birthday',
    person: 'Ammi Jaan',
    daysRemaining: 7,
  },
  {
    id: 'ev-2',
    title: 'Abu & Ammi Wedding Anniversary 💍',
    date: 'October 3',
    type: 'anniversary',
    person: 'Abu & Ammi',
    daysRemaining: 25,
  },
  {
    id: 'ev-3',
    title: 'Family Autumn Picnic to Khanpur Lake 🛶',
    date: 'September 20',
    type: 'gathering',
    daysRemaining: 12,
  }
];

export const INITIAL_CHECKINS: SafetyCheckIn[] = [
  {
    userId: 'user-ammi',
    userName: 'Ammi Jaan',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    statusText: 'Safe at Home in Lahore 🏡',
    time: '4:10 PM',
    type: 'safe'
  },
  {
    userId: 'user-abu',
    userName: 'Abu Jaan',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    statusText: 'Leaving office, on the way 🚗',
    time: '4:20 PM',
    type: 'traveling'
  },
  {
    userId: 'user-ayesha',
    userName: 'Ayesha',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    statusText: 'In University Library 📚',
    time: '3:45 PM',
    type: 'safe'
  }
];

export const QUICK_FAMILY_PHRASES = [
  "Assalam o Alaikum! ❤️",
  "Khana tayyar hai? 🍲",
  "Kahan pohanchay aap? 🚗",
  "Sab theek hain? Dua mein yaad! 🤲",
  "Video call shuru karein! 📹",
  "Pani pi liya sab ne? 💧",
  "Ghar pohanch kr batana! 🏠"
];
