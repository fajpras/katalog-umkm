"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { useFavorit } from "@/context/FavoritContext";

export default function KartuProduk({ produk }) {
  const { isFavorit, toggleFavorit } = useFavorit();
  const favorit = isFavorit(produk.id);

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
    <Link
      href={`/produk/${produk.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={produk.foto_url}
          alt={produk.nama}
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 dark:brightness-95 ${
            isHabis ? "grayscale opacity-75" : ""
          }`}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {produk.kategori && (
            <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur-sm dark:bg-zinc-900/90 dark:text-zinc-200">
              {produk.kategori}
            </span>
          )}
          {produk.label && (
            <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm dark:bg-amber-600">
              {produk.label}
            </span>
          )}
          {isHabis && (
            <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm dark:bg-rose-500">
              Habis
            </span>
          )}
        </div>

        {/* Tombol Hati Wishlist */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorit(produk.id);
          }}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95 dark:bg-zinc-900/90 ${
            favorit
              ? "text-rose-500 hover:text-rose-600"
              : "text-zinc-400 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400"
          }`}
          aria-label={favorit ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <svg
            className="h-4 w-4"
            fill={favorit ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {produk.kategori}
        </p>
        <h3 className="line-clamp-2 text-sm sm:text-base font-semibold text-zinc-900 transition-colors group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
          {produk.nama}
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-1 font-[family-name:var(--font-display)]">
          {adaDiskon ? (
            <>
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(produk.harga_diskon)}
              </span>
              <span className="text-xs font-normal text-zinc-400 line-through dark:text-zinc-500">
                {formatRupiah(produk.harga)}
              </span>
            </>
          ) : (
            <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatRupiah(produk.harga)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
