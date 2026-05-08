import {
  ANIMALS,
  COLORS,
  FRUITS_VEGGIES,
  SEA_ANIMALS,
  SORT_ITEMS,
  SPELLING_ITEMS,
  type AnimalItem,
} from "@/games/data";
import { MultipleChoiceGame, type MCRound } from "@/games/MultipleChoiceGame";
import { HideAndFindGame } from "@/games/HideAndFindGame";
import { TOYS } from "@/games/data";
import { pickN, pickRandom, shuffle } from "@/lib/gameUtils";

// ===== Sortir Buah & Sayur (BUAH/SAYUR) =====
export function SortirBuahSayur({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const item = pickRandom(FRUITS_VEGGIES);
    return {
      prompt: "Ini buah atau sayur?",
      visual: (
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white text-9xl shadow-2xl">
            {item.emoji}
          </div>
          <p className="text-2xl font-bold text-slate-700">{item.name}</p>
        </div>
      ),
      options: [
        { key: "buah", label: "BUAH", emoji: "🍎", bg: "bg-red-400" },
        { key: "sayur", label: "SAYUR", emoji: "🥦", bg: "bg-green-500" },
      ],
      correctKey: item.type,
      audio: { speak: item.name },
    };
  };
  return (
    <MultipleChoiceGame
      title="Sortir Buah & Sayur"
      bg="bg-gradient-to-b from-orange-200 to-yellow-100"
      buildRound={buildRound}
      onBack={onBack}
    />
  );
}

// ===== Game Traktor: Muat ke traktor buah / traktor sayur =====
export function GameTraktor({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const item = pickRandom(FRUITS_VEGGIES);
    return {
      prompt: `Muat ${item.name} ${item.emoji} ke traktor mana?`,
      visual: (
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-7xl shadow-xl">
          {item.emoji}
        </div>
      ),
      options: [
        { key: "buah", label: "Traktor Buah", emoji: "🚜🍎", bg: "bg-red-400" },
        { key: "sayur", label: "Traktor Sayur", emoji: "🚜🥕", bg: "bg-green-500" },
      ],
      correctKey: item.type,
      audio: { speak: item.name },
    };
  };
  return (
    <MultipleChoiceGame
      title="Game Traktor"
      bg="bg-gradient-to-b from-yellow-200 to-amber-100"
      buildRound={buildRound}
      onBack={onBack}
    />
  );
}

// ===== Cocokin Warna =====
export function CocokinWarna({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const t = pickRandom(COLORS);
    const others = pickN(
      COLORS.filter((c) => c.name !== t.name),
      3
    );
    const opts = shuffle([t, ...others]);
    return {
      prompt: (
        <>
          Pilih warna <span className="font-extrabold">{t.name}</span>!
        </>
      ),
      visual: (
        <div
          className={`flex h-28 w-28 items-center justify-center rounded-full text-6xl shadow-2xl ${t.tw}`}
        >
          {t.emoji}
        </div>
      ),
      options: opts.map((c) => ({ key: c.name, label: c.name, bg: c.tw })),
      correctKey: t.name,
    };
  };
  return (
    <MultipleChoiceGame
      title="Cocokin Warna (Taman Hiburan)"
      bg="bg-gradient-to-b from-pink-200 to-rose-100"
      buildRound={buildRound}
      optionStyle="color"
      onBack={onBack}
    />
  );
}

// ===== Hitung Angka =====
const COUNT_EMOJIS = ["⭐", "🐶", "🦋", "🌸", "🐠", "🍎", "🚗", "🎈"];
export function HitungAngka({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const c = 1 + Math.floor(Math.random() * 9);
    const emoji = pickRandom(COUNT_EMOJIS);
    const opts = new Set<number>([c]);
    while (opts.size < 4) {
      const n = 1 + Math.floor(Math.random() * 10);
      opts.add(n);
    }
    const optionList = shuffle([...opts]);
    return {
      prompt: <>Berapa banyak {emoji}?</>,
      visual: (
        <div className="flex max-w-md flex-wrap items-center justify-center gap-3 rounded-3xl bg-white/70 p-6 shadow-lg">
          {Array.from({ length: c }, (_, i) => (
            <span
              key={i}
              className="animate-pop-in text-5xl"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      ),
      options: optionList.map((n) => ({ key: String(n), label: String(n) })),
      correctKey: String(c),
    };
  };
  return (
    <MultipleChoiceGame
      title="Hitung Angka"
      bg="bg-gradient-to-b from-sky-200 to-cyan-100"
      buildRound={buildRound}
      optionStyle="letter"
      ringColor="ring-sky-300"
      onBack={onBack}
    />
  );
}

// ===== Tebak Hewan =====
export function TebakHewan({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const t = pickRandom(ANIMALS);
    const others = pickN(
      ANIMALS.filter((a) => a.name !== t.name),
      3
    );
    const opts = shuffle([t, ...others]);
    return {
      prompt: (
        <>
          Mana <span className="font-extrabold">{t.name}</span>?
        </>
      ),
      options: opts.map((a) => ({ key: a.name, emoji: a.emoji })),
      correctKey: t.name,
      audio: { speak: t.name, animal: t.name },
    };
  };
  return (
    <MultipleChoiceGame
      title="Tebak Hewan"
      bg="bg-gradient-to-b from-emerald-200 to-lime-100"
      buildRound={buildRound}
      optionStyle="tile-large"
      ringColor="ring-emerald-300"
      onBack={onBack}
    />
  );
}

// ===== Peternakan vs Liar =====
export function PeternakanLiar({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const farmAndWild = ANIMALS.filter(
      (a): a is AnimalItem & { habitat: "peternakan" | "liar" } =>
        a.habitat === "peternakan" || a.habitat === "liar"
    );
    const a = pickRandom(farmAndWild);
    return {
      prompt: <>Hewan ini hidup di mana?</>,
      visual: (
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white text-8xl shadow-2xl">
            {a.emoji}
          </div>
          <p className="text-2xl font-bold text-slate-700">{a.name}</p>
        </div>
      ),
      options: [
        { key: "peternakan", label: "PETERNAKAN", emoji: "🏡", bg: "bg-amber-500" },
        { key: "liar", label: "HUTAN LIAR", emoji: "🌳", bg: "bg-green-700" },
      ],
      correctKey: a.habitat,
      audio: { speak: a.name, animal: a.name },
    };
  };
  return (
    <MultipleChoiceGame
      title="Peternakan vs Liar"
      bg="bg-gradient-to-b from-lime-200 to-yellow-100"
      buildRound={buildRound}
      onBack={onBack}
    />
  );
}

// ===== Memberi Makan Hewan =====
export function MemberiMakanHewan({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const a = pickRandom(ANIMALS);
    const wrongFoods = ANIMALS.filter((x) => x.foodEmoji !== a.foodEmoji);
    const wrongs = pickN(wrongFoods, 3);
    const opts = shuffle([
      { key: a.foodEmoji, emoji: a.foodEmoji },
      ...wrongs.map((w) => ({ key: w.foodEmoji, emoji: w.foodEmoji })),
    ]);
    return {
      prompt: <>Apa makanan kesukaan {a.name}?</>,
      visual: (
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white text-8xl shadow-2xl">
          {a.emoji}
        </div>
      ),
      options: opts,
      correctKey: a.foodEmoji,
      audio: { speak: a.name, animal: a.name },
    };
  };
  return (
    <MultipleChoiceGame
      title="Memberi Makan Hewan"
      bg="bg-gradient-to-b from-teal-200 to-emerald-100"
      buildRound={buildRound}
      optionStyle="tile-large"
      ringColor="ring-teal-300"
      onBack={onBack}
    />
  );
}

// ===== Menyortir Barang =====
export function MenyortirBarang({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const item = pickRandom(SORT_ITEMS);
    return {
      prompt: <>Ini termasuk apa?</>,
      visual: (
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white text-8xl shadow-2xl">
            {item.emoji}
          </div>
          <p className="text-2xl font-bold text-slate-700">{item.name}</p>
        </div>
      ),
      options: [
        { key: "makanan", label: "MAKANAN", emoji: "🍔", bg: "bg-red-400" },
        { key: "mainan", label: "MAINAN", emoji: "🧸", bg: "bg-yellow-500" },
        { key: "pakaian", label: "PAKAIAN", emoji: "👕", bg: "bg-blue-500" },
      ],
      correctKey: item.category,
      audio: { speak: item.name },
    };
  };
  return (
    <MultipleChoiceGame
      title="Menyortir Barang"
      bg="bg-gradient-to-b from-fuchsia-200 to-pink-100"
      buildRound={buildRound}
      onBack={onBack}
    />
  );
}

// ===== Petualangan Laut =====
export function PetualanganLaut({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const t = pickRandom(SEA_ANIMALS);
    const others = pickN(
      SEA_ANIMALS.filter((a) => a.name !== t.name),
      3
    );
    const opts = shuffle([t, ...others]);
    return {
      prompt: (
        <>
          Mana <span className="font-extrabold">{t.name}</span>?
        </>
      ),
      options: opts.map((a) => ({ key: a.name, emoji: a.emoji })),
      correctKey: t.name,
      audio: { speak: t.name, animal: t.name },
    };
  };
  return (
    <MultipleChoiceGame
      title="Petualangan Laut"
      bg="bg-gradient-to-b from-cyan-300 to-blue-200"
      buildRound={buildRound}
      optionStyle="tile-large"
      ringColor="ring-cyan-300"
      onBack={onBack}
    />
  );
}

// ===== Game Ejaan =====
export function GameEjaan({ onBack }: { onBack: () => void }) {
  const buildRound = (): MCRound => {
    const item = pickRandom(SPELLING_ITEMS);
    const correctLetter = item.name[0].toUpperCase();
    const wrongLetters = new Set<string>();
    while (wrongLetters.size < 3) {
      const ch = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      if (ch !== correctLetter) wrongLetters.add(ch);
    }
    const opts = shuffle([correctLetter, ...wrongLetters]).map((l) => ({
      key: l,
      label: l,
    }));
    return {
      prompt: <>Huruf awal kata ini?</>,
      visual: (
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white text-8xl shadow-2xl">
            {item.emoji}
          </div>
          <p className="text-3xl font-extrabold text-slate-700">{item.name}</p>
        </div>
      ),
      options: opts,
      correctKey: correctLetter,
      audio: { speak: `${correctLetter}, ${item.name}` },
    };
  };
  return (
    <MultipleChoiceGame
      title="Game Ejaan"
      bg="bg-gradient-to-b from-indigo-200 to-blue-100"
      buildRound={buildRound}
      optionStyle="letter"
      ringColor="ring-indigo-300"
      onBack={onBack}
    />
  );
}

// ===== Menyembunyikan Hewan =====
export function MenyembunyikanHewan({ onBack }: { onBack: () => void }) {
  return (
    <HideAndFindGame
      title="Menyembunyikan Hewan"
      bg="bg-gradient-to-b from-amber-200 to-orange-100"
      pool={ANIMALS.map((a) => ({ emoji: a.emoji, name: a.name }))}
      boxEmoji="🌿"
      promptPrefix="Cari"
      audio={{ speak: true, animal: true }}
      onBack={onBack}
    />
  );
}

// ===== Kotak Mainan =====
export function KotakMainan({ onBack }: { onBack: () => void }) {
  return (
    <HideAndFindGame
      title="Kotak Mainan"
      bg="bg-gradient-to-b from-rose-200 to-pink-100"
      pool={TOYS}
      boxEmoji="📦"
      promptPrefix="Buka kotak yang berisi"
      audio={{ speak: true }}
      onBack={onBack}
    />
  );
}
