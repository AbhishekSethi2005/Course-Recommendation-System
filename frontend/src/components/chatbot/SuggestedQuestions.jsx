import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';
import { useAudio } from '../../audio/AudioContext';

export default function SuggestedQuestions() {
  const { sendMessage } = useChatbot();
  const { playHover, playSelect } = useAudio();

  const suggestions = [
    "What is CourseIQ?",
    "How does AI recommend courses?",
    "Explain Machine Learning.",
    "What is Generative AI?",
    "How can I find courses for Python?",
    "Explain the difference between AI and ML."
  ];

  const handleSelect = (question) => {
    playSelect();
    sendMessage(question);
  };

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A78BFA] uppercase tracking-wider">
        <Sparkles className="w-3 h-3" />
        <span>Suggested Questions</span>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(q)}
            onMouseEnter={playHover}
            className="w-full text-left p-2.5 rounded-xl bg-[#101019] border border-white/[0.08] hover:border-[#8055FF]/50 hover:bg-[#15151F] text-xs text-[#E2E8F0] hover:text-white transition-all duration-200 flex items-center justify-between group shadow-sm"
          >
            <span className="line-clamp-1">{q}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#68667A] group-hover:text-[#A78BFA] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
}

