"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BannerCarousel({ daftarBanner = [] }) {
  const [indexAktif, setIndexAktif] = useState(0);

  useEffect(() => {
    if (!daftarBanner || daftarBanner.length <= 1) return;
    const interval = setInterval(() => {
      setIndexAktif((prev) => (prev + 1) % daftarBanner.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [daftarBanner]);

  if (!daftarBanner || daftarBanner.length === 0) {
    return null;
  }

  const banner = daftarBanner[indexAktif];

  const content = (
    <div className="relative aspect-[21/9] sm:aspect-[24/8] w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-md">
      <img
        src={banner.gambar_url}
        alt={banner.judul}
        className="h-full w-full object-cover transition-opacity duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent flex items-end p-5 sm:p-8">
        <div>
          <span className="inline-block rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-sm mb-2">
            Promo Spesial
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-white font-[family-name:var(--font-display)] line-clamp-2">
            {banner.judul}
          </h2>
        </div>
      </div>

      {daftarBanner.length > 1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10">
          {daftarBanner.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIndexAktif(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === indexAktif
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-8">
      {banner.tautan ? (
        <Link href={banner.tautan} className="block transition hover:opacity-95">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}

