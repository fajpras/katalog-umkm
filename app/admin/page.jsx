import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKlienSesi } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  // a. Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // b. Ambil produk dari Supabase di server
  let daftarProduk = [];
  let pesanError = null;

  try {
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal memuat daftar produk.";
  }

  // US-30: Perhitungan ringkasan statistik dashboard
  const totalProduk = daftarProduk.length;
  const produkHabis = daftarProduk.filter(
    (p) =>
      p.tersedia === false ||
      p.stok === 0 ||
      (p.stok !== undefined && p.stok !== null && Number(p.stok) <= 0)
  ).length;

  const kategoriMap = {};
  daftarProduk.forEach((p) => {
    const k = p.kategori || "Tanpa Kategori";
    kategoriMap[k] = (kategoriMap[k] || 0) + 1;
  });
  const daftarStatKategori = Object.entries(kategoriMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />

      {/* Header Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
            Ringkasan & Pengelolaan Produk
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Pantau statistik katalog dan kelola seluruh produk toko Anda.
          </p>
        </div>
        <Tombol href="/admin/produk/baru" varian="admin">
          + Tambah Produk
        </Tombol>
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
            {totalProduk}
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
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${produkHabis > 0 ? "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"}`}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
          </div>
          <p className={`text-3xl font-extrabold font-[family-name:var(--font-display)] ${produkHabis > 0 ? "text-rose-600 dark:text-rose-400" : "text-zinc-900 dark:text-zinc-50"}`}>
            {produkHabis}
          </p>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {produkHabis > 0 ? "Perlu penambahan stok" : "Semua produk masih tersedia"}
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
              const persentase = totalProduk > 0 ? Math.round((jumlah / totalProduk) * 100) : 0;
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

      {/* State error atau Tabel Produk */}
      {pesanError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          <p className="font-semibold">Terjadi kesalahan saat memuat produk</p>
          <p className="mt-1 text-sm">{pesanError}</p>
        </div>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
