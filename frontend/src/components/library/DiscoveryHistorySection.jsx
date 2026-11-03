import React, { useState } from 'react';
import { History, ArrowRight, Code, Cloud, BarChart3, ShieldCheck, Terminal, Brain, Trash2, RotateCcw, X, Search } from 'lucide-react';
import { useAudio } from '../../audio/AudioContext';

export default function DiscoveryHistorySection({
  history,
  onReopenResults,
  onSearchAgain,
  onPromptDeleteHistory
}) {
  const { playHover, playClick } = useAudio();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getHistoryIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('web') || t.includes('react') || t.includes('code')) return Code;
    if (t.includes('cloud') || t.includes('devops') || t.includes('aws')) return Cloud;
    if (t.includes('data') || t.includes('analytics')) return BarChart3;
    if (t.includes('security') || t.includes('cyber')) return ShieldCheck;
    if (t.includes('algorithm') || t.includes('python')) return Terminal;
    return Brain;
  };

  const filteredHistory = history.filter(h => 
    h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.interests || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#15151F] border border-white/[0.08] shadow-card space-y-5">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <History className="w-4 h-4 text-[#8055FF]" />
          <h3 className="text-base font-bold font-heading text-white">
            Previous Searches
          </h3>
        </div>
        <p className="text-xs text-[#9694A8]">
          Revisit your past course recommendations.
        </p>
      </div>

      {/* History Cards List (top 4 displayed directly) */}
      <div className="space-y-3">
        {history.slice(0, 4).map((entry) => {
          const Icon = getHistoryIcon(entry.title);
          return (
            <div
              key={entry.id}
              onMouseEnter={playHover}
              className="p-3.5 rounded-xl bg-[#101019] border border-white/[0.06] hover:border-[#8055FF]/40 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8055FF]/10 border border-[#8055FF]/25 flex items-center justify-center flex-shrink-0 text-[#A78BFA] group-hover:bg-[#8055FF]/20 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#A78BFA] transition-colors">
                    {entry.title}
                  </h4>
                  <p className="text-[10px] text-[#9694A8] mt-0.5">
                    {entry.recommendationsCount || 10} courses • <span className="capitalize">{entry.difficulty || 'Any Level'}</span>
                  </p>
                  <span className="text-[10px] text-[#68667A] block">
                    📅 {entry.formattedDate || 'Recent'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => {
                    playClick();
                    onReopenResults(entry);
                  }}
                  onMouseEnter={playHover}
                  title="View Results"
                  className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-[#8055FF] text-[#9694A8] hover:text-white flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    playClick();
                    onPromptDeleteHistory(entry);
                  }}
                  onMouseEnter={playHover}
                  title="Delete from history"
                  className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-[#68667A] hover:text-rose-400 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Searches Action Button */}
      <button
        onClick={() => {
          playClick();
          setModalOpen(true);
        }}
        onMouseEnter={playHover}
        className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-xs font-semibold text-[#F5F3FF] flex items-center justify-center gap-2 border border-white/[0.08] transition-colors"
      >
        <History className="w-3.5 h-3.5 text-[#A78BFA]" />
        <span>View All Searches ({history.length})</span>
      </button>

      {/* View All Searches Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  All Discovery Searches
                </h3>
                <p className="text-xs text-[#9694A8] mt-0.5">
                  Re-open previous recommendation results or prefill them into discovery.
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

            {/* Filter / Search Bar inside modal */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-[#68667A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter searches by keyword..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#101019] border border-white/[0.08] text-white placeholder-[#68667A] outline-none"
              />
            </div>

            {/* Full List */}
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {filteredHistory.map((entry) => {
                const Icon = getHistoryIcon(entry.title);
                return (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-xl bg-[#101019] border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#8055FF]/10 border border-[#8055FF]/25 flex items-center justify-center flex-shrink-0 text-[#A78BFA]">
                        <Icon className="w-4 h-4" />
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white">
                          {entry.title}
                        </h4>
                        <p className="text-[11px] text-[#9694A8]">
                          {entry.interests}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-[#68667A] mt-1">
                          <span>{entry.recommendationsCount} results</span>
                          <span>•</span>
                          <span className="capitalize">{entry.difficulty}</span>
                          <span>•</span>
                          <span>{entry.formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setModalOpen(false);
                          onSearchAgain(entry);
                        }}
                        title="Prefill into Discover Courses"
                        className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] font-medium text-white flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3 text-[#A78BFA]" />
                        <span>Search Again</span>
                      </button>

                      <button
                        onClick={() => {
                          setModalOpen(false);
                          onReopenResults(entry);
                        }}
                        title="View Results"
                        className="px-2.5 py-1.5 rounded-lg bg-[#8055FF] text-[11px] font-medium text-white flex items-center gap-1 shadow-sm"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

