import React, { useState } from 'react';
import { Search, Info, X, Check, ArrowRight } from 'lucide-react';
import { ALL_SKILL_SUGGESTIONS, INITIAL_POPULAR_SKILLS } from '../../data/sampleCourses';
import { useAudio } from '../../audio/AudioContext';

export default function SkillsSection({ skills, setSkills }) {
  const { playHover, playClick, playSelect, playDeselect } = useAudio();
  const [skillInput, setSkillInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const addSkill = (val) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    const exists = skills.some(s => s.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      playSelect();
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    playDeselect();
    setSkills(skills.filter(s => s.toLowerCase() !== skillToRemove.toLowerCase()));
  };

  const toggleSkill = (skill) => {
    const exists = skills.some(s => s.toLowerCase() === skill.toLowerCase());
    if (exists) {
      removeSkill(skill);
    } else {
      addSkill(skill);
    }
  };

  return (
    <div className="space-y-3">
      {/* Label Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#8055FF]/20 border border-[#8055FF]/40 text-[#A78BFA] text-xs font-bold flex items-center justify-center">
            2
          </div>
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F3FF]">
            Your Current Skills
          </label>
          <div className="group relative cursor-pointer text-[#68667A] hover:text-[#9694A8]">
            <Info className="w-3.5 h-3.5" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-52 p-2 bg-[#1B1B28] border border-white/10 rounded-lg text-[11px] text-[#9694A8] shadow-xl z-20 pointer-events-none">
              Adding your existing skills helps CourseIQ recommend courses with the right prerequisite coverage.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8055FF] hover:text-[#A78BFA] transition-colors"
        >
          <span>View All (20+)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-[#9694A8]">
        Select skills you already have or add your own.
      </p>

      {/* Search & Tag Input Box */}
      <div className="p-2.5 rounded-xl bg-[#101019] border border-white/[0.08] focus-within:border-[#8055FF] transition-colors space-y-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#68667A] absolute left-2.5" />
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
                e.preventDefault();
                addSkill(skillInput.replace(',', ''));
              }
            }}
            placeholder="Type a skill and press Enter..."
            className="w-full bg-transparent pl-8 pr-3 py-1.5 text-xs sm:text-sm text-[#F5F3FF] placeholder-[#68667A] outline-none"
          />
        </div>

        {/* Selected skills as removable chips */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/[0.04]">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#8055FF]/20 border border-[#8055FF]/40 text-xs font-medium text-[#C4B5FD]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-[#A78BFA] hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Row of Popular Skills */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <span className="text-[11px] text-[#68667A] font-medium">Popular skills:</span>
        {INITIAL_POPULAR_SKILLS.map((sk) => {
          const isSelected = skills.some(s => s.toLowerCase() === sk.toLowerCase());
          return (
            <button
              key={sk}
              type="button"
              onClick={() => toggleSkill(sk)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                isSelected
                  ? 'bg-[#8055FF]/25 border border-[#8055FF] text-white'
                  : 'bg-[#15151F] border border-white/[0.08] text-[#9694A8] hover:text-[#F5F3FF] hover:border-white/20'
              }`}
            >
              {isSelected ? `✓ ${sk}` : `+ ${sk}`}
            </button>
          );
        })}
      </div>

      {/* View All (20+) Skills Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-xl max-h-[80vh] overflow-y-auto p-6 rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Common Technical Skills
                </h3>
                <p className="text-xs text-[#9694A8] mt-0.5">
                  Select all skills you currently possess.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.04] text-[#9694A8] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 py-2">
              {ALL_SKILL_SUGGESTIONS.map((sk) => {
                const isSelected = skills.some(s => s.toLowerCase() === sk.toLowerCase());
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#8055FF]/25 border border-[#8055FF] text-white shadow-glow-sm'
                        : 'bg-[#101019] border border-white/[0.08] text-[#9694A8] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{sk}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#23D18B]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] text-white text-xs font-semibold shadow-glow-sm"
              >
                Done ({skills.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

