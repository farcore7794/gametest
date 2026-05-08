import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { Confetti, FinishScreen, GameHeader, GameLayout } from "@/components/GameShell";
import {
  playAnimalSound,
  playCorrect,
  playWrong,
  playPop,
  speak,
  stopSpeak,
} from "@/lib/gameAudio";
import { pickN, pickRandom, shuffle } from "@/lib/gameUtils";

export type HideItem = { emoji: string; name: string };

export type HideGameAudio = {
  /** If true, speak the target's name on each round. */
  speak?: boolean;
  /** If true, also play an animal mp3 if one exists for the target name. */
  animal?: boolean;
};

export type HideRound = {
  target: HideItem;
  options: HideItem[];
};

export type HideGameProps = {
  title: string;
  bg: string;
  pool: HideItem[];
  total?: number;
  optionCount?: number;
  boxEmoji: string;
  promptPrefix: string;
  audio?: HideGameAudio;
  onBack: () => void;
};

function buildHideRound(pool: HideItem[], optionCount: number): HideRound {
  const target = pickRandom(pool);
  const others = pickN(
    pool.filter((p) => p.name !== target.name),
    optionCount - 1
  );
  return { target, options: shuffle([target, ...others]) };
}

export function HideAndFindGame({
  title,
  bg,
  pool,
  total = 6,
  optionCount = 4,
  boxEmoji,
  promptPrefix,
  audio,
  onBack,
}: HideGameProps) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [data, setData] = useState<HideRound>(() => buildHideRound(pool, optionCount));
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const [pickedKey, setPickedKey] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setRevealed({});
  }, [round]);

  const playRoundAudio = () => {
    if (!audio) return;
    const name = data.target.name;
    if (audio.animal && playAnimalSound(name)) {
      if (audio.speak) setTimeout(() => speak(name), 700);
      return;
    }
    if (audio.speak) speak(name);
  };

  useEffect(() => {
    if (done) return;
    playRoundAudio();
    return () => stopSpeak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, done]);

  const handlePick = (it: HideItem) => {
    if (feedback !== "none") return;
    setPickedKey(it.name);
    setRevealed((r) => ({ ...r, [it.name]: true }));
    if (it.name === data.target.name) {
      playCorrect();
      setFeedback("correct");
      setScore((s) => s + 1);
    } else {
      playWrong();
      playPop();
      setFeedback("wrong");
    }
    setTimeout(() => {
      setFeedback("none");
      setPickedKey(null);
      if (round + 1 >= total) {
        setDone(true);
      } else {
        setRound((r) => r + 1);
        setData(buildHideRound(pool, optionCount));
      }
    }, 900);
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setDone(false);
    setData(buildHideRound(pool, optionCount));
    setRevealed({});
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

  return (
    <GameLayout bg={bg}>
      <GameHeader title={title} onBack={onBack} score={score} total={total} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-2xl bg-white/80 px-6 py-3 text-center text-2xl font-bold text-slate-700 shadow">
            {promptPrefix}{" "}
            <span className="font-extrabold">
              {data.target.emoji} {data.target.name}
            </span>
            !
          </div>
          {audio && (
            <button
              type="button"
              onClick={playRoundAudio}
              className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-base font-bold text-sky-600 shadow ring-2 ring-sky-200 active:scale-95"
              aria-label="Putar suara"
            >
              <Volume2 className="h-5 w-5" />
              Putar suara
            </button>
          )}
        </div>
        <div className="grid w-full max-w-md grid-cols-2 gap-4">
          {data.options.map((opt) => {
            const isOpen = revealed[opt.name];
            const wrong = pickedKey === opt.name && feedback === "wrong";
            const correct = pickedKey === opt.name && feedback === "correct";
            return (
              <button
                key={`${round}-${opt.name}`}
                onClick={() => handlePick(opt)}
                disabled={feedback !== "none"}
                className={`flex h-36 items-center justify-center rounded-3xl bg-white text-7xl shadow-lg ring-4 ring-amber-300 transition active:scale-95 disabled:opacity-70 ${
                  wrong ? "animate-shake bg-red-100" : ""
                } ${correct ? "bg-green-100 ring-green-500" : ""}`}
              >
                {isOpen ? opt.emoji : boxEmoji}
              </button>
            );
          })}
        </div>
      </div>
    </GameLayout>
  );
}
