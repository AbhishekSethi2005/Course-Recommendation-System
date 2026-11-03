import React, { useState } from 'react';
import { Search, Info, X, Check, ArrowRight } from 'lucide-react';
import { ALL_COMPLETED_COURSES, INITIAL_COMMON_COURSES } from '../../data/sampleCourses';
import { useAudio } from '../../audio/AudioContext';

export default function CompletedCoursesSection({ 
  completedCourses, 
  setCompletedCourses, 
  noneYet, 
  setNoneYet 
}) {
  const { playHover, playClick, playSelect, playDeselect } = useAudio();
  const [courseInput, setCourseInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const addCourse = (course) => {
    if (noneYet) return;
    const trimmed = course.trim();
    if (!trimmed) return;
    const exists = completedCourses.some(c => c.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      playSelect();
      setCompletedCourses([...completedCourses, trimmed]);
      setCourseInput('');
    }
  };

  const removeCourse = (courseToRemove) => {
    playDeselect();
    setCompletedCourses(completedCourses.filter(c => c.toLowerCase() !== courseToRemove.toLowerCase()));
  };

  const toggleCourse = (course) => {
    if (noneYet) return;
    const exists = completedCourses.some(c => c.toLowerCase() === course.toLowerCase());
    if (exists) {
      removeCourse(course);
    } else {
      addCourse(course);
    }
  };

  const handleNoneYetToggle = (checked) => {
    playClick();
    setNoneYet(checked);
    if (checked) {
      setCompletedCourses([]);
      setCourseInput('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Label Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#8055FF]/20 border border-[#8055FF]/40 text-[#A78BFA] text-xs font-bold flex items-center justify-center">
            3
          </div>
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F3FF]">
            Completed Courses <span className="text-[#68667A] font-normal lowercase">(Optional)</span>
          </label>
          <div className="group relative cursor-pointer text-[#68667A] hover:text-[#9694A8]">
            <Info className="w-3.5 h-3.5" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-52 p-2 bg-[#1B1B28] border border-white/10 rounded-lg text-[11px] text-[#9694A8] shadow-xl z-20 pointer-events-none">
              Excluded from recommendations so CourseIQ only shows courses with fresh knowledge.
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={noneYet}
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8055FF] hover:text-[#A78BFA] disabled:opacity-40 disabled:hover:text-[#8055FF] transition-colors"
        >
          <span>View All (12+)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-[#9694A8]">
        Add courses you have already completed to get more relevant results.
      </p>

      {/* Input box + None Yet toggle */}
      <div className={`p-2.5 rounded-xl bg-[#101019] border transition-colors space-y-2 ${noneYet ? 'opacity-60 border-white/[0.04]' : 'border-white/[0.08] focus-within:border-[#8055FF]'}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-[#68667A] absolute left-2.5" />
            <input
              type="text"
              disabled={noneYet}
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ',') && courseInput.trim()) {
                  e.preventDefault();
                  addCourse(courseInput.replace(',', ''));
                }
              }}
              placeholder={noneYet ? "No completed courses selected" : "Search or enter a completed course..."}
              className="w-full bg-transparent pl-8 pr-3 py-1.5 text-xs sm:text-sm text-[#F5F3FF] placeholder-[#68667A] outline-none disabled:cursor-not-allowed"
            />
          </div>

          {/* None Yet Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none pr-1">
            <input
              type="checkbox"
              checked={noneYet}
              onChange={(e) => handleNoneYetToggle(e.target.checked)}
              className="w-4 h-4 rounded bg-[#15151F] border border-white/20 text-[#8055FF] focus:ring-0 cursor-pointer accent-[#8055FF]"
            />
            <span className="text-xs font-medium text-[#9694A8] hover:text-white">None yet</span>
          </label>
        </div>

        {/* Selected completed courses tags */}
        {!noneYet && completedCourses.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/[0.04]">
            {completedCourses.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#8055FF]/20 border border-[#8055FF]/40 text-xs font-medium text-[#C4B5FD]"
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => removeCourse(c)}
                  className="text-[#A78BFA] hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Common Courses row */}
      {!noneYet && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] text-[#68667A] font-medium">Common courses:</span>
          {INITIAL_COMMON_COURSES.map((course) => {
            const isSelected = completedCourses.some(c => c.toLowerCase() === course.toLowerCase());
            return (
              <button
                key={course}
                type="button"
                onClick={() => toggleCourse(course)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-[#8055FF]/25 border border-[#8055FF] text-white'
                    : 'bg-[#15151F] border border-white/[0.08] text-[#9694A8] hover:text-[#F5F3FF] hover:border-white/20'
                }`}
              >
                {isSelected ? `✓ ${course}` : `+ ${course}`}
              </button>
            );
          })}
        </div>
      )}

      {/* View All (12+) Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-xl max-h-[80vh] overflow-y-auto p-6 rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Popular Completed Courses
                </h3>
                <p className="text-xs text-[#9694A8] mt-0.5">
                  Select any course you've already completed to exclude it.
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
              {ALL_COMPLETED_COURSES.map((course) => {
                const isSelected = completedCourses.some(c => c.toLowerCase() === course.toLowerCase());
                return (
                  <button
                    key={course}
                    type="button"
                    onClick={() => toggleCourse(course)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#8055FF]/25 border border-[#8055FF] text-white shadow-glow-sm'
                        : 'bg-[#101019] border border-white/[0.08] text-[#9694A8] hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{course}</span>
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
                Done ({completedCourses.length} excluded)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

