import { useEffect } from "react";
import { ArrowLeft, Star, Trophy } from "lucide-react";
import { playWin } from "@/lib/gameAudio";

export function ScoreBar({ score, total }: { score: number; total: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow">
      <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
      <span className="text-lg font-bold text-slate-700">
        {score} / {total}
      </span>
    </div>
  );
}

export function GameHeader({
  title,
  onBack,
  score,
  total,
  hideScore = false,
}: {
  title: string;
  onBack: () => void;
  score?: number;
  total?: number;
  hideScore?: boolean;
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
      <h1 className="hidden flex-1 text-center text-2xl font-extrabold text-slate-800 sm:block">
        {title}
      </h1>
      {!hideScore && score !== undefined && total !== undefined ? (
        <ScoreBar score={score} total={total} />
      ) : (
        <div className="w-24" />
      )}
    </header>
  );
}

export function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  const colors = [
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-blue-400",
    "bg-pink-400",
    "bg-purple-400",
  ];
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

export function FinishScreen({
  onAgain,
  onMenu,
  message = "Kamu menyelesaikan semua soal!",
}: {
  onAgain: () => void;
  onMenu: () => void;
  message?: string;
}) {
  useEffect(() => {
    playWin();
  }, []);
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <Trophy className="h-28 w-28 animate-bounce-up text-yellow-500" />
      <h2 className="text-center text-4xl font-extrabold text-slate-800">Hebat!</h2>
      <p className="text-center text-2xl text-slate-700">{message}</p>
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

export function GameLayout({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return <div className={`flex min-h-screen flex-col ${bg}`}>{children}</div>;
}
