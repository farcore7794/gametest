import { useState } from "react";
import { Sparkles } from "lucide-react";
import "./App.css";
import {
  CocokinWarna,
  GameEjaan,
  GameTraktor,
  HitungAngka,
  KotakMainan,
  MemberiMakanHewan,
  MenyembunyikanHewan,
  MenyortirBarang,
  PetualanganLaut,
  PeternakanLiar,
  SortirBuahSayur,
  TebakHewan,
} from "@/games/definitions";
import { HappyDrumps } from "@/games/HappyDrumps";
import { SelamatkanHewan } from "@/games/SelamatkanHewan";
import { MemandikanBayi } from "@/games/MemandikanBayi";
import { MemberiMakanBayi } from "@/games/MemberiMakanBayi";
import { TekaTekiJigsaw } from "@/games/TekaTekiJigsaw";

type GameKey =
  | "menu"
  | "sort"
  | "traktor"
  | "color"
  | "count"
  | "animal"
  | "farmwild"
  | "feedanimal"
  | "sortbarang"
  | "sea"
  | "spelling"
  | "hideanimal"
  | "toybox"
  | "rescue"
  | "drumps"
  | "babybath"
  | "babyfeed"
  | "jigsaw";

type GameMeta = {
  key: Exclude<GameKey, "menu">;
  title: string;
  emoji: string;
  bg: string;
};

const GAMES: GameMeta[] = [
  { key: "sort", title: "Sortir Buah & Sayur", emoji: "🍎🥕", bg: "bg-orange-300" },
  { key: "traktor", title: "Game Traktor", emoji: "🚜", bg: "bg-amber-400" },
  { key: "color", title: "Taman Warna", emoji: "🎨", bg: "bg-pink-300" },
  { key: "count", title: "Hitung Angka", emoji: "🔢", bg: "bg-sky-300" },
  { key: "animal", title: "Tebak Hewan", emoji: "🐯", bg: "bg-emerald-300" },
  { key: "farmwild", title: "Peternakan vs Liar", emoji: "🐮🦁", bg: "bg-lime-400" },
  { key: "feedanimal", title: "Beri Makan Hewan", emoji: "🐰🥕", bg: "bg-teal-300" },
  { key: "sortbarang", title: "Sortir Barang", emoji: "🧸👕", bg: "bg-fuchsia-300" },
  { key: "sea", title: "Petualangan Laut", emoji: "🐳", bg: "bg-cyan-400" },
  { key: "spelling", title: "Game Ejaan", emoji: "🔤", bg: "bg-indigo-300" },
  { key: "hideanimal", title: "Cari Hewan", emoji: "🌿🐰", bg: "bg-amber-300" },
  { key: "toybox", title: "Kotak Mainan", emoji: "📦🧸", bg: "bg-rose-300" },
  { key: "rescue", title: "Selamatkan Hewan", emoji: "🔓🐶", bg: "bg-green-400" },
  { key: "drumps", title: "Happy Drumps", emoji: "🥁", bg: "bg-purple-400" },
  { key: "babybath", title: "Mandi Bayi", emoji: "🧽👶", bg: "bg-blue-300" },
  { key: "babyfeed", title: "Suapin Bayi", emoji: "🍎👶", bg: "bg-orange-200" },
  { key: "jigsaw", title: "Teka-teki Jigsaw", emoji: "🧩", bg: "bg-violet-400" },
];

function Menu({ onPick }: { onPick: (g: GameKey) => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-yellow-200 via-pink-200 to-purple-200">
      <header className="flex flex-col items-center gap-2 p-6 pt-8">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 animate-spin-slow text-yellow-500" />
          <h1 className="text-center text-4xl font-extrabold text-slate-800 sm:text-5xl">
            Game Balita
          </h1>
          <Sparkles className="h-8 w-8 animate-spin-slow text-yellow-500" />
        </div>
        <p className="text-center text-base font-bold text-slate-700 sm:text-lg">
          Belajar sambil bermain — usia 2–5 tahun
        </p>
      </header>
      <main className="flex flex-1 items-center justify-center p-4 pb-10">
        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {GAMES.map((g) => (
            <button
              key={g.key}
              onClick={() => onPick(g.key)}
              className={`flex flex-col items-center gap-2 rounded-3xl ${g.bg} p-4 shadow-xl ring-4 ring-white transition active:scale-95 hover:scale-105 sm:p-5`}
            >
              <span className="text-5xl sm:text-6xl">{g.emoji}</span>
              <span className="text-center text-sm font-extrabold leading-tight text-white drop-shadow sm:text-base">
                {g.title}
              </span>
            </button>
          ))}
        </div>
      </main>
      <footer className="p-4 text-center text-xs text-slate-600">
        17 mini-game · Tanpa iklan · Tanpa tracking
      </footer>
    </div>
  );
}

function App() {
  const [game, setGame] = useState<GameKey>("menu");
  const goMenu = () => setGame("menu");

  switch (game) {
    case "sort":
      return <SortirBuahSayur onBack={goMenu} />;
    case "traktor":
      return <GameTraktor onBack={goMenu} />;
    case "color":
      return <CocokinWarna onBack={goMenu} />;
    case "count":
      return <HitungAngka onBack={goMenu} />;
    case "animal":
      return <TebakHewan onBack={goMenu} />;
    case "farmwild":
      return <PeternakanLiar onBack={goMenu} />;
    case "feedanimal":
      return <MemberiMakanHewan onBack={goMenu} />;
    case "sortbarang":
      return <MenyortirBarang onBack={goMenu} />;
    case "sea":
      return <PetualanganLaut onBack={goMenu} />;
    case "spelling":
      return <GameEjaan onBack={goMenu} />;
    case "hideanimal":
      return <MenyembunyikanHewan onBack={goMenu} />;
    case "toybox":
      return <KotakMainan onBack={goMenu} />;
    case "rescue":
      return <SelamatkanHewan onBack={goMenu} />;
    case "drumps":
      return <HappyDrumps onBack={goMenu} />;
    case "babybath":
      return <MemandikanBayi onBack={goMenu} />;
    case "babyfeed":
      return <MemberiMakanBayi onBack={goMenu} />;
    case "jigsaw":
      return <TekaTekiJigsaw onBack={goMenu} />;
    default:
      return <Menu onPick={setGame} />;
  }
}

export default App;
