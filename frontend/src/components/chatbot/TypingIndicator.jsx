import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0, opacity: 0.4 },
    animate: { y: -4, opacity: 1 }
  };

  return (
    <div className="flex items-start gap-2.5 my-2 animate-fadeIn">
      {/* Bot Icon */}
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8055FF]/20 to-[#6366F1]/20 border border-[#8055FF]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-[#C4B5FD]" />
      </div>

      {/* Bubble with bouncing dots */}
      <div className="p-3 rounded-2xl rounded-tl-sm bg-[#101019] border border-white/[0.08] shadow-sm flex items-center gap-3">
        <span className="text-xs text-[#9694A8] font-medium">
          CourseIQ Assistant is thinking...
        </span>

        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.15,
                ease: 'easeInOut'
              }}
              className="w-1.5 h-1.5 rounded-full bg-[#8055FF]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

