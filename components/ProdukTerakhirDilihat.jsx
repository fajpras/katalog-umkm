"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";
import { ambilProdukByIds } from "@/app/actions";

export default function ProdukTerakhirDilihat() {
  const [produkList, setProdukList] = useState([]);
  const [sudahMuat, setSudahMuat] = useState(false);

  useEffect(() => {
    try {
      const KEY = "katalog_terakhir_dilihat";
      const tersimpan = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(tersimpan) && tersimpan.length > 0) {
        ambilProdukByIds(tersimpan).then((data) => {
          setProdukList(data || []);
          setSudahMuat(true);
        });
      } else {
        setSudahMuat(true);
      }
    } catch {
      setSudahMuat(true);
    }
  }, []);

  // Sembunyikan widget jika kosong
  if (!sudahMuat || produkList.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="judul-terakhir-dilihat"
      className="mt-12 border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            id="judul-terakhir-dilihat"
            className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)] sm:text-2xl"
          >
            Terakhir Dilihat
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Produk yang baru saja Anda buka sebelumnya
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.removeItem("katalog_terakhir_dilihat");
              setProdukList([]);
            } catch {
              // ignore
            }
          }}
          className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          Bersihkan riwayat
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {produkList.map((item) => (
          <KartuProduk key={item.id} produk={item} />
        ))}
      </div>
    </section>
  );
}
