import React from 'react';
import { Lightbulb, ArrowRight, Brain, Cpu, Database, Code, Terminal, Cloud } from 'lucide-react';

export default function QuickInspirationBar({ onSelectInspiration, onOpenAllInterests }) {
  const topics = [
    { name: "Artificial Intelligence", icon: Brain },
    { name: "Machine Learning", icon: Cpu },
    { name: "Data Science", icon: Database },
    { name: "Full Stack Development", icon: Code },
    { name: "Python Programming", icon: Terminal },
    { name: "Cloud Computing", icon: Cloud },
  ];

  return (
    <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-[#15151F] border border-white/[0.08] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-5">
      
      {/* Left Title */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-[#8055FF]/15 border border-[#8055FF]/30 flex items-center justify-center text-[#A78BFA]">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold font-heading text-white">
            Need inspiration? Try these.
          </h4>
          <p className="text-xs text-[#9694A8]">
            Click on any topic to add it to your learning interests.
          </p>
        </div>
      </div>

      {/* Selectable Chips Row */}
      <div className="flex items-center gap-2 flex-wrap">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => onSelectInspiration(t.name)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101019] border border-white/[0.08] hover:border-[#8055FF]/50 text-xs font-medium text-[#9694A8] hover:text-white transition-all active:scale-95"
            >
              <Icon className="w-3.5 h-3.5 text-[#8055FF]" />
              <span>{t.name}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenAllInterests}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8055FF] hover:text-[#A78BFA] px-2 py-1 transition-colors"
        >
          <span>View All Topics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

