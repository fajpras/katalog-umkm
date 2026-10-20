"use client";

import { useState } from "react";

export default function GaleriProduk({ fotoUtama, fotoGaleri, nama }) {
  const fallbackFoto = "/produk/kopi.svg";
  const fotoUtamaBersih = (fotoUtama && typeof fotoUtama === "string" && fotoUtama.trim()) ? fotoUtama.trim() : fallbackFoto;

  // Normalisasi galeri foto menjadi array URL unik yang valid
  let listGaleri = [];
  if (Array.isArray(fotoGaleri)) {
    listGaleri = fotoGaleri
      .filter((url) => typeof url === "string" && url.trim().length > 0)
      .map((url) => url.trim());
  } else if (typeof fotoGaleri === "string" && fotoGaleri.trim()) {
    listGaleri = fotoGaleri
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
  }

  // Gabungkan foto utama dengan semua foto galeri, hindari duplikat
  const semuaFoto = [fotoUtamaBersih, ...listGaleri].filter(
    (url, index, self) => self.indexOf(url) === index
  );

  const [fotoAktif, setFotoAktif] = useState(semuaFoto[0]);

  // Pastikan jika fotoAktif tidak ada dalam daftar (misal props berubah), fallback ke foto pertama
  const tampilanFoto = semuaFoto.includes(fotoAktif) ? fotoAktif : semuaFoto[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Gambar Utama */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <img
          key={tampilanFoto}
          src={tampilanFoto}
          alt={nama}
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 dark:brightness-95 animate-in fade-in duration-200"
        />
      </div>

      {/* Thumbnail Selector (Hanya tampil jika foto lebih dari 1) */}
      {semuaFoto.length > 1 && (
        <div
          role="tablist"
          aria-label="Pilihan foto galeri"
          className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 sm:gap-3 scrollbar-none"
        >
          {semuaFoto.map((foto, index) => {
            const isSelected = foto === tampilanFoto;
            return (
              <button
                key={`${foto}-${index}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Pilih foto ${index + 1} dari ${semuaFoto.length}`}
                onClick={() => setFotoAktif(foto)}
                className={`relative aspect-square w-16 sm:w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-500/30 dark:border-emerald-400 opacity-100 scale-95"
                    : "border-zinc-200/80 hover:border-zinc-400 dark:border-zinc-800/80 dark:hover:border-zinc-600 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={foto}
                  alt={`${nama} - thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
