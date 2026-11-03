import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Bookmark, Play } from 'lucide-react';

export default function LibraryHeader({ onNavigateDiscover }) {
  return (
    <div className="relative pt-4 pb-8 sm:pb-12 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Copy */}
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8055FF]/15 border border-[#8055FF]/30 text-xs sm:text-sm font-semibold tracking-wide text-[#A78BFA] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
            <span>YOUR PERSONAL COURSE COLLECTION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight leading-[1.15]">
            Your courses.{' '}
            <span className="text-gradient-purple-pink inline-block">
              All in one place.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#9694A8] max-w-xl leading-relaxed">
            Keep your favorite courses organized and revisit your AI-powered discoveries whenever you need them.
          </p>

          <div className="pt-2">
            <button
              onClick={onNavigateDiscover}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] hover:from-[#8F66FF] hover:to-[#7073FA] text-white font-semibold text-sm shadow-glow-sm hover:shadow-glow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Discover More Courses</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Floating Visual Graphic (matching mock screenshot) */}
        <div className="lg:col-span-4 relative hidden lg:flex items-center justify-center">
          <div className="relative w-64 h-48 flex items-center justify-center">
            {/* Ambient Purple glow */}
            <div className="absolute inset-0 bg-[#8055FF]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Back tilted card */}
            <motion.div
              animate={{ rotate: [-6, -4, -6], y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-44 h-28 rounded-2xl bg-[#101019]/90 border border-white/10 shadow-xl backdrop-blur-md -rotate-6 translate-x-2 -translate-y-2 opacity-60"
            />

            {/* Front main floating glass card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-52 h-32 rounded-2xl bg-gradient-to-br from-[#1E1B4B]/80 to-[#101019]/90 border border-[#8055FF]/40 shadow-glow-md backdrop-blur-xl p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                
                {/* Purple Bookmark Ribbon */}
                <div className="w-6 h-8 bg-gradient-to-b from-[#A78BFA] to-[#8055FF] rounded-b-md shadow-md flex items-center justify-center">
                  <Bookmark className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="w-24 h-2 bg-white/20 rounded-full" />
                <div className="w-16 h-2 bg-white/10 rounded-full" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] text-[#A78BFA]">
                <span className="flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-current" /> Saved Collection
                </span>
                <span className="text-white/60">AI Verified</span>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}

