import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, Search, CheckCircle, ArrowRight } from 'lucide-react';
import { useAudio } from '../audio/AudioContext';

export default function HowItWorks() {
  const { playHover } = useAudio();
  const steps = [
    {
      num: "01",
      title: "Share Your Interests",
      description: "Users describe what they want to learn in natural everyday language.",
      icon: FileText,
      accent: "#8055FF"
    },
    {
      num: "02",
      title: "AI Understands Your Profile",
      description: "The system analyzes existing skills and completed courses to avoid repetition.",
      icon: Brain,
      accent: "#A78BFA"
    },
    {
      num: "03",
      title: "Intelligent Course Matching",
      description: "AI evaluates course content, skill relevance, and semantic similarity.",
      icon: Search,
      accent: "#6366F1"
    },
    {
      num: "04",
      title: "Discover Your Best Matches",
      description: "Receive ranked recommendations with transparent relevance and match scores.",
      icon: CheckCircle,
      accent: "#23D18B"
    }
  ];

  return (
    <section id="how-it-works-section" className="py-20 lg:py-28 relative">
      {/* Background accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8055FF]/10 border border-[#8055FF]/25 text-xs font-semibold text-[#A78BFA] mb-4">
            <span>+ HOW IT WORKS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight">
            Discover smarter. Choose better.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#9694A8]">
            A simple process to get personalized course recommendations.
          </p>
        </div>

        {/* 4 Steps Horizontal Cards Grid with Connecting Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative group">
                
                {/* Connecting arrow for desktop between cards */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#8055FF]/40">
                    <ArrowRight className="w-5 h-5 group-hover:text-[#A78BFA] group-hover:translate-x-1 transition-all" />
                  </div>
                )}

                {/* Step Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  onMouseEnter={playHover}
                  className="h-full p-6 sm:p-7 rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#8055FF]/40 transition-all duration-300 shadow-card hover:shadow-card-hover flex flex-col justify-between"
                >
                  <div>
                    {/* Step Top Row: Number Badge and Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8055FF]/20 to-[#6366F1]/10 border border-white/10 flex items-center justify-center text-sm font-bold font-heading text-[#A78BFA]">
                        {step.num}
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#F5F3FF] group-hover:text-[#A78BFA] group-hover:scale-110 transition-all">
                        <Icon className="w-5 h-5" style={{ color: step.accent }} />
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-lg font-bold font-heading text-[#F5F3FF] mb-2.5">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-sm text-[#9694A8] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Step bottom visual indicator */}
                  <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-[#68667A]">
                    <span>Step {step.num} of 04</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.accent }} />
                  </div>
                </motion.div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

