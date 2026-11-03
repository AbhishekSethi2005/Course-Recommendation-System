import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Database, 
  Code, 
  Terminal, 
  Cloud, 
  ShieldCheck, 
  Server, 
  Briefcase, 
  ArrowRight 
} from 'lucide-react';
import { CATEGORIES } from '../data/sampleCourses';
import { useAudio } from '../audio/AudioContext';

export default function ExploreCategories({ onSelectCategory, onNavigateAllCategories }) {
  const { playHover, playClick } = useAudio();
  const iconMap = {
    'ai-ml': Brain,
    'data-science': Database,
    'web-dev': Code,
    'software-eng': Terminal,
    'cloud-devops': Cloud,
    'cybersecurity': ShieldCheck,
    'database': Server,
    'business': Briefcase,
  };

  return (
    <section id="categories-section" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with View All action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8055FF]/10 border border-[#8055FF]/25 text-xs font-semibold text-[#A78BFA] mb-4">
              <span>+ POPULAR CATEGORIES</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight">
              Explore Popular Categories
            </h2>

            <p className="mt-3 text-base sm:text-lg text-[#9694A8]">
              Find courses across various domains and discover new opportunities.
            </p>
          </div>

          <button
            onClick={() => {
              playClick();
              onNavigateAllCategories();
            }}
            onMouseEnter={playHover}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#15151F] hover:bg-[#1B1B28] text-sm font-semibold text-[#F5F3FF] border border-white/10 hover:border-[#8055FF]/40 transition-all self-start md:self-auto group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 8 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, idx) => {
            const Icon = iconMap[cat.id] || Brain;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                onMouseEnter={playHover}
                onClick={() => {
                  playClick();
                  onSelectCategory(cat);
                }}
                className="cursor-pointer p-6 rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#8055FF]/40 transition-all duration-300 shadow-card hover:shadow-card-hover group flex flex-col justify-between"
              >
                <div>
                  {/* Category Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}35` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-base font-bold font-heading text-[#F5F3FF] mb-2 group-hover:text-[#A78BFA] transition-colors">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#9694A8] leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom link & count */}
                <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="text-xs text-[#68667A]">
                    {cat.coursesCount}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8055FF] group-hover:text-[#A78BFA]">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

