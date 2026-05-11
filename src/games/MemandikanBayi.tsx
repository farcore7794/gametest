import { useState } from "react";
import { Confetti, FinishScreen, GameHeader, GameLayout } from "@/components/GameShell";
import { playSplash, playWin } from "@/lib/gameAudio";

type Spot = { x: number; y: number; emoji: string };

const STAGES: Spot[][] = [
  [
    { x: 30, y: 25, emoji: "💩" },
    { x: 65, y: 35, emoji: "💩" },
    { x: 50, y: 60, emoji: "💩" },
    { x: 25, y: 70, emoji: "💩" },
    { x: 70, y: 75, emoji: "💩" },
  ],
];

export function MemandikanBayi({ onBack }: { onBack: () => void }) {
  const [spots, setSpots] = useState<Spot[]>(STAGES[0]);
  const [done, setDone] = useState(false);
  const initial = STAGES[0].length;

  const wash = (idx: number) => {
    playSplash();
    setSpots((s) => {
      const next = s.filter((_, i) => i !== idx);
      if (next.length === 0) {
        setTimeout(() => {
          playWin();
          setDone(true);
        }, 250);
      }
      return next;
    });
  };

  const reset = () => {
    setSpots(STAGES[0]);
    setDone(false);
  };

  const cleaned = initial - spots.length;

  if (done) {
    return (
      <GameLayout bg="bg-gradient-to-b from-sky-200 to-blue-100">
        <GameHeader title="Memandikan Bayi" onBack={onBack} score={cleaned} total={initial} />
        <Confetti show />
        <FinishScreen onAgain={reset} onMenu={onBack} message="Bayi sudah bersih dan wangi!" />
      </GameLayout>
    );
  }

  return (
    <GameLayout bg="bg-gradient-to-b from-sky-200 to-blue-100">
      <GameHeader title="Memandikan Bayi" onBack={onBack} score={cleaned} total={initial} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <div className="rounded-2xl bg-white/80 px-6 py-3 text-center text-xl font-bold text-slate-700 shadow">
          Tekan kotoran 🧽 untuk membersihkan bayi!
        </div>
        <div className="relative h-80 w-80 rounded-full bg-pink-200 shadow-xl ring-8 ring-white">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl">
            👶
          </span>
          {spots.map((s, idx) => (
            <button
              key={`${s.x}-${s.y}-${idx}`}
              onClick={() => wash(idx)}
              className="absolute -translate-x-1/2 -translate-y-1/2 animate-wiggle text-4xl active:scale-50"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              aria-label="Bersihkan"
            >
              {s.emoji}
            </button>
          ))}
        </div>
        <p className="px-6 text-center text-sm text-slate-600">
          Sisa kotoran: {spots.length}
        </p>
      </div>
    </GameLayout>
  );
}
