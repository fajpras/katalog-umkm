"use client";

import { useEffect } from "react";

export default function CatatTerakhirDilihat({ id }) {
  useEffect(() => {
    if (!id || typeof window === "undefined") return;
    try {
      const KEY = "katalog_terakhir_dilihat";
      const idStr = String(id);
      const tersimpan = JSON.parse(localStorage.getItem(KEY) || "[]");
      const baru = [
        idStr,
        ...tersimpan.filter((item) => String(item) !== idStr),
      ].slice(0, 8);
      localStorage.setItem(KEY, JSON.stringify(baru));
    } catch {
      // Abaikan jika quota localStorage penuh atau disable
    }
  }, [id]);

  return null;
}
