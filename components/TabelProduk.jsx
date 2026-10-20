"use client";

import { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import { hapusProduk, toggleAktifProduk } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk = [] }) {
  const [produkHapus, setProdukHapus] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorHapus, setErrorHapus] = useState(null);
  const [loadingToggleId, setLoadingToggleId] = useState(null);

  // Tutup modal jika tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isDeleting) {
        setProdukHapus(null);
      }
    };
    if (produkHapus) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [produkHapus, isDeleting]);

  const handleKonfirmasiHapus = async () => {
    if (!produkHapus) return;
    setIsDeleting(true);
    setErrorHapus(null);

    const hasil = await hapusProduk(produkHapus.id);
    setIsDeleting(false);

    if (hasil?.error) {
      setErrorHapus(hasil.error);
    } else {
      setProdukHapus(null);
    }
  };

  const handleToggleAktif = async (id, statusAktifSekarang) => {
    setLoadingToggleId(id);
    await toggleAktifProduk(id, statusAktifSekarang);
    setLoadingToggleId(null);
  };

  if (!daftarProduk || daftarProduk.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50/50 px-6 py-14 text-center dark:border-zinc-800/80 dark:bg-zinc-900/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Belum ada produk
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Mulai tambahkan produk pertamamu untuk menampilkannya di katalog.
        </p>
        <div className="mt-6">
          <Tombol href="/admin/produk/baru" varian="admin">
            + Tambah Produk Baru
          </Tombol>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200/80 bg-zinc-50/60 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-800/40 dark:text-zinc-400">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Produk</th>
              <th className="px-5 py-3.5 font-semibold">Kategori</th>
              <th className="px-5 py-3.5 font-semibold">Harga</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
            {daftarProduk.map((produk) => {
              const isAktif = produk.aktif !== false;
              const isHabis =
                produk.tersedia === false ||
                produk.stok === 0 ||
                (produk.stok !== undefined && produk.stok !== null && Number(produk.stok) <= 0);

              return (
                <tr
                  key={produk.id}
                  className={`group transition-all hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 ${
                    !isAktif ? "opacity-60 hover:opacity-100" : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3.5">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                        <img
                          src={produk.foto_url || "/produk/kopi.svg"}
                          alt={produk.nama}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {produk.nama}
                        </span>
                        {isHabis ? (
                          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                            Stok Habis
                          </span>
                        ) : (
                          produk.stok !== undefined &&
                          produk.stok !== null && (
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              Stok: {produk.stok}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {produk.kategori || "Umum"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-zinc-900 dark:text-zinc-100">
                    {formatRupiah(produk.harga)}
                  </td>
                  {/* Sakelar Aktif/Nonaktif */}
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleAktif(produk.id, isAktif)}
                      disabled={loadingToggleId === produk.id}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all active:scale-95 ${
                        isAktif
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-900"
                          : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                      }`}
                      title="Klik untuk mengubah status tampil publik"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isAktif
                            ? "bg-emerald-600 dark:bg-emerald-400"
                            : "bg-zinc-400 dark:bg-zinc-500"
                        }`}
                      />
                      <span>
                        {loadingToggleId === produk.id
                          ? "Memproses..."
                          : isAktif
                          ? "Aktif"
                          : "Nonaktif"}
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                        Ubah
                      </Tombol>
                      <Tombol
                        type="button"
                        varian="bahaya"
                        onClick={() => setProdukHapus(produk)}
                      >
                        Hapus
                      </Tombol>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Hapus Produk */}
      {produkHapus && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => !isDeleting && setProdukHapus(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl transition-transform duration-200 dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>

            <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
              Hapus Produk?
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Yakin hapus <span className="font-semibold text-zinc-900 dark:text-zinc-100">"{produkHapus.nama}"</span>? Tindakan ini akan menghapus produk dari database dan katalog secara permanen.
            </p>

            {errorHapus && (
              <p className="mt-3 text-xs font-semibold text-red-600 dark:text-red-400">
                {errorHapus}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <Tombol
                type="button"
                varian="garis"
                disabled={isDeleting}
                onClick={() => setProdukHapus(null)}
              >
                Batal
              </Tombol>
              <Tombol
                type="button"
                varian="bahaya"
                disabled={isDeleting}
                onClick={handleKonfirmasiHapus}
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </Tombol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

