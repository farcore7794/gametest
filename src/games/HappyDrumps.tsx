import { useState } from "react";
import { GameHeader, GameLayout } from "@/components/GameShell";
import { playDrum } from "@/lib/gameAudio";

type Drum = {
  name: string;
  emoji: string;
  pitch: number;
  bg: string;
};

const DRUMS: Drum[] = [
  { name: "Do", emoji: "🥁", pitch: 261, bg: "bg-red-400" },
  { name: "Re", emoji: "🪘", pitch: 293, bg: "bg-orange-400" },
  { name: "Mi", emoji: "🥁", pitch: 329, bg: "bg-yellow-400" },
  { name: "Fa", emoji: "🪘", pitch: 349, bg: "bg-green-400" },
  { name: "Sol", emoji: "🥁", pitch: 392, bg: "bg-cyan-400" },
  { name: "La", emoji: "🪘", pitch: 440, bg: "bg-blue-400" },
  { name: "Si", emoji: "🥁", pitch: 493, bg: "bg-purple-400" },
  { name: "Do'", emoji: "🪘", pitch: 523, bg: "bg-pink-400" },
];

export function HappyDrumps({ onBack }: { onBack: () => void }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleHit = (idx: number, d: Drum) => {
    setActiveIdx(idx);
    playDrum(d.pitch);
    setTimeout(() => setActiveIdx(null), 200);
  };

  return (
    <GameLayout bg="bg-gradient-to-b from-purple-200 to-fuchsia-100">
      <GameHeader title="Happy Drumps" onBack={onBack} hideScore />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="rounded-2xl bg-white/80 px-6 py-3 text-center text-2xl font-bold text-slate-700 shadow">
          Tabuh drum-nya! 🎵
        </div>
        <div className="grid w-full max-w-md grid-cols-4 gap-3">
          {DRUMS.map((d, idx) => (
            <button
              key={d.name}
              onClick={() => handleHit(idx, d)}
              className={`flex h-32 flex-col items-center justify-center gap-1 rounded-3xl shadow-lg ring-4 ring-white active:scale-95 ${d.bg} ${
                activeIdx === idx ? "scale-110" : ""
              }`}
            >
              <span className="text-5xl">{d.emoji}</span>
              <span className="text-lg font-extrabold text-white drop-shadow">{d.name}</span>
            </button>
          ))}
        </div>
        <p className="px-6 text-center text-base text-slate-600">
          Tekan tombol drum untuk memainkan nada Do-Re-Mi.
        </p>
      </div>
    </GameLayout>
  );
}
