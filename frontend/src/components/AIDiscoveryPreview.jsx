import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Plus, 
  X, 
  Check, 
  BookOpen, 
  GraduationCap, 
  Star, 
  LineChart, 
  Search, 
  Cpu, 
  ChevronDown 
} from 'lucide-react';
import { useAudio } from '../audio/AudioContext';

export default function AIDiscoveryPreview({ onNavigateDiscover }) {
  const { playHover, playClick, playSelect, playDeselect } = useAudio();
  const [interests, setInterests] = useState('Web development, AI, cloud computing...');
  const [skills, setSkills] = useState(['Python', 'JavaScript', 'Problem Solving']);
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [completedCourses, setCompletedCourses] = useState('Python basics, Data structures...');
  const [difficulty, setDifficulty] = useState('Any level');
  const [recommendationsCount, setRecommendationsCount] = useState(8);

  const removeSkill = (skillToRemove) => {
    playDeselect();
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      playSelect();
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    playClick();
    onNavigateDiscover({
      interests: interests,
      skills: skills,
      completed_courses: completedCourses,
      difficulty: difficulty.toLowerCase(),
      top_n: recommendationsCount
    });
  };

  return (
    <section id="preview-section" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Eyebrow and Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8055FF]/10 border border-[#8055FF]/25 text-xs font-semibold text-[#A78BFA] mb-4">
            <span>+ TRY IT NOW</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight leading-tight">
            Your interests. Our intelligence.<br />
            <span className="text-gradient-purple-pink">Better recommendations.</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#9694A8] leading-relaxed">
            Tell us what you want to learn. CourseIQ analyzes your preferences and discovers 
            relevant courses from its course database.
          </p>
        </div>

        {/* Interactive Discovery Preview Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Visual Concept Box with Node System */}
          <div className="lg:col-span-5 h-full flex flex-col justify-between p-7 sm:p-8 rounded-2xl bg-gradient-to-br from-[#15151F] via-[#101019] to-[#0D0D14] border border-white/[0.08] shadow-card relative overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8055FF]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header snippet */}
            <div className="relative z-10 flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8055FF] to-[#6366F1] p-[1px] flex-shrink-0 shadow-glow-sm">
                <div className="w-full h-full bg-[#0D0D14] rounded-[11px] flex items-center justify-center">
                  <Search className="w-6 h-6 text-[#A78BFA]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-[#F5F3FF]">
                  Discover courses tailored
                </h3>
                <p className="text-sm text-[#9694A8]">
                  to your unique profile & learning pace
                </p>
              </div>
            </div>

            {/* Interactive Connected Nodes Diagram */}
            <div className="relative z-10 my-6 py-6 flex items-center justify-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Orbit Rings */}
                <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-white/[0.06]" />

                {/* Center Node (AI Core) */}
                <motion.div 
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8055FF] to-[#6366F1] p-0.5 shadow-glow-md flex items-center justify-center relative z-20"
                >
                  <div className="w-full h-full bg-[#0E0E17] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-[#C084FC]" />
                  </div>
                </motion.div>

                {/* Orbiting Satellite Node 1: Book */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-2 left-10 p-2.5 rounded-xl bg-[#1B1B28] border border-[#8055FF]/40 text-[#A78BFA] shadow-lg"
                >
                  <BookOpen className="w-5 h-5" />
                </motion.div>

                {/* Orbiting Satellite Node 2: Star (Rating) */}
                <motion.div 
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-4 right-10 p-2.5 rounded-xl bg-[#1B1B28] border border-amber-500/40 text-amber-400 shadow-lg"
                >
                  <Star className="w-5 h-5" />
                </motion.div>

                {/* Orbiting Satellite Node 3: Analytics */}
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-4 left-10 p-2.5 rounded-xl bg-[#1B1B28] border border-[#23D18B]/40 text-[#23D18B] shadow-lg"
                >
                  <LineChart className="w-5 h-5" />
                </motion.div>

                {/* Orbiting Satellite Node 4: Graduation Cap */}
                <motion.div 
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute bottom-6 right-10 p-2.5 rounded-xl bg-[#1B1B28] border border-cyan-400/40 text-cyan-400 shadow-lg"
                >
                  <GraduationCap className="w-5 h-5" />
                </motion.div>
              </div>
            </div>

            {/* Bottom info quote */}
            <div className="relative z-10 pt-4 border-t border-white/[0.06] text-xs text-[#9694A8] flex items-center justify-between">
              <span>Dynamic TF-IDF + Skill Overlap Engine</span>
              <span className="text-[#23D18B] font-medium">3,400+ indexed courses</span>
            </div>
          </div>

          {/* Right: The Interactive Preview Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#15151F] border border-white/[0.1] shadow-2xl p-6 sm:p-8 relative">
              
              {/* Badge Top Right */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/[0.08]">
                <div className="text-sm font-bold font-heading text-[#F5F3FF]">
                  Recommendation Playground
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8055FF]/15 border border-[#8055FF]/30 text-xs font-semibold text-[#A78BFA]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Powered by AI Smart Matching</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. What do you want to learn? */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
                    What do you want to learn?
                  </label>
                  <textarea
                    rows="2"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="Describe what topics, domains, or skills you want to learn..."
                    className="w-full bg-[#101019] border border-white/[0.08] focus:border-[#8055FF] rounded-xl p-3 text-sm text-[#F5F3FF] placeholder-[#9694A8]/60 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* 2. Your current skills */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
                    Your current skills
                  </label>
                  <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[#101019] border border-white/[0.08] focus-within:border-[#8055FF] min-h-[48px] transition-colors">
                    {skills.map(skill => (
                      <span 
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#8055FF]/20 border border-[#8055FF]/35 text-xs font-medium text-[#C4B5FD]"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}

                    {showAddSkill ? (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="e.g. Docker"
                          autoFocus
                          className="w-24 px-2 py-0.5 text-xs bg-black/40 border border-[#8055FF]/50 rounded-lg text-white outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddSkill(e);
                            if (e.key === 'Escape') setShowAddSkill(false);
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="text-xs text-[#23D18B] hover:text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddSkill(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[#9694A8] hover:text-white hover:bg-white/[0.05] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add skill</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Completed courses */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
                    Completed courses <span className="text-[#68667A] lowercase font-normal">(optional — excluded from results)</span>
                  </label>
                  <input
                    type="text"
                    value={completedCourses}
                    onChange={(e) => setCompletedCourses(e.target.value)}
                    placeholder="e.g. Python for Everybody, CS50..."
                    className="w-full bg-[#101019] border border-white/[0.08] focus:border-[#8055FF] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F3FF] placeholder-[#9694A8]/60 focus:outline-none transition-colors"
                  />
                </div>

                {/* 4. Controls: Difficulty & Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#9694A8] mb-1.5">
                      Difficulty level
                    </label>
                    <div className="relative">
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full appearance-none bg-[#101019] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F3FF] focus:outline-none focus:border-[#8055FF] cursor-pointer"
                      >
                        <option value="Any level">Any level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#9694A8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#9694A8]">
                        Number of recommendations
                      </label>
                      <span className="text-sm font-bold text-[#8055FF] font-heading">{recommendationsCount}</span>
                    </div>
                    <div className="pt-2">
                      <input
                        type="range"
                        min="5"
                        max="20"
                        value={recommendationsCount}
                        onChange={(e) => setRecommendationsCount(Number(e.target.value))}
                        className="w-full h-2 bg-[#101019] rounded-lg appearance-none cursor-pointer accent-[#8055FF]"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Submit CTA Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] hover:from-[#8B60FF] hover:to-[#6F72FA] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow-md transition-all active:scale-[0.99]"
                  >
                    <span>Find My Courses</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-[#68667A] mt-2">
                    Takes your input and navigates directly to the CourseIQ Discover page
                  </p>
                </div>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

