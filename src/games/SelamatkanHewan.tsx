import { useEffect, useState } from "react";
import { Confetti, FinishScreen, GameHeader, GameLayout } from "@/components/GameShell";
import { playPop, playCorrect } from "@/lib/gameAudio";
import { pickN } from "@/lib/gameUtils";
import { ANIMALS } from "@/games/data";

const TARGET = 6;

export function SelamatkanHewan({ onBack }: { onBack: () => void }) {
  const [pool, setPool] = useState(() => pickN(ANIMALS, TARGET));
  const [freed, setFreed] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (freed.length >= TARGET) {
      setTimeout(() => {
        playCorrect();
        setDone(true);
      }, 400);
    }
  }, [freed.length]);

  const free = (name: string) => {
    if (freed.includes(name)) return;
    playPop();
    setFreed((f) => [...f, name]);
  };

  const reset = () => {
    setPool(pickN(ANIMALS, TARGET));
    setFreed([]);
    setDone(false);
  };

  if (done) {
    return (
      <GameLayout bg="bg-gradient-to-b from-green-200 to-emerald-100">
        <GameHeader title="Selamatkan Hewan" onBack={onBack} score={freed.length} total={TARGET} />
        <Confetti show />
        <FinishScreen onAgain={reset} onMenu={onBack} message="Semua hewan berhasil diselamatkan!" />
      </GameLayout>
    );
  }

  return (
    <GameLayout bg="bg-gradient-to-b from-green-200 to-emerald-100">
      <GameHeader title="Selamatkan Hewan" onBack={onBack} score={freed.length} total={TARGET} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="rounded-2xl bg-white/80 px-6 py-3 text-center text-2xl font-bold text-slate-700 shadow">
          Tekan kandang untuk membebaskan hewan!
        </div>
        <div className="grid w-full max-w-lg grid-cols-3 gap-4">
          {pool.map((a) => {
            const isFree = freed.includes(a.name);
            return (
              <button
                key={a.name}
                onClick={() => free(a.name)}
                disabled={isFree}
                className={`flex h-32 flex-col items-center justify-center rounded-3xl text-6xl shadow-lg ring-4 ring-white transition active:scale-95 ${
                  isFree ? "animate-bounce-up bg-green-200" : "bg-stone-300"
                }`}
                aria-label={a.name}
              >
                {isFree ? (
                  <span>{a.emoji}</span>
                ) : (
                  <span className="text-7xl">🔒</span>
                )}
                <span className="text-sm font-bold text-slate-700">{a.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
