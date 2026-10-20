"use server";

import { buatKlienServer } from "@/lib/supabase/server";

export async function ambilProdukByIds(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  // Filter valid string/number ids
  const idsBersih = ids.map((id) => String(id)).filter(Boolean);
  if (idsBersih.length === 0) return [];

  try {
    const supabase = buatKlienServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .in("id", idsBersih)
      .neq("aktif", false);

    if (error || !data) return [];

    // Urutkan sesuai urutan array id terakhir dilihat
    const orderMap = new Map(idsBersih.map((id, index) => [id, index]));
    return [...data].sort(
      (a, b) => (orderMap.get(String(a.id)) ?? 99) - (orderMap.get(String(b.id)) ?? 99)
    );
  } catch {
    return [];
  }
}
