import React, { useRef, useEffect } from 'react';
import { ArrowUp, CornerDownLeft, Sparkles } from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';
import { useAudio } from '../../audio/AudioContext';

export default function ChatInput() {
  const { inputDraft, setInputDraft, sendMessage, loading } = useChatbot();
  const { playHover, playClick } = useAudio();
  const textareaRef = useRef(null);

  const maxLength = 2000;

  // Auto-resize textarea based on input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputDraft]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = inputDraft.trim();
    if (!trimmed || loading) return;
    sendMessage(trimmed);
  };

  const isTooLong = inputDraft.length > maxLength;
  const isNearLimit = inputDraft.length > maxLength * 0.8;

  return (
    <div className="p-3 border-t border-white/[0.08] bg-[#101019]/90 rounded-b-3xl">
      <div className="relative rounded-2xl bg-[#15151F] border border-white/10 focus-within:border-[#8055FF]/60 transition-colors p-2 shadow-inner">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputDraft}
          disabled={loading}
          onChange={(e) => setInputDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about CourseIQ or learning..."
          className="w-full bg-transparent px-2.5 py-1 text-xs sm:text-sm text-[#F5F3FF] placeholder-[#68667A] outline-none resize-none max-h-28 overflow-y-auto leading-relaxed scrollbar-none"
        />

        {/* Input Bar Controls Footer */}
        <div className="flex items-center justify-between pt-1 px-1 text-[10px] text-[#68667A]">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-[#9694A8] border border-white/[0.08]">Enter</kbd> to send
            </span>
            {isNearLimit && (
              <span className={isTooLong ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                {inputDraft.length}/{maxLength}
              </span>
            )}
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            onMouseEnter={playHover}
            disabled={!inputDraft.trim() || loading || isTooLong}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8055FF] to-[#6366F1] hover:from-[#8F66FF] hover:to-[#7275FA] disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-all shadow-sm flex-shrink-0"
            title="Send Message"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isTooLong && (
        <p className="text-[10px] text-rose-400 mt-1.5 px-2">
          Message exceeds maximum length of {maxLength} characters. Please shorten it.
        </p>
      )}
    </div>
  );
}

