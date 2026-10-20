"use client";

import { createContext, useContext, useState, useEffect } from "react";

const BandingkanContext = createContext({
  idsBandingkan: [],
  toggleBandingkan: () => {},
  isBandingkan: () => false,
  resetBandingkan: () => {},
});

const KEY = "katalog_bandingkan";

export function BandingkanProvider({ children }) {
  const [idsBandingkan, setIdsBandingkan] = useState([]);

  useEffect(() => {
    try {
      const tersimpan = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(tersimpan)) {
        setIdsBandingkan(tersimpan);
      }
    } catch {}
  }, []);

  const toggleBandingkan = (id) => {
    const idStr = String(id);
    setIdsBandingkan((prev) => {
      let baru;
      if (prev.includes(idStr)) {
        baru = prev.filter((item) => item !== idStr);
      } else {
        if (prev.length >= 2) {
          alert("Maksimal 2 produk untuk dibandingkan. Silakan hapus salah satu terlebih dahulu.");
          return prev;
        }
        baru = [...prev, idStr];
      }
      try {
        localStorage.setItem(KEY, JSON.stringify(baru));
      } catch {}
      return baru;
    });
  };

  const isBandingkan = (id) => idsBandingkan.includes(String(id));

  const resetBandingkan = () => {
    setIdsBandingkan([]);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  };

  return (
    <BandingkanContext.Provider
      value={{ idsBandingkan, toggleBandingkan, isBandingkan, resetBandingkan }}
    >
      {children}
    </BandingkanContext.Provider>
  );
}

export function useBandingkan() {
  return useContext(BandingkanContext);
}
