import React, { useState } from 'react';
import { Sparkles, Info, Check, ArrowRight, X, Brain, Code, Terminal, Database, Cloud } from 'lucide-react';
import { INTEREST_CATEGORIES, INITIAL_INTEREST_SUGGESTIONS } from '../../data/sampleCourses';
import { useAudio } from '../../audio/AudioContext';

export default function InterestsSection({ 
  interests, 
  setInterests, 
  selectedInterestChips, 
  setSelectedInterestChips 
}) {
  const { playHover, playClick, playSelect, playDeselect } = useAudio();
  const [modalOpen, setModalOpen] = useState(false);
  const maxChars = 500;

  const toggleInterestChip = (topic) => {
    const isSelected = selectedInterestChips.includes(topic);
    if (isSelected) {
      playDeselect();
      setSelectedInterestChips(selectedInterestChips.filter(t => t !== topic));
    } else {
      playSelect();
      setSelectedInterestChips([...selectedInterestChips, topic]);
      // Append to textarea if not already mentioned
      if (!interests.toLowerCase().includes(topic.toLowerCase())) {
        const separator = interests.trim() ? ', ' : '';
        const updated = interests + separator + topic;
        if (updated.length <= maxChars) {
          setInterests(updated);
        }
      }
    }
  };

  const categoryIcons = {
    "Artificial Intelligence": Brain,
    "Programming": Terminal,
    "Web Development": Code,
    "Data & Analytics": Database,
    "Cloud & Security": Cloud,
  };

  return (
    <div className="space-y-3">
      {/* Field Label Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#8055FF]/20 border border-[#8055FF]/40 text-[#A78BFA] text-xs font-bold flex items-center justify-center">
            1
          </div>
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F3FF]">
            Your Learning Interests <span className="text-rose-400">*</span>
          </label>
          <div className="group relative cursor-pointer text-[#68667A] hover:text-[#9694A8]">
            <Info className="w-3.5 h-3.5" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-52 p-2 bg-[#1B1B28] border border-white/10 rounded-lg text-[11px] text-[#9694A8] shadow-xl z-20 pointer-events-none">
              Select predefined interest chips or describe your goals in your own words.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playClick();
            setModalOpen(true);
          }}
          onMouseEnter={playHover}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8055FF] hover:text-[#A78BFA] transition-colors"
        >
          <span>View All (30+)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-[#9694A8]">
        Select topics below or describe your learning goals.
      </p>

      {/* Popular Clickable Suggestions Row */}
      <div className="flex flex-wrap gap-2 pt-1">
        {INITIAL_INTEREST_SUGGESTIONS.map((topic) => {
          const isSelected = selectedInterestChips.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleInterestChip(topic)}
              onMouseEnter={playHover}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-[#8055FF]/20 border border-[#8055FF] text-white shadow-glow-sm'
                  : 'bg-[#15151F] border border-white/[0.08] text-[#9694A8] hover:text-[#F5F3FF] hover:border-white/20'
              }`}
            >
              <span>{topic}</span>
              {isSelected && <Check className="w-3.5 h-3.5 text-[#23D18B]" />}
            </button>
          );
        })}
      </div>

      {/* Large Textarea with Character Limit */}
      <div className="relative">
        <textarea
          rows="3"
          maxLength={maxChars}
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g. I want to learn machine learning, data science, and Python programming for building AI applications..."
          className="w-full bg-[#101019] border border-white/[0.08] focus:border-[#8055FF] rounded-xl p-3.5 text-sm text-[#F5F3FF] placeholder-[#9694A8]/60 focus:outline-none transition-colors resize-none"
        />
        <div className="flex justify-between items-center text-[11px] text-[#68667A] mt-1 px-1">
          <span>Describe your interests, goals, or topics. Be as specific as possible.</span>
          <span className={interests.length >= maxChars ? 'text-amber-400 font-bold' : ''}>
            {interests.length} / {maxChars}
          </span>
        </div>
      </div>

      {/* View All (30+) Categorized Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  All Learning Interests (30+)
                </h3>
                <p className="text-xs text-[#9694A8] mt-0.5">
                  Click any topic to add or remove it from your preferences.
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

            {/* Categorized Lists */}
            <div className="space-y-6">
              {Object.entries(INTEREST_CATEGORIES).map(([catName, topics]) => {
                const Icon = categoryIcons[catName] || Brain;
                return (
                  <div key={catName} className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{catName}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic) => {
                        const isSelected = selectedInterestChips.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => toggleInterestChip(topic)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-[#8055FF]/20 border border-[#8055FF] text-white shadow-glow-sm'
                                : 'bg-[#101019] border border-white/[0.08] text-[#9694A8] hover:text-white hover:border-white/20'
                            }`}
                          >
                            <span>{topic}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#23D18B]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Done CTA */}
            <div className="mt-8 pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] text-white text-xs font-semibold shadow-glow-sm"
              >
                Done ({selectedInterestChips.length} selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

