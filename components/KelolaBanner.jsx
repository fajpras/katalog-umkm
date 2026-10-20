"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import {
  tambahBanner,
  ubahBanner,
  hapusBanner,
  toggleAktifBanner,
  uploadFoto,
} from "@/app/admin/actions";

export default function KelolaBanner({ daftarBanner = [] }) {
  const [stateTambah, formActionTambah, isPendingTambah] = useActionState(
    tambahBanner,
    null
  );
  const [bannerEdit, setBannerEdit] = useState(null);
  const [stateEdit, formActionEdit, isPendingEdit] = useActionState(
    ubahBanner,
    null
  );

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fotoUrl, setFotoUrl] = useState("");

  const [loadingToggleId, setLoadingToggleId] = useState(null);
  const [loadingHapusId, setLoadingHapusId] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 2 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    const hasil = await uploadFoto(formData);
    setIsUploading(false);

    if (hasil?.error) {
      setUploadError(hasil.error);
    } else if (hasil?.url) {
      setFotoUrl(hasil.url);
    }
  };

  const handleToggle = async (id, statusAktif) => {
    setLoadingToggleId(id);
    await toggleAktifBanner(id, statusAktif);
    setLoadingToggleId(null);
  };

  const handleHapus = async (id) => {
    if (!window.confirm("Hapus banner ini secara permanen?")) return;
    setLoadingHapusId(id);
    await hapusBanner(id);
    setLoadingHapusId(null);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Kolom Form Tambah / Edit */}
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-8 self-start">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)] mb-4">
          {bannerEdit ? "Edit Banner Promo" : "Tambah Banner Baru"}
        </h2>

        {bannerEdit ? (
          <form action={formActionEdit} className="flex flex-col gap-4">
            <input type="hidden" name="id" value={bannerEdit.id} />
            {stateEdit?.error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{stateEdit.error}</p>
            )}
            {stateEdit?.sukses && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{stateEdit.sukses}</p>
            )}

            <Input label="Judul Banner" name="judul" defaultValue={bannerEdit.judul} required />
            <Input label="URL Gambar Banner" name="gambar_url" defaultValue={bannerEdit.gambar_url} required />
            <Input
              label="Tautan / Link Tujuan (opsional)"
              name="tautan"
              defaultValue={bannerEdit.tautan || ""}
              placeholder="/produk/... atau https://..."
            />

            <div className="flex gap-2 pt-2">
              <Tombol type="submit" varian="admin" disabled={isPendingEdit}>
                {isPendingEdit ? "Menyimpan..." : "Perbarui Banner"}
              </Tombol>
              <button
                type="button"
                onClick={() => setBannerEdit(null)}
                className="rounded-2xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Batal
              </button>
            </div>
          </form>
        ) : (
          <form action={formActionTambah} className="flex flex-col gap-4">
            {stateTambah?.error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{stateTambah.error}</p>
            )}
            {stateTambah?.sukses && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{stateTambah.sukses}</p>
            )}

            <Input label="Judul Banner" name="judul" placeholder="Contoh: Promo Diskon Spesial" required />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Pilih Foto Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="text-xs text-zinc-500 file:mr-3 file:rounded-xl file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-700 dark:file:bg-indigo-950 dark:file:text-indigo-300"
              />
              {isUploading && <span className="text-[11px] text-indigo-500">Mengunggah ke storage...</span>}
              {uploadError && <span className="text-[11px] text-rose-500">{uploadError}</span>}
            </div>

            <Input
              label="URL Gambar"
              name="gambar_url"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              placeholder="https://... atau /produk/..."
              required
            />

            <Input label="Tautan / Link Tujuan (opsional)" name="tautan" placeholder="Contoh: /produk/1" />

            <Tombol type="submit" varian="admin" disabled={isPendingTambah} className="mt-2">
              {isPendingTambah ? "Menyimpan..." : "+ Tambah Banner"}
            </Tombol>
          </form>
        )}
      </div>

      {/* Kolom Daftar Banner */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {daftarBanner.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white px-6 py-16 text-center dark:border-zinc-800/80 dark:bg-zinc-900/40">
            <span className="text-3xl">🖼️</span>
            <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
              Belum Ada Banner Promo
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
              Tambahkan banner untuk mempromosikan diskon, event, atau produk unggulan di bagian atas beranda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {daftarBanner.map((b) => {
              const isAktif = b.aktif !== false;
              return (
                <div
                  key={b.id}
                  className={`overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 flex flex-col ${
                    !isAktif ? "opacity-60" : ""
                  }`}
                >
                  <div className="relative aspect-[21/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img src={b.gambar_url} alt={b.judul} className="h-full w-full object-cover" />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm ${
                        isAktif ? "bg-emerald-600" : "bg-zinc-600"
                      }`}
                    >
                      {isAktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {b.judul}
                    </h4>
                    {b.tautan && (
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                        🔗 {b.tautan}
                      </span>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => handleToggle(b.id, isAktif)}
                        disabled={loadingToggleId === b.id}
                        className="text-xs font-semibold text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
                      >
                        {isAktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBannerEdit(b);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHapus(b.id)}
                          disabled={loadingHapusId === b.id}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

