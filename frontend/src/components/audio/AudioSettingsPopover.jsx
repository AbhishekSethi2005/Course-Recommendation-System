import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Volume1, Sparkles, MousePointer, MousePointerClick } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../audio/AudioContext';

export default function AudioSettingsPopover() {
  const {
    soundEnabled,
    setSoundEnabled,
    volume,
    setVolume,
    hoverSoundEnabled,
    setHoverSoundEnabled,
    clickSoundEnabled,
    setClickSoundEnabled,
    testSound,
    playClick
  } = useAudio();

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close when clicking outside or Escape
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleMasterToggle = () => {
    playClick();
    setSoundEnabled(!soundEnabled);
  };

  const handleHoverToggle = (e) => {
    e.stopPropagation();
    playClick();
    setHoverSoundEnabled(!hoverSoundEnabled);
  };

  const handleClickToggle = (e) => {
    e.stopPropagation();
    playClick();
    setClickSoundEnabled(!clickSoundEnabled);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  const handleTestSound = (e) => {
    e.stopPropagation();
    testSound();
  };

  const volumePercent = Math.round(volume * 100);

  const getSpeakerIcon = () => {
    if (!soundEnabled || volume === 0) {
      return <VolumeX className="w-4 h-4 text-[#9694A8]" />;
    }
    if (volume < 0.4) {
      return <Volume1 className="w-4 h-4 text-[#A78BFA]" />;
    }
    return <Volume2 className="w-4 h-4 text-[#A78BFA]" />;
  };

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Speaker Icon Trigger Button */}
      <button
        type="button"
        onClick={() => {
          playClick();
          setIsOpen(!isOpen);
        }}
        aria-label="Sound Settings"
        title={soundEnabled ? `Sound Effects (${volumePercent}%)` : "Sound Effects (Muted)"}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border ${
          isOpen
            ? 'bg-[#8055FF]/20 border-[#8055FF]/60 text-white shadow-glow-sm'
            : soundEnabled
            ? 'bg-[#15151F] border-white/10 hover:border-[#8055FF]/40 text-[#F5F3FF]'
            : 'bg-[#15151F]/80 border-white/[0.08] hover:border-white/20 text-[#68667A]'
        }`}
      >
        {getSpeakerIcon()}
        {soundEnabled && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#23D18B]" />
        )}
      </button>

      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#15151F] border border-white/10 p-4 sm:p-5 shadow-2xl shadow-black/80 backdrop-blur-xl z-50 text-[#F5F3FF]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#8055FF]/20 border border-[#8055FF]/40 flex items-center justify-center text-[#A78BFA]">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold font-heading text-white tracking-wide">
                  Sound Effects
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8055FF]/15 text-[#A78BFA] font-medium border border-[#8055FF]/20">
                Web Audio
              </span>
            </div>

            {/* Master Audio Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-white/[0.06] mb-2.5">
              <div>
                <label
                  className="text-xs font-semibold text-[#F5F3FF] block cursor-pointer select-none"
                  onClick={handleMasterToggle}
                >
                  Master Audio
                </label>
                <span className="text-[10px] text-[#9694A8]">
                  {soundEnabled ? 'Enabled for desktop pointer' : 'Currently muted'}
                </span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={soundEnabled}
                onClick={handleMasterToggle}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                  soundEnabled ? 'bg-[#8055FF]' : 'bg-[#1E1B2E] border border-white/10'
                }`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 rounded-full shadow-md ${
                    soundEnabled ? 'bg-white ml-auto' : 'bg-[#68667A] mr-auto'
                  }`}
                />
              </button>
            </div>

            {/* Sub-Toggles: Hover Sounds & Click Sounds */}
            <div className={`space-y-2.5 py-1 transition-opacity ${soundEnabled ? 'opacity-100' : 'opacity-35 pointer-events-none'}`}>
              
              {/* 1. Hover Sound Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#101019]/70 border border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center text-[#A78BFA]">
                    <MousePointer className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-[#F5F3FF] block cursor-pointer select-none"
                      onClick={handleHoverToggle}
                    >
                      Hover Sounds
                    </label>
                    <span className="text-[10px] text-[#9694A8] block">
                      Card & chip hover tick
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  disabled={!soundEnabled}
                  aria-checked={hoverSoundEnabled}
                  onClick={handleHoverToggle}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 flex items-center ${
                    hoverSoundEnabled && soundEnabled ? 'bg-[#8055FF]' : 'bg-[#1E1B2E] border border-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 rounded-full shadow-md ${
                      hoverSoundEnabled && soundEnabled ? 'bg-white ml-auto' : 'bg-[#68667A] mr-auto'
                    }`}
                  />
                </button>
              </div>

              {/* 2. Click Sound Toggle */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#101019]/70 border border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center text-[#A78BFA]">
                    <MousePointerClick className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-[#F5F3FF] block cursor-pointer select-none"
                      onClick={handleClickToggle}
                    >
                      Click Sounds
                    </label>
                    <span className="text-[10px] text-[#9694A8] block">
                      Buttons & action clicks
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  disabled={!soundEnabled}
                  aria-checked={clickSoundEnabled}
                  onClick={handleClickToggle}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 flex items-center ${
                    clickSoundEnabled && soundEnabled ? 'bg-[#8055FF]' : 'bg-[#1E1B2E] border border-white/10'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-4 h-4 rounded-full shadow-md ${
                      clickSoundEnabled && soundEnabled ? 'bg-white ml-auto' : 'bg-[#68667A] mr-auto'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Volume Slider */}
            <div className={`pt-3 pb-1 space-y-1.5 transition-opacity ${soundEnabled ? 'opacity-100' : 'opacity-35 pointer-events-none'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9694A8] text-[11px] font-medium">Master Volume</span>
                <span className="text-white text-xs font-bold font-mono">{volumePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                disabled={!soundEnabled}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-[#09090F] rounded-lg appearance-none cursor-pointer accent-[#8055FF]"
              />
            </div>

            {/* Test Sound Preview Button */}
            <div className="pt-3 border-t border-white/[0.08] mt-3">
              <button
                type="button"
                onClick={handleTestSound}
                className="w-full py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] active:bg-[#8055FF]/20 border border-white/[0.08] hover:border-white/20 text-xs font-semibold text-[#F5F3FF] flex items-center justify-center gap-2 transition-all group"
              >
                <Play className="w-3.5 h-3.5 text-[#A78BFA] group-hover:scale-110 transition-transform fill-[#A78BFA]" />
                <span>Test Audio Cue</span>
              </button>
            </div>

            {/* Desktop Only Notice */}
            <div className="pt-2 text-[10px] text-[#68667A] text-center leading-tight">
              Desktop only: subtle digital cues synthesized via Web Audio API.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
