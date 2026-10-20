"use server";

import { buatKlienServer } from "@/lib/supabase/server";

export async function ambilProdukByIds(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { data: [] };
  }

  const cleanedIds = ids
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id));

  if (cleanedIds.length === 0) {
    return { data: [] };
  }

  try {
    const supabase = buatKlienServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .in("id", cleanedIds);

    if (error) {
      return { error: error.message, data: [] };
    }

    return { data: data || [] };
  } catch (err) {
    return { error: err.message, data: [] };
  }
}

