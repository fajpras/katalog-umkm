import Link from "next/link";
import { notFound } from "next/navigation";
import AksiPesanProduk from "@/components/AksiPesanProduk";
import { formatRupiah } from "@/lib/format";
import { buatKlienServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  let produk = null;

  try {
    const supabase = buatKlienServer();
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
    <div className="pb-24 pt-4 md:pb-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">
          Beranda
        </Link>
        <span>/</span>
        <span className="text-zinc-400 dark:text-zinc-600">{produk.kategori || "Produk"}</span>
        <span>/</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{produk.nama}</span>
      </nav>

      <article className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Kolom Foto Produk Lengket di Desktop */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
            <img
              src={produk.foto_url || "/produk/kopi.svg"}
              alt={produk.nama}
              className="h-full w-full object-cover dark:brightness-95"
            />
          </div>
        </div>

        {/* Kolom Informasi & Aksi Pemesanan */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {produk.kategori || "Umum"}
            </span>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)] sm:text-4xl">
              {produk.nama}
            </h1>
            <p className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-[family-name:var(--font-display)] sm:text-3xl">
              {formatRupiah(produk.harga)}
            </p>
          </div>

          {/* Stepper Jumlah, Varian & WhatsApp CTA */}
          <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 sm:p-6">
            <AksiPesanProduk produk={produk} />
          </div>

          {/* Deskripsi Produk */}
          <div className="border-t border-zinc-200/80 pt-6 dark:border-zinc-800/80">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
              Deskripsi Produk
            </h2>
            <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400 text-sm sm:text-base whitespace-pre-line">
              {produk.deskripsi || "Tidak ada deskripsi untuk produk ini."}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
