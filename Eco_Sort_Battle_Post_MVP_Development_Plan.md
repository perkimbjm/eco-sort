# ECO SORT BATTLE

# POST MVP DEVELOPMENT PLAN

## Dopamine Enhancement & Game Engagement Roadmap

Dokumen ini merupakan lanjutan setelah seluruh checklist MVP pada
`Eco_Sort_Battle_AI_Development_Plan.md` selesai.

Tujuan: Mengembangkan Eco Sort Battle dari game edukasi sederhana
menjadi game yang memiliki: - engagement tinggi - progression system -
reward system - retention pemain - pengalaman seperti game
Nintendo/mobile casual

------------------------------------------------------------------------

# Aturan Development Lanjutan

AI Developer wajib:

-   Menyelesaikan satu phase sebelum lanjut.
-   Melakukan testing setiap selesai phase.
-   Tidak membuat fitur kompleks sebelum core gameplay stabil.
-   Memprioritaskan pengalaman pemain.
-   Tetap menggunakan React + Vite + TypeScript.

Stack tetap:

-   React
-   Vite
-   TypeScript
-   Tailwind CSS
-   Framer Motion
-   Lucide React

------------------------------------------------------------------------

# PHASE 11 --- Game Juice & Feedback System

## Tujuan

Membuat setiap aksi pemain terasa memiliki dampak.

Prinsip:

    ACTION
    ↓
    FEEDBACK
    ↓
    REWARD
    ↓
    PROGRESS

## Fitur

### Jawaban benar

Tampilkan:

    ✨ PERFECT!

    +100 Eco Point

    🌱 Kota semakin bersih

Tambahkan:

-   popup reward
-   scale animation
-   bounce animation
-   particle effect sederhana

### Jawaban salah

Tampilkan:

    ❌ Oops!

    Pelajari kategori sampah ini.

Tambahkan:

-   shake animation
-   edukasi singkat

## Checklist

-   [ ] Floating reward text
-   [ ] Success animation
-   [ ] Error animation
-   [ ] Edukasi ketika salah

------------------------------------------------------------------------

# PHASE 12 --- Combo & Streak System

## Tujuan

Meningkatkan motivasi pemain untuk mempertahankan performa.

Tambahkan state:

``` ts
combo
maxCombo
streak
```

## Sistem

Contoh:

    Benar 1 kali
    +100


    Benar 5 kali

    🔥 COMBO x5

    Bonus +500

Reward:

  Combo   Reward
  ------- -------------
  3       Bonus kecil
  5       Bonus besar
  10      Badge

## Checklist

-   [ ] Combo bertambah
-   [ ] Bonus score bekerja
-   [ ] Combo reset ketika salah
-   [ ] Maximum combo tersimpan

------------------------------------------------------------------------

# PHASE 13 --- City Evolution System

## Tujuan

Memberikan visual progress bahwa pemain benar-benar memperbaiki kota.

## Progress Kota

    0-20%
    Kota Tercemar


    20-40%
    Mulai Bersih


    40-70%
    Kota Hijau


    70-90%
    Eco City


    90-100%
    Perfect Environment

Ketika naik stage:

    🎉 CITY UPGRADE!

    Warga semakin sadar lingkungan.

## Checklist

-   [ ] Progress kota tersedia
-   [ ] Visual kota berubah
-   [ ] Reward saat upgrade

------------------------------------------------------------------------

# PHASE 14 --- Eco Ranger Character System

## Tujuan

Membuat pemain merasa memiliki karakter.

Tambahkan:

    Eco Ranger Lv.1

## XP System

Mendapat XP:

  Aktivitas          XP
  --------------- -----
  Jawaban benar      10
  Combo              50
  Selesai level     200

## Unlock

Level tertentu:

    Lv 5
    Eco Hat


    Lv 10
    Green Suit

## Checklist

-   [ ] XP system
-   [ ] Character level
-   [ ] Unlock item

------------------------------------------------------------------------

# PHASE 15 --- Achievement System

## Tujuan

Memberikan target jangka panjang.

Buat:

    Achievement

Contoh:

## Pemula

Pilah 10 sampah.

## Recycler

Pilah 100 sampah.

## Combo Master

Combo 10 kali.

## Guardian Earth

Clean City 100%.

## Checklist

-   [ ] Achievement data
-   [ ] Progress tracking
-   [ ] Achievement popup

------------------------------------------------------------------------

# PHASE 16 --- Daily Mission System

## Tujuan

Meningkatkan kemungkinan pemain kembali bermain.

Contoh:

    🎯 Daily Mission


    □ Pilah 20 sampah plastik

    □ Dapatkan combo 5


    Reward:

    1000 Eco Point

## Checklist

-   [ ] Mission random
-   [ ] Mission progress
-   [ ] Reward system

------------------------------------------------------------------------

# PHASE 17 --- Sound & Visual Polish

## Sound Effect

Tambahkan:

    correct.mp3
    wrong.mp3
    levelup.mp3

## Visual

Tambahkan:

-   confetti
-   particle
-   screen shake
-   glow effect

## Checklist

-   [ ] Sound berjalan
-   [ ] Sound dapat dimatikan
-   [ ] Animasi tidak berat

------------------------------------------------------------------------

# PHASE 18 --- Save Progress

## Tujuan

Agar pemain tidak kehilangan progres.

Gunakan:

    localStorage

Data:

``` json
{
 score:5000,
 level:5,
 badge:[
  "Eco Warrior"
 ]
}
```

## Checklist

-   [ ] Progress tersimpan
-   [ ] Refresh tidak reset
-   [ ] Reset data tersedia

------------------------------------------------------------------------

# PHASE 19 --- Competition Feature

## Tujuan

Membuat pemain memiliki motivasi sosial.

## Share Result

Contoh:

    Saya berhasil membersihkan Eco City!

    5000 Eco Point

    Eco Sort Battle

## Leaderboard

Contoh:

    🏆 Ranking

    1. Budi
    2. Siti
    3. Andi

## Checklist

-   [ ] Share card
-   [ ] Ranking
-   [ ] Score comparison

------------------------------------------------------------------------

# PHASE 20 --- Integrasi Peduli-Sampah.id

## Tujuan

Mengubah game menjadi platform edukasi berbasis data.

Arsitektur:

    Game Player

    ↓

    Data Aktivitas

    ↓

    Database

    ↓

    Dashboard

Analisis:

-   sekolah aktif
-   kategori sampah sulit dipahami
-   perilaku pemilahan
-   tingkat edukasi

## Checklist

-   [ ] Export data
-   [ ] Statistik pemain
-   [ ] Integrasi dashboard

------------------------------------------------------------------------

# Prioritas Implementasi

Urutan:

1.  PHASE 11 - Feedback
2.  PHASE 12 - Combo
3.  PHASE 13 - City Evolution
4.  PHASE 15 - Achievement
5.  PHASE 14 - Character
6.  PHASE 16 - Daily Mission
7.  PHASE 17 - Sound
8.  PHASE 18 - Save Progress
9.  PHASE 19 - Competition
10. PHASE 20 - Platform Integration

------------------------------------------------------------------------

# Format Laporan AI Agent

Setelah setiap phase:

    PHASE X SELESAI

    Yang dibuat:
    -

    Testing:
    -

    Error:
    -

    Status:
    READY / BLOCKED

    Lanjut:
    PHASE berikutnya

AI tidak boleh melewati phase.
