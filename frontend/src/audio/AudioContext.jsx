import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { soundEngine } from './soundEngine';

const AudioContext = createContext(null);

const STORAGE_KEY_ENABLED = 'courseiq_sound_enabled';
const STORAGE_KEY_VOLUME = 'courseiq_sound_volume';
const STORAGE_KEY_HOVER = 'courseiq_hover_sound_enabled';
const STORAGE_KEY_CLICK = 'courseiq_click_sound_enabled';

export function AudioProvider({ children }) {
  // Sound is disabled by default until user explicitly enables it
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ENABLED);
      return stored === 'true'; // false if not set or 'false'
    } catch {
      return false;
    }
  });

  const [volume, setVolumeState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VOLUME);
      return stored !== null ? Number(stored) : 0.15; // default 15%
    } catch {
      return 0.15;
    }
  });

  // Hover sound sub-toggle (default true)
  const [hoverSoundEnabled, setHoverSoundEnabledState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HOVER);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  // Click sound sub-toggle (default true)
  const [clickSoundEnabled, setClickSoundEnabledState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CLICK);
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  // Sync with soundEngine on mount and state changes
  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    soundEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    soundEngine.setHoverEnabled(hoverSoundEnabled);
  }, [hoverSoundEnabled]);

  useEffect(() => {
    soundEngine.setClickEnabled(clickSoundEnabled);
  }, [clickSoundEnabled]);

  const setSoundEnabled = useCallback((enabled) => {
    setSoundEnabledState(enabled);
    try {
      localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled));
    } catch {}
    soundEngine.setEnabled(enabled);
  }, []);

  const setVolume = useCallback((vol) => {
    setVolumeState(vol);
    try {
      localStorage.setItem(STORAGE_KEY_VOLUME, String(vol));
    } catch {}
    soundEngine.setVolume(vol);
  }, []);

  const setHoverSoundEnabled = useCallback((enabled) => {
    setHoverSoundEnabledState(enabled);
    try {
      localStorage.setItem(STORAGE_KEY_HOVER, String(enabled));
    } catch {}
    soundEngine.setHoverEnabled(enabled);
  }, []);

  const setClickSoundEnabled = useCallback((enabled) => {
    setClickSoundEnabledState(enabled);
    try {
      localStorage.setItem(STORAGE_KEY_CLICK, String(enabled));
    } catch {}
    soundEngine.setClickEnabled(enabled);
  }, []);

  const playHover = useCallback(() => soundEngine.playHover(), []);
  const playClick = useCallback(() => soundEngine.playClick(), []);
  const playSelect = useCallback(() => soundEngine.playSelect(), []);
  const playDeselect = useCallback(() => soundEngine.playDeselect(), []);
  const playProcessingStart = useCallback(() => soundEngine.playProcessingStart(), []);
  const playSuccess = useCallback(() => soundEngine.playSuccess(), []);
  const playError = useCallback(() => soundEngine.playError(), []);
  const playBookmarkAdd = useCallback(() => soundEngine.playBookmarkAdd(), []);
  const playBookmarkRemove = useCallback(() => soundEngine.playBookmarkRemove(), []);

  const testSound = useCallback(() => {
    soundEngine.initContext();
    // Temporarily ensure sound can play during test even if disabled
    const prevEnabled = soundEngine.enabled;
    soundEngine.enabled = true;
    soundEngine.playSuccess();
    setTimeout(() => {
      soundEngine.enabled = prevEnabled;
    }, 300);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        volume,
        setVolume,
        hoverSoundEnabled,
        setHoverSoundEnabled,
        clickSoundEnabled,
        setClickSoundEnabled,
        playHover,
        playClick,
        playSelect,
        playDeselect,
        playProcessingStart,
        playSuccess,
        playError,
        playBookmarkAdd,
        playBookmarkRemove,
        testSound
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    // Graceful fallback dummy if outside provider
    return {
      soundEnabled: false,
      setSoundEnabled: () => {},
      volume: 0.15,
      setVolume: () => {},
      hoverSoundEnabled: true,
      setHoverSoundEnabled: () => {},
      clickSoundEnabled: true,
      setClickSoundEnabled: () => {},
      playHover: () => {},
      playClick: () => {},
      playSelect: () => {},
      playDeselect: () => {},
      playProcessingStart: () => {},
      playSuccess: () => {},
      playError: () => {},
      playBookmarkAdd: () => {},
      playBookmarkRemove: () => {},
      testSound: () => {},
    };
  }
  return context;
}
