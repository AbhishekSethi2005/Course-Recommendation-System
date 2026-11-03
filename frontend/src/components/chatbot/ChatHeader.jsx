import React from 'react';
import { Sparkles, Minus, X, RotateCcw, Bot } from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';
import { useAudio } from '../../audio/AudioContext';

export default function ChatHeader() {
  const { closeChat, minimizeChat, setShowClearConfirm } = useChatbot();
  const { playHover, playClick } = useAudio();

  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-[#101019]/80 backdrop-blur-md rounded-t-3xl">
      {/* Left: Avatar & Assistant Info */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8055FF] via-[#6366F1] to-[#A78BFA] p-[1px] shadow-glow-sm">
          <div className="w-full h-full bg-[#0E0E17] rounded-[11px] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold font-heading text-white tracking-tight">
              CourseIQ Assistant
            </h3>
            <span className="w-1.5 h-1.5 rounded-full bg-[#23D18B] animate-pulse" />
          </div>
          <p className="text-[10px] text-[#9694A8]">
            Your AI-powered learning companion
          </p>
        </div>
      </div>

      {/* Right Actions: New Chat, Minimize, Close */}
      <div className="flex items-center gap-1 text-[#9694A8]">
        {/* New / Clear Chat Button */}
        <button
          type="button"
          onClick={() => {
            playClick();
            setShowClearConfirm(true);
          }}
          onMouseEnter={playHover}
          title="New Conversation / Clear Chat"
          className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Minimize Button */}
        <button
          type="button"
          onClick={() => {
            playClick();
            minimizeChat();
          }}
          onMouseEnter={playHover}
          title="Minimize Chat"
          className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            playClick();
            closeChat();
          }}
          onMouseEnter={playHover}
          title="Close Chat"
          className="p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-rose-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

