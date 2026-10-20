import Link from "next/link";
import { toko } from "@/lib/toko";

export const metadata = {
  title: `Tentang Kami - ${toko.nama}`,
  description: toko.tagline,
};

export default function HalamanTentang() {
  const nomor = toko.nomorWhatsApp.replace(/[^0-9]/g, "");
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(`Halo ${toko.nama}, saya ingin bertanya tentang toko dan produk Anda.`)}`;

  return (
    <div className="py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">Tentang Toko</span>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-emerald-50 via-white to-zinc-50 p-6 shadow-sm dark:border-zinc-800/80 dark:from-emerald-950/20 dark:via-zinc-900 dark:to-zinc-900 sm:p-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Profil Usaha UMKM
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)] sm:text-4xl">
            {toko.nama}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {toko.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.97.549 1.761.815 2.796.815 3.183 0 5.769-2.587 5.77-5.767 0-3.182-2.587-5.77-5.77-5.77zm0 10.373c-.93 0-1.74-.271-2.434-.695l-.174-.103-1.637.43.437-1.597-.113-.18c-.469-.747-.717-1.467-.716-2.462.001-2.539 2.066-4.604 4.637-4.604 2.571 0 4.636 2.065 4.636 4.604 0 2.539-2.065 4.607-4.649 4.607z" />
              </svg>
              <span>Hubungi via WhatsApp</span>
            </a>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white px-5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Lihat Katalog Produk
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Informasi Toko */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {/* Alamat */}
        <div className="flex flex-col gap-2 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
            Alamat Toko
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {toko.alamat}
          </p>
        </div>

        {/* Jam Operasional */}
        <div className="flex flex-col gap-2 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
            Jam Operasional
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {toko.jamBuka}
          </p>
        </div>

        {/* WhatsApp & Layanan */}
        <div className="flex flex-col gap-2 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.998z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
            Layanan Pelanggan
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            WhatsApp: +{toko.nomorWhatsApp}
          </p>
        </div>
      </div>
    </div>
  );
}

