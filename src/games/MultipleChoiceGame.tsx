import { useState, type ReactNode } from "react";
import { Confetti, FinishScreen, GameHeader, GameLayout } from "@/components/GameShell";
import { playCorrect, playWrong } from "@/lib/gameAudio";

export type MCOption = {
  key: string;
  label?: string;
  emoji?: string;
  bg?: string;
};

export type MCRound = {
  prompt: ReactNode;
  visual?: ReactNode;
  options: MCOption[];
  correctKey: string;
};

export type MCGameProps = {
  title: string;
  bg: string;
  total?: number;
  buildRound: () => MCRound;
  optionStyle?: "tile" | "color" | "letter" | "tile-large";
  ringColor?: string;
  onBack: () => void;
};

export function MultipleChoiceGame({
  title,
  bg,
  total = 8,
  buildRound,
  optionStyle = "tile",
  ringColor = "ring-white",
  onBack,
}: MCGameProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [data, setData] = useState<MCRound>(() => buildRound());
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [pickedKey, setPickedKey] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handlePick = (opt: MCOption) => {
    if (feedback !== "none") return;
    setPickedKey(opt.key);
    if (opt.key === data.correctKey) {
      playCorrect();
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      playWrong();
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("none");
      setPickedKey(null);
      if (round + 1 >= total) {
        setDone(true);
      } else {
        setRound((r) => r + 1);
        setData(buildRound());
      }
    }, 700);
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setDone(false);
    setData(buildRound());
  };

  if (done) {
    return (
      <GameLayout bg={bg}>
        <GameHeader title={title} onBack={onBack} score={score} total={total} />
        <Confetti show />
        <FinishScreen onAgain={reset} onMenu={onBack} />
      </GameLayout>
    );
  }

  const cols = data.options.length <= 2 ? "grid-cols-2" : "grid-cols-2";

  return (
    <GameLayout bg={bg}>
      <GameHeader title={title} onBack={onBack} score={score} total={total} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="rounded-2xl bg-white/80 px-6 py-3 text-center text-2xl font-bold text-slate-700 shadow">
          {data.prompt}
        </div>
        {data.visual && (
          <div key={`visual-${round}`} className="animate-pop-in">
            {data.visual}
          </div>
        )}
        <div className={`grid w-full max-w-md gap-4 ${cols}`}>
          {data.options.map((opt) => {
            const wrong = pickedKey === opt.key && feedback === "wrong";
            const correct = pickedKey === opt.key && feedback === "correct";

            if (optionStyle === "color") {
              return (
                <button
                  key={`${round}-${opt.key}`}
                  onClick={() => handlePick(opt)}
                  disabled={feedback !== "none"}
                  className={`h-28 rounded-3xl shadow-lg ring-4 ${ringColor} active:scale-95 disabled:opacity-70 ${opt.bg ?? ""} ${
                    wrong ? "animate-shake" : ""
                  } ${correct ? "ring-green-500" : ""}`}
                  aria-label={opt.label ?? opt.key}
                />
              );
            }

            if (optionStyle === "letter") {
              return (
                <button
                  key={`${round}-${opt.key}`}
                  onClick={() => handlePick(opt)}
                  disabled={feedback !== "none"}
                  className={`h-24 rounded-3xl bg-white text-5xl font-extrabold text-slate-700 shadow-lg ring-4 ${ringColor} active:scale-95 disabled:opacity-70 ${
                    wrong ? "animate-shake bg-red-100" : ""
                  } ${correct ? "bg-green-100 ring-green-500" : ""}`}
                >
                  {opt.label}
                </button>
              );
            }

            if (optionStyle === "tile-large") {
              return (
                <button
                  key={`${round}-${opt.key}`}
                  onClick={() => handlePick(opt)}
                  disabled={feedback !== "none"}
                  className={`flex h-36 items-center justify-center rounded-3xl bg-white text-7xl shadow-lg ring-4 ${ringColor} active:scale-95 disabled:opacity-70 ${
                    wrong ? "animate-shake bg-red-100" : ""
                  } ${correct ? "bg-green-100 ring-green-500" : ""}`}
                >
                  {opt.emoji}
                </button>
              );
            }

            return (
              <button
                key={`${round}-${opt.key}`}
                onClick={() => handlePick(opt)}
                disabled={feedback !== "none"}
                className={`flex flex-col items-center gap-2 rounded-3xl p-6 text-white shadow-lg active:scale-95 disabled:opacity-70 ${opt.bg ?? "bg-slate-400"} ${
                  wrong ? "animate-shake" : ""
                } ${correct ? "ring-4 ring-green-500" : ""}`}
              >
                {opt.emoji && <span className="text-6xl">{opt.emoji}</span>}
                {opt.label && <span className="text-2xl font-bold">{opt.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
