import React from 'react';
import { Sparkles, Github, Twitter, Linkedin, MessageCircle, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const handleNav = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#09090F] border-t border-white/[0.08] pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8055FF] to-[#6366F1] flex items-center justify-center shadow-glow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold font-heading text-white">
                Course<span className="text-[#8055FF]">IQ</span>
              </span>
            </button>

            <p className="text-sm text-[#9694A8] leading-relaxed max-w-sm">
              CourseIQ is an AI-powered course discovery and recommendation engine. 
              We analyze your background, skills, and goals to surface the most relevant online courses from top global providers.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#15151F] border border-white/10 flex items-center justify-center text-[#9694A8] hover:text-white hover:border-[#8055FF]/40 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#15151F] border border-white/10 flex items-center justify-center text-[#9694A8] hover:text-white hover:border-[#8055FF]/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#15151F] border border-white/10 flex items-center justify-center text-[#9694A8] hover:text-white hover:border-[#8055FF]/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#15151F] border border-white/10 flex items-center justify-center text-[#9694A8] hover:text-white hover:border-[#8055FF]/40 transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F3FF]">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#9694A8]">
              <li>
                <button 
                  onClick={() => handleNav('home')} 
                  className="hover:text-[#F5F3FF] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('discover')} 
                  className="hover:text-[#F5F3FF] transition-colors"
                >
                  Discover Courses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('categories')} 
                  className="hover:text-[#F5F3FF] transition-colors"
                >
                  Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F3FF]">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-[#9694A8]">
              <li>
                <button 
                  onClick={() => {
                    handleNav('home');
                    setTimeout(() => {
                      const el = document.getElementById('how-it-works-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-[#F5F3FF] transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <a 
                  href="#about" 
                  onClick={(e) => { e.preventDefault(); alert("CourseIQ is a machine learning powered course discovery platform combining TF-IDF content similarity and Jaccard skill matching on 3,416+ courses."); }}
                  className="hover:text-[#F5F3FF] transition-colors"
                >
                  About CourseIQ
                </a>
              </li>
              <li>
                <a 
                  href="#faqs" 
                  onClick={(e) => { e.preventDefault(); alert("FAQs:\n\n1. How does CourseIQ rank courses?\nUsing a weighted combination of TF-IDF text similarity, Jaccard skill overlap, completed-course exclusion, and rating bonuses.\n\n2. Is CourseIQ free?\nYes, intelligent course discovery is 100% free."); }}
                  className="hover:text-[#F5F3FF] transition-colors"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F3FF]">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-[#9694A8]">
              <li>
                <a 
                  href="#privacy" 
                  onClick={(e) => { e.preventDefault(); alert("Privacy Policy: CourseIQ does not store or share your personal profile data. Searches are processed in real-time."); }}
                  className="hover:text-[#F5F3FF] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#terms" 
                  onClick={(e) => { e.preventDefault(); alert("Terms & Conditions: CourseIQ recommendations are based on publicly available educational curricula for discovery purposes."); }}
                  className="hover:text-[#F5F3FF] transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#68667A] gap-4">
          <p>© 2026 CourseIQ. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built for intelligent course discovery</span>
            <span>•</span>
            <span className="text-[#8055FF]">Powered by Machine Learning</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

