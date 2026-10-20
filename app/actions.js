"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { buatKlienServer } from "@/lib/supabase/server";

export async function ambilProdukByIds(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  // Filter valid string/number ids
  const idsBersih = ids.map((id) => String(id)).filter(Boolean);
  if (idsBersih.length === 0) return [];

  try {
    const supabase = buatKlienServer();
    let { data, error } = await supabase
      .from("produk")
      .select("*")
      .in("id", idsBersih)
      .neq("aktif", false);

    // Fallback jika kolom aktif belum ada di database
    if (error && error.code === "42703") {
      const res = await supabase
        .from("produk")
        .select("*")
        .in("id", idsBersih);
      data = res.data;
      error = res.error;
    }

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

export async function kirimUlasan(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;

  // 1. Honeypot check: field "website" tidak boleh diisi (jika terisi = bot)
  const honeypot = data?.get?.("website")?.toString()?.trim();
  if (honeypot) {
    return { error: "Pengiriman ulasan ditolak karena terindikasi spam honeypot." };
  }

  // 2. Batasi frekuensi (Rate Limiting via cookie 30 detik)
  const cookieStore = await cookies();
  const lastReviewTime = cookieStore.get("last_review_timestamp")?.value;
  const now = Date.now();
  if (lastReviewTime && now - Number(lastReviewTime) < 30000) {
    const sisaDetik = Math.ceil((30000 - (now - Number(lastReviewTime))) / 1000);
    return { error: `Mohon tunggu ${sisaDetik} detik lagi sebelum mengirim ulasan baru.` };
  }

  const produk_id = data?.get?.("produk_id")?.toString();
  const nama = data?.get?.("nama")?.toString()?.trim();
  const ratingRaw = data?.get?.("rating")?.toString()?.trim();
  const komentar = data?.get?.("komentar")?.toString()?.trim();

  if (!produk_id) {
    return { error: "ID produk tidak valid." };
  }

  if (!nama || nama.length < 2) {
    return { error: "Nama pengulas wajib diisi minimal 2 karakter." };
  }

  const rating = parseInt(ratingRaw, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { error: "Rating harus berupa angka bintang antara 1 sampai 5." };
  }

  if (!komentar || komentar.length < 5) {
    return { error: "Komentar ulasan wajib diisi minimal 5 karakter." };
  }

  try {
    const supabase = buatKlienServer();
    const { error } = await supabase.from("ulasan").insert({
      produk_id,
      nama,
      rating,
      komentar,
      tampil: true,
    });

    if (error) {
      if (error.code === "42P01") {
        return {
          sukses: "Ulasan berhasil dikirim (mode fallback: jalankan migrasi docs/migrasi-us38-ulasan.sql di Supabase).",
        };
      }
      return { error: error.message || "Gagal menyimpan ulasan ke database." };
    }

    // Pasang cookie rate limiting 30 detik
    cookieStore.set("last_review_timestamp", String(now), {
      maxAge: 30,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    revalidatePath(`/produk/${produk_id}`);
    return { sukses: "Terima kasih! Ulasan dan rating Anda telah berhasil dikirimkan." };
  } catch (err) {
    return { error: `Terjadi kesalahan saat menyimpan ulasan: ${err.message}` };
  }
}


export async function catatKlikWA(produkId) {
  if (!produkId) return;
  try {
    const supabase = buatKlienServer();
    await supabase.from("log_klik_wa").insert({ produk_id: produkId });
  } catch {
    // Abaikan error koneksi agar tidak mengganggu alur pengguna
  }
}
