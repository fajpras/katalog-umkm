import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `404 - Halaman Tidak Ditemukan | ${toko.nama}`,
};

export default function TidakDitemukan() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-sm dark:bg-emerald-950/60 dark:text-emerald-400">
        <span className="text-3xl font-extrabold font-[family-name:var(--font-display)]">404</span>
      </div>

      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)] sm:text-3xl">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        Maaf, halaman atau produk yang Anda cari tidak tersedia, telah dihapus, atau tautan yang dimasukkan keliru.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/tentang"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white px-5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Hubungi Kami
        </Link>
      </div>
    </div>
  );
}
