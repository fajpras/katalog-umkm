import Link from "next/link";
import { notFound } from "next/navigation";
import AksiPesanProduk from "@/components/AksiPesanProduk";
import GaleriProduk from "@/components/GaleriProduk";
import KartuProduk from "@/components/KartuProduk";
import { formatRupiah } from "@/lib/format";
import { buatKlienServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  let produk = null;
  let produkTerkait = [];

  try {
    const supabase = buatKlienServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      produk = data;

      // US-17: Query produk terkait kategori sama, kecualikan produk saat ini, limit 4
      if (produk.kategori) {
        const { data: terkait } = await supabase
          .from("produk")
          .select("*")
          .eq("kategori", produk.kategori)
          .neq("id", id)
          .limit(4);

        produkTerkait = terkait || [];
      }
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
        {/* Kolom Foto & Galeri Produk Lengket di Desktop */}
        <div className="lg:sticky lg:top-24 self-start">
          <GaleriProduk
            fotoUtama={produk.foto_url}
            fotoGaleri={produk.foto_galeri}
            nama={produk.nama}
          />
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

      {/* US-17: Seksi Produk Terkait */}
      {produkTerkait.length > 0 && (
        <section aria-labelledby="judul-produk-terkait" className="mt-14 border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2
                id="judul-produk-terkait"
                className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)] sm:text-2xl"
              >
                Produk Terkait
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Pilihan lain dari kategori {produk.kategori}
              </p>
            </div>
            <Link
              href={`/?kategori=${encodeURIComponent(produk.kategori)}`}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Lihat semua &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {produkTerkait.map((item) => (
              <KartuProduk key={item.id} produk={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
