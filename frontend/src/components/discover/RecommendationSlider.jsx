import React from 'react';
import { PRESET_COUNTS } from '../../data/sampleCourses';
import { useAudio } from '../../audio/AudioContext';

export default function RecommendationSlider({ topN, setTopN }) {
  const { playHover, playClick } = useAudio();
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#8055FF]/20 border border-[#8055FF]/40 text-[#A78BFA] text-xs font-bold flex items-center justify-center">
            5
          </div>
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F3FF]">
            Number of Results
          </label>
        </div>

        <div className="px-3 py-1 rounded-full bg-[#8055FF]/15 border border-[#8055FF]/30 text-xs font-semibold text-[#A78BFA]">
          {topN} courses will be recommended.
        </div>
      </div>

      <p className="text-xs text-[#9694A8]">
        Choose how many course recommendations you want.
      </p>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {PRESET_COUNTS.map((count) => {
          const isSelected = topN === count;
          return (
            <button
              key={count}
              type="button"
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                setTopN(count);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-[#8055FF] text-white shadow-glow-sm'
                  : 'bg-[#101019] border border-white/[0.08] text-[#9694A8] hover:text-[#F5F3FF] hover:border-white/20'
              }`}
            >
              {isSelected ? `✓ ${count} Courses` : `${count} Courses`}
            </button>
          );
        })}
      </div>

      {/* Interactive Range Slider with Track Tooltip */}
      <div className="pt-2">
        <div className="relative flex items-center">
          <input
            type="range"
            min="5"
            max="20"
            step="1"
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="w-full h-2 bg-[#101019] rounded-lg appearance-none cursor-pointer accent-[#8055FF]"
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#68667A] mt-1.5 font-medium">
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
        </div>
      </div>
    </div>
  );
}

