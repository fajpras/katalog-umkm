"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function AksiPesanProduk({ produk }) {
  const isHabis =
    produk.tersedia === false ||
    produk.stok === 0 ||
    (produk.stok !== undefined && produk.stok !== null && Number(produk.stok) <= 0);

  const hargaEfektif =
    produk.harga_diskon !== null &&
    produk.harga_diskon !== undefined &&
    Number(produk.harga_diskon) > 0 &&
    Number(produk.harga_diskon) < Number(produk.harga)
      ? Number(produk.harga_diskon)
      : Number(produk.harga);

  const [jumlah, setJumlah] = useState(1);
  const daftarVarian = ["Reguler", "Spesial", "Besar"];
  const [varianTerpilih, setVarianTerpilih] = useState("Reguler");

  const totalHarga = hargaEfektif * jumlah;
  const nomor = toko.nomorWhatsApp.replace(/[^0-9]/g, "");

  const teksPesan = `Halo, saya ingin memesan *${produk.nama}* (Varian: ${varianTerpilih}, Jumlah: ${jumlah}) seharga total ${formatRupiah(totalHarga)}.`;
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(teksPesan)}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Pilihan Varian */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Pilih Varian
        </label>
        <div className="mt-2.5 flex flex-wrap gap-2.5">
          {daftarVarian.map((v) => {
            const isSelected = v === varianTerpilih;
            return (
              <button
                key={v}
                type="button"
                disabled={isHabis}
                onClick={() => setVarianTerpilih(v)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isSelected
                    ? "border-2 border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-200"
                    : "border border-zinc-200/80 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stepper Jumlah */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Jumlah Pesanan
        </label>
        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex items-center rounded-2xl border border-zinc-200/80 bg-white p-1 dark:border-zinc-800/80 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
              disabled={isHabis || jumlah <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:text-zinc-600"
              aria-label="Kurangi jumlah"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>
            <span className="w-12 text-center text-base font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
              {jumlah}
            </span>
            <button
              type="button"
              onClick={() => setJumlah((prev) => prev + 1)}
              disabled={isHabis}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-300 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:disabled:text-zinc-600"
              aria-label="Tambah jumlah"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Subtotal: <strong className="text-zinc-900 dark:text-zinc-100">{formatRupiah(totalHarga)}</strong>
          </span>
        </div>
      </div>

      {/* Tombol Pesan Desktop */}
      <div className="pt-2">
        {isHabis ? (
          <button
            type="button"
            disabled
            className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 px-6 font-semibold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-500 sm:w-auto"
          >
            <span>Stok Habis — Tidak Dapat Dipesan</span>
          </button>
        ) : (
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600 sm:w-auto"
          >
            <span>Pesan via WhatsApp ({formatRupiah(totalHarga)})</span>
          </a>
        )}
      </div>

      {/* Bar Pesan Lengket Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-zinc-200/80 bg-white/95 px-5 py-3 shadow-lg backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 md:hidden">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isHabis ? "Status Produk" : `Total (${jumlah}x, ${varianTerpilih})`}
          </p>
          <p
            className={`text-lg font-bold font-[family-name:var(--font-display)] ${
              isHabis ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isHabis ? "Stok Habis" : formatRupiah(totalHarga)}
          </p>
        </div>
        {isHabis ? (
          <button
            type="button"
            disabled
            className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 px-5 text-sm font-semibold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-500"
          >
            Habis
          </button>
        ) : (
          <a
            href={urlWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            Pesan WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
