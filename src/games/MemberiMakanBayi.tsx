import { useState } from "react";
import { Confetti, FinishScreen, GameHeader, GameLayout } from "@/components/GameShell";
import { playPop, playWin } from "@/lib/gameAudio";
import { pickN, shuffle } from "@/lib/gameUtils";

const FOODS = ["🍎", "🍌", "🍓", "🥕", "🍞", "🍪", "🥛", "🍰", "🥦", "🍇"];
const TARGET = 6;

export function MemberiMakanBayi({ onBack }: { onBack: () => void }) {
  const [foods, setFoods] = useState<string[]>(() => pickN(shuffle(FOODS), TARGET));
  const [eaten, setEaten] = useState(0);
  const [chewing, setChewing] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const feed = (idx: number, emoji: string) => {
    if (chewing) return;
    setChewing(emoji);
    playPop();
    setFoods((f) => f.filter((_, i) => i !== idx));
    setEaten((e) => e + 1);
    setTimeout(() => {
      setChewing(null);
      if (eaten + 1 >= TARGET) {
        playWin();
        setDone(true);
      }
    }, 500);
  };

  const reset = () => {
    setFoods(pickN(shuffle(FOODS), TARGET));
    setEaten(0);
    setChewing(null);
    setDone(false);
  };

  if (done) {
    return (
      <GameLayout bg="bg-gradient-to-b from-amber-200 to-orange-100">
        <GameHeader title="Memberi Makan Bayi" onBack={onBack} score={eaten} total={TARGET} />
        <Confetti show />
        <FinishScreen onAgain={reset} onMenu={onBack} message="Bayi sudah kenyang!" />
      </GameLayout>
    );
  }

  return (
    <GameLayout bg="bg-gradient-to-b from-amber-200 to-orange-100">
      <GameHeader title="Memberi Makan Bayi" onBack={onBack} score={eaten} total={TARGET} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <div className="rounded-2xl bg-white/80 px-6 py-3 text-center text-xl font-bold text-slate-700 shadow">
          Suapin bayi! Tekan makanannya.
        </div>
        <div className="flex h-48 w-48 items-center justify-center rounded-full bg-pink-200 text-9xl shadow-xl ring-8 ring-white">
          {chewing ? "😋" : "👶"}
        </div>
        <div className="grid w-full max-w-md grid-cols-3 gap-3">
          {foods.map((f, idx) => (
            <button
              key={`${idx}-${f}`}
              onClick={() => feed(idx, f)}
              disabled={!!chewing}
              className="flex h-20 items-center justify-center rounded-3xl bg-white text-5xl shadow-lg ring-4 ring-amber-300 active:scale-95 disabled:opacity-70"
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}
