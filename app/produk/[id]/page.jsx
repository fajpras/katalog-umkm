import Link from "next/link";
import { notFound } from "next/navigation";
import AksiPesanProduk from "@/components/AksiPesanProduk";
import GaleriProduk from "@/components/GaleriProduk";
import KartuProduk from "@/components/KartuProduk";
import TombolBagikan from "@/components/TombolBagikan";
import CatatTerakhirDilihat from "@/components/CatatTerakhirDilihat";
import SeksiUlasan from "@/components/SeksiUlasan";
import { formatRupiah } from "@/lib/format";
import { buatKlienServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const supabase = buatKlienServer();
    const { data: produk } = await supabase
      .from("produk")
      .select("nama, deskripsi, foto_url, harga, kategori, aktif")
      .eq("id", id)
      .maybeSingle();

    if (!produk || produk.aktif === false) {
      return {
        title: `Produk Tidak Ditemukan - ${toko.nama}`,
      };
    }

    const judul = `${produk.nama} - ${toko.nama}`;
    const deskripsi =
      produk.deskripsi ||
      `Pesan ${produk.nama} seharga ${formatRupiah(produk.harga)} di ${toko.nama}. Pesan mudah langsung via WhatsApp.`;
    const gambar = produk.foto_url || "/produk/kopi.svg";

    return {
      title: judul,
      description: deskripsi,
      openGraph: {
        title: judul,
        description: deskripsi,
        type: "article",
        images: [
          {
            url: gambar,
            alt: produk.nama,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: judul,
        description: deskripsi,
        images: [gambar],
      },
    };
  } catch {
    return {
      title: toko.nama,
      description: toko.tagline,
    };
  }
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;
  let produk = null;
  let produkTerkait = [];
  let daftarUlasan = [];

  try {
    const supabase = buatKlienServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      produk = data;

      // US-17 & US-32: Query produk terkait kategori sama (hanya yang aktif), kecualikan produk saat ini, limit 4
      if (produk.kategori && produk.aktif !== false) {
        const { data: terkait } = await supabase
          .from("produk")
          .select("*")
          .eq("kategori", produk.kategori)
          .neq("aktif", false)
          .neq("id", id)
          .limit(4);

        produkTerkait = terkait || [];
      }

      // US-38: Query ulasan yang tampil untuk produk ini
      try {
        const { data: ulasanData } = await supabase
          .from("ulasan")
          .select("*")
          .eq("produk_id", id)
          .eq("tampil", true)
          .order("created_at", { ascending: false });

        if (ulasanData) {
          daftarUlasan = ulasanData;
        }
      } catch {
        // Abaikan jika tabel ulasan belum dibuat
      }
    }
  } catch {
    // Abaikan error koneksi
  }

  // US-32: Produk nonaktif memicu 404 di sisi publik
  if (!produk || produk.aktif === false) {
    notFound();
  }

  const isHabis =
    produk.tersedia === false ||
    produk.stok === 0 ||
    (produk.stok !== undefined && produk.stok !== null && Number(produk.stok) <= 0);

  const adaDiskon =
    produk.harga_diskon !== null &&
    produk.harga_diskon !== undefined &&
    Number(produk.harga_diskon) > 0 &&
    Number(produk.harga_diskon) < Number(produk.harga);

  return (
    <div className="pb-24 pt-4 md:pb-12">
      {/* US-36: Catat ID produk ke LocalStorage (maks 8) */}
      <CatatTerakhirDilihat id={produk.id} />

      {/* Breadcrumb & Tombol Bagikan */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-zinc-400 dark:text-zinc-600">{produk.kategori || "Produk"}</span>
          <span>/</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{produk.nama}</span>
        </nav>
        <TombolBagikan nama={produk.nama} deskripsi={produk.deskripsi} />
      </div>

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
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {produk.kategori || "Umum"}
              </span>
              {produk.label && (
                <span className="inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm dark:bg-amber-600">
                  {produk.label}
                </span>
              )}
              {isHabis && (
                <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  Stok Habis
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)] sm:text-4xl">
              {produk.nama}
            </h1>
            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              {adaDiskon ? (
                <>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-[family-name:var(--font-display)] sm:text-3xl">
                    {formatRupiah(produk.harga_diskon)}
                  </p>
                  <p className="text-base text-zinc-400 line-through dark:text-zinc-500 sm:text-lg">
                    {formatRupiah(produk.harga)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-[family-name:var(--font-display)] sm:text-3xl">
                  {formatRupiah(produk.harga)}
                </p>
              )}
            </div>
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

      {/* US-38: Ulasan & Rating Produk */}
      <SeksiUlasan produkId={produk.id} daftarUlasan={daftarUlasan} />

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
