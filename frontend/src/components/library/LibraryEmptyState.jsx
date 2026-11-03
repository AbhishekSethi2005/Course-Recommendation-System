import React from 'react';
import { Bookmark, History, ArrowRight } from 'lucide-react';

export default function LibraryEmptyState({ type = "courses", onNavigateDiscover }) {
  if (type === "history") {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#101019] border border-white/[0.06] space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#8055FF]/10 border border-[#8055FF]/30 flex items-center justify-center text-[#A78BFA] mx-auto">
          <History className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold font-heading text-white">
          Your discovery history starts here.
        </h4>
        <p className="text-xs text-[#9694A8] max-w-xs mx-auto leading-relaxed">
          Every time you explore courses using CourseIQ, your previous searches appear here for instant re-access.
        </p>
        <div className="pt-2">
          <button
            onClick={onNavigateDiscover}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors"
          >
            <span>Start Discovering</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 text-center rounded-3xl bg-[#15151F] border border-white/[0.08] shadow-card space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#8055FF]/20 to-[#6366F1]/10 border border-[#8055FF]/40 flex items-center justify-center text-[#A78BFA] mx-auto shadow-glow-sm">
        <Bookmark className="w-7 h-7 text-[#C084FC]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-bold font-heading text-white">
          Your library is waiting.
        </h3>
        <p className="text-xs sm:text-sm text-[#9694A8] max-w-md mx-auto leading-relaxed">
          You haven't saved any courses yet. Discover courses that match your interests and bookmark your favorites here.
        </p>
      </div>

      <div className="pt-2">
        <button
          onClick={onNavigateDiscover}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8055FF] to-[#6366F1] hover:from-[#8F66FF] hover:to-[#7073FA] text-white font-semibold text-xs sm:text-sm shadow-glow-sm hover:shadow-glow-md transition-all"
        >
          <span>Discover Courses</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

