"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";
import { useKeranjang } from "@/context/KeranjangContext";

export default function AksiPesanProduk({ produk }) {
  const { tambahItem } = useKeranjang();

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

  // US-40: Catat log klik WhatsApp secara asinkron tanpa menahan navigasi
  const handleKlikWA = () => {
    try {
      fetch("/api/log-klik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ produk_id: produk.id }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  };

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

      {/* Tombol Aksi */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {isHabis ? (
          <button
            type="button"
            disabled
            className="flex h-12 flex-1 cursor-not-allowed items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 font-semibold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-500"
          >
            Stok Sedang Habis
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => tambahItem(produk, varianTerpilih, jumlah)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-emerald-600 bg-emerald-50 px-5 font-bold text-emerald-800 transition-all duration-300 hover:bg-emerald-100 active:scale-95 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span>+ Keranjang</span>
            </button>
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleKlikWA}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <span>Pesan via WhatsApp</span>
            </a>
          </>
        )}
      </div>

      {/* Bar Pesan Lengket Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 border-t border-zinc-200/80 bg-white/95 px-5 py-3 shadow-lg backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 md:hidden">
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => tambahItem(produk, varianTerpilih, jumlah)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-emerald-600 bg-emerald-50 text-emerald-800 active:scale-95 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300"
              aria-label="Tambah ke keranjang"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleKlikWA}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              Pesan WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
