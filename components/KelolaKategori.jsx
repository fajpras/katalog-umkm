"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { tambahKategori, ubahKategori, hapusKategori } from "@/app/admin/actions";

export default function KelolaKategori({ daftarKategori = [], hitungProdukMap = {} }) {
  const [tambahState, tambahAction, isTambahPending] = useActionState(tambahKategori, null);
  const [ubahState, ubahAction, isUbahPending] = useActionState(ubahKategori, null);

  const [kategoriEdit, setKategoriEdit] = useState(null);
  const [kategoriHapus, setKategoriHapus] = useState(null);
  const [errorHapus, setErrorHapus] = useState(null);
  const [isHapusPending, setIsHapusPending] = useState(false);

  const handleKonfirmasiHapus = async () => {
    if (!kategoriHapus) return;
    setErrorHapus(null);
    setIsHapusPending(true);

    const hasil = await hapusKategori(kategoriHapus.id, kategoriHapus.nama);
    setIsHapusPending(false);

    if (hasil?.error) {
      setErrorHapus(hasil.error);
    } else {
      setKategoriHapus(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Form Tambah Kategori Baru */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-6">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
          Tambah Kategori Baru
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Buat nama kategori baru untuk mengelompokkan produk di katalog tokomu.
        </p>

        {tambahState?.error && (
          <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
            {tambahState.error}
          </div>
        )}

        {tambahState?.sukses && (
          <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
            {tambahState.sukses}
          </div>
        )}

        <form action={tambahAction} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Nama Kategori"
              name="nama"
              placeholder="Contoh: Minuman Dingin, Kue Basah"
              required
            />
          </div>
          <div className="pt-1 sm:pt-0">
            <Tombol type="submit" varian="admin" disabled={isTambahPending}>
              {isTambahPending ? "Menambahkan..." : "+ Tambah Kategori"}
            </Tombol>
          </div>
        </form>
      </div>

      {/* Tabel Daftar Kategori */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800/80">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
            Daftar Kategori ({daftarKategori.length})
          </h2>
        </div>

        {daftarKategori.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Belum ada kategori. Gunakan form di atas untuk menambahkan kategori baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200/80 bg-zinc-50/60 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-800/40 dark:text-zinc-400">
                <tr>
                  <th className="px-5 py-3.5">Nama Kategori</th>
                  <th className="px-5 py-3.5">Jumlah Produk</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
                {daftarKategori.map((kategori) => {
                  const jumlahProduk = hitungProdukMap[kategori.nama] || 0;
                  return (
                    <tr
                      key={kategori.id}
                      className="group transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30"
                    >
                      <td className="px-5 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                        {kategori.nama}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-500 dark:text-zinc-400">
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {jumlahProduk} produk
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setKategoriEdit(kategori);
                            }}
                            className="rounded-xl border border-zinc-200/80 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setErrorHapus(null);
                              setKategoriHapus(kategori);
                            }}
                            className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-950"
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
        )}
      </div>

      {/* Modal Ubah Kategori */}
      {kategoriEdit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
              Ubah Kategori
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Perubahan nama akan otomatis diperbarui di seluruh produk terkait.
            </p>

            {ubahState?.error && (
              <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
                {ubahState.error}
              </div>
            )}

            <form
              action={async (formData) => {
                await ubahAction(formData);
                setKategoriEdit(null);
              }}
              className="mt-4 flex flex-col gap-4"
            >
              <input type="hidden" name="id" value={kategoriEdit.id} />
              <input type="hidden" name="nama_lama" value={kategoriEdit.nama} />
              <Input
                label="Nama Kategori Baru"
                name="nama"
                defaultValue={kategoriEdit.nama}
                required
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setKategoriEdit(null)}
                  className="rounded-2xl border border-zinc-200/80 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Batal
                </button>
                <Tombol type="submit" varian="admin" disabled={isUbahPending}>
                  {isUbahPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Tombol>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Kategori */}
      {kategoriHapus && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
              Hapus Kategori "{kategoriHapus.nama}"?
            </h3>

            {errorHapus ? (
              <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 leading-relaxed">
                {errorHapus}
              </div>
            ) : (
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                Apakah Anda yakin ingin menghapus kategori ini? Kategori yang masih digunakan oleh produk tidak dapat dihapus demi integritas katalog.
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setKategoriHapus(null);
                  setErrorHapus(null);
                }}
                className="rounded-2xl border border-zinc-200/80 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {errorHapus ? "Tutup" : "Batal"}
              </button>
              {!errorHapus && (
                <button
                  type="button"
                  onClick={handleKonfirmasiHapus}
                  disabled={isHapusPending}
                  className="rounded-2xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-95 disabled:opacity-50"
                >
                  {isHapusPending ? "Menghapus..." : "Ya, Hapus Kategori"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
