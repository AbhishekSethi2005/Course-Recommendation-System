import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight, Bookmark, User } from 'lucide-react';
import AudioSettingsPopover from './audio/AudioSettingsPopover';
import { useAudio } from '../audio/AudioContext';

export default function Navbar({ activePage, setActivePage, onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { playHover, playClick } = useAudio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Discover Courses', id: 'discover' },
    { name: 'Categories', id: 'categories' },
    { name: 'How It Works', id: 'how-it-works' },
  ];

  const handleNavClick = (id) => {
    playClick();
    setMobileMenuOpen(false);
    if (id === 'how-it-works') {
      if (activePage !== 'home') {
        setActivePage('home');
        setTimeout(() => {
          const el = document.getElementById('how-it-works-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('how-it-works-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (id === 'categories' && activePage === 'home') {
      const el = document.getElementById('categories-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav py-3.5 shadow-lg shadow-black/40'
          : 'bg-[#09090F]/80 backdrop-blur-md py-4 border-b border-white/[0.05]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: CourseIQ Logo */}
          <button
            onClick={() => handleNavClick('home')}
            onMouseEnter={playHover}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8055FF] via-[#6366F1] to-[#A78BFA] p-[1px] shadow-glow-sm">
              <div className="w-full h-full bg-[#0E0E17] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                <Sparkles className="w-4 h-4 text-[#A78BFA] group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-heading tracking-tight flex items-center">
              <span className="text-[#F5F3FF]">Course</span>
              <span className="bg-gradient-to-r from-[#8055FF] via-[#A78BFA] to-[#C084FC] text-transparent bg-clip-text">IQ</span>
            </div>
          </button>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[#15151F]/70 border border-white/[0.06] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  onMouseEnter={playHover}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
                    isActive
                      ? 'text-[#F5F3FF] bg-[#8055FF]/20 shadow-sm'
                      : 'text-[#9694A8] hover:text-[#F5F3FF] hover:bg-white/[0.04]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#8055FF] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Audio Control, My Library & User Profile / Login */}
          <div className="hidden md:flex items-center gap-3">
            {/* Audio Settings Popover */}
            <AudioSettingsPopover />

            <button
              onClick={() => handleNavClick('library')}
              onMouseEnter={playHover}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-xl ${
                activePage === 'library'
                  ? 'bg-[#8055FF]/20 border border-[#8055FF]/50 text-white shadow-glow-sm font-semibold'
                  : 'text-[#9694A8] hover:text-[#F5F3FF] hover:bg-white/[0.04]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${activePage === 'library' ? 'text-[#C084FC] fill-[#C084FC]' : 'text-[#A78BFA]'}`} />
              <span>My Library</span>
            </button>

            <button
              onClick={() => {
                playClick();
                onOpenAuth('login');
              }}
              onMouseEnter={playHover}
              className="w-9 h-9 rounded-full bg-[#15151F] border border-white/10 flex items-center justify-center text-[#9694A8] hover:text-[#F5F3FF] hover:border-[#8055FF]/50 transition-colors focus:outline-none"
              title="User Account"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#15151F] border border-white/10 text-[#9694A8] hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/[0.06] mt-3 py-4 px-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                activePage === link.id
                  ? 'text-white bg-[#8055FF]/20 font-semibold'
                  : 'text-[#9694A8] hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </button>
          ))}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={() => handleNavClick('library')}
              className={`inline-flex items-center gap-2 py-2 px-3 text-sm rounded-lg ${
                activePage === 'library'
                  ? 'bg-[#8055FF]/20 text-white font-semibold'
                  : 'text-[#9694A8] hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 text-[#A78BFA]" />
              <span>My Library</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth('login');
              }}
              className="py-1.5 px-4 text-xs font-semibold rounded-lg bg-[#8055FF] text-white"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
