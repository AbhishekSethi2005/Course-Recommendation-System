import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Cpu, Search, CheckCircle2 } from 'lucide-react';

export default function AIProcessingModal({ isOpen }) {
  const messages = [
    "Understanding your learning interests...",
    "Analyzing your existing skills...",
    "Comparing relevant course content...",
    "Ranking your best matches..."
  ];

  const icons = [Sparkles, Brain, Cpu, Search];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const ActiveIcon = icons[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md p-8 rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl text-center space-y-6 relative overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#8055FF]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Central Animated AI Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8055FF] to-[#6366F1] blur-md opacity-60 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-[#101019] border border-[#8055FF]/50 flex items-center justify-center shadow-glow-md">
            <ActiveIcon className="w-9 h-9 text-[#A78BFA] animate-[spin_6s_linear_infinite]" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold font-heading text-white">
            Finding your perfect courses...
          </h3>
          <p className="text-xs text-[#9694A8]">
            CourseIQ machine learning engine is evaluating 3,416+ courses
          </p>
        </div>

        {/* Rotating Processing Messages with AnimatePresence */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8055FF]/15 border border-[#8055FF]/30 text-xs font-semibold text-[#C4B5FD]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#23D18B] animate-ping" />
              <span>{messages[currentIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pt-2">
          {messages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-[#8055FF]' : 'w-1.5 bg-white/10'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

