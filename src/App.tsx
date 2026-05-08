import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Star, Sparkles, Trophy } from "lucide-react";
import "./App.css";

type GameKey = "menu" | "sort" | "color" | "count" | "shape";

type GameMeta = {
  key: GameKey;
  title: string;
  emoji: string;
  bg: string;
};

const GAMES: GameMeta[] = [
  { key: "sort", title: "Sortir Buah & Sayur", emoji: "🥕", bg: "bg-orange-300" },
  { key: "color", title: "Cocokin Warna", emoji: "🎨", bg: "bg-pink-300" },
  { key: "count", title: "Hitung Angka", emoji: "🔢", bg: "bg-sky-300" },
  { key: "shape", title: "Tebak Hewan", emoji: "🐯", bg: "bg-emerald-300" },
];

function playBeep(freq: number, duration = 0.15) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
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

const playCorrect = () => {
  playBeep(660, 0.12);
  setTimeout(() => playBeep(880, 0.16), 120);
};
const playWrong = () => playBeep(180, 0.25);
const playWin = () => {
  playBeep(523, 0.12);
  setTimeout(() => playBeep(659, 0.12), 130);
  setTimeout(() => playBeep(784, 0.2), 260);
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  const colors = ["bg-red-400", "bg-yellow-400", "bg-green-400", "bg-blue-400", "bg-pink-400", "bg-purple-400"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className={`absolute top-0 h-3 w-3 rounded-sm ${color} animate-confetti`}
            style={{ left: `${left}%`, animationDelay: `${delay}s` }}
          />
        );
      })}
    </div>
  );
}

function ScoreBar({ score, total }: { score: number; total: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow">
      <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
      <span className="text-lg font-bold text-slate-700">
        {score} / {total}
      </span>
    </div>
  );
}

function FinishScreen({ onAgain, onMenu }: { onAgain: () => void; onMenu: () => void }) {
  useEffect(() => {
    playWin();
  }, []);
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <Trophy className="h-28 w-28 animate-bounce-up text-yellow-500" />
      <h2 className="text-center text-4xl font-extrabold text-slate-800">Hebat!</h2>
      <p className="text-center text-2xl text-slate-700">Kamu menyelesaikan semua soal!</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onAgain}
          className="rounded-2xl bg-emerald-500 px-8 py-4 text-2xl font-bold text-white shadow-lg active:scale-95"
        >
          Main Lagi
        </button>
        <button
          onClick={onMenu}
          className="rounded-2xl bg-sky-500 px-8 py-4 text-2xl font-bold text-white shadow-lg active:scale-95"
        >
          Menu Utama
        </button>
      </div>
    </div>
  );
}

type SortItem = { emoji: string; type: "buah" | "sayur"; name: string };
const SORT_POOL: SortItem[] = [
  { emoji: "🍎", type: "buah", name: "Apel" },
  { emoji: "🍌", type: "buah", name: "Pisang" },
  { emoji: "🍊", type: "buah", name: "Jeruk" },
  { emoji: "🍇", type: "buah", name: "Anggur" },
  { emoji: "🍓", type: "buah", name: "Stroberi" },
  { emoji: "🍉", type: "buah", name: "Semangka" },
  { emoji: "🥭", type: "buah", name: "Mangga" },
  { emoji: "🍍", type: "buah", name: "Nanas" },
  { emoji: "🥕", type: "sayur", name: "Wortel" },
  { emoji: "🥦", type: "sayur", name: "Brokoli" },
  { emoji: "🌽", type: "sayur", name: "Jagung" },
  { emoji: "🍅", type: "sayur", name: "Tomat" },
  { emoji: "🥔", type: "sayur", name: "Kentang" },
  { emoji: "🧅", type: "sayur", name: "Bawang" },
  { emoji: "🥒", type: "sayur", name: "Mentimun" },
];

function GameSort({ onBack }: { onBack: () => void }) {
  const TOTAL = 8;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<SortItem[]>(() => shuffle(SORT_POOL).slice(0, TOTAL));
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [done, setDone] = useState(false);

  const current = items[round];

  const handleChoice = (choice: "buah" | "sayur") => {
    if (feedback !== "none") return;
    if (choice === current.type) {
      playCorrect();
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      playWrong();
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("none");
      if (round + 1 >= TOTAL) {
        setDone(true);
      } else {
        setRound((r) => r + 1);
      }
    }, 700);
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setItems(shuffle(SORT_POOL).slice(0, TOTAL));
    setDone(false);
  };

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-200 to-yellow-100">
        <Header title="Sortir Buah & Sayur" onBack={onBack} score={score} total={TOTAL} />
        <Confetti show />
        <FinishScreen onAgain={reset} onMenu={onBack} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-200 to-yellow-100">
      <Header title="Sortir Buah & Sayur" onBack={onBack} score={score} total={TOTAL} />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <p className="rounded-2xl bg-white/80 px-6 py-3 text-center text-2xl font-bold text-slate-700 shadow">
          Ini buah atau sayur?
        </p>
        <div
          key={`${round}-${current.emoji}`}
          className={`flex flex-col items-center gap-2 ${feedback === "wrong" ? "animate-shake" : "animate-pop-in"}`}
        >
          <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white text-9xl shadow-2xl">
            {current.emoji}
          </div>
          <p className="text-2xl font-bold text-slate-700">{current.name}</p>
        </div>
        <div className="grid w-full max-w-md grid-cols-2 gap-4">
          <button
            onClick={() => handleChoice("buah")}
            disabled={feedback !== "none"}
            className="flex flex-col items-center gap-2 rounded-3xl bg-red-400 p-6 text-white shadow-lg active:scale-95 disabled:opacity-70"
          >
            <span className="text-6xl">🍎</span>
            <span className="text-2xl font-bold">BUAH</span>
          </button>
          <button
            onClick={() => handleChoice("sayur")}
            disabled={feedback !== "none"}
            className="flex flex-col items-center gap-2 rounded-3xl bg-green-500 p-6 text-white shadow-lg active:scale-95 disabled:opacity-70"
          >
            <span className="text-6xl">🥦</span>
            <span className="text-2xl font-bold">SAYUR</span>
          </button>
        </div>
      </div>
    </div>
  );
}

type ColorItem = { name: string; tw: string; emoji: string };
const COLORS: ColorItem[] = [
  { name: "Merah", tw: "bg-red-500", emoji: "🍎" },
  { name: "Kuning", tw: "bg-yellow-400", emoji: "🍌" },
  { name: "Hijau", tw: "bg-green-500", emoji: "🥦" },
  { name: "Biru", tw: "bg-blue-500", emoji: "🫐" },
  { name: "Ungu", tw: "bg-purple-500", emoji: "🍇" },
  { name: "Oranye", tw: "bg-orange-500", emoji: "🥕" },
];

function GameColor({ onBack }: { onBack: () => void }) {
  const TOTAL = 8;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState<ColorItem>(() => pickRandom(COLORS));
  const [options, setOptions] = useState<ColorItem[]>(() => shuffle(COLORS).slice(0, 4));
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const buildRound = () => {
    const t = pickRandom(COLORS);
    setTarget(t);
    const others = shuffle(COLORS.filter((c) => c.name !== t.name)).slice(0, 3);
    setOptions(shuffle([t, ...others]));
  };

  const handlePick = (c: ColorItem, idx: number) => {
    if (feedback !== "none") return;
    setPickedIdx(idx);
    if (c.name === target.name) {
      playCorrect();
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      playWrong();
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("none");
      setPickedIdx(null);
      if (round + 1 >= TOTAL) {
        setDone(true);
      } else {
        setRound((r) => r + 1);
        buildRound();
      }
    }, 700);
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setDone(false);
    buildRound();
  };

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-pink-200 to-rose-100">
        <Header title="Cocokin Warna" onBack={onBack} score={score} total={TOTAL} />
        <Confetti show />
        <FinishScreen onAgain={reset} onMenu={onBack} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-pink-200 to-rose-100">
      <Header title="Cocokin Warna" onBack={onBack} score={score} total={TOTAL} />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <p className="rounded-2xl bg-white/80 px-6 py-3 text-center text-2xl font-bold text-slate-700 shadow">
          Pilih warna <span className="font-extrabold">{target.name}</span>!
        </p>
        <div
          key={`target-${round}`}
          className={`flex h-32 w-32 items-center justify-center rounded-full text-7xl shadow-2xl ${target.tw} animate-pop-in`}
        >
          {target.emoji}
        </div>
        <div className="grid w-full max-w-md grid-cols-2 gap-4">
          {options.map((c, idx) => (
            <button
              key={`${round}-${c.name}`}
              onClick={() => handlePick(c, idx)}
              disabled={feedback !== "none"}
              className={`h-28 rounded-3xl shadow-lg ring-4 ring-white active:scale-95 disabled:opacity-70 ${c.tw} ${
                pickedIdx === idx && feedback === "wrong" ? "animate-shake" : ""
              } ${pickedIdx === idx && feedback === "correct" ? "ring-green-500" : ""}`}
              aria-label={c.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const COUNT_EMOJIS = ["⭐", "🐶", "🦋", "🌸", "🐠", "🍎", "🚗", "🎈"];

function GameCount({ onBack }: { onBack: () => void }) {
  const TOTAL = 8;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(() => 1 + Math.floor(Math.random() * 9));
  const [emoji, setEmoji] = useState(() => pickRandom(COUNT_EMOJIS));
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [pickedNum, setPickedNum] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const buildRound = () => {
    const c = 1 + Math.floor(Math.random() * 9);
    setCount(c);
    setEmoji(pickRandom(COUNT_EMOJIS));
    const opts = new Set<number>([c]);
    while (opts.size < 4) {
      const n = 1 + Math.floor(Math.random() * 10);
      opts.add(n);
    }
    setOptions(shuffle([...opts]));
  };

  useEffect(() => {
    buildRound();
  }, []);

  const handlePick = (n: number) => {
    if (feedback !== "none") return;
    setPickedNum(n);
    if (n === count) {
      playCorrect();
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      playWrong();
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("none");
      setPickedNum(null);
      if (round + 1 >= TOTAL) {
        setDone(true);
      } else {
        setRound((r) => r + 1);
        buildRound();
      }
    }, 700);
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setDone(false);
    buildRound();
  };

  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-200 to-cyan-100">
        <Header title="Hitung Angka" onBack={onBack} score={score} total={TOTAL} />
        <Confetti show />
        <FinishScreen onAgain={reset} onMenu={onBack} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-200 to-cyan-100">
      <Header title="Hitung Angka" onBack={onBack} score={score} total={TOTAL} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <p className="rounded-2xl bg-white/80 px-6 py-3 text-center text-2xl font-bold text-slate-700 shadow">
          Berapa banyak {emoji}?
        </p>
        <div
          key={`items-${round}`}
          className="flex max-w-md flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/70 p-6 shadow-lg"
        >
          {items.map((i) => (
            <span key={i} className="animate-pop-in text-5xl" style={{ animationDelay: `${i * 0.05}s` }}>
              {emoji}
            </span>
          ))}
        </div>
        <div className="grid w-full max-w-md grid-cols-4 gap-3">
          {options.map((n) => (
            <button
              key={`${round}-${n}`}
              onClick={() => handlePick(n)}
              disabled={feedback !== "none"}
              className={`h-20 rounded-3xl bg-white text-4xl font-extrabold text-sky-700 shadow-lg ring-4 ring-sky-300 active:scale-95 disabled:opacity-70 ${
                pickedNum === n && feedback === "wrong" ? "animate-shake bg-red-200" : ""
              } ${pickedNum === n && feedback === "correct" ? "bg-green-200 ring-green-500" : ""}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type AnimalItem = { emoji: string; name: string };
const ANIMALS: AnimalItem[] = [
  { emoji: "🐶", name: "Anjing" },
  { emoji: "🐱", name: "Kucing" },
  { emoji: "🐮", name: "Sapi" },
  { emoji: "🐷", name: "Babi" },
  { emoji: "🐵", name: "Monyet" },
  { emoji: "🦁", name: "Singa" },
  { emoji: "🐯", name: "Harimau" },
  { emoji: "🐰", name: "Kelinci" },
  { emoji: "🐸", name: "Katak" },
  { emoji: "🐔", name: "Ayam" },
  { emoji: "🐘", name: "Gajah" },
  { emoji: "🦒", name: "Jerapah" },
  { emoji: "🦓", name: "Zebra" },
  { emoji: "🐧", name: "Pinguin" },
  { emoji: "🐳", name: "Paus" },
  { emoji: "🐠", name: "Ikan" },
];

function GameShape({ onBack }: { onBack: () => void }) {
  const TOTAL = 8;
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState<AnimalItem>(() => pickRandom(ANIMALS));
  const [options, setOptions] = useState<AnimalItem[]>([]);
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [pickedName, setPickedName] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const buildRound = () => {
    const t = pickRandom(ANIMALS);
    setTarget(t);
    const others = shuffle(ANIMALS.filter((a) => a.name !== t.name)).slice(0, 3);
    setOptions(shuffle([t, ...others]));
  };

  useEffect(() => {
    buildRound();
  }, []);

  const handlePick = (a: AnimalItem) => {
    if (feedback !== "none") return;
    setPickedName(a.name);
    if (a.name === target.name) {
      playCorrect();
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      playWrong();
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("none");
      setPickedName(null);
      if (round + 1 >= TOTAL) {
        setDone(true);
      } else {
        setRound((r) => r + 1);
        buildRound();
      }
    }, 700);
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setDone(false);
    buildRound();
  };

  if (done) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-200 to-lime-100">
        <Header title="Tebak Hewan" onBack={onBack} score={score} total={TOTAL} />
        <Confetti show />
        <FinishScreen onAgain={reset} onMenu={onBack} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-200 to-lime-100">
      <Header title="Tebak Hewan" onBack={onBack} score={score} total={TOTAL} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <p className="rounded-2xl bg-white/80 px-6 py-3 text-center text-2xl font-bold text-slate-700 shadow">
          Mana <span className="font-extrabold">{target.name}</span>?
        </p>
        <div className="grid w-full max-w-md grid-cols-2 gap-4">
          {options.map((a) => (
            <button
              key={`${round}-${a.name}`}
              onClick={() => handlePick(a)}
              disabled={feedback !== "none"}
              className={`flex h-36 items-center justify-center rounded-3xl bg-white text-7xl shadow-lg ring-4 ring-emerald-300 active:scale-95 disabled:opacity-70 ${
                pickedName === a.name && feedback === "wrong" ? "animate-shake bg-red-100" : ""
              } ${pickedName === a.name && feedback === "correct" ? "bg-green-100 ring-green-500" : ""}`}
            >
              {a.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header({
  title,
  onBack,
  score,
  total,
}: {
  title: string;
  onBack: () => void;
  score: number;
  total: number;
}) {
  return (
    <header className="flex items-center justify-between gap-3 p-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-lg font-bold text-slate-700 shadow active:scale-95"
        aria-label="Kembali ke menu"
      >
        <ArrowLeft className="h-5 w-5" />
        Menu
      </button>
      <h1 className="hidden flex-1 text-center text-2xl font-extrabold text-slate-800 sm:block">{title}</h1>
      <ScoreBar score={score} total={total} />
    </header>
  );
}

function Menu({ onPick }: { onPick: (g: GameKey) => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-yellow-200 via-pink-200 to-purple-200">
      <header className="flex flex-col items-center gap-2 p-6 pt-10">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 animate-spin-slow text-yellow-500" />
          <h1 className="text-center text-4xl font-extrabold text-slate-800 sm:text-5xl">Game Balita</h1>
          <Sparkles className="h-8 w-8 animate-spin-slow text-yellow-500" />
        </div>
        <p className="text-center text-lg font-bold text-slate-700">Belajar sambil bermain — usia 2–5 tahun</p>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="grid w-full max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
          {GAMES.map((g) => (
            <button
              key={g.key}
              onClick={() => onPick(g.key)}
              className={`flex flex-col items-center gap-3 rounded-3xl ${g.bg} p-8 shadow-xl ring-4 ring-white transition active:scale-95 hover:scale-105`}
            >
              <span className="animate-bounce-up text-8xl">{g.emoji}</span>
              <span className="text-2xl font-extrabold text-white drop-shadow">{g.title}</span>
            </button>
          ))}
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-slate-600">
        Dibuat untuk anak-anak usia 2-5 tahun
      </footer>
    </div>
  );
}

function App() {
  const [game, setGame] = useState<GameKey>("menu");

  const goMenu = () => setGame("menu");

  if (game === "sort") return <GameSort onBack={goMenu} />;
  if (game === "color") return <GameColor onBack={goMenu} />;
  if (game === "count") return <GameCount onBack={goMenu} />;
  if (game === "shape") return <GameShape onBack={goMenu} />;
  return <Menu onPick={setGame} />;
}

export default App;
