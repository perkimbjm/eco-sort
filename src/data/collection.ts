import type { CardRarity, CollectionCard } from '../types/game'
import { TRASH_ITEMS } from './trashData'

// PHASE 23 — Eco Collection. Tiap sampah yang berhasil dipilah membuka kartunya
// beserta fakta edukasi, sehingga mengoleksi = belajar.
export const COLLECTION_CARDS: CollectionCard[] = [
  // Plastik
  { id: 'botol-plastik', rarity: 'umum', fact: 'Satu botol PET butuh 450 tahun untuk terurai, tapi bisa didaur ulang jadi serat baju.' },
  { id: 'kantong-plastik', rarity: 'umum', fact: 'Rata-rata kantong kresek dipakai hanya 12 menit, lalu mencemari selama ratusan tahun.' },
  { id: 'gelas-plastik', rarity: 'umum', fact: 'Indonesia memakai miliaran gelas plastik sekali pakai per tahun. Bawa tumbler sendiri!' },
  { id: 'sedotan-plastik', rarity: 'jarang', fact: 'Sedotan terlalu ringan untuk disortir mesin daur ulang, jadi hampir selalu berakhir di TPA.' },
  { id: 'botol-sampo', rarity: 'jarang', fact: 'Botol sampo berbahan HDPE — plastik paling bernilai untuk didaur ulang. Bilas dulu sebelum dibuang.' },
  { id: 'mainan-plastik', rarity: 'langka', fact: 'Mainan sering mencampur beberapa jenis plastik, sehingga sulit didaur ulang. Donasikan bila masih layak.' },
  // Organik
  { id: 'daun-kering', rarity: 'umum', fact: 'Daun kering kaya karbon — bahan "cokelat" yang menyeimbangkan kompos agar tidak bau.' },
  { id: 'kulit-pisang', rarity: 'umum', fact: 'Kulit pisang terurai dalam 2-10 hari dan kaya kalium untuk menyuburkan tanaman.' },
  { id: 'sisa-makanan', rarity: 'umum', fact: 'Sampah makanan adalah penyumbang terbesar sampah rumah tangga Indonesia — sekitar 40%.' },
  { id: 'kulit-jeruk', rarity: 'jarang', fact: 'Kulit jeruk bisa difermentasi menjadi eco-enzyme, cairan pembersih alami serbaguna.' },
  { id: 'sayur-busuk', rarity: 'umum', fact: 'Sayuran layu tetap berguna: jadi kompos, ia mengembalikan nutrisi ke tanah.' },
  { id: 'cangkang-telur', rarity: 'jarang', fact: 'Cangkang telur mengandung 95% kalsium karbonat — tumbuk halus untuk pupuk tanaman.' },
  // Kertas
  { id: 'kardus', rarity: 'umum', fact: 'Kardus bisa didaur ulang 5-7 kali sebelum seratnya terlalu pendek untuk dipakai lagi.' },
  { id: 'koran', rarity: 'umum', fact: 'Mendaur ulang 1 ton kertas menyelamatkan sekitar 17 pohon dan menghemat banyak air.' },
  { id: 'buku-tulis', rarity: 'jarang', fact: 'Lepaskan spiral kawat sebelum mendaur ulang buku — logamnya masuk tong berbeda.' },
  { id: 'majalah', rarity: 'jarang', fact: 'Kertas majalah dilapisi kaolin agar mengkilap, tetap bisa didaur ulang di pabrik modern.' },
  { id: 'kertas-hvs', rarity: 'umum', fact: 'Cetak bolak-balik memangkas separuh sampah kertas kantormu.' },
  // Residu
  { id: 'tisu-bekas', rarity: 'umum', fact: 'Serat tisu terlalu pendek untuk didaur ulang. Tisu bersih bekas makanan boleh dikompos.' },
  { id: 'popok', rarity: 'jarang', fact: 'Satu popok sekali pakai butuh sekitar 500 tahun terurai. Popok kain jauh lebih ramah.' },
  { id: 'puntung-rokok', rarity: 'jarang', fact: 'Filter rokok terbuat dari selulosa asetat — plastik. Satu puntung mencemari 50 liter air.' },
  { id: 'permen-karet', rarity: 'langka', fact: 'Permen karet mengandung karet sintetis, sama seperti bahan ban. Tidak terurai alami.' },
  { id: 'styrofoam', rarity: 'jarang', fact: 'Styrofoam 95% berisi udara, sehingga mahal diangkut dan hampir tidak pernah didaur ulang.' },
  // Logam
  { id: 'kaleng-minuman', rarity: 'umum', fact: 'Aluminium bisa didaur ulang tanpa batas. Mendaur ulang 1 kaleng hemat energi untuk TV 3 jam.' },
  { id: 'kaleng-sarden', rarity: 'jarang', fact: 'Kaleng makanan berbahan baja berlapis timah — sangat bernilai bagi pemulung dan pabrik.' },
  { id: 'tutup-botol', rarity: 'jarang', fact: 'Kumpulkan tutup botol logam dalam kaleng tertutup agar tidak lolos dari mesin sortir.' },
  { id: 'sendok-rusak', rarity: 'langka', fact: 'Alat makan stainless bisa dilebur berkali-kali tanpa kehilangan kualitas.' },
  { id: 'paku-berkarat', rarity: 'langka', fact: 'Meski berkarat, besi tetap bernilai untuk dilebur ulang menjadi produk baru.' },
  // B3
  { id: 'baterai', rarity: 'langka', fact: 'Satu baterai bekas dapat mencemari 600 ribu liter air. Serahkan ke dropbox limbah B3.' },
  { id: 'jarum-suntik', rarity: 'legendaris', fact: 'Limbah medis wajib masuk wadah tahan tusuk dan diolah insinerator berizin.' },
  { id: 'lampu-neon', rarity: 'langka', fact: 'Lampu neon mengandung uap merkuri. Jika pecah, buka jendela dan jangan disapu dengan sapu biasa.' },
  { id: 'obat-kadaluarsa', rarity: 'langka', fact: 'Jangan siram obat ke saluran air — residunya memicu bakteri kebal antibiotik.' },
  { id: 'kaleng-cat', rarity: 'legendaris', fact: 'Sisa cat mengandung logam berat. Keringkan dulu, lalu serahkan ke fasilitas limbah B3.' },
]

export const RARITY_STYLES: Record<
  CardRarity,
  { label: string; badge: string; ring: string }
> = {
  umum: {
    label: 'Umum',
    badge: 'bg-slate-200 text-slate-700',
    ring: 'border-slate-300',
  },
  jarang: {
    label: 'Jarang',
    badge: 'bg-sky-200 text-sky-800',
    ring: 'border-sky-400',
  },
  langka: {
    label: 'Langka',
    badge: 'bg-purple-200 text-purple-800',
    ring: 'border-purple-400',
  },
  legendaris: {
    label: 'Legendaris',
    badge: 'bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-950',
    ring: 'border-amber-400',
  },
}

export function getCard(trashId: string): CollectionCard | undefined {
  return COLLECTION_CARDS.find((card) => card.id === trashId)
}

/** Kartu digabung dengan data sampahnya untuk ditampilkan */
export function getCollectionEntries() {
  return COLLECTION_CARDS.map((card) => ({
    card,
    trash: TRASH_ITEMS.find((item) => item.id === card.id),
  })).filter((entry) => entry.trash !== undefined)
}

export function getCollectionProgress(collected: string[]): {
  owned: number
  total: number
  percent: number
} {
  const total = COLLECTION_CARDS.length
  const owned = COLLECTION_CARDS.filter((card) =>
    collected.includes(card.id),
  ).length
  return { owned, total, percent: Math.round((owned / total) * 100) }
}
