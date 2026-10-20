"use client";

import { useKeranjang } from "@/context/KeranjangContext";

export default function TombolKeranjangHeader() {
  const { totalItem, bukaDrawer } = useKeranjang();

  return (
    <button
      type="button"
      onClick={bukaDrawer}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      aria-label={`Keranjang belanja (${totalItem} item)`}
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
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
      {totalItem > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:bg-emerald-500 dark:ring-zinc-900 animate-in zoom-in-50 duration-150">
          {totalItem > 99 ? "99+" : totalItem}
        </span>
      )}
    </button>
  );
}

