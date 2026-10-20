import Link from "next/link";
import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import PaginasiAdmin from "@/components/PaginasiAdmin";
import Tombol from "@/components/Tombol";
import { buatKlienSesi } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

const ITEM_PER_HALAMAN = 10;

export default async function HalamanAdmin({ searchParams }) {
  // a. Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const halaman = Math.max(1, parseInt(sp.page, 10) || 1);

  // Ambil metrik ringkasan keseluruhan
  let totalProdukKeseluruhan = 0;
  let totalHabisKeseluruhan = 0;
  let daftarStatKategori = [];

  try {
    const { data: semuaData } = await supabase
      .from("produk")
      .select("id, kategori, stok, tersedia, aktif");

    if (semuaData) {
      totalProdukKeseluruhan = semuaData.length;
      totalHabisKeseluruhan = semuaData.filter(
        (p) =>
          p.tersedia === false ||
          p.stok === 0 ||
          (p.stok !== undefined && p.stok !== null && Number(p.stok) <= 0)
      ).length;

      const kategoriMap = {};
      semuaData.forEach((p) => {
        const k = p.kategori || "Tanpa Kategori";
        kategoriMap[k] = (kategoriMap[k] || 0) + 1;
      });
      daftarStatKategori = Object.entries(kategoriMap).sort((a, b) => b[1] - a[1]);
    }
  } catch {
    // Abaikan error metrik
  }

  // Query tabel produk dengan cari nama (q) dan paginasi server-side 10 baris/halaman
  let daftarProduk = [];
  let totalDataTabel = 0;
  let totalHalamanTabel = 1;
  let pesanError = null;

  try {
    let query = supabase
      .from("produk")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (q) {
      query = query.ilike("nama", `%${q}%`);
    }

    const dari = (halaman - 1) * ITEM_PER_HALAMAN;
    const sampai = dari + ITEM_PER_HALAMAN - 1;
    query = query.range(dari, sampai);

    const { data, count, error } = await query;
    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
      totalDataTabel = count || 0;
      totalHalamanTabel = Math.max(1, Math.ceil(totalDataTabel / ITEM_PER_HALAMAN));
    }
  } catch (err) {
    pesanError = err.message || "Gagal memuat daftar produk.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      {/* Header Dashboard */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
          Ringkasan & Pengelolaan Produk
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Pantau statistik katalog dan kelola seluruh produk toko Anda.
        </p>
      </div>

      {/* US-30: Kartu Metrik Ringkasan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Kartu Total Produk */}
        <div className="flex flex-col gap-1 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Total Produk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
            {totalProdukKeseluruhan}
          </p>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            Produk terdaftar di database
          </span>
        </div>

        {/* Kartu Total Kategori */}
        <div className="flex flex-col gap-1 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Kategori Aktif
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
            {daftarStatKategori.length}
          </p>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            Kategori produk digunakan
          </span>
        </div>

        {/* Kartu Status Stok */}
        <div className="flex flex-col gap-1 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Stok Habis
            </span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${totalHabisKeseluruhan > 0 ? "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"}`}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <p className={`text-3xl font-extrabold font-[family-name:var(--font-display)] ${totalHabisKeseluruhan > 0 ? "text-rose-600 dark:text-rose-400" : "text-zinc-900 dark:text-zinc-50"}`}>
            {totalHabisKeseluruhan}
          </p>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {totalHabisKeseluruhan > 0 ? "Perlu penambahan stok" : "Semua produk masih tersedia"}
          </span>
        </div>
      </div>

      {/* US-30: Bar Statistik Produk per Kategori */}
      {daftarStatKategori.length > 0 && (
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-6">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
            Distribusi Produk per Kategori
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Perbandingan persentase dan jumlah produk di tiap kategori.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {daftarStatKategori.map(([namaKategori, jumlah]) => {
              const persentase = totalProdukKeseluruhan > 0 ? Math.round((jumlah / totalProdukKeseluruhan) * 100) : 0;
              return (
                <div key={namaKategori} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-800 dark:text-zinc-200">{namaKategori}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {jumlah} produk ({persentase}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${persentase}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* US-33: Form Cari & Aksi Tambah Produk */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form action="/admin" method="GET" className="relative w-full max-w-md">
          <div className="relative flex items-center">
            <svg
              className="pointer-events-none absolute left-3.5 h-4 w-4 text-zinc-400 dark:text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari nama produk di admin..."
              className="h-10 w-full rounded-2xl border border-zinc-200/80 bg-white pl-10 pr-20 text-xs text-zinc-900 shadow-sm placeholder:text-zinc-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 h-7 rounded-xl bg-indigo-600 px-3 text-xs font-semibold text-white transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Cari
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          {q && (
            <Link
              href="/admin"
              className="rounded-2xl border border-zinc-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Reset Cari
            </Link>
          )}
          {/* US-35: Tombol Ekspor CSV */}
          <a
            href="/admin/export"
            download="produk-katalog.csv"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Ekspor CSV</span>
          </a>
          <Tombol href="/admin/produk/baru" varian="admin">
            + Tambah Produk
          </Tombol>
        </div>
      </div>

      {/* State error atau Tabel Produk & Paginasi */}
      {pesanError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <p className="font-semibold">Terjadi kesalahan saat memuat produk</p>
          <p className="mt-1 text-sm">{pesanError}</p>
        </div>
      ) : (
        <>
          <TabelProduk daftarProduk={daftarProduk} />
          {/* US-33: Paginasi 10 baris per halaman */}
          <PaginasiAdmin
            page={halaman}
            totalPages={totalHalamanTabel}
            totalData={totalDataTabel}
            q={q}
          />
        </>
      )}
    </div>
  );
}
