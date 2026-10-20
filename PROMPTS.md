# Jurnal Prompt Katalog UMKM

Dokumen ini berisi kumpulan prompt panduan pengembangan untuk US-01 sampai US-06 pada proyek Katalog UMKM. Salin teks prompt di bawah ini ke AI agent untuk mengerjakan setiap fitur secara bertahap dan terstruktur.

## Aturan Umum

- **Keamanan:**
  - Supabase hanya boleh diakses dari server (Server Component, Server Action, atau Route Handler). Jangan membuat client Supabase di file yang memakai `"use client"`.
  - Environment variable tidak boleh memakai awalan `NEXT_PUBLIC_`. Nama variabel: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`.
  - Setiap aksi yang mengubah data (ganti password, tambah, ubah, hapus produk) wajib memeriksa sesi login admin di server pada baris pertama fungsi (`supabase.auth.getUser()`).
  - Semua halaman di bawah `/admin` (kecuali `/admin/login`) hanya boleh dibuka oleh admin yang sudah login.
  - Jangan menulis kunci, password, atau email admin di dalam kode.
  - Row Level Security (RLS) wajib aktif di semua tabel database.

- **Desain & Tampilan (DESIGN.md):**
  - Mengikuti panduan token warna, tipografi, dan gaya komponen di `DESIGN.md`.
  - Tampilan harus rapi dan responsif di perangkat mobile (lebar 360 px), desktop, serta mendukung mode terang dan gelap.
  - Target sentuh tombol minimal 44 px untuk memudahkan interaksi di layar sentuh ponsel.

- **Aturan Commit & Pengerjaan:**
  - Kerjakan satu user story per prompt secara berurutan.
  - Pastikan `npm run build` sukses tanpa error sebelum melakukan commit.
  - Gunakan format pesan commit terstandarisasi: `US-XX: [deskripsi fitur]`.

---

## US-01 Katalog dari database

### Teks Prompt
```
Sebagai pengunjung, saya ingin melihat semua produk toko dalam satu halaman, supaya saya tahu apa saja yang dijual.
```

### Kriteria Selesai
- Halaman `/` menampilkan semua produk dari tabel `produk` di Supabase, bukan dari `lib/data-contoh.js`.
- Data diambil di sisi server.
- Setiap kartu menampilkan foto, kategori, nama, dan harga dalam format rupiah.
- Jika belum ada produk, halaman menampilkan pesan yang jelas.

### Pesan Commit
```
US-01: katalog dari database
```

---

## US-02 Detail produk

### Teks Prompt
```
Sebagai pengunjung, saya ingin melihat detail satu produk, supaya saya yakin sebelum memesan.
```

### Kriteria Selesai
- Halaman `/produk/[id]` menampilkan foto, kategori, nama, harga, dan deskripsi dari database.
- Produk yang tidak ada menampilkan halaman "tidak ditemukan".

### Pesan Commit
```
US-02: detail produk
```

---

## US-03 Pesan via WhatsApp

### Teks Prompt
```
Sebagai pengunjung, saya ingin menekan satu tombol untuk memesan lewat WhatsApp, supaya saya tidak perlu mengetik ulang nama produk.
```

### Kriteria Selesai
- Tombol "Pesan via WhatsApp" membuka WhatsApp ke nomor di `lib/toko.js`.
- Pesan sudah terisi otomatis dengan nama dan harga produk.
- Berfungsi di HP dan di laptop.

### Pesan Commit
```
US-03: pesan via whatsapp
```

---

## US-04 Login admin

### Teks Prompt
```
Sebagai admin, saya ingin masuk dengan email dan password, supaya hanya saya yang bisa mengelola toko.
```

### Kriteria Selesai
- Login memakai Supabase Auth, diproses di server.
- Login berhasil mengarah ke `/admin`; login gagal menampilkan pesan yang jelas.
- Tombol "Keluar" mengakhiri sesi dan kembali ke halaman login.

### Pesan Commit
```
US-04: login admin
```

---

## US-05 Ganti password

### Teks Prompt
```
Sebagai admin, saya ingin mengganti password, supaya password bawaan tidak bisa dipakai orang lain.
```

### Kriteria Selesai
- Form di `/admin/password` mengganti password admin yang sedang login.
- Password baru minimal 8 karakter dan harus sama dengan konfirmasinya.
- Menampilkan pesan berhasil atau pesan error yang jelas.

### Pesan Commit
```
US-05: ganti password
```

---

## US-06 Proteksi halaman admin

### Teks Prompt
```
Sebagai admin, saya ingin halaman admin tertutup untuk orang lain, supaya data toko aman.
```

### Kriteria Selesai
- Membuka halaman `/admin` mana pun tanpa login akan dialihkan ke `/admin/login`.
- Setiap aksi yang mengubah data memeriksa login di server.

### Pesan Commit
```
US-06: proteksi halaman admin
```
