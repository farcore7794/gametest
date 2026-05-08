export function playBeep(freq: number, duration = 0.15, type: OscillatorType = "sine") {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
    setTimeout(() => ctx.close(), (duration + 0.1) * 1000);
  } catch {
    // ignore
  }
}

export const playCorrect = () => {
  playBeep(660, 0.12);
  setTimeout(() => playBeep(880, 0.16), 120);
};

export const playWrong = () => playBeep(180, 0.25);

export const playWin = () => {
  playBeep(523, 0.12);
  setTimeout(() => playBeep(659, 0.12), 130);
  setTimeout(() => playBeep(784, 0.2), 260);
};

export const playTap = () => playBeep(520, 0.06, "triangle");

export const playSplash = () => {
  playBeep(440, 0.08, "sawtooth");
  setTimeout(() => playBeep(220, 0.12, "sawtooth"), 60);
};

export const playPop = () => playBeep(880, 0.08, "square");

export const playDrum = (pitch: number) => playBeep(pitch, 0.18, "triangle");
