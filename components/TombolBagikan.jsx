"use client";

import { useState } from "react";

export default function TombolBagikan({ nama, deskripsi }) {
  const [pesanToast, setPesanToast] = useState(null);

  const handleBagikan = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: nama,
      text: deskripsi || `Lihat produk ${nama} di katalog kami!`,
      url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === "AbortError") {
          return; // Pengguna membatalkan dialog share
        }
      }
    }

    // Fallback: Salin ke clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback untuk browser lawas
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setPesanToast("Tautan produk berhasil disalin ke clipboard!");
      setTimeout(() => {
        setPesanToast(null);
      }, 2500);
    } catch {
      setPesanToast("Gagal menyalin tautan.");
      setTimeout(() => {
        setPesanToast(null);
      }, 2500);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleBagikan}
        className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        aria-label="Bagikan produk"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        <span>Bagikan</span>
      </button>

      {/* Floating Toast Notification */}
      {pesanToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-zinc-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md dark:bg-zinc-100/95 dark:text-zinc-900 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-emerald-400 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>{pesanToast}</span>
          </div>
        </div>
      )}
    </>
  );
}
