import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import KelolaBanner from "@/components/KelolaBanner";
import { buatKlienSesi } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HalamanAdminBanner() {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  let daftarBanner = [];
  try {
    const { data, error } = await supabase
      .from("banner")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      daftarBanner = data;
    }
  } catch {
    // Abaikan jika tabel banner belum dibuat
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
          Kelola Banner Promo
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Atur banner promosi, diskon, dan pengumuman yang muncul di halaman beranda toko.
        </p>
      </div>

      <KelolaBanner daftarBanner={daftarBanner} />
    </div>
  );
}

