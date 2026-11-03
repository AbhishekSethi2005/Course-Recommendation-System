import React, { useState } from 'react';
import { Sparkles, User, Copy, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { useChatbot } from '../../context/ChatbotContext';
import { useAudio } from '../../audio/AudioContext';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const { retryMessage } = useChatbot();
  const { playClick } = useAudio();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    playClick();
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRetry = () => {
    playClick();
    if (message.failedUserText) {
      retryMessage(message.failedUserText);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end my-3 pl-8">
        <div className="max-w-[85%] space-y-1 text-right">
          <div className="p-3.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#8055FF]/30 to-[#6366F1]/30 border border-[#8055FF]/40 text-white text-xs sm:text-sm leading-relaxed shadow-sm">
            {message.content}
          </div>
          <span className="text-[10px] text-[#68667A] pr-1 block">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  // Assistant / Error Message
  return (
    <div className="flex items-start gap-2.5 my-3 pr-4 group">
      {/* Bot Icon */}
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8055FF] via-[#6366F1] to-[#A78BFA] p-[1px] flex-shrink-0 mt-1 shadow-sm">
        <div className="w-full h-full bg-[#0E0E17] rounded-[7px] flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
        </div>
      </div>

      <div className="flex-1 space-y-1.5 overflow-hidden">
        {/* Message Bubble */}
        <div className={`p-4 rounded-2xl rounded-tl-sm border shadow-sm ${
          isError 
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
            : 'bg-[#101019] border-white/[0.08] text-[#F5F3FF]'
        }`}>
          {isError ? (
            <div className="flex items-start gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p>{message.content}</p>
                {message.failedUserText && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry Question</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Message Metadata & Copy Action */}
        {!isError && (
          <div className="flex items-center justify-between text-[10px] text-[#68667A] px-1">
            <span>{message.timestamp}</span>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 hover:text-[#A78BFA] transition-colors p-1"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#23D18B]" />
                  <span className="text-[#23D18B]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

