import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKlienSesi } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  // a. Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // b. Ambil produk dari Supabase di server (id, nama, harga, kategori, foto_url), urut terbaru
  let daftarProduk = [];
  let pesanError = null;

  try {
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, kategori, foto_url")
      .order("created_at", { ascending: false });

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal memuat daftar produk.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Produk</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Kelola semua produk katalog tokomu di sini.
          </p>
        </div>
        {/* US-08: tambah produk */}
        <Tombol href="/admin/produk/baru">+ Tambah Produk</Tombol>
      </div>

      {/* d. State error */}
      {pesanError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <p className="font-semibold">Terjadi kesalahan saat memuat produk</p>
          <p className="mt-1 text-sm">{pesanError}</p>
        </div>
      ) : (
        /* c & d. Tampilkan tabel dengan state kosong di dalamnya */
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
