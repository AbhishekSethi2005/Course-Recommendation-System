import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, ExternalLink, Bookmark, Info, CheckCircle2 } from 'lucide-react';
import { useAudio } from '../../audio/AudioContext';

export default function SavedCourseCard({ course, onOpenDetails, onPromptRemove }) {
  const { playHover, playClick } = useAudio();
  const getThumbnailGradient = (name) => {
    const n = name.toLowerCase();
    if (n.includes('python')) return 'from-blue-900/60 via-indigo-900/40 to-[#101019]';
    if (n.includes('learning') || n.includes('ai')) return 'from-purple-900/60 via-indigo-900/40 to-[#101019]';
    if (n.includes('aws') || n.includes('cloud')) return 'from-amber-900/50 via-orange-950/40 to-[#101019]';
    if (n.includes('react')) return 'from-cyan-900/60 via-blue-950/40 to-[#101019]';
    if (n.includes('data')) return 'from-indigo-900/60 via-purple-950/40 to-[#101019]';
    return 'from-purple-900/50 via-[#1E1B4B]/40 to-[#101019]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onMouseEnter={playHover}
      className="rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#8055FF]/40 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
    >
      <div>
        {/* Course Banner Thumbnail with Bookmark Ribbon */}
        <div className={`h-28 bg-gradient-to-br ${getThumbnailGradient(course.course_name)} p-4 flex items-start justify-between relative border-b border-white/[0.04]`}>
          
          {/* Logo / Thumbnail Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {course.course_name.includes('Python') ? '🐍' :
               course.course_name.includes('AWS') ? '☁️' :
               course.course_name.includes('React') ? '⚛️' :
               course.course_name.includes('Data') ? '📊' :
               course.course_name.includes('Learning') || course.course_name.includes('AI') ? '🧠' : '🎓'}
            </div>

            <div>
              <span className="text-xs font-bold text-white line-clamp-1">
                {course.organization}
              </span>
              <span className="text-[10px] text-[#A78BFA] block">
                {course.course_difficulty}
              </span>
            </div>
          </div>

          {/* Bookmark Ribbon Toggle (top right) */}
          <button
            onClick={() => {
              playClick();
              onPromptRemove(course);
            }}
            title="Remove from Saved Courses"
            className="w-7 h-9 bg-gradient-to-b from-[#EC4899] to-[#8055FF] rounded-b-md shadow-md flex items-center justify-center hover:opacity-85 transition-opacity"
          >
            <Bookmark className="w-4 h-4 text-white fill-white" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Title */}
          <h3 
            onClick={() => {
              playClick();
              onOpenDetails(course);
            }}
            className="text-sm sm:text-base font-bold font-heading text-white line-clamp-2 hover:text-[#A78BFA] cursor-pointer transition-colors leading-snug"
          >
            {course.course_name}
          </h3>

          {/* Provider & Difficulty row */}
          <div className="flex items-center justify-between text-xs text-[#9694A8]">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              {course.organization}
            </span>

            <span className="capitalize px-2 py-0.5 rounded bg-white/[0.05] text-[#C4B5FD] text-[11px] font-medium">
              {course.course_difficulty}
            </span>
          </div>

          {/* Rating & Duration */}
          <div className="flex items-center justify-between text-xs text-[#9694A8] pt-1 border-t border-white/[0.04]">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{course.course_rating || 4.7}</span>
              <span className="text-[#68667A] font-normal">({course.reviews || '100K'})</span>
            </div>

            <div className="flex items-center gap-1 text-[#9694A8]">
              <Clock className="w-3 h-3" />
              <span>{course.duration || '20 hours'}</span>
            </div>
          </div>

          {/* Certificate Badge */}
          <div className="pt-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] text-[#23D18B]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{course.certificate !== false ? 'Certificate' : 'Audit Only'}</span>
            </span>

            <button
              onClick={() => onOpenDetails(course)}
              className="text-[11px] text-[#A78BFA] hover:text-white transition-colors"
            >
              Details ⓘ
            </button>
          </div>
        </div>
      </div>

      {/* Card Action: View Course Button */}
      <div className="p-4 pt-0">
        <a
          href={course.course_url && course.course_url !== '#' ? course.course_url : `https://www.coursera.org/search?query=${encodeURIComponent(course.course_name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#8055FF]/20 to-[#6366F1]/20 hover:from-[#8055FF] hover:to-[#6366F1] text-[#C4B5FD] hover:text-white border border-[#8055FF]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <span>View Course</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

