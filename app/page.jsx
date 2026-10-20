import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import PilihUrutan from "@/components/PilihUrutan";
import Paginasi from "@/components/Paginasi";
import ProdukTerakhirDilihat from "@/components/ProdukTerakhirDilihat";
import BannerCarousel from "@/components/BannerCarousel";
import { toko } from "@/lib/toko";
import { buatKlienServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ITEM_PER_HALAMAN = 12;

export default async function HalamanKatalog({ searchParams }) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const kategori = typeof sp.kategori === "string" ? sp.kategori.trim() : "";
  const urut = typeof sp.urut === "string" ? sp.urut.trim() : "terbaru";
  const halaman = Math.max(1, parseInt(sp.page, 10) || 1);

  let daftarProduk = [];
  let semuaKategori = ["Semua"];
  let daftarBanner = [];
  let totalData = 0;
  let totalHalaman = 1;
  let pesanError = null;

  try {
    const supabase = buatKlienServer();

    // US-42: Ambil banner promo aktif (sembunyikan jika kosong/tabel belum ada)
    try {
      const { data: bannerData } = await supabase
        .from("banner")
        .select("*")
        .eq("aktif", true)
        .order("created_at", { ascending: false });

      if (bannerData) {
        daftarBanner = bannerData;
      }
    } catch {
      // Abaikan jika tabel banner belum dibuat
    }

    // Ambil daftar seluruh kategori untuk chip filter (hanya dari produk aktif, fallback jika kolom aktif belum ada)
    let dataKategori = null;
    const resKat = await supabase
      .from("produk")
      .select("kategori")
      .neq("aktif", false);

    if (resKat.error && resKat.error.code === "42703") {
      const resFallback = await supabase.from("produk").select("kategori");
      dataKategori = resFallback.data;
    } else {
      dataKategori = resKat.data;
    }

    if (dataKategori) {
      const kategoriSet = new Set(dataKategori.map((p) => p.kategori).filter(Boolean));
      semuaKategori = ["Semua", ...Array.from(kategoriSet)];
    }

    // Helper pembangun query dengan filter aktif (fallback jika kolom belum ada)
    const buatQueryProduk = (denganFilterAktif = true) => {
      let qBuilder = supabase.from("produk").select("*", { count: "exact" });

      if (denganFilterAktif) {
        qBuilder = qBuilder.neq("aktif", false);
      }

      if (q) {
        qBuilder = qBuilder.ilike("nama", `%${q}%`);
      }

      if (kategori && kategori !== "Semua") {
        qBuilder = qBuilder.eq("kategori", kategori);
      }

      if (urut === "termurah") {
        qBuilder = qBuilder.order("harga", { ascending: true });
      } else if (urut === "termahal") {
        qBuilder = qBuilder.order("harga", { ascending: false });
      } else {
        qBuilder = qBuilder.order("created_at", { ascending: false });
      }

      const dari = (halaman - 1) * ITEM_PER_HALAMAN;
      const sampai = dari + ITEM_PER_HALAMAN - 1;
      return qBuilder.range(dari, sampai);
    };

    let { data, count, error } = await buatQueryProduk(true);

    // Fallback otomatis jika kolom `aktif` belum ditambahkan di Supabase
    if (error && error.code === "42703") {
      const resTanpaAktif = await buatQueryProduk(false);
      data = resTanpaAktif.data;
      count = resTanpaAktif.count;
      error = resTanpaAktif.error;
    }

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
      totalData = count || 0;
      totalHalaman = Math.max(1, Math.ceil(totalData / ITEM_PER_HALAMAN));
    }
  } catch (err) {
    pesanError = err.message;
  }

  const adaFilter = Boolean(q || (kategori && kategori !== "Semua") || (urut && urut !== "terbaru") || halaman > 1);

  return (
    <>
      {/* US-42: Carousel Banner Promo Aktif (disembunyikan jika kosong) */}
      <div className="mt-4">
        <BannerCarousel daftarBanner={daftarBanner} />
      </div>

      {/* Hero & Banner Toko */}
      <section className="relative -mx-4 mb-8 overflow-hidden rounded-b-3xl bg-gradient-to-b from-emerald-50/80 via-emerald-50/30 to-transparent px-4 py-10 dark:from-emerald-950/30 dark:via-zinc-950/10 dark:to-transparent sm:-mx-6 sm:px-6 sm:py-14">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Katalog Resmi UMKM
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)] sm:text-5xl">
            {toko.nama}
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
            {toko.tagline}
          </p>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
            🕒 {toko.jamBuka} &bull; 📍 {toko.alamat}
          </p>

          {/* Form Pencarian (GET) */}
          <form action="/" method="GET" className="relative mt-6 max-w-xl">
            {kategori && kategori !== "Semua" && (
              <input type="hidden" name="kategori" value={kategori} />
            )}
            {urut && urut !== "terbaru" && (
              <input type="hidden" name="urut" value={urut} />
            )}
            <div className="relative flex items-center">
              <svg
                className="pointer-events-none absolute left-4 h-5 w-5 text-zinc-400 dark:text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Cari produk pilihanmu di sini..."
                className="h-12 w-full rounded-2xl border border-zinc-200/80 bg-white pl-11 pr-24 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Chip Filter Kategori */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {semuaKategori.map((kat) => {
              const isAktif = kat === "Semua" ? !kategori || kategori === "Semua" : kategori === kat;
              
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (kat !== "Semua") params.set("kategori", kat);
              if (urut && urut !== "terbaru") params.set("urut", urut);

              const queryString = params.toString();
              const href = queryString ? `/?${queryString}` : "/";

              return (
                <Link
                  key={kat}
                  href={href}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                    isAktif
                      ? "bg-emerald-600 text-white shadow-sm dark:bg-emerald-500"
                      : "border border-zinc-200/80 bg-white/80 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {kat}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Daftar Produk */}
      <section aria-labelledby="judul-produk" className="mb-14 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
          <div>
            <h2
              id="judul-produk"
              className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)] sm:text-2xl"
            >
              {kategori && kategori !== "Semua" ? `Kategori: ${kategori}` : "Semua Produk"}
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Menampilkan {daftarProduk.length} dari {totalData} produk (Halaman {halaman} dari {totalHalaman})
            </p>
          </div>

          {/* Dropdown Urutkan */}
          <PilihUrutan urutAktif={urut} />
        </div>

        {pesanError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-5 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <p className="font-semibold">Terjadi kesalahan saat memuat produk</p>
            <p className="mt-1 text-sm">{pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          adaFilter ? (
            /* State Produk Tidak Ditemukan Karena Filter/Pencarian */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white px-6 py-16 text-center dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
                Produk tidak ditemukan
              </h3>
              <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                Tidak ada produk yang cocok dengan {q && `kata kunci "${q}"`} {q && kategori && "pada"} {kategori && `kategori "${kategori}"`}.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-900 px-5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Reset pencarian
                </Link>
              </div>
            </div>
          ) : (
            /* State Belum Ada Produk Sama Sekali */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white px-6 py-16 text-center dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Belum ada produk
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Katalog saat ini sedang dalam proses pembaharuan.
              </p>
            </div>
          )
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>

            {/* Paginasi 12 item/halaman */}
            <Paginasi
              page={halaman}
              totalPages={totalHalaman}
              q={q}
              kategori={kategori}
              urut={urut}
            />
          </>
        )}
      </section>

      {/* US-36: Widget Produk Terakhir Dilihat (disembunyikan jika kosong) */}
      <ProdukTerakhirDilihat />
    </>
  );
}
