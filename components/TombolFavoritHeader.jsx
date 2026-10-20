"use client";

import Link from "next/link";
import { useFavorit } from "@/context/FavoritContext";

export default function TombolFavoritHeader() {
  const { totalFavorit } = useFavorit();

  return (
    <Link
      href="/favorit"
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-rose-600 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-rose-400"
      aria-label={`Daftar favorit (${totalFavorit} produk)`}
    >
      <svg
        className="h-4 w-4"
        fill="none"
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
      {totalFavorit > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:bg-rose-500 dark:ring-zinc-900 animate-in zoom-in-50 duration-150">
          {totalFavorit > 99 ? "99+" : totalFavorit}
        </span>
      )}
    </Link>
  );
}
