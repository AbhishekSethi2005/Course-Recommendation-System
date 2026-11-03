import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAudio } from '../audio/AudioContext';

export default function FinalCTA({ onNavigateDiscover }) {
  const { playHover, playClick } = useAudio();
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full-width container with rich ambient purple glow */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1A1535] via-[#121124] to-[#0D0D18] border border-[#8055FF]/30 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl text-center">
          
          {/* Ambient Lighting Circles */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8055FF]/25 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-[#6366F1]/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            {/* Small icon badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8055FF]/20 border border-[#8055FF]/40 text-xs font-semibold text-[#C4B5FD]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligent Discovery Engine</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight leading-tight">
              Ready to discover your <span className="text-gradient-purple-pink">perfect courses?</span>
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#9694A8] max-w-2xl mx-auto leading-relaxed">
              Join thousands of learners who are finding better courses with CourseIQ. 
              Let AI simplify your course discovery experience and make smarter learning decisions.
            </p>

            {/* Primary Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  playClick();
                  onNavigateDiscover();
                }}
                onMouseEnter={playHover}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] hover:from-[#8E63FF] hover:to-[#7275FA] text-white font-bold text-base shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Secondary microcopy */}
            <p className="text-xs text-[#68667A] pt-2">
              Smarter discovery starts here. No credit card required.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

