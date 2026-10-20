import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { buatKlienSesi } from "@/lib/supabase/auth";
import { tambahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HalamanTambahProduk() {
  const supabase = await buatKlienSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let daftarKategori = [];
  try {
    const { data: dataKategori } = await supabase
      .from("kategori")
      .select("nama")
      .order("nama", { ascending: true });

    if (dataKategori && dataKategori.length > 0) {
      daftarKategori = dataKategori.map((k) => k.nama);
    } else {
      // Fallback ke distinct kategori dari tabel produk
      const { data: dataProduk } = await supabase.from("produk").select("kategori");
      if (dataProduk) {
        daftarKategori = Array.from(new Set(dataProduk.map((p) => p.kategori).filter(Boolean)));
      }
    }
  } catch {
    // Abaikan error koneksi
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
          Tambah Produk
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Masukkan informasi produk baru untuk ditampilkan di katalog toko.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 sm:p-8">
        <FormProduk
          daftarKategori={daftarKategori}
          labelTombol="Simpan produk"
          action={tambahProduk}
        />
      </div>
    </div>
  );
}

