"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { kirimUlasan } from "@/app/actions";

export default function FormUlasan({ produkId }) {
  const [state, formAction, isPending] = useActionState(kirimUlasan, null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.sukses) {
      formRef.current?.reset();
      setRating(5);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="produk_id" value={produkId} />
      <input type="hidden" name="rating" value={rating} />

      {/* Honeypot field (tersembunyi dari user biasa, bot akan mengisinya) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website URL (leave blank)</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state?.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-3 text-xs font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {state.error}
        </div>
      )}

      {state?.sukses && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          {state.sukses}
        </div>
      )}

      {/* Pemilih Bintang Rating (1-5) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Rating Anda
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const aktif = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110 active:scale-95"
                aria-label={`Beri bintang ${star}`}
              >
                <svg
                  className={`h-6 w-6 ${aktif ? "text-amber-400 fill-amber-400" : "text-zinc-300 dark:text-zinc-700"}`}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              </button>
            );
          })}
          <span className="ml-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            {rating} dari 5 Bintang
          </span>
        </div>
      </div>

      {/* Input Nama Pengulas */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Nama Anda
        </label>
        <input
          type="text"
          name="nama"
          required
          placeholder="Contoh: Budi Santoso"
          className="h-10 w-full rounded-2xl border border-zinc-200/80 bg-white px-3.5 text-xs text-zinc-900 shadow-sm placeholder:text-zinc-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400"
        />
      </div>

      {/* Input Komentar */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Ulasan / Pengalaman Produk
        </label>
        <textarea
          name="komentar"
          rows={3}
          required
          placeholder="Tulis ulasan Anda mengenai kualitas, rasa, atau kemasan produk ini..."
          className="w-full rounded-2xl border border-zinc-200/80 bg-white px-3.5 py-2.5 text-xs text-zinc-900 shadow-sm placeholder:text-zinc-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-10 items-center justify-center rounded-2xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        {isPending ? "Mengirim Ulasan..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}
