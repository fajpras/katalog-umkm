"use client";

import { useActionState, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

export default function FormProduk({ produk = {}, labelTombol = "Simpan produk", action }) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleGenerateAI = async (e) => {
    e.preventDefault();
    setAiError(null);

    const form = e.currentTarget.closest("form");
    const namaInput = form?.querySelector('input[name="nama"]');
    const kategoriInput = form?.querySelector('input[name="kategori"]');

    const nama = namaInput?.value?.trim() || "";
    const kategori = kategoriInput?.value?.trim() || "Umum";

    if (!nama) {
      setAiError("Isi nama produk terlebih dahulu sebelum membuat deskripsi dengan AI.");
      namaInput?.focus();
      return;
    }

    setIsAiLoading(true);
    const hasil = await buatDeskripsiAI(nama, kategori);
    setIsAiLoading(false);

    if (hasil?.error) {
      setAiError(hasil.error);
    } else if (hasil?.deskripsi) {
      setDeskripsi(hasil.deskripsi);
    }
  };

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}

      {state?.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {state.error}
        </div>
      )}

      {aiError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          {aiError}
        </div>
      )}

      <Input
        label="Nama produk"
        name="nama"
        defaultValue={produk.nama || ""}
        placeholder="Contoh: Kopi Bubuk Robusta 250 g"
        required
      />

      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga ?? ""}
        placeholder="Contoh: 45000"
        required
      />

      <Input
        label="Kategori"
        name="kategori"
        defaultValue={produk.kategori || ""}
        placeholder="Contoh: Minuman, Camilan, Kerajinan"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Jumlah stok"
          name="stok"
          type="number"
          min="0"
          defaultValue={produk.stok !== undefined && produk.stok !== null ? produk.stok : 10}
          placeholder="Contoh: 10 (isi 0 jika habis)"
        />
        <div className="flex flex-col gap-1.5 justify-center sm:pt-6">
          <label className="flex items-center gap-3 cursor-pointer select-none rounded-2xl border border-zinc-200/80 bg-white px-4 py-2.5 dark:border-zinc-800/80 dark:bg-zinc-900">
            <input
              type="checkbox"
              name="tersedia"
              value="true"
              defaultChecked={
                produk.tersedia !== false &&
                (produk.stok === undefined || produk.stok === null || Number(produk.stok) > 0)
              }
              className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Tersedia untuk dipesan
            </span>
          </label>
        </div>
      </div>

      <Input
        label="Link foto utama"
        name="foto_url"
        placeholder="https://... atau /produk/kopi.svg"
        defaultValue={produk.foto_url || ""}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Foto galeri tambahan (opsional)
        </label>
        <textarea
          name="foto_galeri"
          rows={2}
          defaultValue={
            Array.isArray(produk.foto_galeri)
              ? produk.foto_galeri.join("\n")
              : (produk.foto_galeri || "")
          }
          placeholder="Tulis satu link per baris atau pisahkan dengan koma&#10;Contoh: /produk/keripik.svg, /produk/sambal.svg"
          className="w-full rounded-2xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Foto-foto ini akan muncul sebagai galeri thumbnail interaktif di halaman detail produk.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Deskripsi
          </label>
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isAiLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md active:scale-95 disabled:opacity-50"
          >
            {isAiLoading ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Menulis deskripsi...</span>
              </>
            ) : (
              <>
                <span>✨ Buat Deskripsi AI</span>
              </>
            )}
          </button>
        </div>
        <textarea
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Jelaskan keunggulan, bahan, atau cara penyajian produk... Atau klik '✨ Buat Deskripsi AI' di atas."
          className="w-full rounded-2xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Tombol type="submit" varian="admin" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
