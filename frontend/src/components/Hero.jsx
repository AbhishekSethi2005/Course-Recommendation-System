import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  UserCheck, 
  BarChart3, 
  Sliders, 
  Check, 
  Plus, 
  X,
  Search,
  Bookmark,
  Share2,
  ChevronDown
} from 'lucide-react';
import { useAudio } from '../audio/AudioContext';

export default function Hero({ onNavigateDiscover, onScrollHowItWorks }) {
  const { playHover, playClick, playSelect, playDeselect } = useAudio();
  const [heroSkills, setHeroSkills] = useState(['Python', 'JavaScript', 'HTML']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [numRecs, setNumRecs] = useState(8);

  const removeSkill = (skillToRemove) => {
    playDeselect();
    setHeroSkills(heroSkills.filter(s => s !== skillToRemove));
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !heroSkills.includes(newSkillInput.trim())) {
      playSelect();
      setHeroSkills([...heroSkills, newSkillInput.trim()]);
      setNewSkillInput('');
      setShowAddSkill(false);
    }
  };

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    playClick();
    onNavigateDiscover({
      interests: 'Web development, Data science, UI/UX design',
      skills: heroSkills,
      difficulty: difficulty.toLowerCase(),
      top_n: numRecs
    });
  };

  return (
    <section className="relative pt-8 pb-20 lg:pt-14 lg:pb-32 overflow-hidden">
      {/* Background radial glow & subtle grid */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Column: Hero Copy & Value Proposition ── */}
          <motion.div 
            className="lg:col-span-6 xl:col-span-6 space-y-6 lg:space-y-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Small eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8055FF]/10 border border-[#8055FF]/30 text-xs sm:text-sm font-semibold tracking-wide text-[#A78BFA]">
              <span className="w-2 h-2 rounded-full bg-[#8055FF] animate-pulse" />
              <span>✦ AI-POWERED COURSE DISCOVERY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold font-heading text-[#F5F3FF] tracking-tight leading-[1.12]">
              Find courses that{' '}
              <span className="text-gradient-purple-pink inline-block">
                actually match
              </span>{' '}
              your goals.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#9694A8] leading-relaxed max-w-xl">
              Stop wasting time searching through endless courses. Let AI understand your interests, 
              analyze your skills, and discover the courses that are right for you.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => {
                  playClick();
                  onNavigateDiscover();
                }}
                onMouseEnter={playHover}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] text-white font-semibold text-base shadow-glow-md hover:shadow-glow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Discover My Courses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  playClick();
                  onScrollHowItWorks();
                }}
                onMouseEnter={playHover}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#15151F] hover:bg-[#1B1B28] text-[#F5F3FF] font-medium text-base border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-[#A78BFA] fill-[#A78BFA] ml-0.5" />
                </div>
                <span>See How It Works</span>
              </button>
            </div>

            {/* 3 Compact Trust Indicators */}
            <div className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#8055FF]/15 border border-[#8055FF]/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#F5F3FF]">AI-Powered</div>
                  <div className="text-[11px] text-[#9694A8]">Matching</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/30 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-4 h-4 text-[#818CF8]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#F5F3FF]">Personalized</div>
                  <div className="text-[11px] text-[#9694A8]">Results</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#23D18B]/15 border border-[#23D18B]/30 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-[#23D18B]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#F5F3FF]">Intelligent</div>
                  <div className="text-[11px] text-[#9694A8]">Discovery</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Right Column: Floating Product Interface Preview ── */}
          <div className="lg:col-span-6 xl:col-span-6 relative mt-4 lg:mt-0">
            
            {/* Whimsical Handwritten Annotations with Curvy Arrows */}
            {/* Annotation 1: Top Right */}
            <div className="hidden xl:block absolute -top-8 -right-4 z-20 pointer-events-none">
              <div className="flex items-start gap-1">
                <span className="handwriting-note text-lg font-bold rotate-6 inline-block">
                  Tell us your<br />interests and skills
                </span>
                <svg className="w-10 h-10 text-[#A78BFA] -scale-x-100 rotate-45" viewBox="0 0 50 50" fill="none">
                  <path d="M10 10 C 25 15, 35 25, 40 40 M 40 40 L 30 35 M 40 40 L 35 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Annotation 2: Left Middle */}
            <div className="hidden xl:block absolute top-[48%] -left-12 z-20 pointer-events-none">
              <div className="flex items-end gap-1">
                <span className="handwriting-note text-lg font-bold -rotate-6 inline-block max-w-[130px] text-right">
                  Get personalized<br />course recommendations
                </span>
                <svg className="w-12 h-12 text-[#A78BFA] rotate-12" viewBox="0 0 50 50" fill="none">
                  <path d="M10 20 C 20 35, 30 40, 42 42 M 42 42 L 32 38 M 42 42 L 38 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Main Interactive Product Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative z-10 rounded-2xl bg-[#101019]/90 border border-white/[0.1] shadow-2xl backdrop-blur-xl p-5 sm:p-6"
            >
              {/* Product Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold font-heading flex items-center">
                    <span className="text-[#F5F3FF]">Course</span>
                    <span className="text-[#8055FF]">IQ</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#9694A8]">
                  <div className="p-1 rounded bg-white/[0.04] hover:text-white transition-colors cursor-pointer">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1 rounded bg-white/[0.04] hover:text-white transition-colors cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#8055FF]/20 border border-[#8055FF]/40 flex items-center justify-center text-[10px] text-[#A78BFA] font-bold">
                    JD
                  </div>
                </div>
              </div>

              {/* Form inside product window */}
              <form onSubmit={handleHeroSubmit} className="space-y-3.5 text-left">
                {/* Field 1: What do you want to learn? */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
                    What do you want to learn?
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="e.g. Web development, Data science, UI/UX design..."
                      className="w-full bg-[#15151F] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F5F3FF] placeholder-[#9694A8]/60 cursor-pointer focus:outline-none"
                    />
                  </div>
                </div>

                {/* Field 2: Your current skills tags */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
                    Your current skills
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-[#15151F] border border-white/[0.08] min-h-[42px]">
                    {heroSkills.map(skill => (
                      <span 
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#8055FF]/15 border border-[#8055FF]/30 text-xs font-medium text-[#C4B5FD]"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {showAddSkill ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          placeholder="Skill..."
                          autoFocus
                          className="w-20 px-1.5 py-0.5 text-xs bg-black/40 border border-[#8055FF]/50 rounded text-white outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addSkill(e);
                            if (e.key === 'Escape') setShowAddSkill(false);
                          }}
                        />
                        <button
                          type="button"
                          onClick={addSkill}
                          className="text-xs text-[#23D18B] hover:text-white"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddSkill(true)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-[#9694A8] hover:text-white hover:bg-white/[0.05] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add skill</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Field 3: Completed courses */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
                    Completed courses <span className="text-[#68667A] lowercase font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="e.g. Python basics, Machine Learning..."
                    className="w-full bg-[#15151F] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#9694A8] cursor-pointer focus:outline-none"
                  />
                </div>

                {/* Controls Row: Difficulty & Number Slider */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#9694A8] mb-1">
                      Difficulty level
                    </label>
                    <div className="relative">
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full appearance-none bg-[#15151F] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-[#F5F3FF] focus:outline-none cursor-pointer"
                      >
                        <option value="Any level">Any level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#9694A8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#9694A8]">
                        Recommendations
                      </label>
                      <span className="text-xs font-bold text-[#8055FF]">{numRecs}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="15"
                      value={numRecs}
                      onChange={(e) => setNumRecs(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#15151F] rounded-lg appearance-none cursor-pointer accent-[#8055FF]"
                    />
                  </div>
                </div>

                {/* Submit button inside preview */}
                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] hover:from-[#8B60FF] hover:to-[#6F72FA] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-glow-sm transition-all"
                >
                  <span>Find My Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>

            {/* Floating Recommendation Cards Overlapping Below */}
            <div className="relative -mt-6 sm:-mt-8 z-20 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 px-2">
              
              {/* Card 1: Machine Learning */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                onMouseEnter={playHover}
                className="p-3 rounded-xl bg-[#15151F]/95 border border-white/[0.1] shadow-xl backdrop-blur-md hover:border-[#8055FF]/40 transition-all cursor-pointer"
                onClick={() => {
                  playClick();
                  onNavigateDiscover({ interests: 'Machine Learning Specialization' });
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#23D18B]/15 text-[#23D18B] border border-[#23D18B]/30">
                    95% Match
                  </span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-[#8055FF]/20 text-[#A78BFA] font-bold">
                    AI
                  </span>
                </div>
                <div className="text-xs font-bold text-[#F5F3FF] line-clamp-1 mb-1">
                  Machine Learning Specialization
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#9694A8]">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Google
                  </span>
                  <span>Inter. • 3 Mos</span>
                </div>
              </motion.div>

              {/* Card 2: Full Stack Web Dev */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                onMouseEnter={playHover}
                className="p-3 rounded-xl bg-[#15151F]/95 border border-[#8055FF]/30 shadow-xl backdrop-blur-md hover:border-[#8055FF]/60 transition-all cursor-pointer ring-1 ring-[#8055FF]/20"
                onClick={() => {
                  playClick();
                  onNavigateDiscover({ interests: 'Full Stack Web Development' });
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#23D18B]/15 text-[#23D18B] border border-[#23D18B]/30">
                    92% Match
                  </span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-[#8055FF]/20 text-[#A78BFA] font-bold">
                    AI
                  </span>
                </div>
                <div className="text-xs font-bold text-[#F5F3FF] line-clamp-1 mb-1">
                  Full Stack Web Development
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#9694A8]">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Udemy
                  </span>
                  <span>Beginner • 4 Mos</span>
                </div>
              </motion.div>

              {/* Card 3: Data Science with Python */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                onMouseEnter={playHover}
                className="p-3 rounded-xl bg-[#15151F]/95 border border-white/[0.1] shadow-xl backdrop-blur-md hover:border-[#8055FF]/40 transition-all cursor-pointer"
                onClick={() => {
                  playClick();
                  onNavigateDiscover({ interests: 'Data Science with Python' });
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#23D18B]/15 text-[#23D18B] border border-[#23D18B]/30">
                    88% Match
                  </span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-[#8055FF]/20 text-[#A78BFA] font-bold">
                    AI
                  </span>
                </div>
                <div className="text-xs font-bold text-[#F5F3FF] line-clamp-1 mb-1">
                  Data Science with Python
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#9694A8]">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Coursera
                  </span>
                  <span>Inter. • 6 Mos</span>
                </div>
              </motion.div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

