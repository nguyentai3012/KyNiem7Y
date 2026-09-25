// Web Audio API synthesizer for "Ngày Đầu Tiên" (Đức Phúc) & Sound Effects + HTML5 Audio Player

type AudioSourceType = 'custom' | 'synth';

class AudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private noteIndex = 0;
  private volume = 0.5;
  private isMuted = false;
  private audioEl: HTMLAudioElement | null = null;
  private activeSource: AudioSourceType = 'synth';
  private listeners: Array<() => void> = [];

  // Exact melody notes for the iconic chorus of "Ngày Đầu Tiên - Đức Phúc":
  // "Điều anh muốn là luôn thấy em cười / Chẳng cần phải lo lắng vì anh ở đây rồi / Cuộc đời anh là để cho em, riêng em mãi thôi..."
  private ngayDauTienMelody: Array<{ freq: number; duration: number }> = [
    // Phrase 1: "Điều anh muốn là luôn thấy em cười"
    { freq: 392.00, duration: 320 }, // G4 - Điêu
    { freq: 392.00, duration: 320 }, // G4 - anh
    { freq: 440.00, duration: 340 }, // A4 - muốn
    { freq: 392.00, duration: 340 }, // G4 - là
    { freq: 329.63, duration: 380 }, // E4 - luôn
    { freq: 392.00, duration: 380 }, // G4 - thấy
    { freq: 523.25, duration: 500 }, // C5 - em
    { freq: 440.00, duration: 600 }, // A4 - cười

    // Phrase 2: "Chẳng cần phải lo lắng vì anh ở đây rồi"
    { freq: 392.00, duration: 320 }, // G4 - Chẳng
    { freq: 440.00, duration: 320 }, // A4 - cần
    { freq: 523.25, duration: 340 }, // C5 - phải
    { freq: 587.33, duration: 360 }, // D5 - lo
    { freq: 523.25, duration: 340 }, // C5 - lắng
    { freq: 493.88, duration: 320 }, // B4 - vì
    { freq: 440.00, duration: 340 }, // A4 - anh
    { freq: 392.00, duration: 620 }, // G4 - ở đây rồi

    // Phrase 3: "Cuộc đời anh là để cho em"
    { freq: 329.63, duration: 320 }, // E4 - Cuộc
    { freq: 349.23, duration: 320 }, // F4 - đời
    { freq: 392.00, duration: 360 }, // G4 - anh
    { freq: 329.63, duration: 340 }, // E4 - là
    { freq: 293.66, duration: 340 }, // D4 - để
    { freq: 261.63, duration: 520 }, // C4 - cho em

    // Phrase 4: "Riêng em mãi thôi..."
    { freq: 293.66, duration: 340 }, // D4 - Riêng
    { freq: 329.63, duration: 340 }, // E4 - em
    { freq: 293.66, duration: 340 }, // D4 - mãi
    { freq: 261.63, duration: 750 }, // C4 - thôi...

    // Phrase 5: "Và ngày hôm ấy đã đến, anh được nhìn thấy em cười"
    { freq: 261.63, duration: 320 }, // C4 - Và
    { freq: 293.66, duration: 320 }, // D4 - ngày
    { freq: 329.63, duration: 340 }, // E4 - hôm
    { freq: 392.00, duration: 340 }, // G4 - ấy
    { freq: 440.00, duration: 360 }, // A4 - đã
    { freq: 523.25, duration: 520 }, // C5 - đến
    { freq: 440.00, duration: 340 }, // A4 - anh
    { freq: 392.00, duration: 580 }, // G4 - được nhìn thấy em cười

    // Phrase 6: "Cầm tay bước đi đến cuối con đường..."
    { freq: 392.00, duration: 320 }, // G4 - Cầm
    { freq: 440.00, duration: 320 }, // A4 - tay
    { freq: 523.25, duration: 360 }, // C5 - bước
    { freq: 587.33, duration: 380 }, // D5 - đi
    { freq: 659.25, duration: 520 }, // E5 - đến
    { freq: 587.33, duration: 420 }, // D5 - cuối
    { freq: 523.25, duration: 800 }, // C5 - con đường
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.loop = true;
      this.audioEl.volume = this.volume;
      this.audioEl.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });
      this.audioEl.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });
      this.audioEl.addEventListener('ended', () => {
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCustomAudioUrl(url: string) {
    if (this.audioEl) {
      const wasPlaying = this.isPlaying;
      if (wasPlaying) {
        this.stopMusic();
      }
      this.audioEl.src = url;
      this.activeSource = 'custom';
      if (wasPlaying) {
        this.startMusic();
      }
    }
  }

  public getActiveSource(): AudioSourceType {
    return this.activeSource;
  }

  public startMusic(): Promise<boolean> {
    if (this.activeSource === 'custom' && this.audioEl && this.audioEl.src) {
      this.audioEl.volume = this.isMuted ? 0 : this.volume;
      return this.audioEl
        .play()
        .then(() => {
          this.isPlaying = true;
          this.notify();
          return true;
        })
        .catch((err) => {
          console.warn('HTML5 audio play blocked, falling back to synth music box', err);
          this.startSynthMusic();
          return true;
        });
    } else {
      this.startSynthMusic();
      return Promise.resolve(true);
    }
  }

  private startSynthMusic() {
    try {
      this.initContext();
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      this.isPlaying = true;
      this.playNextNote();
      this.notify();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.audioEl && !this.audioEl.paused) {
      this.audioEl.pause();
    }
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playNextNote() {
    if (!this.isPlaying || !this.ctx) return;

    const note = this.ngayDauTienMelody[this.noteIndex % this.ngayDauTienMelody.length];
    this.noteIndex++;

    if (!this.isMuted) {
      this.playMusicBoxTone(note.freq, note.duration / 1000);
    }

    // Interval between notes
    this.timer = window.setTimeout(() => {
      this.playNextNote();
    }, note.duration + 40);
  }

  private playMusicBoxTone(freq: number, duration: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm bell-like music box timbre (sine with soft overtones)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);

    const actualVol = this.volume * 0.22;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(actualVol, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.45);
  }

  public playChime() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.9);
      });
    } catch {
      // Ignore
    }
  }

  public playFireworksSound() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const burstOffsets = [0, 0.28, 0.65, 1.1, 1.55];

      burstOffsets.forEach((offset, idx) => {
        const whooshOsc = this.ctx!.createOscillator();
        const whooshGain = this.ctx!.createGain();
        whooshOsc.type = 'sine';
        whooshOsc.frequency.setValueAtTime(250 + idx * 80, now + offset);
        whooshOsc.frequency.exponentialRampToValueAtTime(700 + idx * 120, now + offset + 0.15);

        whooshGain.gain.setValueAtTime(0.01, now + offset);
        whooshGain.gain.linearRampToValueAtTime(0.12, now + offset + 0.08);
        whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);

        whooshOsc.connect(whooshGain);
        whooshGain.connect(this.ctx!.destination);
        whooshOsc.start(now + offset);
        whooshOsc.stop(now + offset + 0.2);

        const baseFreq = [587.33, 659.25, 783.99, 880.00, 1046.50][idx % 5];
        const burstOsc = this.ctx!.createOscillator();
        const burstGain = this.ctx!.createGain();

        burstOsc.type = 'triangle';
        burstOsc.frequency.setValueAtTime(baseFreq, now + offset + 0.15);
        burstOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + offset + 0.35);

        burstGain.gain.setValueAtTime(0, now + offset + 0.15);
        burstGain.gain.linearRampToValueAtTime(0.25, now + offset + 0.17);
        burstGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.7);

        burstOsc.connect(burstGain);
        burstGain.connect(this.ctx!.destination);
        burstOsc.start(now + offset + 0.15);
        burstOsc.stop(now + offset + 0.75);
      });
    } catch {
      // Ignore
    }
  }

  // Stamp sound effect when redeeming love voucher
  public playStampSound() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }

  // Realistic gentle heartbeat pulse ("lub-dub")
  public playHeartbeat() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;

      // "Lub"
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(75, now);
      osc1.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // "Dub"
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(65, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(40, now + 0.28);
      gain2.gain.setValueAtTime(0.3, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.32);
    } catch {
      // Ignore
    }
  }

  // Soft mechanical tick for wheel rotation
  public playTick() {
    try {
      this.initContext();
      if (!this.ctx || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audioEl;
  }
}

export const audioService = new AudioManager();
