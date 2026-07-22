# ♻️ Eco Sort Battle

Game edukasi pemilahan sampah — selamatkan kota dari sampah!
Powered by peduli-sampah.id

## Cara Main

Sampah muncul satu per satu. Pilih tong yang tepat:

| Tong | Isi |
|------|-----|
| 🥤 Plastik | Botol, kantong, gelas plastik |
| 🍃 Organik | Daun, kulit buah, sisa makanan |
| 📄 Kertas | Kardus, koran, buku bekas |
| 🗑️ Residu | Tisu, popok, styrofoam |
| 🥫 Logam | Kaleng, tutup botol, paku |
| ☣️ B3 | Baterai, jarum suntik, obat kadaluarsa |

- Benar: **+100 skor**, combo naik, kota makin bersih (+5)
- Salah: **-20 skor**, kehilangan 1 nyawa, combo reset
- Penuhi bar **Clean City** untuk naik level — ada 5 level
- Badge: 🌱 Pemilah Pemula (Lv 1), 🛡️ Eco Warrior (Lv 3), 🏆 Pahlawan Lingkungan (Lv 5)

## Fitur Engagement (Post-MVP)

- **Game juice**: teks reward melayang (`✨ PERFECT!`), partikel, confetti, screen shake, edukasi singkat saat salah
- **Combo & bonus**: combo 3 → +100, combo 5 → +500, combo 10 → +1000
- **City evolution**: latar kota berubah 5 tahap — Kota Tercemar → Mulai Bersih → Kota Hijau → Eco City → Perfect Environment
- **Eco Ranger**: XP & level karakter, buka item 🧢 Eco Hat (Lv 5) dan 🥋 Green Suit (Lv 10)
- **Achievement**: Pemula, Recycler, Combo Master, Guardian Earth, dll. dengan progress bar
- **Misi harian**: 1–2 misi acak-harian, hadiah 1000 Eco Point per misi
- **Daily streak**: hitungan hari bermain berturut-turut
- **Save & resume**: permainan berjalan otomatis tersimpan, bisa dilanjutkan
- **Kompetisi**: leaderboard lokal + tombol Bagikan Hasil (Web Share / clipboard)
- **Statistik**: akurasi per kategori + export data JSON (siap untuk dashboard peduli-sampah.id)

## Teknologi

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide React

Tanpa backend — semua progres (profil, badge, skor, misi, ranking, statistik)
disimpan di `localStorage`.

## Perintah

```bash
npm install     # pasang dependensi
npm run dev     # server pengembangan (http://localhost:5173)
npm run test    # test logika game (vitest)
npm run lint    # eslint
npm run build   # type-check + build produksi
```

## Struktur

```
src/
├── components/   # TrashCard, CategoryButton, ScoreBoard, HealthBar, CityProgress,
│                 # GameHeader, LevelCompleteModal, FloatingReward, Toasts,
│                 # ProfileCard, MissionPanel, AchievementsPanel,
│                 # LeaderboardPanel, StatsPanel
├── pages/        # Home, Game
├── data/         # trashData, achievements, cityStages, missions
├── hooks/        # useGame (engine), useProfile (progression), useToasts + test
├── types/        # game.ts (semua interface)
└── utils/        # storage, sound, profile, progression, share + test
```
