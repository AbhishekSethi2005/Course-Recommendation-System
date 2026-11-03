import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  ExternalLink, 
  Heart, 
  Clock, 
  Award, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { SAMPLE_RECOMMENDATIONS } from '../data/sampleCourses';
import { useAudio } from '../audio/AudioContext';

export default function SampleRecommendations({ onNavigateDiscover }) {
  const { playHover, playClick, playBookmarkAdd, playBookmarkRemove } = useAudio();
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const isAdding = !favorites[id];
    if (isAdding) {
      playBookmarkAdd();
    } else {
      playBookmarkRemove();
    }
    setFavorites(prev => ({ ...prev, [id]: isAdding }));
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#8055FF]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8055FF]/10 border border-[#8055FF]/25 text-xs font-semibold text-[#A78BFA] mb-4">
            <span>+ SAMPLE RECOMMENDATIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F5F3FF] tracking-tight">
            Courses you might love
          </h2>

          <p className="mt-4 text-base sm:text-lg text-[#9694A8]">
            Recommendations that understand what you need based on different interests & skill goals.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {SAMPLE_RECOMMENDATIONS.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onMouseEnter={playHover}
              className="rounded-2xl bg-[#15151F] border border-white/[0.08] hover:border-[#8055FF]/50 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Visual Header / Banner */}
                <div className={`h-24 bg-gradient-to-br ${course.gradient} p-3.5 flex flex-col justify-between relative`}>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-bold text-[#23D18B] border border-[#23D18B]/30">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{course.matchPercentage}% Match</span>
                    </span>

                    <button
                      onClick={(e) => toggleFavorite(course.id, e)}
                      className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-colors"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 ${favorites[course.id] ? 'fill-rose-500 text-rose-500' : ''}`} 
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 text-[10px] font-bold text-[#C4B5FD] tracking-wider uppercase">
                      AI MATCHED
                    </span>
                    <span className="text-[10px] text-white/90 font-medium px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-sm">
                      {course.provider}
                    </span>
                  </div>
                </div>

                {/* Course Card Body */}
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-bold font-heading text-[#F5F3FF] line-clamp-2 mb-2 group-hover:text-[#A78BFA] transition-colors leading-snug">
                    {course.title}
                  </h3>

                  {/* University & Provider */}
                  <p className="text-xs text-[#9694A8] mb-3 line-clamp-1">
                    {course.university}
                  </p>

                  {/* Rating & Level */}
                  <div className="flex items-center justify-between text-xs text-[#9694A8] pb-3 mb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-[#68667A] font-normal">({course.reviews})</span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[11px] text-[#A78BFA] font-medium">
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Skills preview chips */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.skills.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#101019] text-[#9694A8] border border-white/[0.06]">
                        {s}
                      </span>
                    ))}
                    {course.skills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#101019] text-[#68667A]">
                        +{course.skills.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Score breakdown bars */}
                  <div className="space-y-1.5 text-[10px] text-[#9694A8] bg-[#101019] p-2.5 rounded-xl border border-white/[0.04]">
                    <div className="flex justify-between items-center">
                      <span>Content Relevance</span>
                      <span className="font-semibold text-[#8055FF]">{course.contentScore}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#8055FF] to-[#6366F1] rounded-full" style={{ width: `${course.contentScore}%` }} />
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span>Skill Match</span>
                      <span className="font-semibold text-[#23D18B]">{course.skillsScore}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-[#23D18B] rounded-full" style={{ width: `${course.skillsScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: View Course Link */}
              <div className="p-4 pt-0">
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-[#8055FF]/20 hover:text-white border border-white/[0.08] hover:border-[#8055FF]/40 text-xs font-semibold text-[#A78BFA] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Course</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA to Discover Courses */}
        <div className="mt-14 text-center">
          <button
            onClick={() => {
              playClick();
              onNavigateDiscover();
            }}
            onMouseEnter={playHover}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] text-white font-semibold text-base shadow-glow-sm hover:shadow-glow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Discover Your Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

