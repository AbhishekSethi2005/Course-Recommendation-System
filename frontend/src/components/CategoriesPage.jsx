import React, { useState } from 'react';
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
  ArrowRight,
  Search,
  BookOpen
} from 'lucide-react';
import { CATEGORIES } from '../data/sampleCourses';
import { useAudio } from '../audio/AudioContext';

export default function CategoriesPage({ onSelectCategory }) {
  const { playHover, playClick } = useAudio();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filtered = CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="py-10 sm:py-16 relative z-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8055FF]/10 border border-[#8055FF]/25 text-xs font-semibold text-[#A78BFA] mb-4">
            <span>DISCOVER DOMAINS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight">
            Explore All Categories
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#9694A8]">
            Select a specialized category to launch tailored course recommendations instantly.
          </p>

          {/* Search bar inside categories */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#9694A8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by keyword (e.g. Python, Cloud, Security)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#15151F] border border-white/[0.08] focus:border-[#8055FF] text-sm text-white placeholder-[#68667A] outline-none"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((cat, idx) => {
            const Icon = iconMap[cat.id] || Brain;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onMouseEnter={playHover}
                onClick={() => {
                  playClick();
                  onSelectCategory(cat);
                }}
                className="cursor-pointer p-6 rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#8055FF]/50 transition-all duration-300 shadow-card hover:shadow-card-hover group flex flex-col justify-between"
              >
                <div>
                  <div 
                    className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15`, border: `1px solid ${cat.color}35` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>

                  <h3 className="text-base font-bold font-heading text-[#F5F3FF] mb-2 group-hover:text-[#A78BFA] transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9694A8] leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cat.skills.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-[#101019] text-[#9694A8] border border-white/[0.05]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                  <span className="text-xs text-[#68667A]">
                    {cat.coursesCount}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8055FF] group-hover:text-[#A78BFA]">
                    <span>Find Courses</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

