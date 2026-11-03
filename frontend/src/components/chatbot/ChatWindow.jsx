import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatbot } from '../../context/ChatbotContext';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ClearConfirmModal from './ClearConfirmModal';

export default function ChatWindow() {
  const { isOpen, isMinimized } = useChatbot();

  return (
    <AnimatePresence>
      {isOpen && !isMinimized && (
        <motion.div
          key="courseiq-chat-window"
          initial={{ opacity: 0, y: 25, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-50 inset-x-3 bottom-24 top-20 sm:top-auto sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[420px] sm:h-[620px] sm:max-h-[82vh] flex flex-col bg-[#0F0F18]/95 backdrop-blur-2xl border border-white/[0.12] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_rgba(128,85,255,0.18)] overflow-hidden"
          role="region"
          aria-label="CourseIQ AI Assistant Chat"
        >
          {/* Header */}
          <ChatHeader />

          {/* Messages & Welcome Flow */}
          <ChatMessages />

          {/* Interactive Input Bar */}
          <ChatInput />

          {/* Clear Confirmation Modal */}
          <ClearConfirmModal />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

