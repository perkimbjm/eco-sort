import type {
  Badge,
  CategoryInfo,
  LevelConfig,
  TrashCategory,
  TrashItem,
} from '../types/game'

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'plastik',
    label: 'Plastik',
    emoji: '🥤',
    description: 'Sampah plastik yang bisa didaur ulang',
  },
  {
    id: 'organik',
    label: 'Organik',
    emoji: '🍃',
    description: 'Sampah alami yang bisa jadi kompos',
  },
  {
    id: 'kertas',
    label: 'Kertas',
    emoji: '📄',
    description: 'Kertas dan kardus daur ulang',
  },
  {
    id: 'residu',
    label: 'Residu',
    emoji: '🗑️',
    description: 'Sampah yang sulit didaur ulang',
  },
  {
    id: 'logam',
    label: 'Logam',
    emoji: '🥫',
    description: 'Kaleng dan benda logam',
  },
  {
    id: 'b3',
    label: 'B3',
    emoji: '☣️',
    description: 'Bahan Berbahaya dan Beracun',
  },
]

export const TRASH_ITEMS: TrashItem[] = [
  // Plastik
  {
    id: 'botol-plastik',
    name: 'Botol Plastik',
    emoji: '🧴',
    category: 'plastik',
    description: 'Botol bekas minuman, bisa didaur ulang jadi barang baru.',
  },
  {
    id: 'kantong-plastik',
    name: 'Kantong Plastik',
    emoji: '🛍️',
    category: 'plastik',
    description: 'Kantong kresek butuh ratusan tahun untuk terurai.',
  },
  {
    id: 'gelas-plastik',
    name: 'Gelas Plastik',
    emoji: '🥤',
    category: 'plastik',
    description: 'Gelas minuman sekali pakai dari plastik.',
  },
  {
    id: 'sedotan-plastik',
    name: 'Sedotan Plastik',
    emoji: '🧃',
    category: 'plastik',
    description: 'Sedotan kecil tapi sangat mencemari lautan.',
  },
  {
    id: 'botol-sampo',
    name: 'Botol Sampo',
    emoji: '🧴',
    category: 'plastik',
    description: 'Kemasan sampo dan sabun terbuat dari plastik HDPE.',
  },
  {
    id: 'mainan-plastik',
    name: 'Mainan Plastik Rusak',
    emoji: '🪀',
    category: 'plastik',
    description: 'Mainan rusak dari plastik keras bisa didaur ulang.',
  },
  // Organik
  {
    id: 'daun-kering',
    name: 'Daun Kering',
    emoji: '🍂',
    category: 'organik',
    description: 'Daun gugur bisa diolah menjadi kompos subur.',
  },
  {
    id: 'kulit-pisang',
    name: 'Kulit Pisang',
    emoji: '🍌',
    category: 'organik',
    description: 'Kulit buah cepat terurai dan bagus untuk kompos.',
  },
  {
    id: 'sisa-makanan',
    name: 'Sisa Makanan',
    emoji: '🍚',
    category: 'organik',
    description: 'Sisa nasi dan lauk bisa jadi pakan atau kompos.',
  },
  {
    id: 'kulit-jeruk',
    name: 'Kulit Jeruk',
    emoji: '🍊',
    category: 'organik',
    description: 'Kulit jeruk mengandung minyak alami, aman terurai.',
  },
  {
    id: 'sayur-busuk',
    name: 'Sayur Busuk',
    emoji: '🥬',
    category: 'organik',
    description: 'Sayuran layu adalah bahan kompos terbaik.',
  },
  {
    id: 'cangkang-telur',
    name: 'Cangkang Telur',
    emoji: '🥚',
    category: 'organik',
    description: 'Cangkang telur kaya kalsium untuk pupuk tanaman.',
  },
  // Kertas
  {
    id: 'kardus',
    name: 'Kardus',
    emoji: '📦',
    category: 'kertas',
    description: 'Kardus bekas paket bisa didaur ulang berkali-kali.',
  },
  {
    id: 'koran',
    name: 'Koran Bekas',
    emoji: '📰',
    category: 'kertas',
    description: 'Koran lama bisa jadi kertas daur ulang baru.',
  },
  {
    id: 'buku-tulis',
    name: 'Buku Tulis Bekas',
    emoji: '📓',
    category: 'kertas',
    description: 'Buku yang sudah penuh bisa didaur ulang.',
  },
  {
    id: 'majalah',
    name: 'Majalah Lama',
    emoji: '📖',
    category: 'kertas',
    description: 'Majalah bekas termasuk sampah kertas.',
  },
  {
    id: 'kertas-hvs',
    name: 'Kertas HVS',
    emoji: '📃',
    category: 'kertas',
    description: 'Kertas bekas print masih bernilai untuk didaur ulang.',
  },
  // Residu
  {
    id: 'tisu-bekas',
    name: 'Tisu Bekas',
    emoji: '🧻',
    category: 'residu',
    description: 'Tisu kotor tidak bisa didaur ulang.',
  },
  {
    id: 'popok',
    name: 'Popok Sekali Pakai',
    emoji: '🩲',
    category: 'residu',
    description: 'Popok bekas termasuk residu yang harus dibuang aman.',
  },
  {
    id: 'puntung-rokok',
    name: 'Puntung Rokok',
    emoji: '🚬',
    category: 'residu',
    description: 'Puntung rokok beracun bagi tanah dan air.',
  },
  {
    id: 'permen-karet',
    name: 'Permen Karet',
    emoji: '🍬',
    category: 'residu',
    description: 'Permen karet bekas tidak bisa terurai alami.',
  },
  {
    id: 'styrofoam',
    name: 'Styrofoam',
    emoji: '🍱',
    category: 'residu',
    description: 'Styrofoam sangat sulit didaur ulang, kurangi pemakaiannya.',
  },
  // Logam
  {
    id: 'kaleng-minuman',
    name: 'Kaleng Minuman',
    emoji: '🥫',
    category: 'logam',
    description: 'Kaleng aluminium bisa didaur ulang tanpa batas.',
  },
  {
    id: 'kaleng-sarden',
    name: 'Kaleng Sarden',
    emoji: '🐟',
    category: 'logam',
    description: 'Kaleng makanan terbuat dari baja yang bernilai.',
  },
  {
    id: 'tutup-botol',
    name: 'Tutup Botol Logam',
    emoji: '🍾',
    category: 'logam',
    description: 'Tutup botol kecil tetap bisa dikumpulkan dan didaur ulang.',
  },
  {
    id: 'sendok-rusak',
    name: 'Sendok Rusak',
    emoji: '🥄',
    category: 'logam',
    description: 'Alat makan logam rusak bisa dilebur kembali.',
  },
  {
    id: 'paku-berkarat',
    name: 'Paku Berkarat',
    emoji: '🔩',
    category: 'logam',
    description: 'Paku dan baut bekas termasuk sampah logam.',
  },
  // B3
  {
    id: 'baterai',
    name: 'Baterai Bekas',
    emoji: '🔋',
    category: 'b3',
    description: 'Baterai mengandung zat beracun, jangan buang sembarangan!',
  },
  {
    id: 'jarum-suntik',
    name: 'Jarum Suntik',
    emoji: '💉',
    category: 'b3',
    description: 'Limbah medis berbahaya, harus dibuang di tempat khusus.',
  },
  {
    id: 'lampu-neon',
    name: 'Lampu Neon Pecah',
    emoji: '💡',
    category: 'b3',
    description: 'Lampu mengandung merkuri yang sangat berbahaya.',
  },
  {
    id: 'obat-kadaluarsa',
    name: 'Obat Kadaluarsa',
    emoji: '💊',
    category: 'b3',
    description: 'Obat lama bisa mencemari air jika dibuang sembarangan.',
  },
  {
    id: 'kaleng-cat',
    name: 'Kaleng Cat',
    emoji: '🎨',
    category: 'b3',
    description: 'Sisa cat mengandung bahan kimia berbahaya.',
  },
]

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: 'Taman Kota',
    categories: ['plastik', 'organik'],
  },
  {
    level: 2,
    name: 'Sekolah Hijau',
    categories: ['plastik', 'organik', 'kertas'],
  },
  {
    level: 3,
    name: 'Pasar Rakyat',
    categories: ['plastik', 'organik', 'kertas', 'residu', 'logam'],
  },
  {
    level: 4,
    name: 'Rumah Sakit',
    categories: ['plastik', 'organik', 'kertas', 'residu', 'logam', 'b3'],
  },
  {
    level: 5,
    name: 'Kota Metropolitan',
    categories: ['plastik', 'organik', 'kertas', 'residu', 'logam', 'b3'],
  },
]

export const BADGES: Badge[] = [
  {
    id: 'pemilah-pemula',
    name: 'Pemilah Pemula',
    emoji: '🌱',
    unlockLevel: 1,
    description: 'Menyelesaikan Level 1 - Taman Kota',
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    emoji: '🛡️',
    unlockLevel: 3,
    description: 'Menyelesaikan Level 3 - Pasar Rakyat',
  },
  {
    id: 'pahlawan-lingkungan',
    name: 'Pahlawan Lingkungan Peduli Sampah',
    emoji: '🏆',
    unlockLevel: 5,
    description: 'Menamatkan semua level Eco Sort Battle!',
  },
]

export function getTrashByCategories(categories: TrashCategory[]): TrashItem[] {
  return TRASH_ITEMS.filter((item) => categories.includes(item.category))
}

export function getCategoryInfo(id: TrashCategory): CategoryInfo {
  const found = CATEGORIES.find((category) => category.id === id)
  if (!found) {
    throw new Error(`Kategori tidak dikenal: ${id}`)
  }
  return found
}

export function getLevelConfig(level: number): LevelConfig {
  return LEVELS[Math.min(level, LEVELS.length) - 1]
}
