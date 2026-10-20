# DESIGN.md: Katalog UMKM

Panduan desain visual dan layout. Dokumen ini murni soal **tampilan**. Fitur tetap mengikuti User Story. Letakkan file ini di root repo, lalu suruh AI membacanya sebelum membuat atau mengubah UI.

---

## 1. Karakter Brand

**Kata kunci:** hangat, tepercaya, lokal, cepat dipesan.

- Terasa seperti etalase toko yang rapi, bukan marketplace yang ramai.
- Foto produk adalah bintang utama. UI tampil tenang di sekitarnya.
- Satu tujuan utama per layar: **memesan via WhatsApp**.
- Nada bahasa: ramah dan singkat. Contoh: "Pesan sekarang", "Stok habis", "Belum ada favorit".

---

## 2. Warna

Dua mode: Terang dan Gelap. Semua warna memakai palet bawaan Tailwind, jadi tidak perlu konfigurasi tambahan.

### 2.1 Peran warna

| Peran | Terang | Gelap | Dipakai untuk |
|---|---|---|---|
| Latar halaman | `bg-zinc-50` | `dark:bg-zinc-950` | body |
| Permukaan (kartu, panel) | `bg-white` | `dark:bg-zinc-900` | kartu, tabel, modal |
| Permukaan terangkat | `bg-zinc-100` | `dark:bg-zinc-800` | input, chip, skeleton |
| Garis/border | `border-zinc-200/80` | `dark:border-zinc-800/80` | semua border |
| Teks utama | `text-zinc-900` | `dark:text-zinc-50` | judul, harga |
| Teks sekunder | `text-zinc-600` | `dark:text-zinc-400` | deskripsi, label |
| Teks samar | `text-zinc-500` | `dark:text-zinc-500` | placeholder, meta |
| **Aksen UMKM / WhatsApp** | `emerald-600` (hover `emerald-700`) | `emerald-500` (hover `emerald-400`) | tombol pesan, harga diskon, badge stok ada |
| **Aksen Admin / AI** | `indigo-600` (hover `indigo-700`) | `indigo-500` | tombol admin, fitur AI |
| Aksen AI (gradien) | `from-indigo-500 to-violet-500` | sama | tombol "Buat Deskripsi AI", chat asisten |
| Peringatan | `amber-500` | `amber-400` | badge "Terlaris", stok menipis |
| Bahaya | `red-600` | `red-500` | hapus, error, badge "Habis" |

### 2.2 Aturan pemakaian

1. Emerald hanya untuk aksi pelanggan (pesan, harga, stok tersedia).
2. Indigo/violet hanya untuk area admin dan fitur AI. Jangan campur di halaman pelanggan, kecuali widget asisten AI.
3. Maksimal satu tombol emerald solid per layar.
4. Latar badge memakai tingkat 50/950 dan teks tingkat 700/300. Contoh: `bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300`.
5. Kontras teks minimal 4.5:1. Jangan memakai `zinc-400` di atas putih untuk teks penting.

---

## 3. Tipografi

Pakai `next/font/google` agar cepat dan tanpa layout shift.

| Peran | Font | Bobot |
|---|---|---|
| Judul & harga | **Plus Jakarta Sans** | 600, 700, 800 |
| Isi & UI | **Inter** | 400, 500, 600 |

```jsx
// app/layout.jsx
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

// <html className={`${jakarta.variable} ${inter.variable}`}>
// <body className="font-[family-name:var(--font-body)]">
```

### Skala teks

| Elemen | Kelas Tailwind |
|---|---|
| Hero judul | `text-3xl sm:text-5xl font-extrabold tracking-tight` (font display) |
| Judul halaman | `text-2xl sm:text-3xl font-bold tracking-tight` |
| Judul seksi | `text-xl font-semibold` |
| Nama produk (kartu) | `text-sm sm:text-base font-semibold line-clamp-2` |
| Harga | `text-base sm:text-lg font-bold` (font display) |
| Isi | `text-sm sm:text-base leading-relaxed` |
| Label/meta | `text-xs font-medium uppercase tracking-wide` |

---

## 4. Bentuk, Jarak, dan Elevasi

### Radius
| Elemen | Kelas |
|---|---|
| Kartu produk, panel, modal | `rounded-3xl` |
| Tombol, input, dropdown | `rounded-2xl` |
| Badge, chip | `rounded-full` |
| Gambar di dalam kartu | `rounded-2xl` (atau ikut kartu dengan `overflow-hidden`) |

### Jarak
- Kelipatan 4px. Gunakan `gap-4` (mobile) dan `gap-6` (desktop) untuk grid.
- Padding kartu: `p-4 sm:p-5`.
- Jarak antar seksi halaman: `py-10 sm:py-14`.
- Lebar konten: `mx-auto max-w-6xl px-4 sm:px-6`.

### Bayangan
| Keadaan | Kelas |
|---|---|
| Diam | `shadow-sm` |
| Hover kartu | `hover:shadow-xl hover:-translate-y-0.5` |
| Modal/drawer | `shadow-2xl` |

Semua transisi: `transition-all duration-300`.

### Efek kaca (glassmorphism)
Hanya untuk header lengket dan bar bawah mobile:
```
bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80
```

---

## 5. Layout Global

### 5.1 Header (pelanggan)

```
┌──────────────────────────────────────────────────────────┐
│ [Logo] Nama Toko        Beranda  Tentang   ♡  🛒(2)  ☾  │  ← sticky, glass
└──────────────────────────────────────────────────────────┘
```

- Tinggi `h-16`, `sticky top-0 z-40`.
- Desktop: logo kiri, navigasi tengah/kanan, ikon aksi (favorit, keranjang, dark mode) kanan.
- Mobile: logo + ikon keranjang + tombol menu. Navigasi masuk ke drawer.
- Badge jumlah keranjang: lingkaran emerald kecil di pojok ikon.

### 5.2 Bar bawah mobile (opsional, sangat disarankan)

```
┌───────────────────────────────┐
│  🏠 Beranda  ♡ Favorit  🛒  ℹ️ │  ← fixed bottom, glass, md:hidden
└───────────────────────────────┘
```
- Tambahkan `pb-20 md:pb-0` pada `<main>` agar konten tidak tertutup.
- Hormati area aman perangkat: `pb-[env(safe-area-inset-bottom)]`.

### 5.3 Footer
- Tiga kolom (desktop): info toko, tautan, jam buka. Satu kolom di mobile.
- Latar `bg-zinc-100 dark:bg-zinc-900`, teks sekunder.
- Tombol WhatsApp kecil emerald di footer.

### 5.4 Tombol WhatsApp melayang
- Pojok kanan bawah, bulat 56px, `bg-emerald-500`, ikon putih.
- Tampil di beranda dan kategori. **Sembunyikan** di halaman detail (sudah ada tombol pesan).
- Di mobile, naikkan di atas bar bawah: `bottom-24 md:bottom-6`.

---

## 6. Layout Per Halaman

### 6.1 Beranda

```
[ Header ]
[ Banner/Hero: judul + subjudul + kolom cari besar ]
[ Chip kategori (scroll horizontal) ]
[ Bar alat: jumlah hasil · Urutkan ▾ ]
[ Grid produk: 2 kolom (mobile) · 3 (tablet) · 4 (desktop) ]
[ Paginasi ]
[ Terakhir dilihat (baris scroll horizontal) ]
[ Footer ]
```

- **Hero:** latar gradien lembut `bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-950/30`. Tinggi rendah (`py-10 sm:py-16`) supaya produk cepat terlihat.
- **Pencarian:** input besar `h-12 rounded-2xl` dengan ikon kaca pembesar.
- **Chip kategori:** `rounded-full`; aktif `bg-emerald-600 text-white`, tidak aktif `bg-zinc-100 dark:bg-zinc-800`. Scroll horizontal di mobile tanpa scrollbar.
- **Grid:** `grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4`.

### 6.2 Kartu Produk

```
┌─────────────────────┐
│ [Badge]        [♡]  │  ← overlay di atas foto
│                     │
│     FOTO 4:5        │  ← rasio aspect-[4/5], object-cover
│                     │
├─────────────────────┤
│ Kategori (kecil)    │
│ Nama produk 2 baris │
│ Rp 25.000  ~~30.000~~│
│ [ Pesan ]           │  ← emerald, penuh lebar
└─────────────────────┘
```

Kelas dasar:
```
group overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm
transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
dark:border-zinc-800/80 dark:bg-zinc-900
```
- Foto: pembungkus `overflow-hidden`, gambar `transition duration-500 group-hover:scale-105`.
- Badge ("Baru", "Terlaris", "Habis") di kiri atas, `rounded-full`, huruf kecil tebal.
- Ikon hati di kanan atas: lingkaran kaca `bg-white/80 backdrop-blur` ukuran 36px (target sentuh cukup besar).
- Produk habis: foto `grayscale opacity-70`, tombol abu-abu disabled.
- Seluruh kartu dapat diklik ke halaman detail; tombol di dalamnya memakai `stopPropagation`.

### 6.3 Detail Produk

**Desktop (2 kolom):**
```
┌──────────────────────┬─────────────────────────┐
│  Foto utama          │ Breadcrumb              │
│  (aspect-square)     │ Kategori · Badge        │
│                      │ Nama produk (H1)        │
│  [thumb][thumb][thumb]│ ★★★★☆ 4.5 (12 ulasan)  │
│                      │ Rp 25.000  ~~30.000~~   │
│                      │ Pilih ukuran/varian     │
│                      │ Jumlah [− 1 +]          │
│                      │ [ Pesan via WhatsApp ]  │
│                      │ [Tambah keranjang][Bagikan]│
│                      │ Deskripsi               │
└──────────────────────┴─────────────────────────┘
[ Ulasan ]  [ Tanya AI ]  [ Produk terkait ]
```
- Kolom foto `lg:sticky lg:top-24`.
- **Mobile:** foto penuh lebar di atas, info di bawah, dan **bar pesan lengket di bawah layar** berisi harga + tombol "Pesan via WhatsApp".
- Ukuran/varian: chip `rounded-2xl`; terpilih `border-emerald-600 bg-emerald-50 dark:bg-emerald-950`.
- Stepper jumlah: tiga kotak `h-10 w-10 rounded-xl`.
- Widget Tanya AI: panel `rounded-3xl` dengan border/gradien indigo-violet tipis, ikon ✨, gelembung chat `rounded-2xl`.

### 6.4 Keranjang
- Desktop: drawer dari kanan `w-full max-w-md`. Mobile: sheet dari bawah.
- Baris item: foto 64px, nama, harga, stepper kecil, tombol hapus.
- Footer lengket: total + tombol "Pesan Semua via WhatsApp" (emerald).

### 6.5 Halaman Favorit, Bandingkan, Tentang, Kategori
- **Favorit & Kategori:** pakai grid kartu yang sama dengan beranda.
- **Bandingkan:** tabel dua kolom, label di kiri, kolom produk berdampingan; mobile boleh scroll horizontal.
- **Tentang:** hero kecil, kartu info (jam buka, alamat), peta/tautan, tombol WhatsApp besar.

### 6.6 404 dan Loading
- 404: ilustrasi sederhana (emoji/ikon besar), kalimat ramah, tombol "Kembali ke beranda".
- Loading: skeleton yang **sama persis** dengan bentuk kartu (foto abu, 3 garis teks) memakai `animate-pulse bg-zinc-200 dark:bg-zinc-800`.

---

## 7. Layout Admin

Admin harus terasa berbeda dari etalase: lebih padat, aksen indigo.

```
┌─────────┬──────────────────────────────────────────┐
│ Sidebar │ Topbar: judul halaman        [akun ▾]    │
│  Ringkasan├────────────────────────────────────────┤
│  Produk │ Konten                                    │
│  Kategori│  - Kartu statistik (4 kolom)             │
│  Ulasan │  - Tabel / form dalam panel rounded-3xl   │
│  Banner │                                           │
│  Pengaturan                                         │
│  Akun   │                                           │
│  Log    │                                           │
└─────────┴──────────────────────────────────────────┘
```

- **Sidebar:** `w-64`, tetap di desktop; di mobile jadi drawer dengan tombol hamburger.
- Item aktif: `bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-2xl`.
- **Kartu statistik:** angka besar `text-3xl font-bold`, label kecil di atasnya, ikon dalam kotak indigo lembut.
- **Tabel:** header `bg-zinc-50 text-xs uppercase`, baris `hover:bg-zinc-50`, aksi di kanan. Di mobile ubah baris menjadi kartu bertumpuk.
- **Form:** satu kolom, lebar maksimal `max-w-2xl`, label di atas input, pesan error `text-sm text-red-600` tepat di bawah field.
- **Tombol:** utama `bg-indigo-600 text-white`; sekunder `border`; bahaya `bg-red-600`.
- **Modal konfirmasi:** latar `bg-black/50 backdrop-blur-sm`, kartu `rounded-3xl`, tombol Batal di kiri dan aksi di kanan.
- **Toast:** kanan atas, `rounded-2xl`, hilang otomatis 3 detik.

---

## 8. Komponen Dasar

### Tombol
```
Utama (pelanggan):
h-11 rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm
transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg active:scale-95
disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:active:scale-100
dark:disabled:bg-zinc-800

Sekunder:
h-11 rounded-2xl border border-zinc-200/80 bg-white px-5 text-sm font-medium text-zinc-700
hover:bg-zinc-100 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800

AI:
h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-semibold text-white
shadow-sm hover:shadow-lg active:scale-95
```

### Input
```
h-11 w-full rounded-2xl border border-zinc-200/80 bg-white px-4 text-sm
placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500
dark:border-zinc-800/80 dark:bg-zinc-900
```
(Di admin, ganti ring/border fokus ke `indigo`.)

### Badge
| Jenis | Kelas |
|---|---|
| Baru | `bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300` |
| Terlaris | `bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300` |
| Habis | `bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300` |
| Diskon | `bg-red-600 text-white` (contoh: "-20%") |

### Toast, modal, drawer
- Animasi masuk 200 ms (fade + geser 8px). Tutup dengan tombol Esc dan klik latar.
- Fokus berpindah ke dalam modal, lalu kembali ke pemicu saat ditutup.

### Ikon
- Gunakan satu set saja: **lucide-react**, `strokeWidth={1.75}`, ukuran 20 (UI) atau 24 (navigasi).

---

## 9. Gerak (Micro-interaction)

| Elemen | Efek |
|---|---|
| Gambar produk | `group-hover:scale-105 duration-500` |
| Kartu | naik 2px + bayangan membesar |
| Tombol | `active:scale-95` |
| Ikon hati | animasi "pop" singkat (scale 1 → 1.3 → 1) saat difavoritkan |
| Badge keranjang | "bump" saat jumlah berubah |
| Halaman | tanpa animasi berat; cukup fade 150 ms |

Hormati preferensi pengguna:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 10. Dark Mode

- Strategi `class` (`dark` di `<html>`), dengan pilihan Terang / Gelap / Sistem.
- Skrip kecil di `<head>` untuk menerapkan kelas sebelum render agar tidak berkedip.
- Jangan memakai hitam murni. Latar `zinc-950`, kartu `zinc-900`.
- Kurangi kecerahan foto: `dark:brightness-95`.
- Bayangan nyaris tak terlihat di mode gelap, jadi andalkan border (`dark:border-zinc-800/80`) untuk memisahkan permukaan.
- Aksen emerald dinaikkan satu tingkat (600 → 500) agar tetap terbaca.

---

## 11. Responsif

| Breakpoint | Perilaku |
|---|---|
| `< 640px` (mobile) | grid 2 kolom, bar bawah, bar pesan lengket di detail, drawer navigasi |
| `640–1023px` (tablet) | grid 3 kolom, header penuh |
| `≥ 1024px` (desktop) | grid 4 kolom, detail 2 kolom dengan foto lengket, sidebar admin tetap |

Desain **mobile dulu**: pengunjung UMKM hampir semuanya dari ponsel. Target sentuh minimal 44×44 px.

---

## 12. Aksesibilitas

- Semua `<img>` punya `alt` bermakna (nama produk). Foto dekoratif memakai `alt=""`.
- Ikon tombol tanpa teks wajib punya `aria-label` ("Tambah ke favorit", "Buka keranjang").
- Fokus terlihat jelas: `focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`.
- Jangan menyampaikan status hanya lewat warna. Tambahkan teks atau ikon ("Habis", bukan sekadar merah).
- Modal: perangkap fokus, tutup dengan Esc, `role="dialog"` dan `aria-modal="true"`.
- Urutan judul benar: satu `<h1>` per halaman.

---

## 13. Performa Visual

- Pakai `next/image` untuk foto produk dengan `sizes` yang benar dan `priority` hanya pada gambar paling atas.
- Rasio foto tetap (`aspect-[4/5]` di kartu) agar tidak ada layout shift.
- Tampilkan skeleton sebelum data tiba, bukan spinner kosong.
- Batasi font ke dua keluarga dan bobot yang dipakai saja.

---

## 14. Do & Don't

**Do**
- Biarkan foto produk besar dan bersih.
- Satu aksi utama per area, selalu emerald untuk "pesan".
- Konsisten: radius, bayangan, dan jarak sama di semua kartu.
- Uji tiap halaman di mode terang, gelap, dan lebar 360 px.

**Don't**
- Jangan memakai lebih dari satu warna aksen dalam satu komponen.
- Jangan menumpuk banyak badge pada satu kartu (maksimal dua).
- Jangan memakai animasi yang menghalangi pengguna memesan.
- Jangan memakai teks kecil (`< 12px`) untuk informasi penting.

---

## 15. Urutan Penerapan yang Disarankan

Kerjakan sebagai tugas desain terpisah dari User Story. Setiap langkah bisa di-commit sendiri.

1. **Fondasi:** font, warna dasar, `globals.css`, strategi dark mode.
2. **Shell:** header, footer, bar bawah mobile, tombol WhatsApp melayang.
3. **Kartu produk** dan grid beranda, termasuk skeleton.
4. **Hero, pencarian, chip kategori.**
5. **Halaman detail** (galeri, panel info, bar pesan lengket mobile).
6. **Shell admin:** sidebar, topbar, tabel, form, modal, toast.
7. **Penyempurnaan:** gerak, aksesibilitas, uji responsif.

### Cara memakai dengan AI

Tempel di awal tugas:

```
Baca DESIGN.md di root repo dan jadikan sumber kebenaran untuk seluruh tampilan.
Kerjakan langkah desain nomor [N] saja. Jangan mengubah logika, query, atau Server Action.
Hanya ubah className, struktur JSX, dan layout. Setelah selesai: jalankan npm run lint
dan npm run build, tunjukkan ringkasan perubahan, lalu commit dengan pesan
"Desain: [deskripsi ringkas]" dan berhenti.
```
