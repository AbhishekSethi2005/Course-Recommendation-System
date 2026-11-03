import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DiscoverHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
      {/* Small eyebrow label */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8055FF]/10 border border-[#8055FF]/30 text-xs sm:text-sm font-semibold tracking-wide text-[#A78BFA] mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
        <span>PERSONALIZED AI COURSE DISCOVERY</span>
      </div>

      {/* Main heading */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight leading-[1.15]">
        Discover courses that{' '}
        <span className="text-gradient-purple-pink inline-block">
          match your ambition.
        </span>
      </h1>

      {/* Supporting description */}
      <p className="mt-4 text-base sm:text-lg text-[#9694A8] max-w-2xl mx-auto leading-relaxed">
        Tell us what you want to learn, share the skills you already have, and let our AI find the courses that fit your goals.
      </p>

      {/* Status indicator */}
      <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15151F] border border-white/[0.08] text-xs text-[#9694A8]">
        <span className="w-2 h-2 rounded-full bg-[#23D18B] animate-pulse" />
        <span className="font-medium text-[#F5F3FF]">AI-powered recommendations</span>
      </div>
    </div>
  );
}

