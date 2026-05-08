# Game Balita

Game edukasi web untuk anak balita usia 2–5 tahun. Terinspirasi dari aplikasi
"Game Balita: Usia 2-5" di Play Store, dibangun ulang dari nol dengan
asset bebas (emoji), tanpa iklan, dan tanpa data tracking.

## Fitur

- 4 mini-game edukatif:
  - **Sortir Buah & Sayur** — kenali buah vs sayur
  - **Cocokin Warna** — pilih warna yang sesuai
  - **Hitung Angka** — hitung jumlah objek (1–9)
  - **Tebak Hewan** — pilih hewan sesuai nama
- UI ramah anak: tombol besar, animasi, suara feedback
- Suara beep (Web Audio API) — tidak butuh asset audio
- Mobile-first, bisa dipakai di HP / tablet
- Offline-ready setelah load pertama (Vite static build)

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- Lucide icons

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:5173.

Build produksi:

```bash
npm run build
npm run preview
```

## Lint & build check

```bash
npm run lint
npm run build
```

## Packaging ke Android (APK) via Capacitor

Web app ini bisa langsung dibungkus jadi APK Android
pakai [Capacitor](https://capacitorjs.com/) — tanpa perlu rewrite logic.

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Init Capacitor (sekali aja)
npx cap init "Game Balita" com.example.gamebalita --web-dir=dist

# 3. Build web app
npm run build

# 4. Tambah platform Android
npx cap add android

# 5. Sync dist ke project Android
npx cap sync android

# 6. Buka di Android Studio
npx cap open android
```

Di Android Studio, klik **Run** untuk install ke device/emulator, atau
**Build > Generate Signed Bundle/APK** untuk publish ke Play Store.

### Alternatif: rewrite native Kotlin

Kalau nanti butuh performa native atau fitur device dalam (kamera, sensor,
push notif), bisa rewrite ke Kotlin + Jetpack Compose. Logic mini-game di
`src/App.tsx` cukup straightforward untuk diport.

## Catatan privasi & iklan

- Tidak ada iklan
- Tidak ada tracking / pengumpulan data
- Semua asset visual adalah emoji standar (Unicode), bebas copyright
- Suara dihasilkan procedural via Web Audio API, tanpa file audio eksternal

## Lisensi

MIT
