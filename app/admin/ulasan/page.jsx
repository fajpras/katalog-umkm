import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelModerasiUlasan from "@/components/TabelModerasiUlasan";
import { buatKlienSesi } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HalamanModerasiUlasan() {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let daftarUlasan = [];
  try {
    const { data: ulasanData, error } = await supabase
      .from("ulasan")
      .select("*, produk:produk_id(id, nama)")
      .order("created_at", { ascending: false });

    if (!error && ulasanData) {
      daftarUlasan = ulasanData;
    } else if (error && error.code !== "42P01") {
      // Jika join produk gagal, fallback select ulasan langsung
      const { data: rawUlasan } = await supabase
        .from("ulasan")
        .select("*")
        .order("created_at", { ascending: false });
      if (rawUlasan) daftarUlasan = rawUlasan;
    }
  } catch {
    // Abaikan jika tabel ulasan belum dibuat
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
          Moderasi Ulasan Pelanggan
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Kelola ulasan pembeli: sembunyikan ulasan yang tidak pantas atau hapus secara permanen.
        </p>
      </div>

      <TabelModerasiUlasan daftarUlasan={daftarUlasan} />
    </div>
  );
}
