import React, { useState } from 'react';
import { Filter, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useAudio } from '../../audio/AudioContext';

export default function LibraryFilters({
  savedCourses,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedProviders,
  setSelectedProviders,
  selectedRating,
  setSelectedRating,
  selectedCertificate,
  setSelectedCertificate,
  onClearAll
}) {
  const { playHover, playClick, playSelect, playDeselect } = useAudio();
  const [showAllProviders, setShowAllProviders] = useState(false);

  // Calculate dynamic counts from savedCourses
  const difficultyCounts = {
    beginner: savedCourses.filter(c => (c.course_difficulty || '').toLowerCase() === 'beginner').length,
    intermediate: savedCourses.filter(c => (c.course_difficulty || '').toLowerCase() === 'intermediate').length,
    advanced: savedCourses.filter(c => (c.course_difficulty || '').toLowerCase() === 'advanced').length,
  };

  const providerCounts = {};
  savedCourses.forEach(c => {
    const prov = c.organization || 'Coursera';
    providerCounts[prov] = (providerCounts[prov] || 0) + 1;
  });

  const ratingCounts = {
    4.5: savedCourses.filter(c => (c.course_rating || 0) >= 4.5).length,
    4.0: savedCourses.filter(c => (c.course_rating || 0) >= 4.0).length,
    3.5: savedCourses.filter(c => (c.course_rating || 0) >= 3.5).length,
  };

  const certificateCounts = {
    available: savedCourses.filter(c => c.certificate !== false).length,
    none: savedCourses.filter(c => c.certificate === false).length,
  };

  const toggleDifficulty = (diff) => {
    if (selectedDifficulty.includes(diff)) {
      playDeselect();
      setSelectedDifficulty(selectedDifficulty.filter(d => d !== diff));
    } else {
      playSelect();
      setSelectedDifficulty([...selectedDifficulty, diff]);
    }
  };

  const toggleProvider = (prov) => {
    if (selectedProviders.includes(prov)) {
      playDeselect();
      setSelectedProviders(selectedProviders.filter(p => p !== prov));
    } else {
      playSelect();
      setSelectedProviders([...selectedProviders, prov]);
    }
  };

  const toggleCertificate = (cert) => {
    if (selectedCertificate.includes(cert)) {
      playDeselect();
      setSelectedCertificate(selectedCertificate.filter(c => c !== cert));
    } else {
      playSelect();
      setSelectedCertificate([...selectedCertificate, cert]);
    }
  };

  const providerEntries = Object.entries(providerCounts);
  const displayedProviders = showAllProviders ? providerEntries : providerEntries.slice(0, 5);

  return (
    <div className="p-5 rounded-2xl bg-[#15151F] border border-white/[0.08] shadow-card space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
          <Filter className="w-3.5 h-3.5 text-[#8055FF]" />
          <span>Filters</span>
        </div>

        <button
          onClick={() => {
            playClick();
            onClearAll();
          }}
          onMouseEnter={playHover}
          className="text-xs text-[#8055FF] hover:text-[#A78BFA] transition-colors font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Difficulty Level */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-white block">Difficulty Level</span>
        {['beginner', 'intermediate', 'advanced'].map((lvl) => {
          const isChecked = selectedDifficulty.includes(lvl);
          const count = difficultyCounts[lvl] || 0;
          return (
            <label key={lvl} className="flex items-center justify-between text-xs text-[#9694A8] hover:text-white cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDifficulty(lvl)}
                  className="w-3.5 h-3.5 rounded bg-[#101019] border border-white/20 accent-[#8055FF]"
                />
                <span className="capitalize">{lvl}</span>
              </div>
              <span className="text-[11px] text-[#68667A]">({count})</span>
            </label>
          );
        })}
      </div>

      {/* Provider */}
      <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
        <span className="text-xs font-bold text-white block">Provider</span>
        {displayedProviders.map(([prov, count]) => {
          const isChecked = selectedProviders.includes(prov);
          return (
            <label key={prov} className="flex items-center justify-between text-xs text-[#9694A8] hover:text-white cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleProvider(prov)}
                  className="w-3.5 h-3.5 rounded bg-[#101019] border border-white/20 accent-[#8055FF]"
                />
                <span className="line-clamp-1">{prov}</span>
              </div>
              <span className="text-[11px] text-[#68667A]">({count})</span>
            </label>
          );
        })}

        {providerEntries.length > 5 && (
          <button
            onClick={() => setShowAllProviders(!showAllProviders)}
            className="inline-flex items-center gap-1 text-[11px] text-[#8055FF] hover:text-[#A78BFA] pt-1"
          >
            <span>{showAllProviders ? 'Show Less' : 'Show More'}</span>
            {showAllProviders ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Rating */}
      <div className="space-y-2 pt-3 border-t border-white/[0.06]">
        <span className="text-xs font-bold text-white block">Rating</span>
        {[
          { val: 4.5, label: "4.5 & above", count: ratingCounts[4.5] },
          { val: 4.0, label: "4.0 & above", count: ratingCounts[4.0] },
          { val: 3.5, label: "3.5 & above", count: ratingCounts[3.5] },
        ].map((r) => {
          const isSelected = selectedRating === r.val;
          return (
            <label key={r.val} className="flex items-center justify-between text-xs text-[#9694A8] hover:text-white cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="libraryRatingFilter"
                  checked={isSelected}
                  onChange={() => setSelectedRating(isSelected ? 0 : r.val)}
                  onClick={() => { if (isSelected) setSelectedRating(0); }}
                  className="w-3.5 h-3.5 accent-[#8055FF]"
                />
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{r.label}</span>
                </span>
              </div>
              <span className="text-[11px] text-[#68667A]">({r.count})</span>
            </label>
          );
        })}
      </div>

      {/* Certificate */}
      <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
        <span className="text-xs font-bold text-white block">Certificate</span>
        {[
          { id: 'available', label: 'Certificate Available', count: certificateCounts.available },
          { id: 'none', label: 'No Certificate', count: certificateCounts.none }
        ].map((c) => {
          const isChecked = selectedCertificate.includes(c.id);
          return (
            <label key={c.id} className="flex items-center justify-between text-xs text-[#9694A8] hover:text-white cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCertificate(c.id)}
                  className="w-3.5 h-3.5 rounded bg-[#101019] border border-white/20 accent-[#8055FF]"
                />
                <span>{c.label}</span>
              </div>
              <span className="text-[11px] text-[#68667A]">({c.count})</span>
            </label>
          );
        })}
      </div>

    </div>
  );
}

