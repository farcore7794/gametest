import { useEffect, useState } from "react";
import { Confetti, FinishScreen, GameHeader, GameLayout } from "@/components/GameShell";
import { playCorrect, playWrong } from "@/lib/gameAudio";
import { pickRandom, shuffle } from "@/lib/gameUtils";

type Puzzle = {
  emoji: string;
  name: string;
};

const PUZZLES: Puzzle[] = [
  { emoji: "🦋", name: "Kupu-Kupu" },
  { emoji: "🐢", name: "Penyu" },
  { emoji: "🐘", name: "Gajah" },
  { emoji: "🦒", name: "Jerapah" },
  { emoji: "🌻", name: "Bunga Matahari" },
  { emoji: "🚂", name: "Kereta" },
  { emoji: "🚀", name: "Roket" },
  { emoji: "🏠", name: "Rumah" },
  { emoji: "🐯", name: "Harimau" },
];

const PIECE_COUNT = 4;
const TOTAL = 5;

type Slot = { idx: number; filledBy: number | null };
type Piece = { id: number; correctIdx: number };

function buildPuzzle(): { puzzle: Puzzle; pieces: Piece[]; slots: Slot[] } {
  const puzzle = pickRandom(PUZZLES);
  const pieces = shuffle(
    Array.from({ length: PIECE_COUNT }, (_, i) => ({ id: i, correctIdx: i }))
  );
  const slots = Array.from({ length: PIECE_COUNT }, (_, i) => ({ idx: i, filledBy: null as number | null }));
  return { puzzle, pieces, slots };
}

export function TekaTekiJigsaw({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [{ puzzle, pieces, slots }, setState] = useState(buildPuzzle);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const allFilled = slots.every((s) => s.filledBy !== null);

  useEffect(() => {
    if (allFilled) {
      setTimeout(() => {
        if (round + 1 >= TOTAL) {
          setDone(true);
        } else {
          setRound((r) => r + 1);
          setScore((s) => s + 1);
          setState(buildPuzzle());
        }
      }, 900);
    }
  }, [allFilled, round]);

  const handleSlot = (slotIdx: number) => {
    if (selectedPiece === null) return;
    const slot = slots[slotIdx];
    if (slot.filledBy !== null) return;
    const piece = pieces.find((p) => p.id === selectedPiece);
    if (!piece) return;
    if (piece.correctIdx === slotIdx) {
      playCorrect();
      setState((st) => ({
        ...st,
        slots: st.slots.map((s, i) => (i === slotIdx ? { ...s, filledBy: piece.id } : s)),
        pieces: st.pieces.filter((p) => p.id !== piece.id),
      }));
      setSelectedPiece(null);
    } else {
      playWrong();
      setSelectedPiece(null);
    }
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setDone(false);
    setState(buildPuzzle());
    setSelectedPiece(null);
  };

  if (done) {
    return (
      <GameLayout bg="bg-gradient-to-b from-violet-200 to-indigo-100">
        <GameHeader title="Teka-teki Jigsaw" onBack={onBack} score={score + 1} total={TOTAL} />
        <Confetti show />
        <FinishScreen onAgain={reset} onMenu={onBack} message="Semua puzzle berhasil disusun!" />
      </GameLayout>
    );
  }

  // Render each slot showing the piece slice if filled
  // We simulate slices using transform-translate within an emoji
  return (
    <GameLayout bg="bg-gradient-to-b from-violet-200 to-indigo-100">
      <GameHeader title="Teka-teki Jigsaw" onBack={onBack} score={score} total={TOTAL} />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
        <div className="rounded-2xl bg-white/80 px-6 py-3 text-center text-xl font-bold text-slate-700 shadow">
          Susun puzzle <span className="font-extrabold">{puzzle.name}</span>!
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-3xl bg-white p-3 shadow-2xl ring-4 ring-violet-300">
          {slots.map((s, i) => (
            <button
              key={`slot-${round}-${i}`}
              onClick={() => handleSlot(i)}
              className={`flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl bg-violet-50 text-7xl ${
                s.filledBy !== null ? "" : "border-4 border-dashed border-violet-300"
              }`}
            >
              {s.filledBy !== null && (
                <PieceSlice emoji={puzzle.emoji} sliceIdx={i} />
              )}
            </button>
          ))}
        </div>
        <p className="text-base font-bold text-slate-700">Pilih kepingan, lalu tekan kotaknya:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {pieces.map((p) => (
            <button
              key={`piece-${round}-${p.id}`}
              onClick={() => setSelectedPiece(p.id)}
              className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg ring-4 transition ${
                selectedPiece === p.id ? "ring-violet-500 scale-110" : "ring-violet-200"
              }`}
            >
              <PieceSlice emoji={puzzle.emoji} sliceIdx={p.correctIdx} small />
            </button>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}

function PieceSlice({
  emoji,
  sliceIdx,
  small = false,
}: {
  emoji: string;
  sliceIdx: number;
  small?: boolean;
}) {
  const size = small ? "w-20 h-20" : "w-28 h-28";
  const fontSize = small ? "text-[140px]" : "text-[200px]";
  const dx = sliceIdx % 2 === 0 ? "0%" : "-50%";
  const dy = sliceIdx < 2 ? "0%" : "-50%";
  return (
    <div className={`relative overflow-hidden ${size}`}>
      <div
        className={`absolute leading-none ${fontSize}`}
        style={{ transform: `translate(${dx}, ${dy})`, top: 0, left: 0 }}
      >
        {emoji}
      </div>
    </div>
  );
}
