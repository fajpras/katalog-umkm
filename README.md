# Katalog UMKM + Order WhatsApp

Template workshop vibe coding Creative Hub App Talent (CHAT) 2026. Repo ini berisi aplikasi katalog UMKM terintegrasi dengan database, login admin, keamanan berlapis, dan pemesanan lewat WhatsApp.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fandixurniawan%2Fkatalog-umkm&project-name=katalog-umkm&repository-name=katalog-umkm)

## Langkah awal

1. **Salin repo ke akun GitHub-mu.** Klik tombol **Deploy with Vercel** di atas. Vercel akan membuat repo baru di akun GitHub-mu dan langsung men-deploy-nya. Setelah selesai, buka link Vercel-mu: katalog tampil dengan data contoh.
2. **Buat proyek Supabase.** Masuk ke [supabase.com](https://supabase.com) dengan akun GitHub, lalu buat proyek baru. Simpan password database di tempat aman.
3. **Siapkan database.** Di Supabase, buka **SQL Editor**, tempel seluruh isi `docs/schema.sql`, lalu klik **Run**. Tabel `produk` beserta data awal akan terbentuk.
4. **Siapkan akun admin.** Ikuti panduan akun admin yang dibagikan mentor. Setelah itu matikan pendaftaran akun baru di **Authentication > Sign In / Providers**.
5. **Isi environment variable di Vercel.** Buka proyekmu di Vercel > **Settings > Environment Variables**, lalu isi tiga variabel dari `.env.example`. Nilainya ada di Supabase > **Project Settings > API**. Setelah itu lakukan **Redeploy**.
6. **Clone repo ke laptop.**

   ```bash
   git clone https://github.com/<akunmu>/<nama-repo>.git
   cd <nama-repo>
   npm install
   ```

7. **Buat file `.env.local`.** Salin `.env.example` menjadi `.env.local`, lalu isi dengan nilai yang sama seperti di Vercel.
8. **Jalankan di laptop.**

   ```bash
   npm run dev
   ```

   Buka `http://localhost:3000`.

## Alur kerja

Kerjakan satu user story setiap kali, lalu simpan dan kirim perubahan:

```bash
git add .
git commit -m "US-01: katalog dari database"
git push
```

Setiap `git push`, Vercel otomatis men-deploy versi terbaru. Cek hasilnya di link Vercel-mu.

Urutan yang disarankan: US-01, US-02, US-03, US-04, US-05, US-06, lalu fitur bonus. Daftar lengkap ada di `docs/user-stories.md`.

## Isi repo

| File atau folder | Isi |
| --- | --- |
| `AGENTS.md` | Aturan untuk AI agent, dibaca sebelum setiap prompt |
| `DESIGN.md` | Panduan warna, huruf, dan komponen |
| `PROMPTS.md` | Jurnal prompt panduan implementasi |
| `docs/` | Problem statement, PRD, user story, rancangan teknis, skema database, checklist |
| `lib/toko.js` | Nama toko, nomor WhatsApp, alamat, jam buka |
| `app/` | Halaman aplikasi |
| `components/` | Komponen tampilan |

## Menyesuaikan dengan usahamu

- Identitas toko: ubah `lib/toko.js`.
- Warna: ubah bagian `@theme` di `app/globals.css` (lihat `DESIGN.md`).
- Produk: ubah langsung di Supabase > **Table Editor > produk** atau lewat dasbor admin.

## Aturan penting

- Jangan menyimpan kunci atau password di kode, dan jangan push file `.env.local`.
- Jangan memberi awalan `NEXT_PUBLIC_` pada environment variable.
- Isi `PROMPTS.md` setiap menyelesaikan fitur.

## Sebelum mengumpulkan

1. Jalankan semua poin di `docs/checklist-keamanan.md` dan `docs/checklist-pengujian.md` pada link Vercel.
2. Lengkapi bagian di bawah ini.
3. Push perubahan terakhir sebelum batas waktu.

## Tentang aplikasi ini

### Ringkasan & Sasaran Pengguna
Aplikasi katalog produk online UMKM (**Faleft Toko**) yang dirancang untuk calon pembeli dan pemilik toko:
- **Pengunjung (calon pembeli):** Menelusuri seluruh katalog produk terkini, melihat detail spesifikasi, harga, status stok, ulasan pelanggan, membandingkan produk, hingga memesan langsung via WhatsApp dengan pesan otomatis yang rapi dalam maksimal 3 kali klik.
- **Admin (pemilik toko):** Mengelola katalog toko (tambah, ubah, hapus produk), mengatur status aktif produk dan banner promosi, memoderasi ulasan pelanggan, mengelola kategori, mengekspor data ke format CSV, memantau metrik performa (produk terlaris & log klik WhatsApp), serta mengganti password akun admin.

### Fitur Utama (US-01 s.d. US-06)
- **US-01 (Katalog dari Database):** Halaman beranda (`/`) merender seluruh produk langsung dari Supabase di sisi server (SSR) dalam format harga Rupiah dan tata letak responsif.
- **US-02 (Detail Produk):** Halaman `/produk/[id]` menampilkan informasi lengkap produk dengan penanganan halaman tidak ditemukan (`notFound()`) bila ID tidak valid atau produk nonaktif.
- **US-03 (Pesan via WhatsApp):** Tombol pesan otomatis menghubungkan pembeli ke nomor WhatsApp toko (`lib/toko.js`) dengan teks pesanan ter-encode yang memuat nama produk, varian, jumlah, dan total harga.
- **US-04 (Login Admin):** Otentikasi aman akun admin menggunakan Supabase Auth yang diproses di server.
- **US-05 (Ganti Password):** Fasilitas penggantian password admin di `/admin/password` dengan validasi minimal 8 karakter dan konfirmasi kecocokan.
- **US-06 (Proteksi Halaman Admin):** Proteksi menyeluruh pada rute `/admin` melalui `proxy.js` dan verifikasi sesi server di setiap Server Action / Route Handler.

### Fitur Lanjutan & Bonus
- Manajemen produk lengkap (US-08 s.d. US-10) dengan validasi form server dan penanganan galeri foto (US-18).
- Filter kategori, pencarian cerdas, dan pengurutan (US-11, US-15).
- Pemilihan varian dan jumlah (US-12) serta Keranjang Belanja multi-item via WhatsApp (US-21).
- PWA terkonfigurasi (US-13) dan generator deskripsi produk dengan AI Gemini (US-14).
- Paginasi katalog pengunjung dan tabel admin (US-16, US-33).
- Produk terkait (US-17), status ketersediaan stok (US-19), dan harga diskon/badge promo (US-20).
- Halaman tentang toko (US-22), bagikan tautan produk (US-23), dan daftar favorit lokal (US-24).
- Mode gelap / terang / sistem anti-flash (US-25).
- SEO dinamis, Open Graph, Twitter Cards (US-26), serta sitemap.xml dan robots.txt dinamis (US-27).
- Halaman 404 kustom dan animasi skeleton loading (US-28).
- Upload foto produk ke Supabase Storage (US-29).
- Dashboard ringkasan statistik toko & produk terlaris (US-30, US-41).
- CRUD kategori toko terproteksi (US-31) dan sakelar aktif/nonaktif produk (US-32).
- Validasi form admin server dengan feedback per-field (US-34) dan ekspor data CSV (US-35).
- Widget produk terakhir dilihat (US-36) dan fitur bandingkan produk (US-37).
- Sistem ulasan & rating bintang dengan honeypot spam protection (US-38) dan moderasi admin (US-39).
- Pelacakan analitik klik WhatsApp (US-40) dan slider banner promo beranda (US-42).

### Teknologi
- **Framework & Runtime:** Next.js 16 (App Router), React 19, JavaScript
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Storage)
- **Styling:** Tailwind CSS 4 dengan token warna dan tema gelap/terang
- **AI Integration:** Google Gemini API (`@google/genai` / REST)

### Cara Menjalankan Secara Lokal
1. Pastikan Node.js (>= 20.9.0) sudah terpasang.
2. Pasang dependensi proyek:
   ```bash
   npm install
   ```
3. Salin berkas lingkungan dari template:
   ```bash
   cp .env.example .env.local
   ```
4. Buka `.env.local` dan isi nama-nama variabel lingkungan berikut dengan nilai proyek Supabase dan Google Gemini Anda:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `GEMINI_API_KEY`
5. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
6. Buka peramban di `http://localhost:3000`.

### Catatan Keamanan
- Seluruh pengambilan data publik maupun pengelolaan data admin dijalankan di sisi server (Server Component, Server Action, atau Route Handler).
- Tidak ada inisialisasi browser client (`createBrowserClient`) maupun akses langsung dari komponen klien ke Supabase.
- Tidak ada environment variable yang menggunakan awalan `NEXT_PUBLIC_` untuk kredensial rahasia.
- Row Level Security (RLS) diaktifkan pada seluruh tabel database Supabase.
- Setiap aksi mutasi data admin memverifikasi sesi login secara ketat di baris pertama pemanggilan fungsi.

### Dokumentasi Jurnal Prompt
Rincian prompt pengembangan fitur US-01 sampai US-06 dapat dilihat pada berkas [PROMPTS.md](PROMPTS.md).
