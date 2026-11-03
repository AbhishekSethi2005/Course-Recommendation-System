import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Bot, X } from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';
import { useAudio } from '../../audio/AudioContext';

export default function ChatbotLauncher() {
  const { isOpen, isMinimized, toggleChat, restoreChat } = useChatbot();
  const { playHover } = useAudio();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (isMinimized) {
      restoreChat();
    } else {
      toggleChat();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center">
      {/* Tooltip on Hover */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mr-3 px-3.5 py-1.5 rounded-xl bg-[#15151F] border border-[#8055FF]/40 text-xs font-semibold text-white shadow-xl shadow-black/60 pointer-events-none whitespace-nowrap flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Chat with CourseIQ AI</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Launcher Button */}
      <motion.button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => {
          setShowTooltip(true);
          playHover();
        }}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle CourseIQ AI Assistant"
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#8055FF] via-[#7445F8] to-[#6366F1] text-white p-0.5 shadow-glow-md hover:shadow-glow-lg transition-shadow duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#8055FF]/60"
      >
        <div className="w-full h-full rounded-full bg-[#0E0E1A] flex items-center justify-center hover:bg-transparent transition-colors duration-300">
          <AnimatePresence mode="wait">
            {isOpen && !isMinimized ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center relative"
              >
                <Sparkles className="w-6 h-6 text-[#C4B5FD] drop-shadow-sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Online Badge Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#23D18B] border-2 border-[#09090F] shadow-sm animate-pulse" />
      </motion.button>
    </div>
  );
}

