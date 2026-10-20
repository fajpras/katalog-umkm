"use client";

import { useEffect } from "react";
import { useKeranjang } from "@/context/KeranjangContext";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

export default function DrawerKeranjang() {
  const {
    items,
    totalItem,
    totalHarga,
    isDrawerBuka,
    tutupDrawer,
    ubahJumlah,
    hapusItem,
    kosongkanKeranjang,
  } = useKeranjang();

  // Tutup drawer jika tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isDrawerBuka) {
        tutupDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerBuka, tutupDrawer]);

  // Kunci scroll body ketika drawer terbuka
  useEffect(() => {
    if (isDrawerBuka) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerBuka]);

  if (!isDrawerBuka) return null;

  // Format pesan WhatsApp untuk semua item
  const nomor = toko.nomorWhatsApp.replace(/[^0-9]/g, "");
  let teksPesan = `Halo ${toko.nama}, saya ingin memesan daftar belanja berikut:\n\n`;
  items.forEach((item, idx) => {
    teksPesan += `${idx + 1}. *${item.nama}* (Varian: ${item.varian}, Jumlah: ${item.jumlah}) — ${formatRupiah(item.harga * item.jumlah)}\n`;
  });
  teksPesan += `\n*Total Belanja: ${formatRupiah(totalHarga)}*\n\nMohon informasi ketersediaan dan nomor rekening/ongkos kirimnya. Terima kasih!`;
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(teksPesan)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang Belanja"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        onClick={tutupDrawer}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Panel Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform animate-in slide-in-from-right duration-300 dark:bg-zinc-900">
        {/* Header Drawer */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
              Keranjang Belanja
            </h2>
            {totalItem > 0 && (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-100 px-2 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {totalItem}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={tutupDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Tutup keranjang"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Konten Daftar Item */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Keranjang masih kosong
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Pilih produk favorit Anda dan tambahkan ke sini.
              </p>
              <button
                type="button"
                onClick={tutupDrawer}
                className="mt-6 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.map((item) => (
                <div key={`${item.id}-${item.varian}`} className="flex items-center gap-3.5 py-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                    <img
                      src={item.foto_url}
                      alt={item.nama}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.nama}
                      </h4>
                      <button
                        type="button"
                        onClick={() => hapusItem(item.id, item.varian)}
                        className="text-zinc-400 transition hover:text-rose-600 dark:hover:text-rose-400"
                        aria-label={`Hapus ${item.nama}`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {item.varian}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatRupiah(item.harga)}
                      </span>
                    </div>

                    {/* Stepper Jumlah */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center rounded-xl border border-zinc-200/80 bg-zinc-50 p-0.5 dark:border-zinc-800 dark:bg-zinc-800/60">
                        <button
                          type="button"
                          onClick={() => ubahJumlah(item.id, item.varian, item.jumlah - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-700"
                          aria-label="Kurangi jumlah"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {item.jumlah}
                        </span>
                        <button
                          type="button"
                          onClick={() => ubahJumlah(item.id, item.varian, item.jumlah + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-700"
                          aria-label="Tambah jumlah"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>

                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {formatRupiah(item.harga * item.jumlah)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Drawer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Total Belanja</span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-[family-name:var(--font-display)]">
                {formatRupiah(totalHarga)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={urlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                <span>Pesan Semua via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={kosongkanKeranjang}
                className="py-1.5 text-center text-xs font-medium text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

