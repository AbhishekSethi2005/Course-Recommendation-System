import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';
import { useAudio } from '../../audio/AudioContext';

export default function ClearConfirmModal() {
  const { showClearConfirm, setShowClearConfirm, clearConversation } = useChatbot();
  const { playClick, playHover } = useAudio();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showClearConfirm) {
        setShowClearConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showClearConfirm, setShowClearConfirm]);

  if (!showClearConfirm) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-dialog-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-[#15151F] border border-white/10 p-5 shadow-2xl relative text-left">
        <button
          onClick={() => {
            playClick();
            setShowClearConfirm(false);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close confirmation"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 id="clear-dialog-title" className="text-sm font-semibold text-white">
              Start a new conversation?
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              This will clear your current chat messages and reset the learning session. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onMouseEnter={playHover}
            onClick={() => {
              playClick();
              setShowClearConfirm(false);
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onMouseEnter={playHover}
            onClick={() => {
              clearConversation();
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-lg shadow-sm transition-all"
          >
            Clear &amp; Start New
          </button>
        </div>
      </div>
    </div>
  );
}

