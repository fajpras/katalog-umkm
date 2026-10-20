import { notFound, redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormProduk from "@/components/FormProduk";
import { buatKlienSesi } from "@/lib/supabase/auth";
import { ubahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Ambil data lama dari Supabase
  let produk = null;
  try {
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      produk = data;
    }
  } catch {
    // Abaikan error koneksi
  }

  if (!produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
          Ubah Produk
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Perbarui rincian, harga, kategori, atau foto produk.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 sm:p-8">
        <FormProduk produk={produk} labelTombol="Simpan perubahan" action={ubahProduk} />
      </div>
    </div>
  );
}
