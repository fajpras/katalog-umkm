"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFavorit } from "@/context/FavoritContext";
import { ambilProdukByIds } from "@/app/actions/produk";
import KartuProduk from "@/components/KartuProduk";

export default function HalamanFavorit() {
  const { favoritIds, isHydrated } = useFavorit();
  const [daftarProduk, setDaftarProduk] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (favoritIds.length === 0) {
      setDaftarProduk([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    ambilProdukByIds(favoritIds)
      .then((res) => {
        if (isMounted) {
          setDaftarProduk(res.data || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [favoritIds, isHydrated]);

  return (
    <div className="py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">Favorit Saya</span>
      </nav>

      {/* Header Halaman */}
      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)] sm:text-3xl">
            Produk Favorit
          </h1>
          {favoritIds.length > 0 && (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-rose-100 px-2 text-xs font-bold text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
              {favoritIds.length}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Tersimpan di browser Anda
        </p>
      </div>

      {/* Konten Favorit */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-3xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900"
            />
          ))}
        </div>
      ) : favoritIds.length === 0 || daftarProduk.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white px-6 py-16 text-center shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
            Belum ada produk favorit
          </h2>
          <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Klik ikon hati pada produk yang Anda sukai untuk menyimpannya ke daftar ini.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-6 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            Jelajahi Katalog Produk
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {daftarProduk.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}
