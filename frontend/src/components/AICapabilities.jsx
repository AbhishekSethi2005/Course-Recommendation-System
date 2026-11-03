import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Layers, FileSearch, HelpCircle } from 'lucide-react';
import { useAudio } from '../audio/AudioContext';

export default function AICapabilities() {
  const { playHover } = useAudio();
  const capabilities = [
    {
      card: "CARD 01",
      title: "Semantic Understanding",
      description: "Understand natural-language learning interests beyond simple keyword matching using TF-IDF vectorization.",
      icon: MessageSquareText,
      gradient: "from-[#8055FF]/20 to-[#6366F1]/10",
      accent: "#8055FF",
      tag: "Natural Language"
    },
    {
      card: "CARD 02",
      title: "Skill-Based Matching",
      description: "Compare your current skills with individual course curriculum to find the ideal learning progression.",
      icon: Layers,
      gradient: "from-[#6366F1]/20 to-[#A78BFA]/10",
      accent: "#6366F1",
      tag: "Jaccard Overlap"
    },
    {
      card: "CARD 03",
      title: "Content Relevance Analysis",
      description: "Analyze course descriptions, topics, and syllabus modules to identify high-accuracy thematic matches.",
      icon: FileSearch,
      gradient: "from-[#23D18B]/20 to-[#06B6D4]/10",
      accent: "#23D18B",
      tag: "Cosine Metric"
    },
    {
      card: "CARD 04",
      title: "Explainable AI Recommendations",
      description: "Transparent match metrics show content relevance score, skill overlap percentage, and student rating boost.",
      icon: HelpCircle,
      gradient: "from-[#EC4899]/20 to-[#8055FF]/10",
      accent: "#EC4899",
      tag: "Transparent Scoring"
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8055FF]/10 border border-[#8055FF]/25 text-xs font-semibold text-[#A78BFA] mb-4">
            <span>+ AI CAPABILITIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight">
            More intelligence. Less searching.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#9694A8]">
            Designed to bridge your ambitions with the most relevant learning material without fluff or filler.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                onMouseEnter={playHover}
                className="p-6 sm:p-7 rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#8055FF]/50 transition-all duration-300 shadow-card hover:shadow-card-hover flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header with Icon and Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${cap.accent}20, transparent)` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: cap.accent }} />
                    </div>

                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#9694A8]">
                      {cap.tag}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg font-bold font-heading text-[#F5F3FF] mb-2.5 group-hover:text-white transition-colors">
                    {cap.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm text-[#9694A8] leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                {/* Bottom label */}
                <div className="mt-6 pt-4 border-t border-white/[0.05] text-[11px] text-[#68667A] uppercase tracking-wider font-semibold">
                  {cap.card}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

