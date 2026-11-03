import React from 'react';
import { X, ExternalLink, Bookmark, Star, Clock, Award, Sparkles, CheckCircle2, Trash2 } from 'lucide-react';
import { useAudio } from '../../audio/AudioContext';

export default function CourseDetailsModal({ course, isOpen, onClose, onPromptRemove }) {
  const { playHover, playClick } = useAudio();
  if (!isOpen || !course) return null;

  const handleClose = () => {
    playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl relative text-left space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          onMouseEnter={playHover}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] text-[#9694A8] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#23D18B]/15 border border-[#23D18B]/30 text-xs font-bold text-[#23D18B]">
              {course.matchPercentage || 92}% Match
            </span>
            <span className="text-xs text-[#9694A8] font-semibold">
              {course.organization}
            </span>
            {course.course_certificate_type && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/[0.05] text-[#C4B5FD]">
                {course.course_certificate_type}
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
            {course.course_name}
          </h2>

          <div className="flex items-center gap-4 text-xs text-[#9694A8] pt-1">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{course.course_rating}</span>
              <span className="text-[#68667A]">({course.reviews || '100K reviews'})</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.duration || '20 hours'}</span>
            </span>
            <span>•</span>
            <span className="capitalize">{course.course_difficulty}</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
            Course Overview
          </h4>
          <p className="text-xs sm:text-sm text-[#F5F3FF]/90 leading-relaxed">
            {course.description || "Comprehensive hands-on curriculum taught by top university faculty and industry experts, covering theoretical concepts and practical real-world exercises."}
          </p>
        </div>

        {/* Why this course was recommended */}
        {course.whyMatches && (
          <div className="p-4 rounded-2xl bg-[#8055FF]/10 border border-[#8055FF]/25 text-xs text-[#C4B5FD] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#A78BFA] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Recommendation Rationale:</strong>
              <span>{course.whyMatches}</span>
            </div>
          </div>
        )}

        {/* Skills Covered */}
        {course.skills && course.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9694A8]">
              Skills You Will Gain
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map((sk, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-[#101019] text-[#C4B5FD] border border-white/[0.06]">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Scores Breakdown */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#101019] border border-white/[0.06] text-xs">
          <div>
            <span className="text-[#68667A] block text-[10px] uppercase font-semibold">Content Similarity</span>
            <span className="text-base font-bold text-[#8055FF] font-heading">
              {Math.round((course.content_score || 0.9) * 100)}%
            </span>
          </div>
          <div>
            <span className="text-[#68667A] block text-[10px] uppercase font-semibold">Skill Overlap Score</span>
            <span className="text-base font-bold text-[#23D18B] font-heading">
              {Math.round((course.skills_score || 0.85) * 100)}%
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              playClick();
              onClose();
              onPromptRemove(course);
            }}
            onMouseEnter={playHover}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove from Library</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleClose}
              onMouseEnter={playHover}
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors"
            >
              Close
            </button>

            <a
              href={course.course_url && course.course_url !== '#' ? course.course_url : `https://www.coursera.org/search?query=${encodeURIComponent(course.course_name)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              onMouseEnter={playHover}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] hover:from-[#8F66FF] hover:to-[#7073FA] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-glow-sm transition-all"
            >
              <span>View Course</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

