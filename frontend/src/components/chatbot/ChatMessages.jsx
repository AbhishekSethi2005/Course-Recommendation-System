import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import SuggestedQuestions from './SuggestedQuestions';

export default function ChatMessages() {
  const { messages, loading } = useChatbot();
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Auto-scroll on new message or typing state change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollBottom(isUp);
    }
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hasMessages = messages && messages.length > 0;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-2 relative scrollbar-thin scrollbar-thumb-white/10"
    >
      {!hasMessages ? (
        <div className="space-y-4 pt-2">
          {/* Welcome Screen Greeting */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8055FF] to-[#6366F1] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-glow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <div className="p-4 rounded-2xl rounded-tl-sm bg-[#101019] border border-white/[0.08] shadow-sm text-xs sm:text-sm text-[#F5F3FF] leading-relaxed space-y-2">
              <p className="font-bold text-white text-sm">
                Hey! I'm your CourseIQ AI Assistant. 👋
              </p>
              <p className="text-[#9694A8]">
                I can help you explore CourseIQ, discover relevant courses, understand technical concepts, and learn something new.
              </p>
              <p className="text-[#C4B5FD] font-medium">
                What would you like to know today?
              </p>
            </div>
          </div>

          {/* Suggested Questions */}
          <SuggestedQuestions />
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {loading && <TypingIndicator />}
        </>
      )}

      <div ref={bottomRef} className="h-1" />

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="sticky bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#8055FF] text-white text-xs font-semibold shadow-lg shadow-black/60 flex items-center gap-1.5 hover:bg-[#8F66FF] transition-all z-10"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Latest Message</span>
        </button>
      )}
    </div>
  );
}

