import React from 'react';
import { useFamily } from '../context/FamilyContext';
import { Phone, Video, PhoneOff, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, acceptIncomingCall, declineIncomingCall } = useFamily();

  if (!incomingCall) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        id="incoming-call-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          id="incoming-call-dialog"
          className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Animated decorative glow */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Caller Avatar with Pulse Ring */}
          <div className="relative mt-2 mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
            <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/40 animate-pulse" />
            <img
              src={incomingCall.from.avatar}
              alt={incomingCall.from.name}
              className="relative w-24 h-24 rounded-full object-cover border-3 border-emerald-400 shadow-xl"
            />
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-1">
            Incoming {incomingCall.isVideo ? 'Video Call' : 'Audio Call'}
          </span>
          <h3 className="text-2xl font-bold text-white mb-1">
            {incomingCall.from.name}
          </h3>
          <p className="text-sm text-neutral-400 mb-8">
            {incomingCall.from.relation} • Family Calling
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-8 w-full">
            {/* Decline */}
            <div className="flex flex-col items-center gap-2">
              <button
                id="btn-decline-call"
                onClick={declineIncomingCall}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-transform"
                title="Decline Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <span className="text-xs font-medium text-neutral-400">Decline</span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-2">
              <button
                id="btn-accept-call"
                onClick={acceptIncomingCall}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 transition-transform animate-bounce"
                title="Answer Video Call"
              >
                <Video className="w-7 h-7" />
              </button>
              <span className="text-xs font-semibold text-emerald-400">Answer</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
