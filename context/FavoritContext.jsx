"use client";

import { createContext, useContext, useState, useEffect } from "react";

const FavoritContext = createContext(null);

const STORAGE_KEY = "katalog_favorit";

export function FavoritProvider({ children }) {
  const [favoritIds, setFavoritIds] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Ambil dari localStorage setelah hydration (aman SSR)
  useEffect(() => {
    try {
      const tersimpan = localStorage.getItem(STORAGE_KEY);
      if (tersimpan) {
        setFavoritIds(JSON.parse(tersimpan));
      }
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }
    setIsHydrated(true);
  }, []);

  // Simpan ke localStorage saat ada perubahan
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritIds));
    } catch {
      // Abaikan error penyimpanan
    }
  }, [favoritIds, isHydrated]);

  const toggleFavorit = (id) => {
    const idStr = String(id);
    setFavoritIds((prev) => {
      const sudahAda = prev.includes(idStr);
      if (sudahAda) {
        return prev.filter((item) => item !== idStr);
      }
      return [...prev, idStr];
    });
  };

  const isFavorit = (id) => {
    if (!isHydrated) return false;
    return favoritIds.includes(String(id));
  };

  const totalFavorit = isHydrated ? favoritIds.length : 0;

  return (
    <FavoritContext.Provider
      value={{
        favoritIds: isHydrated ? favoritIds : [],
        totalFavorit,
        toggleFavorit,
        isFavorit,
        isHydrated,
      }}
    >
      {children}
    </FavoritContext.Provider>
  );
}

export function useFavorit() {
  const context = useContext(FavoritContext);
  if (!context) {
    throw new Error("useFavorit harus digunakan di dalam FavoritProvider");
  }
  return context;
}
