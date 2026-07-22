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

## Teknologi

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide React

Tanpa backend — badge dan skor tertinggi disimpan di `localStorage`.

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
├── components/   # TrashCard, CategoryButton, ScoreBoard, HealthBar,
│                 # CityProgress, GameHeader, LevelCompleteModal
├── pages/        # Home, Game
├── data/         # trashData (32 sampah, 6 kategori, 5 level, badge)
├── hooks/        # useGame (game engine berbasis reducer) + test
├── types/        # game.ts (semua interface)
└── utils/        # storage (localStorage), sound (Web Audio)
```
