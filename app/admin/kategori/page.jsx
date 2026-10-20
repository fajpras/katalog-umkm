import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import KelolaKategori from "@/components/KelolaKategori";
import { buatKlienSesi } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HalamanAdminKategori() {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let daftarKategori = [];
  let hitungProdukMap = {};

  try {
    // 1. Ambil data kategori
    const { data: dataKategori, error: errKategori } = await supabase
      .from("kategori")
      .select("*")
      .order("nama", { ascending: true });

    if (!errKategori && dataKategori) {
      daftarKategori = dataKategori;
    }

    // 2. Hitung jumlah produk untuk tiap kategori
    const { data: dataProduk } = await supabase
      .from("produk")
      .select("kategori");

    if (dataProduk) {
      dataProduk.forEach((p) => {
        if (p.kategori) {
          hitungProdukMap[p.kategori] = (hitungProdukMap[p.kategori] || 0) + 1;
        }
      });

      // Fallback jika tabel kategori belum dimigrasikan: ekstrak dari produk
      if (daftarKategori.length === 0 && dataProduk.length > 0) {
        const setKategori = new Set(dataProduk.map((p) => p.kategori).filter(Boolean));
        daftarKategori = Array.from(setKategori).map((nama, idx) => ({
          id: idx + 1,
          nama,
        }));
      }
    }
  } catch {
    // Abaikan error koneksi
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
          Kelola Kategori Produk
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Atur dan kelompokkan produk katalog Anda dengan kategori terstruktur.
        </p>
      </div>

      <KelolaKategori
        daftarKategori={daftarKategori}
        hitungProdukMap={hitungProdukMap}
      />
    </div>
  );
}
