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
- Penuhi bar **Clean City** untuk naik level — ada **7 level**
- Badge: 🌱 Pemilah Pemula (Lv 1), 🛡️ Eco Warrior (Lv 3), 🏆 Pahlawan Lingkungan (Lv 5)

## Level Endgame (6–7)

Dua level pamungkas dengan tensi tinggi:

**Level 6 · Chaos City** — kota krisis setelah badai sampah.
- Antrean sampah: 3 tampil sekaligus, sampah aktif + 2 pratinjau
- **Timer 6 detik** per sampah. Terlambat → `⚠️ Sampah menumpuk!` Clean City −5%
- **Event acak**: 🌧️ Hujan Deras (waktu −35%), 🚛 Truk Sampah (waktu +50%),
  🤝 Warga Membantu (perisai combo, satu kesalahan tidak mereset)
- Hadiah: 🏆 badge City Savior + ⚡ Speed Sorting Ability

**Level 7 · Final Guardian** — pertarungan pamungkas melawan Raja Sampah.
- Timer 4,5 detik — paling menekan
- **Fase 1 Garbage Storm**: bertahan dari 8 sampah beruntun
- **Fase 2 Boss Battle**: 👑 Raja Sampah HP 100. Jawaban benar = damage,
  meningkat seiring combo dan berlipat saat Eco Fever. Terlambat → boss pulih
- **Fase 3 Ultimate Decision**: pilih strategi lingkungan (jawaban terbaik: daur ulang),
  lengkap dengan penjelasan edukatif untuk setiap pilihan
- Hadiah: 👑 badge Eco Legend + 🌟 New Game+ / Eco Master Mode

**Unsur dopamin tambahan:**
- 🔥 **Eco Fever** — combo 10+ menyalakan mode POINT ×2 dengan overlay membara
- ⚡ **CLUTCH** — jawaban benar di sisa waktu ≤15% memberi +500
- ✨ **Rare Trash** — Golden Bottle muncul sesekali, +1000 poin
- 🏅 **Final Ranking** — peringkat S/A/B/C dari skor, combo, akurasi, dan ketepatan waktu

## Mode Petualangan (Phase 21–30)

- 🗺️ **Peta Eco World** — 4 area (Kota Ceria → Sungai Bersih → Kawasan Industri →
  TPA Misterius) dengan cerita pembuka/penutup, terbuka bertahap mengikuti progres
- 🃏 **Eco Collection** — 32 kartu, satu per jenis sampah, masing-masing berisi fakta
  edukasi dan tingkat kelangkaan. Terbuka otomatis saat sampahnya dipilah benar
- 🦸 **Kustomisasi Eco Ranger** — Eco Hat (Lv5), Rescue Helmet (Lv8), Green Suit (Lv10),
  City Guardian Badge (Lv15); item yang dipakai tampil pada karakter
- 🐾 **Eco Buddy** — Teco Turtle (bonus organik), Bira Bird (bonus skor),
  Cico Cat (perisai combo). Terbuka lewat koleksi kartu dan naik level sendiri
- ✨ **Rahasia** — 5 pencapaian tersembunyi; sebelum ditemukan hanya petunjuk samar
  yang terlihat
- 🎬 **Ending** — adegan penutup bertahap setelah Raja Sampah dikalahkan
- ⚡ **Mastery Mode** — Speed (60 detik), Endless (makin cepat tiap 10 sampah),
  Perfect (satu nyawa). Terbuka setelah menamatkan Level 7, rekornya dicatat terpisah
- 🏆 **Ranking tiga kategori** — skor tertinggi, combo terbaik, dan kota terbersih

## Fitur Engagement (Post-MVP)

- **Game juice**: teks reward melayang (`✨ PERFECT!`), partikel, confetti, screen shake, edukasi singkat saat salah
- **Combo & bonus**: combo 3 → +100, combo 5 → +500, combo 10 → +1000
- **City evolution**: latar kota berubah 5 tahap — Kota Tercemar → Mulai Bersih → Kota Hijau → Eco City → Perfect Environment
- **Eco Ranger**: XP & level karakter, buka item 🧢 Eco Hat (Lv 5) dan 🥋 Green Suit (Lv 10)
- **Achievement**: Pemula, Recycler, Combo Master, Guardian Earth, dll. dengan progress bar
- **Misi harian**: 1–2 misi acak-harian, hadiah 1000 Eco Point per misi
- **Daily streak**: hitungan hari bermain berturut-turut
- **Save & resume**: permainan berjalan otomatis tersimpan, bisa dilanjutkan
- **Backsound**: 5 track dengan crossfade — menu, gameplay (Lv 1–3), high-level (Lv 4–5),
  combo (saat combo ≥ 5), dan jingle victory saat menang. Bisa dimatikan lewat tombol
  suara di beranda maupun dalam permainan
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
│                 # LeaderboardPanel, StatsPanel,
│                 # TimerBar, TrashQueue, BossPanel, EventBanner,
│                 # FeverOverlay, DecisionPanel, RankResultModal
│                 # WorldMap, CollectionPanel, CharacterPanel,
│                 # SecretsPanel, MasteryPanel, EndingScene
├── pages/        # Home, Game
├── data/         # trashData, achievements, cityStages, missions, endgame,
│                 # worlds, collection, companions, secrets, mastery
├── hooks/        # gameReducer (logika murni), useGame (efek & timer),
│                 # useProfile, useBackgroundMusic, useToasts + test
├── types/        # game.ts (semua interface)
└── utils/        # storage, sound (SFX), music (backsound), profile,
                  # progression, ranking, share + test
```

Logika permainan sengaja dipisah: [gameReducer.ts](src/hooks/gameReducer.ts) berisi
reducer murni (mudah diuji, 30+ test), sedangkan [useGame.ts](src/hooks/useGame.ts)
menangani efek samping — timer, spawn antrean, event acak, dan penyimpanan sesi.

Berkas musik berada di `public/sound/` (`main-menu`, `main-gameplay`, `high-level`,
`combo`, `victory`).
