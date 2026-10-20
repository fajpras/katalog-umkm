"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { useBandingkan } from "@/context/BandingkanContext";
import { ambilProdukByIds } from "@/app/actions";
import { toko } from "@/lib/toko";

export default function HalamanBandingkan() {
  const { idsBandingkan, toggleBandingkan, resetBandingkan } = useBandingkan();
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idsBandingkan || idsBandingkan.length === 0) {
      setProdukList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    ambilProdukByIds(idsBandingkan)
      .then((data) => {
        setProdukList(data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idsBandingkan]);

  return (
    <div className="py-8 pb-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">Bandingkan Produk</span>
      </nav>

      {/* Header Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-6 dark:border-zinc-800/80">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)] sm:text-3xl">
            Perbandingan Produk
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Bandingkan harga, kategori, spesifikasi, dan stok produk secara berdampingan.
          </p>
        </div>

        {idsBandingkan.length > 0 && (
          <button
            type="button"
            onClick={resetBandingkan}
            className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Bersihkan Pilihan ({idsBandingkan.length}/2)
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Memuat data perbandingan...</span>
        </div>
      ) : produkList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white px-6 py-20 text-center dark:border-zinc-800/80 dark:bg-zinc-900/40 my-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
            Belum ada produk yang dipilih
          </h2>
          <p className="mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            Tekan tombol <strong>&quot;+ Banding&quot;</strong> pada kartu produk di katalog untuk membandingkan 2 produk sekaligus.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Lihat Katalog Produk
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto pb-4">
          {produkList.length === 1 && (
            <div className="mb-4 rounded-2xl border border-indigo-200 bg-indigo-50/80 p-4 text-xs font-semibold text-indigo-800 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300">
              💡 Anda baru memilih 1 produk. Pilih 1 produk lagi di katalog untuk melihat perbandingan berdampingan.
            </div>
          )}

          {/* US-37: Tabel Berdampingan (Foto, Harga, Kategori, Deskripsi, Stok) */}
          <table className="w-full min-w-[580px] border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-200/80 dark:border-zinc-800/80">
                <th className="w-1/4 p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Parameter
                </th>
                {produkList.map((p) => (
                  <th key={p.id} className="w-[37.5%] p-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        Produk #{p.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleBandingkan(p.id)}
                        className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400"
                      >
                        Hapus
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/80 text-sm dark:divide-zinc-800/80">
              {/* Baris Foto */}
              <tr>
                <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Foto Produk</td>
                {produkList.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="relative aspect-square w-36 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                      <img src={p.foto_url} alt={p.nama} className="h-full w-full object-cover" />
                    </div>
                  </td>
                ))}
              </tr>

              {/* Baris Nama */}
              <tr>
                <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Nama Produk</td>
                {produkList.map((p) => (
                  <td key={p.id} className="p-4">
                    <Link
                      href={`/produk/${p.id}`}
                      className="font-bold text-zinc-900 hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400 text-base"
                    >
                      {p.nama}
                    </Link>
                  </td>
                ))}
              </tr>

              {/* Baris Harga */}
              <tr>
                <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Harga</td>
                {produkList.map((p) => {
                  const adaDiskon =
                    p.harga_diskon !== null &&
                    p.harga_diskon !== undefined &&
                    Number(p.harga_diskon) > 0 &&
                    Number(p.harga_diskon) < Number(p.harga);

                  return (
                    <td key={p.id} className="p-4 font-[family-name:var(--font-display)]">
                      {adaDiskon ? (
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {formatRupiah(p.harga_diskon)}
                          </span>
                          <span className="text-xs text-zinc-400 line-through dark:text-zinc-500">
                            {formatRupiah(p.harga)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {formatRupiah(p.harga)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Baris Kategori */}
              <tr>
                <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Kategori</td>
                {produkList.map((p) => (
                  <td key={p.id} className="p-4">
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {p.kategori || "Umum"}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Baris Status Stok */}
              <tr>
                <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Status Stok</td>
                {produkList.map((p) => {
                  const isHabis =
                    p.tersedia === false ||
                    p.stok === 0 ||
                    (p.stok !== undefined && p.stok !== null && Number(p.stok) <= 0);

                  return (
                    <td key={p.id} className="p-4">
                      {isHabis ? (
                        <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          Habis (0)
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Tersedia {p.stok !== undefined && p.stok !== null ? `(${p.stok})` : ""}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Baris Deskripsi */}
              <tr>
                <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Deskripsi</td>
                {produkList.map((p) => (
                  <td key={p.id} className="p-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {p.deskripsi || "Tidak ada rincian deskripsi."}
                  </td>
                ))}
              </tr>

              {/* Baris Aksi Pesan WhatsApp */}
              <tr>
                <td className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Aksi Pesan</td>
                {produkList.map((p) => {
                  const isHabis =
                    p.tersedia === false ||
                    p.stok === 0 ||
                    (p.stok !== undefined && p.stok !== null && Number(p.stok) <= 0);

                  const hargaAktif =
                    p.harga_diskon && Number(p.harga_diskon) > 0 ? p.harga_diskon : p.harga;
                  const teksPesan = `Halo ${toko.nama}, saya ingin memesan:\n- ${p.nama} (1 pcs) seharga ${formatRupiah(hargaAktif)}`;
                  const waUrl = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(teksPesan)}`;

                  return (
                    <td key={p.id} className="p-4">
                      <div className="flex flex-col gap-2">
                        {isHabis ? (
                          <button
                            disabled
                            className="inline-flex h-9 items-center justify-center rounded-xl bg-zinc-200 px-4 text-xs font-bold text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600"
                          >
                            Stok Habis
                          </button>
                        ) : (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center justify-center rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                          >
                            Pesan via WhatsApp
                          </a>
                        )}
                        <Link
                          href={`/produk/${p.id}`}
                          className="text-center text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Lihat Detail Produk &rarr;
                        </Link>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
