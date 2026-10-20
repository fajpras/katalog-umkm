"use client";

import Link from "next/link";
import { useBandingkan } from "@/context/BandingkanContext";

export default function BandingkanFloatingBar() {
  const { idsBandingkan, resetBandingkan } = useBandingkan();

  if (!idsBandingkan || idsBandingkan.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 w-[92%] max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/90 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-900/95">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white dark:bg-indigo-500">
            {idsBandingkan.length}
          </span>
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {idsBandingkan.length === 1
              ? "Pilih 1 produk lagi..."
              : "2 produk siap dibanding"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetBandingkan}
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 px-2 py-1"
          >
            Reset
          </button>
          <Link
            href="/bandingkan"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <span>Bandingkan</span>
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
