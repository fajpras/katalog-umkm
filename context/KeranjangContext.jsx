"use client";

import { createContext, useContext, useState, useEffect } from "react";

const KeranjangContext = createContext(null);

const STORAGE_KEY = "katalog_keranjang";

export function KeranjangProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isDrawerBuka, setIsDrawerBuka] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Ambil dari localStorage setelah hydration (aman SSR)
  useEffect(() => {
    try {
      const tersimpan = localStorage.getItem(STORAGE_KEY);
      if (tersimpan) {
        setItems(JSON.parse(tersimpan));
      }
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }
    setIsHydrated(true);
  }, []);

  // Simpan ke localStorage setiap ada perubahan (hanya setelah terhidrasi)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Abaikan error kuota penyimpanan
    }
  }, [items, isHydrated]);

  const bukaDrawer = () => setIsDrawerBuka(true);
  const tutupDrawer = () => setIsDrawerBuka(false);

  const tambahItem = (produk, varian = "Reguler", jumlah = 1) => {
    const hargaSatuan =
      produk.harga_diskon !== null &&
      produk.harga_diskon !== undefined &&
      Number(produk.harga_diskon) > 0 &&
      Number(produk.harga_diskon) < Number(produk.harga)
        ? Number(produk.harga_diskon)
        : Number(produk.harga);

    setItems((prevItems) => {
      const index = prevItems.findIndex(
        (it) => it.id === produk.id && it.varian === varian
      );

      if (index > -1) {
        const itemBaru = [...prevItems];
        itemBaru[index] = {
          ...itemBaru[index],
          jumlah: itemBaru[index].jumlah + jumlah,
        };
        return itemBaru;
      }

      return [
        ...prevItems,
        {
          id: produk.id,
          nama: produk.nama,
          harga: hargaSatuan,
          foto_url: produk.foto_url || "/produk/kopi.svg",
          varian,
          jumlah,
        },
      ];
    });

    setIsDrawerBuka(true);
  };

  const ubahJumlah = (id, varian, jumlahBaru) => {
    if (jumlahBaru <= 0) {
      hapusItem(id, varian);
      return;
    }
    setItems((prev) =>
      prev.map((it) =>
        it.id === id && it.varian === varian ? { ...it, jumlah: jumlahBaru } : it
      )
    );
  };

  const hapusItem = (id, varian) => {
    setItems((prev) =>
      prev.filter((it) => !(it.id === id && it.varian === varian))
    );
  };

  const kosongkanKeranjang = () => {
    setItems([]);
  };

  const totalItem = isHydrated
    ? items.reduce((total, it) => total + it.jumlah, 0)
    : 0;

  const totalHarga = isHydrated
    ? items.reduce((total, it) => total + it.harga * it.jumlah, 0)
    : 0;

  return (
    <KeranjangContext.Provider
      value={{
        items: isHydrated ? items : [],
        totalItem,
        totalHarga,
        isDrawerBuka,
        bukaDrawer,
        tutupDrawer,
        tambahItem,
        ubahJumlah,
        hapusItem,
        kosongkanKeranjang,
      }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const context = useContext(KeranjangContext);
  if (!context) {
    throw new Error("useKeranjang harus digunakan di dalam KeranjangProvider");
  }
  return context;
}
