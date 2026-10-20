"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

export default function FormProduk({ produk = {}, labelTombol = "Simpan produk", action }) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      {produk.id && <input type="hidden" name="id" value={produk.id} />}

      {state?.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {state.error}
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

      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/kopi.svg"
        defaultValue={produk.foto_url || ""}
      />

      <Input
        label="Deskripsi"
        name="deskripsi"
        textarea
        rows={4}
        placeholder="Jelaskan keunggulan, bahan, atau cara penyajian produk..."
        defaultValue={produk.deskripsi || ""}
      />

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
