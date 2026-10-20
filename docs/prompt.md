# prompt.md: Audit Akhir & Kelengkapan Fase 1 (US-01 s.d. US-06)

Tempel isi blok di bawah ke Claude Code (atau agen lain yang punya akses repo). Letakkan folder `docs/` di root repo sebelum memulai.


---

```
Bertindaklah sebagai Senior Full-Stack Engineer sekaligus reviewer keamanan. Proyek Katalog UMKM (Next.js App Router + Supabase + Tailwind). US-01 sampai US-06 sudah dikerjakan. Tugas sekarang: audit akhir, perapian, dan kelengkapan dokumentasi sebelum push terakhir. Ini BUKAN pengerjaan User Story baru.

=== LANGKAH 0: BACA REFERENSI DULU ===
1. Jalankan `ls -R docs` dan baca SEMUA file di folder docs/ (spesifikasi, daftar US, catatan, desain, dsb).
2. Tulis ringkasan 5-8 poin: apa tujuan aplikasi, daftar US-01 s.d. US-06 menurut docs, aturan keamanan, dan standar desain.
3. Jalankan `git status` dan `git log --oneline -15`. Jika ada perubahan belum ter-commit, tampilkan dan tanya saya sebelum lanjut.
4. Jika ada hal di docs yang bertentangan dengan kode, catat sebagai temuan. Jangan diam-diam mengubahnya.

=== BATASAN KERAS ===
- Dilarang `git reset --hard`, `git push --force`, `git clean -fd`, `git filter-branch`, atau menulis ulang riwayat.
- Dilarang mencetak isi nilai rahasia (kunci, password, token) ke laporan. Cukup tulis nama variabelnya.
- Dilarang mengubah logika fitur kecuali untuk memperbaiki temuan keamanan. Setiap perbaikan dijelaskan dulu, lalu dikerjakan sebagai commit terpisah.
- Periksa `git status` sebelum `git add`. Jangan `git add .` buta.
- Jangan menjalankan `git push` sebelum Bagian C selesai dan saya menyetujui.

=== BAGIAN A: AUDIT KEAMANAN (yang bisa dicek lewat kode) ===

A1. Proteksi halaman admin (setara cek "jendela penyamaran → /admin → dialihkan ke login")
 a. Temukan semua file di app/admin/** (page, layout, route, actions).
 b. Pastikan setiap halaman /admin (kecuali /admin/login) memeriksa sesi di server dan `redirect("/admin/login")` jika tidak ada user. Gunakan `supabase.auth.getUser()`, bukan `getSession()`.
 c. Pastikan setiap Server Action / Route Handler yang mengubah data memeriksa sesi di BARIS PERTAMA fungsi.
 d. Tabel hasil: file | memeriksa sesi? | baris keberapa | status OK/TEMUAN.

A2. Password bawaan sudah tidak berlaku (setara cek "login password bawaan → gagal")
 a. Cari password bawaan/seed yang tertulis di kode, docs, README, skrip seed, atau SQL (cari kata: password, passwd, admin123, seed, createUser).
 b. Jika ada password bawaan tertulis di repo: tandai TEMUAN, sarankan menggantinya di Supabase Auth, dan hapus dari berkas (tanpa mencetak nilainya).
 c. Pastikan fitur ganti password (app/admin/password/page.jsx + action di app/admin/actions.js) memvalidasi minimal 8 karakter, konfirmasi cocok, dan cek sesi di baris pertama.
 d. Catat sebagai LANGKAH MANUAL: saya yang mencoba login dengan password lama dan memastikan gagal.

A3. Tidak ada permintaan dari browser ke supabase.co (setara cek F12 → Network)
 a. Cari semua pemakaian klien Supabase di sisi browser: `createBrowserClient`, `"use client"` yang meng-import supabase, `NEXT_PUBLIC_SUPABASE_`, dan `fetch` ke domain `supabase.co`.
 b. Pastikan seluruh akses data (produk, auth, mutasi) berjalan di server (Server Component, Server Action, Route Handler).
 c. Jika ada akses langsung dari komponen klien: tandai TEMUAN dan usulkan memindahkannya ke server. Jangan ubah sebelum saya setuju.
 d. Catatan penting: jika `foto_url` menunjuk ke Supabase Storage, gambar akan tetap muncul di tab Network sebagai permintaan gambar (Img). Itu normal dan bukan pelanggaran. Yang dilarang adalah permintaan Fetch/XHR data dari browser. Tulis catatan ini di laporan agar saya tahu cara memfilter di F12 (filter "Fetch/XHR").

A4. Tidak ada .env.local di repo GitHub
 a. Jalankan: `git ls-files | grep -E '(^|/)\.env'` → hanya `.env.example` yang boleh terlacak.
 b. Periksa `.gitignore` memuat `.env*` (dengan pengecualian `!.env.example`). Perbaiki jika belum.
 c. Periksa riwayat: `git log --all --oneline -- .env.local .env` dan `git log --all -S"SUPABASE_SERVICE_ROLE_KEY" --oneline`.
 d. Jika berkas rahasia PERNAH ter-commit: JANGAN menulis ulang riwayat. Laporkan commit-nya, dan beri instruksi: putar (rotate) kunci di dashboard Supabase/Gemini, lalu bersihkan riwayat secara manual atas keputusan saya.
 e. Buat atau perbarui `.env.example` yang berisi NAMA variabel saja (tanpa nilai).

A5. Kebocoran kunci
 a. Pastikan `SUPABASE_SERVICE_ROLE_KEY` dan `GEMINI_API_KEY` tidak pernah memakai awalan NEXT_PUBLIC_ dan tidak di-import dari komponen klien.
 b. Cari nilai kunci yang tertanam langsung di kode: pola `eyJ` (JWT), `AIza`, `sb_secret`, `service_role`.
 c. Jalankan `npm run build` lalu cari string kunci di `.next/static` untuk memastikan tidak ada yang bocor ke bundle klien.

A6. Supabase RLS
 a. Cari semua SQL/migrasi di repo atau docs. Pastikan setiap tabel punya `ENABLE ROW LEVEL SECURITY`.
 b. Pastikan policy publik hanya SELECT pada data yang memang publik (tabel produk).
 c. Jika tidak ada berkas SQL, tulis di laporan: "perlu dicek manual di dashboard Supabase → Table Editor → RLS enabled".

Setelah Bagian A: tampilkan ringkasan temuan (tabel: ID | temuan | tingkat bahaya | usulan perbaikan). Perbaiki hanya temuan yang aman dan jelas, masing-masing satu commit: `git commit -m "Keamanan: [deskripsi]"`. Temuan yang butuh keputusan saya: berhenti dan tanya.

=== BAGIAN B: CEK FITUR (yang bisa dicek lewat kode dan build) ===

B1. Katalog & detail produk tampil benar
 a. `npm run lint` dan `npm run build` harus lulus. Jika gagal, perbaiki akar masalahnya.
 b. Tinjau app/page.jsx dan app/produk/[id]/page.jsx: data diambil di server, kartu produk menampilkan foto, nama, harga (format Rupiah), kategori; `notFound()` dipanggil jika ID tidak ada.
 c. Jalankan `npm run dev` jika memungkinkan, ambil beberapa halaman dengan `curl` (beranda, satu detail produk, ID ngawur) dan laporkan status HTTP-nya (200, 200, 404).

B2. Tombol WhatsApp
 a. Tinjau pembentukan tautan wa.me: nomor dari lib/toko.js (hanya digit, format internasional tanpa + dan 0 di depan, misalnya 62...), pesan di-encode dengan `encodeURIComponent`, berisi nama produk dan harga.
 b. Tampilkan satu contoh URL hasil (nomor boleh disamarkan).
 c. Catat sebagai LANGKAH MANUAL: saya yang menekan tombol di HP dan memastikan WhatsApp terbuka dengan pesan benar.

B3. Tampilan rapi di HP (tinjauan kode)
 a. Periksa kelas responsif di beranda, kartu, detail, login: grid mobile, tidak ada lebar tetap yang memicu scroll horizontal, tombol punya target sentuh cukup besar (min 44px), viewport meta ada.
 b. Periksa dark mode tetap terbaca bila sudah ada.
 c. Daftar halaman yang saya harus buka di HP (manual): /, /produk/[id], /admin/login, /admin.

=== BAGIAN C: LENGKAPI DOKUMENTASI & PUSH ===

C1. PROMPTS.md berisi prompt US-01 sampai US-06
 a. Ambil teks prompt US-01 s.d. US-06 dari sumber di folder docs/ (salin APA ADANYA, jangan mengarang atau meringkas). Jika sumbernya tidak ditemukan di docs/, berhenti dan tanya saya.
 b. Format PROMPTS.md:
    - Judul + satu paragraf pengantar (cara pakai).
    - Aturan umum (keamanan, UI, aturan commit) dari docs.
    - Satu seksi per story: `## US-01 ...` sampai `## US-06 ...`, berisi teks prompt dalam blok kode, kriteria lulus, dan pesan commit.
 c. Pastikan tidak ada nilai rahasia di dalamnya.
 d. Commit: `git commit -m "Docs: PROMPTS.md US-01 sampai US-06"`

C2. README.md bagian "Tentang aplikasi ini"
 a. Buat atau lengkapi seksi `## Tentang aplikasi ini` berdasarkan docs/ dan kode yang sebenarnya (bukan karangan):
    - Apa itu aplikasi dan untuk siapa (katalog produk UMKM, pesan via WhatsApp).
    - Fitur yang sudah ada (US-01 s.d. US-06).
    - Teknologi: Next.js, Supabase, Tailwind CSS.
    - Cara menjalankan: instal, salin `.env.example` menjadi `.env.local`, isi variabel, `npm run dev`. Sebutkan NAMA variabel saja.
    - Catatan keamanan singkat (data dibaca di server, halaman admin diproteksi, kunci rahasia tidak ke klien).
    - Tautan ke PROMPTS.md.
 b. Commit: `git commit -m "Docs: isi bagian tentang aplikasi di README"`

C3. Push terakhir
 a. Pastikan Bagian A dan B tidak punya temuan terbuka, `npm run build` lulus, dan `git status` bersih.
 b. Tampilkan `git log --oneline -10` dan `git remote -v`, lalu TANYA saya: "Siap push?". Tunggu persetujuan.
 c. Setelah saya setuju: `git push` biasa (tanpa --force). Jika ditolak karena riwayat berbeda, berhenti dan jelaskan; jangan memaksa.
 d. Setelah push, tampilkan `git status -sb` untuk memastikan lokal dan remote sinkron.

=== BAGIAN D: LAPORAN AKHIR ===
Tulis laporan dengan format:

1. Ringkasan: LULUS / ADA TEMUAN (hitungan per bagian).
2. Tabel hasil otomatis: item | hasil | bukti singkat (nama file/baris/perintah).
3. Daftar commit yang dibuat (`git log --oneline`).
4. **Checklist uji manual untuk saya** (centang satu per satu):
   - [ ] Jendela penyamaran → buka /admin → dialihkan ke /admin/login.
   - [ ] Login dengan password bawaan → gagal (password sudah diganti).
   - [ ] F12 → tab Network → muat ulang beranda dan detail produk, filter Fetch/XHR → tidak ada permintaan ke supabase.co.
   - [ ] Di repo GitHub (lewat browser), tidak ada berkas .env.local; hanya .env.example.
   - [ ] Katalog dan detail produk tampil benar.
   - [ ] Tombol WhatsApp dicoba di HP: WhatsApp terbuka dengan pesan yang benar.
   - [ ] Tampilan rapi di HP (/, detail produk, login admin).
   - [ ] PROMPTS.md di GitHub berisi US-01 s.d. US-06.
   - [ ] README.md bagian "Tentang aplikasi ini" terisi.
   - [ ] Push terakhir sudah tampil di GitHub.
5. Hal yang butuh keputusan saya (jika ada).

MULAI: kerjakan Langkah 0, tampilkan ringkasannya, lalu lanjut ke Bagian A. Berhenti dan tanya hanya pada kondisi yang disebutkan di atas.
```

---

## Cara pakai singkat

1. Pastikan folder `docs/` ada di root repo dan berisi spesifikasi serta teks prompt US-01 sampai US-06.
2. Salin blok di atas ke Claude Code.
3. Setelah AI selesai, kerjakan checklist uji manual di laporan akhir (jendela penyamaran, F12, HP).
4. Setujui push hanya setelah semua centang terpenuhi.
