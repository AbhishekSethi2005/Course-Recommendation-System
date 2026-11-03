import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, Layers, FileSearch, BarChart3, Code, GraduationCap, Cloud, BookOpen } from 'lucide-react';

export default function AIAssistantPanel() {
  const steps = [
    {
      title: "Understand your interests.",
      desc: "Identifies your learning goals and focus areas.",
      icon: Target,
      color: "#8055FF"
    },
    {
      title: "Analyze existing skills.",
      desc: "Considers what you already know.",
      icon: Layers,
      color: "#A78BFA"
    },
    {
      title: "Compare course content.",
      desc: "Matches your profile with relevant course details.",
      icon: FileSearch,
      color: "#6366F1"
    },
    {
      title: "Rank relevant courses.",
      desc: "Finds and prioritizes the best course matches for you.",
      icon: BarChart3,
      color: "#23D18B"
    }
  ];

  return (
    <div className="h-full rounded-3xl bg-[#15151F] border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-card">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8055FF] to-[#6366F1] flex items-center justify-center shadow-glow-sm">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold font-heading text-white">
            How CourseIQ thinks.
          </h3>
        </div>

        <p className="text-xs text-[#9694A8] leading-relaxed">
          Our AI analyzes your learning preferences and compares them with course information to find relevant matches.
        </p>

        {/* 4 Capabilities List */}
        <div className="mt-5 space-y-3.5">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${s.color}20`, border: `1px solid ${s.color}40` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3FF]">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-[#9694A8] leading-tight">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Futuristic AI Node Chip Graphic */}
      <div className="my-2 py-4 flex items-center justify-center relative">
        <div className="relative w-56 h-48 flex items-center justify-center">
          
          {/* Ambient Purple Lighting behind chip */}
          <div className="absolute inset-4 bg-[#8055FF]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Central 3D AI Processor Chip */}
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8055FF] via-[#6366F1] to-[#1E1B4B] p-[2px] shadow-glow-md flex items-center justify-center relative z-20"
          >
            <div className="w-full h-full bg-[#0E0E1A] rounded-[14px] flex flex-col items-center justify-center">
              <span className="text-xs font-black tracking-widest text-[#F5F3FF]">AI</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC] mt-0.5" />
            </div>
          </motion.div>

          {/* Connected Satellite Nodes */}
          {/* Top Node: Graduation Cap */}
          <motion.div 
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-[#1B1B28] border border-[#8055FF]/40 text-[#C4B5FD] shadow-lg"
          >
            <GraduationCap className="w-4 h-4" />
          </motion.div>

          {/* Left Top Node: Code </> */}
          <div className="absolute top-8 left-2 p-2 rounded-xl bg-[#1B1B28] border border-[#6366F1]/40 text-[#818CF8] shadow-lg">
            <Code className="w-4 h-4" />
          </div>

          {/* Left Bottom Node: BookOpen */}
          <div className="absolute bottom-4 left-4 p-2 rounded-xl bg-[#1B1B28] border border-cyan-400/40 text-cyan-400 shadow-lg">
            <BookOpen className="w-4 h-4" />
          </div>

          {/* Right Top Node: Analytics */}
          <div className="absolute top-8 right-2 p-2 rounded-xl bg-[#1B1B28] border border-[#23D18B]/40 text-[#23D18B] shadow-lg">
            <BarChart3 className="w-4 h-4" />
          </div>

          {/* Right Bottom Node: Cloud */}
          <div className="absolute bottom-4 right-4 p-2 rounded-xl bg-[#1B1B28] border border-amber-400/40 text-amber-400 shadow-lg">
            <Cloud className="w-4 h-4" />
          </div>

          {/* Subtle connection glow rings */}
          <div className="absolute inset-2 rounded-full border border-white/[0.06] -z-0" />
        </div>
      </div>

      {/* Pro Tip Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#8055FF]/15 via-[#1E1B4B]/30 to-[#101019] border border-[#8055FF]/30 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#C4B5FD]">
          <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>Pro Tip</span>
        </div>
        <p className="text-[11px] text-[#9694A8] leading-relaxed">
          Adding your existing skills and completed courses helps our AI eliminate duplicate basics and focus on high-impact learning opportunities.
        </p>
      </div>

    </div>
  );
}

