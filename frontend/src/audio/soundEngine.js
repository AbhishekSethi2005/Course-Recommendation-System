/**
 * CourseIQ Sound Engine
 * Synthesizes subtle, high-end digital UI feedback using the Web Audio API.
 * Desktop-only: strictly checks for fine pointer & hover capability.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.volume = 0.15; // Default 15%
    this.enabled = false; // Master sound toggle (disabled by default)
    this.hoverEnabled = true; // Hover sound toggle (default on)
    this.clickEnabled = true; // Click sound toggle (default on)
    this.lastHoverTime = 0;
    this.hoverCooldown = 75; // 75ms debounce between card hovers
  }

  isDesktop() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { });
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  setEnabled(val) {
    this.enabled = !!val;
    if (this.enabled) {
      this.initContext();
    }
  }

  setHoverEnabled(val) {
    this.hoverEnabled = !!val;
  }

  setClickEnabled(val) {
    this.clickEnabled = !!val;
  }

  canPlay() {
    return this.enabled && this.isDesktop() && this.volume > 0;
  }

  // 1. Soft high-frequency digital hover tick
  playHover() {
    if (!this.canPlay() || !this.hoverEnabled) return;
    const now = performance.now();
    if (now - this.lastHoverTime < this.hoverCooldown) return;
    this.lastHoverTime = now;

    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1150, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.025);

      // Soft envelope (reduced by 30%: 0.12 * 0.70 = 0.084)
      const vol = this.volume * 0.084;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch (e) { }
  }

  // 2. Short, low-volume tactile button click
  playClick() {
    if (!this.canPlay() || !this.clickEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.03);

      // Tactile envelope (increased by 100%: 0.22 * 2 = 0.44)
      const vol = this.volume * 0.44;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.045);
    } catch (e) { }
  }

  // 3. Gentle digital pop when selecting an item
  playSelect() {
    if (!this.canPlay()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(680, t + 0.05);

      const vol = this.volume * 0.20;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.065);
    } catch (e) { }
  }

  // 4. Muted deselection sound
  playDeselect() {
    if (!this.canPlay()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(560, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.045);

      const vol = this.volume * 0.16;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.055);
    } catch (e) { }
  }

  // 5. Subtle processing-start sound
  playProcessingStart() {
    if (!this.canPlay()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.12);

      const vol = this.volume * 0.25;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    } catch (e) { }
  }

  // 6. Gentle two-tone success confirmation chime
  playSuccess() {
    if (!this.canPlay()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const vol = this.volume * 0.22;

      // Note 1: C6 (~1046 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, t);
      gain1.gain.setValueAtTime(0.0001, t);
      gain1.gain.linearRampToValueAtTime(vol, t + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.17);

      // Note 2: E6 (~1318 Hz)
      const t2 = t + 0.08;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.5, t2);
      gain2.gain.setValueAtTime(0.0001, t2);
      gain2.gain.linearRampToValueAtTime(vol * 1.1, t2 + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.22);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t2);
      osc2.stop(t2 + 0.24);
    } catch (e) { }
  }

  // 7. Soft descending warning / error tone
  playError() {
    if (!this.canPlay()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.16);

      const vol = this.volume * 0.20;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.19);
    } catch (e) { }
  }

  // 8. Bookmark Added confirmation sound
  playBookmarkAdd() {
    if (!this.canPlay()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(1174, t + 0.08);

      const vol = this.volume * 0.20;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    } catch (e) { }
  }

  // 9. Bookmark Removed sound
  playBookmarkRemove() {
    if (!this.canPlay()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, t);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.06);

      const vol = this.volume * 0.18;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.075);
    } catch (e) { }
  }
}

export const soundEngine = new SoundEngine();

