export type FruitVeg = { emoji: string; type: "buah" | "sayur"; name: string };
export const FRUITS_VEGGIES: FruitVeg[] = [
  { emoji: "🍎", type: "buah", name: "Apel" },
  { emoji: "🍌", type: "buah", name: "Pisang" },
  { emoji: "🍊", type: "buah", name: "Jeruk" },
  { emoji: "🍇", type: "buah", name: "Anggur" },
  { emoji: "🍓", type: "buah", name: "Stroberi" },
  { emoji: "🍉", type: "buah", name: "Semangka" },
  { emoji: "🥭", type: "buah", name: "Mangga" },
  { emoji: "🍍", type: "buah", name: "Nanas" },
  { emoji: "🥕", type: "sayur", name: "Wortel" },
  { emoji: "🥦", type: "sayur", name: "Brokoli" },
  { emoji: "🌽", type: "sayur", name: "Jagung" },
  { emoji: "🍅", type: "sayur", name: "Tomat" },
  { emoji: "🥔", type: "sayur", name: "Kentang" },
  { emoji: "🧅", type: "sayur", name: "Bawang" },
  { emoji: "🥒", type: "sayur", name: "Mentimun" },
];

export type ColorItem = { name: string; tw: string; emoji: string };
export const COLORS: ColorItem[] = [
  { name: "Merah", tw: "bg-red-500", emoji: "🍎" },
  { name: "Kuning", tw: "bg-yellow-400", emoji: "🍌" },
  { name: "Hijau", tw: "bg-green-500", emoji: "🥦" },
  { name: "Biru", tw: "bg-blue-500", emoji: "🫐" },
  { name: "Ungu", tw: "bg-purple-500", emoji: "🍇" },
  { name: "Oranye", tw: "bg-orange-500", emoji: "🥕" },
];

export type AnimalItem = {
  emoji: string;
  name: string;
  habitat: "peternakan" | "liar" | "laut";
  food: string;
  foodEmoji: string;
};

export const ANIMALS: AnimalItem[] = [
  { emoji: "🐶", name: "Anjing", habitat: "peternakan", food: "Tulang", foodEmoji: "🦴" },
  { emoji: "🐱", name: "Kucing", habitat: "peternakan", food: "Ikan", foodEmoji: "🐟" },
  { emoji: "🐮", name: "Sapi", habitat: "peternakan", food: "Rumput", foodEmoji: "🌿" },
  { emoji: "🐷", name: "Babi", habitat: "peternakan", food: "Jagung", foodEmoji: "🌽" },
  { emoji: "🐔", name: "Ayam", habitat: "peternakan", food: "Biji", foodEmoji: "🌾" },
  { emoji: "🐰", name: "Kelinci", habitat: "peternakan", food: "Wortel", foodEmoji: "🥕" },
  { emoji: "🐐", name: "Kambing", habitat: "peternakan", food: "Daun", foodEmoji: "🍃" },
  { emoji: "🦁", name: "Singa", habitat: "liar", food: "Daging", foodEmoji: "🥩" },
  { emoji: "🐯", name: "Harimau", habitat: "liar", food: "Daging", foodEmoji: "🥩" },
  { emoji: "🐵", name: "Monyet", habitat: "liar", food: "Pisang", foodEmoji: "🍌" },
  { emoji: "🐻", name: "Beruang", habitat: "liar", food: "Madu", foodEmoji: "🍯" },
  { emoji: "🐘", name: "Gajah", habitat: "liar", food: "Daun", foodEmoji: "🍃" },
  { emoji: "🦒", name: "Jerapah", habitat: "liar", food: "Daun", foodEmoji: "🍃" },
  { emoji: "🦓", name: "Zebra", habitat: "liar", food: "Rumput", foodEmoji: "🌿" },
];

export const SEA_ANIMALS: AnimalItem[] = [
  { emoji: "🐠", name: "Ikan", habitat: "laut", food: "Plankton", foodEmoji: "🌱" },
  { emoji: "🐳", name: "Paus", habitat: "laut", food: "Ikan Kecil", foodEmoji: "🐟" },
  { emoji: "🐬", name: "Lumba-lumba", habitat: "laut", food: "Ikan", foodEmoji: "🐟" },
  { emoji: "🦈", name: "Hiu", habitat: "laut", food: "Ikan", foodEmoji: "🐟" },
  { emoji: "🐙", name: "Gurita", habitat: "laut", food: "Kepiting", foodEmoji: "🦀" },
  { emoji: "🦑", name: "Cumi", habitat: "laut", food: "Udang", foodEmoji: "🦐" },
  { emoji: "🦀", name: "Kepiting", habitat: "laut", food: "Plankton", foodEmoji: "🌱" },
  { emoji: "🦐", name: "Udang", habitat: "laut", food: "Plankton", foodEmoji: "🌱" },
  { emoji: "🐢", name: "Penyu", habitat: "laut", food: "Ubur-ubur", foodEmoji: "🪼" },
  { emoji: "🐧", name: "Pinguin", habitat: "laut", food: "Ikan", foodEmoji: "🐟" },
];

export type SortItem = {
  emoji: string;
  name: string;
  category: "makanan" | "mainan" | "pakaian";
};

export const SORT_ITEMS: SortItem[] = [
  { emoji: "🍕", name: "Pizza", category: "makanan" },
  { emoji: "🍔", name: "Burger", category: "makanan" },
  { emoji: "🍰", name: "Kue", category: "makanan" },
  { emoji: "🍩", name: "Donat", category: "makanan" },
  { emoji: "🍦", name: "Es Krim", category: "makanan" },
  { emoji: "🍱", name: "Bekal", category: "makanan" },
  { emoji: "🧸", name: "Boneka", category: "mainan" },
  { emoji: "🎲", name: "Dadu", category: "mainan" },
  { emoji: "🎮", name: "Stik Game", category: "mainan" },
  { emoji: "🪀", name: "Yoyo", category: "mainan" },
  { emoji: "🧩", name: "Puzzle", category: "mainan" },
  { emoji: "🎨", name: "Cat", category: "mainan" },
  { emoji: "👕", name: "Kaos", category: "pakaian" },
  { emoji: "👖", name: "Celana", category: "pakaian" },
  { emoji: "👗", name: "Gaun", category: "pakaian" },
  { emoji: "🧦", name: "Kaus Kaki", category: "pakaian" },
  { emoji: "🧣", name: "Syal", category: "pakaian" },
  { emoji: "🧢", name: "Topi", category: "pakaian" },
];

export type SpellingItem = { emoji: string; name: string };
export const SPELLING_ITEMS: SpellingItem[] = [
  { emoji: "🍎", name: "Apel" },
  { emoji: "🍌", name: "Pisang" },
  { emoji: "🐱", name: "Kucing" },
  { emoji: "🐶", name: "Anjing" },
  { emoji: "🌳", name: "Pohon" },
  { emoji: "🌸", name: "Bunga" },
  { emoji: "🚗", name: "Mobil" },
  { emoji: "🏠", name: "Rumah" },
  { emoji: "🌞", name: "Matahari" },
  { emoji: "🌧️", name: "Hujan" },
  { emoji: "📚", name: "Buku" },
  { emoji: "🥕", name: "Wortel" },
  { emoji: "🦋", name: "Kupu-Kupu" },
  { emoji: "⭐", name: "Bintang" },
  { emoji: "🐠", name: "Ikan" },
  { emoji: "🌽", name: "Jagung" },
];

export type ToyItem = { emoji: string; name: string };
export const TOYS: ToyItem[] = [
  { emoji: "🧸", name: "Boneka" },
  { emoji: "🪁", name: "Layangan" },
  { emoji: "🎈", name: "Balon" },
  { emoji: "🚂", name: "Kereta" },
  { emoji: "🚗", name: "Mobil" },
  { emoji: "🪀", name: "Yoyo" },
  { emoji: "🎲", name: "Dadu" },
  { emoji: "🪅", name: "Pinata" },
  { emoji: "🎁", name: "Kado" },
];
