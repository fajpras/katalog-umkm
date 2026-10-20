"use client";

import { useState } from "react";
import Link from "next/link";
import { toggleTampilUlasan, hapusUlasan } from "@/app/admin/actions";

export default function TabelModerasiUlasan({ daftarUlasan = [] }) {
  const [loadingId, setLoadingId] = useState(null);
  const [hapusId, setHapusId] = useState(null);

  const handleToggle = async (id, statusSekarang, produkId) => {
    setLoadingId(id);
    await toggleTampilUlasan(id, statusSekarang, produkId);
    setLoadingId(null);
  };

  const handleHapus = async (id, produkId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus ulasan ini secara permanen?")) return;
    setHapusId(id);
    await hapusUlasan(id, produkId);
    setHapusId(null);
  };

  if (!daftarUlasan || daftarUlasan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white px-6 py-16 text-center dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <span className="text-3xl">⭐</span>
        <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
          Belum Ada Ulasan Masuk
        </h3>
        <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
          Ulasan dan rating yang dikirim pembeli dari halaman detail produk akan muncul di sini untuk Anda moderasi.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200/80 bg-zinc-50/70 text-xs font-semibold text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400">
            <tr>
              <th className="px-5 py-3.5">Produk</th>
              <th className="px-5 py-3.5">Pengulas</th>
              <th className="px-5 py-3.5">Rating & Komentar</th>
              <th className="px-5 py-3.5">Status Publik</th>
              <th className="px-5 py-3.5 text-right">Aksi Moderasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
            {daftarUlasan.map((u) => {
              const isTampil = u.tampil !== false;
              const isBusy = loadingId === u.id || hapusId === u.id;

              return (
                <tr
                  key={u.id}
                  className={`transition hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 ${
                    !isTampil ? "opacity-60 bg-zinc-50/30 dark:bg-zinc-950/20" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    {u.produk ? (
                      <Link
                        href={`/produk/${u.produk_id}`}
                        target="_blank"
                        className="font-semibold text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400 text-xs sm:text-sm line-clamp-1"
                      >
                        {u.produk.nama}
                      </Link>
                    ) : (
                      <span className="text-xs text-zinc-500">ID Produk: #{u.produk_id}</span>
                    )}
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                      {u.nama}
                    </span>
                    <span className="block text-[10px] text-zinc-400 dark:text-zinc-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : ""}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 max-w-xs">
                    <div className="flex text-amber-400 text-xs mb-1">
                      {"★".repeat(u.rating)}
                      {"☆".repeat(Math.max(0, 5 - u.rating))}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                      {u.komentar}
                    </p>
                  </td>

                  <td className="px-5 py-3.5">
                    {isTampil ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Tampil
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                        Tersembunyi
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(u.id, isTampil, u.produk_id)}
                        disabled={isBusy}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95 disabled:opacity-50 ${
                          isTampil
                            ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500"
                        }`}
                      >
                        {isTampil ? "Sembunyikan" : "Tampilkan"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleHapus(u.id, u.produk_id)}
                        disabled={isBusy}
                        className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition active:scale-95 disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
