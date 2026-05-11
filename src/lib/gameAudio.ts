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

// ---- Speech (Web Speech API) ----------------------------------------------

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickIdVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  try {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    if (voices.length === 0) return null;
    const id =
      voices.find((v) => v.lang?.toLowerCase().startsWith("id")) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("ms")) ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      voices[0];
    cachedVoice = id ?? null;
    return cachedVoice;
  } catch {
    return null;
  }
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  // Voices load async on some browsers (e.g. Chrome).
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickIdVoice();
  };
}

export function stopSpeak() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // ignore
  }
}

export function speak(text: string, lang = "id-ID") {
  try {
    if (!("speechSynthesis" in window)) return;
    stopSpeak();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    u.pitch = 1.15;
    const v = pickIdVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

// ---- Recorded animal sounds -----------------------------------------------

const animalAudioCache = new Map<string, HTMLAudioElement>();
let lastAnimalAudio: HTMLAudioElement | null = null;

// Animals that have an mp3 file available in /sounds/animals/
const KNOWN_ANIMAL_SOUNDS = new Set<string>([
  "anjing",
  "kucing",
  "sapi",
  "babi",
  "ayam",
  "kambing",
  "kuda",
  "beruang",
  "monyet",
  "gajah",
  "harimau",
  "singa",
  "paus",
]);

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

export function hasAnimalSound(animalName: string): boolean {
  return KNOWN_ANIMAL_SOUNDS.has(normalizeName(animalName));
}

export function playAnimalSound(animalName: string): boolean {
  const key = normalizeName(animalName);
  if (!KNOWN_ANIMAL_SOUNDS.has(key)) return false;
  try {
    if (lastAnimalAudio) {
      lastAnimalAudio.pause();
      lastAnimalAudio.currentTime = 0;
    }
    let audio = animalAudioCache.get(key);
    if (!audio) {
      audio = new Audio(`${import.meta.env.BASE_URL}sounds/animals/${key}.mp3`);
      audio.preload = "auto";
      animalAudioCache.set(key, audio);
    }
    audio.currentTime = 0;
    audio.volume = 0.9;
    audio.play().catch(() => {
      // ignore autoplay restrictions
    });
    lastAnimalAudio = audio;
    return true;
  } catch {
    return false;
  }
}
