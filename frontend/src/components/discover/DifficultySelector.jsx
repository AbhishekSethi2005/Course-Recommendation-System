import React from 'react';
import { BarChart2, Compass, Layers, Rocket } from 'lucide-react';
import { DIFFICULTY_OPTIONS } from '../../data/sampleCourses';
import { useAudio } from '../../audio/AudioContext';

export default function DifficultySelector({ difficulty, setDifficulty }) {
  const { playHover, playSelect } = useAudio();
  const iconMap = {
    any: BarChart2,
    beginner: Compass,
    intermediate: Layers,
    advanced: Rocket
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#8055FF]/20 border border-[#8055FF]/40 text-[#A78BFA] text-xs font-bold flex items-center justify-center">
          4
        </div>
        <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F3FF]">
          Difficulty Level
        </label>
      </div>

      <p className="text-xs text-[#9694A8]">
        Choose the level of courses you prefer.
      </p>

      {/* 4 Clickable Segmented Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DIFFICULTY_OPTIONS.map((opt) => {
          const isSelected = difficulty.toLowerCase() === opt.id.toLowerCase();
          const Icon = iconMap[opt.id] || BarChart2;

          return (
            <button
              key={opt.id}
              type="button"
              onMouseEnter={playHover}
              onClick={() => {
                playSelect();
                setDifficulty(opt.id);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[#8055FF]/20 border-[#8055FF] shadow-glow-sm ring-1 ring-[#8055FF]/50'
                  : 'bg-[#101019] border-white/[0.08] hover:border-white/20 hover:bg-[#15151F]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#8055FF]/30 text-[#C4B5FD]' : 'bg-white/[0.04] text-[#9694A8] group-hover:text-white'}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#23D18B] shadow-sm" />
                  )}
                </div>

                <div className={`text-xs sm:text-sm font-bold font-heading mb-1 ${isSelected ? 'text-white' : 'text-[#F5F3FF]'}`}>
                  {opt.label}
                </div>

                <p className="text-[11px] text-[#9694A8] leading-snug">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

