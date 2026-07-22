# ECO SORT BATTLE

## AI Development Plan & Checklist

### React + Vite + TypeScript + Tailwind + Framer Motion

Dokumen ini digunakan sebagai panduan kerja AI Coding Agent agar proses
pembuatan game dilakukan secara bertahap, presisi, dan mudah dipantau.

------------------------------------------------------------------------

# 1. Aturan Utama Untuk AI Developer

## Tujuan

Membangun game edukasi sampah bernama **Eco Sort Battle** dengan konsep:

-   Puzzle sorting game
-   Inspirasi gameplay Nintendo/Sega klasik
-   Edukasi pemilahan sampah
-   MVP ringan tetapi polished

## Prinsip Development

AI WAJIB:

-   Menyelesaikan satu tahap sebelum lanjut tahap berikutnya.
-   Melakukan pengecekan error setelah setiap tahap.
-   Tidak menggunakan backend.
-   Jika terpaksa menggunakan database maka gunakan sqlite
-   Tidak membuat arsitektur terlalu kompleks.
-   Mengutamakan game yang bisa dimainkan.

------------------------------------------------------------------------

# 2. Teknologi Wajib

Gunakan:

-   React
-   Vite
-   TypeScript
-   Tailwind CSS
-   Framer Motion
-   Lucide React

Tidak menggunakan:

-   Redux
-   Backend API
-   Unity
-   Canvas engine kompleks

------------------------------------------------------------------------

# 3. Struktur Folder Target

    src/
    ├── components/
    │   ├── GameHeader.tsx
    │   ├── TrashCard.tsx
    │   ├── CategoryButton.tsx
    │   ├── ScoreBoard.tsx
    │   ├── HealthBar.tsx
    │   ├── CityProgress.tsx
    │   └── LevelCompleteModal.tsx
    │
    ├── pages/
    │   ├── Home.tsx
    │   └── Game.tsx
    │
    ├── data/
    │   └── trashData.ts
    │
    ├── types/
    │   └── game.ts
    │
    ├── hooks/
    │   └── useGame.ts
    │
    ├── App.tsx
    └── main.tsx

------------------------------------------------------------------------

# DEVELOPMENT CHECKLIST

------------------------------------------------------------------------

------------------------------------------------------------------------

# PHASE 1 - Type System

## Buat:

src/types/game.ts

Interface:

TrashItem:

-   id
-   name
-   emoji
-   category
-   description

Kategori:

    plastik
    organik
    kertas
    residu
    logam
    b3

GameState:

-   score
-   level
-   health
-   combo
-   cleanCity
-   currentTrash

## Checklist

-   [ ] Semua interface dibuat
-   [ ] Tidak menggunakan any
-   [ ] TypeScript compile tanpa error

------------------------------------------------------------------------

# PHASE 2 - Data Sampah

Buat:

src/data/trashData.ts

Minimal 25 sampah.

Contoh:

Plastik:

-   Botol plastik
-   Kantong plastik
-   Gelas plastik

Organik:

-   Daun
-   Kulit buah
-   Sisa makanan

Kertas:

-   Kardus
-   Koran

Logam:

-   Kaleng

Residu:
- Tisu
- Popok

B3:

-   Baterai
-   Jarum suntik

## Checklist

-   [ ] Data valid
-   [ ] Semua kategori memiliki data
-   [ ] Tidak ada typo kategori
-   [ ] Data bisa dipanggil dari component

------------------------------------------------------------------------

# PHASE 3 - Layout Dasar

Buat:

Home Page

Game Page

Home:

    ECO SORT BATTLE

    Selamatkan Kota Dari Sampah, Powered by peduli-sampah.id

    [Mulai Game]

    [Cara Bermain]

    [Prestasi]

## Checklist

-   [ ] Routing berjalan
-   [ ] UI tampil
-   [ ] Responsive
-   [ ] Tidak ada warning

------------------------------------------------------------------------

# PHASE 4 - Game Engine Dasar

Buat hook:

useGame.ts

Fungsi:

-   checkAnswer()
-   nextTrash()
-   increaseScore()
-   decreaseHealth()
-   resetGame()

Logic:

Jawaban benar:

    score +100
    combo +1
    cleanCity +5

Jawaban salah:

    score -20
    health -1
    combo = 0

## Checklist

-   [ ] Sampah muncul random
-   [ ] Tombol kategori bekerja
-   [ ] Score berubah
-   [ ] Health berubah
-   [ ] Game bisa dimainkan

------------------------------------------------------------------------

# PHASE 5 - Component UI

Buat:

## TrashCard

Menampilkan:

-   emoji sampah
-   nama sampah
-   deskripsi

## CategoryButton

Menampilkan kategori.

## ScoreBoard

Menampilkan:

-   score
-   level
-   combo

## HealthBar

Menampilkan nyawa.

## CityProgress

Menampilkan:

    Clean City

    ██████░░░░ 60%

## Checklist

-   [ ] Semua component reusable
-   [ ] Props menggunakan TypeScript
-   [ ] Tidak ada duplicate code

------------------------------------------------------------------------

# PHASE 6 - Level System

Buat:

5 level.

Level 1:

Plastik + Organik

Level 2:

Tambah Kertas

Level 3:

Tambah Residu dan Logam

Level 4:

Tambah B3

Level 5:

Semua kategori

## Checklist

-   [ ] Level naik otomatis
-   [ ] Kesulitan meningkat
-   [ ] Level selesai muncul

------------------------------------------------------------------------

# PHASE 7 - Animasi

Gunakan Framer Motion.

Benar:

-   Sampah bergerak keluar
-   Success message

Salah:

-   Shake animation

## Checklist

-   [ ] Animasi berjalan
-   [ ] Tidak mengganggu gameplay
-   [ ] Mobile tetap lancar

------------------------------------------------------------------------

# PHASE 8 - Reward System

Badge:

Level 1:

Pemilah Pemula

Level 3:

Eco Warrior

Level 5:

Pahlawan Lingkungan Peduli Sampah

## Checklist

-   [ ] Badge muncul
-   [ ] Modal selesai level tampil
-   [ ] Tombol lanjut bekerja

------------------------------------------------------------------------

# PHASE 9 - Final Polish

Tambahkan:

-   Background kota hijau
-   Karakter Eco Ranger sederhana
-   Icon tong sampah
-   Sound effect optional

## Checklist

-   [ ] UI menarik
-   [ ] Tidak ada bug
-   [ ] Responsive
-   [ ] Loading cepat

------------------------------------------------------------------------

# PHASE 10 - Testing

Test:

Desktop:

-   Chrome
-   Edge

Mobile:

-   Android browser

Test scenario:

1.  Jawaban benar 5 kali
2.  Jawaban salah sampai game over
3.  Semua level selesai

Checklist:

-   [ ] Tidak crash
-   [ ] Tidak ada TypeScript error
-   [ ] Tidak ada console error
-   [ ] Game playable

------------------------------------------------------------------------

# Aturan Komunikasi AI Agent

Setelah setiap phase selesai:

AI harus memberikan laporan:

Format:

    PHASE X SELESAI

    Yang dibuat:
    -

    Testing:
    -

    Error ditemukan:
    -

    Status:
    READY / BLOCKED

    Lanjut ke:
    PHASE berikutnya

AI tidak boleh melompat phase.

------------------------------------------------------------------------

# Future Development

Setelah MVP selesai:

-   SQLite leaderboard
-   Login pemain
-   Ranking
-   Integrasi peduli-sampah.id
-   Statistik perilaku pemilahan
-   Fitur Share ke sosial media
