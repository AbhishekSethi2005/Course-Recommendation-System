import React from 'react';
import { Bookmark, History, GraduationCap } from 'lucide-react';
import { useAudio } from '../../audio/AudioContext';

export default function LibraryStats({ savedCount, searchHistoryCount, providersCount }) {
  const { playHover } = useAudio();
  const stats = [
    {
      label: "Saved Courses",
      value: savedCount,
      icon: Bookmark,
      color: "#8055FF",
      accentBg: "bg-[#8055FF]/15 border-[#8055FF]/30",
    },
    {
      label: "Previous Searches",
      value: searchHistoryCount,
      icon: History,
      color: "#A78BFA",
      accentBg: "bg-[#A78BFA]/15 border-[#A78BFA]/30",
    },
    {
      label: "Course Providers",
      value: providersCount,
      icon: GraduationCap,
      color: "#6366F1",
      accentBg: "bg-[#6366F1]/15 border-[#6366F1]/30",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            onMouseEnter={playHover}
            className="p-5 sm:p-6 rounded-2xl bg-[#15151F] border border-white/[0.08] shadow-card flex items-center gap-4 hover:border-white/20 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 ${stat.accentBg}`}>
              <Icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[#9694A8] font-medium mt-0.5">
                {stat.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

