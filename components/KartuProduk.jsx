import Link from "next/link";
import { formatRupiah } from "@/lib/format";

export default function KartuProduk({ produk }) {
  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105 dark:brightness-95"
        />
        {produk.kategori && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur-sm dark:bg-zinc-900/90 dark:text-zinc-200">
            {produk.kategori}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {produk.kategori}
        </p>
        <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-zinc-900 transition-colors group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
          {produk.nama}
        </h3>
        <p className="mt-auto self-start text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-[family-name:var(--font-display)]">
          {formatRupiah(produk.harga)}
        </p>
      </div>
    </Link>
  );
}
