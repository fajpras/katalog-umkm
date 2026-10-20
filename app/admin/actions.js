"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buatKlienSesi } from "@/lib/supabase/auth";

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get?.("email")?.toString()?.trim();
  const password = data?.get?.("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatKlienSesi();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let pesan = error.message;
    if (pesan === "Invalid login credentials") {
      pesan = "Email atau password salah.";
    }
    return { error: pesan };
  }

  redirect("/admin");
}

export async function keluar() {
  const supabase = await buatKlienSesi();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function gantiPassword(prevState, formData) {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  const data = formData instanceof FormData ? formData : prevState;
  const passwordBaru = data?.get?.("password_baru")?.toString() || "";
  const konfirmasiPassword = data?.get?.("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Konfirmasi password tidak cocok dengan password baru." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { sukses: "Password berhasil diganti." };
}

export async function tambahProduk(prevState, formData) {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  const data = formData instanceof FormData ? formData : prevState;
  const nama = data?.get?.("nama")?.toString()?.trim() || "";
  const hargaRaw = data?.get?.("harga")?.toString()?.trim() || "";
  const kategori = data?.get?.("kategori")?.toString()?.trim() || "Umum";
  const foto_url = data?.get?.("foto_url")?.toString()?.trim() || "/produk/kopi.svg";
  const deskripsi = data?.get?.("deskripsi")?.toString()?.trim() || "";
  const fotoGaleriRaw = data?.get?.("foto_galeri")?.toString()?.trim() || "";
  const foto_galeri = fotoGaleriRaw
    ? fotoGaleriRaw
        .split(/[\n,]/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    : [];

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka valid dan tidak boleh negatif." };
  }

  const payload = {
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
    foto_galeri,
  };

  let { error: insertError } = await supabase.from("produk").insert(payload);

  // Jika kolom foto_galeri belum ada di database, coba simpan tanpa foto_galeri
  if (insertError && (insertError.code === "42703" || insertError.message?.includes("foto_galeri"))) {
    delete payload.foto_galeri;
    const res = await supabase.from("produk").insert(payload);
    insertError = res.error;
  }

  if (insertError) {
    return { error: insertError.message || "Gagal menyimpan produk baru." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function ubahProduk(prevState, formData) {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  const data = formData instanceof FormData ? formData : prevState;
  const id = data?.get?.("id")?.toString();
  const nama = data?.get?.("nama")?.toString()?.trim() || "";
  const hargaRaw = data?.get?.("harga")?.toString()?.trim() || "";
  const kategori = data?.get?.("kategori")?.toString()?.trim() || "Umum";
  const foto_url = data?.get?.("foto_url")?.toString()?.trim() || "/produk/kopi.svg";
  const deskripsi = data?.get?.("deskripsi")?.toString()?.trim() || "";
  const fotoGaleriRaw = data?.get?.("foto_galeri")?.toString()?.trim() || "";
  const foto_galeri = fotoGaleriRaw
    ? fotoGaleriRaw
        .split(/[\n,]/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    : [];

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka valid dan tidak boleh negatif." };
  }

  const payload = {
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
    foto_galeri,
  };

  let { error: updateError } = await supabase
    .from("produk")
    .update(payload)
    .eq("id", id);

  // Jika kolom foto_galeri belum ada di database, coba update tanpa foto_galeri
  if (updateError && (updateError.code === "42703" || updateError.message?.includes("foto_galeri"))) {
    delete payload.foto_galeri;
    const res = await supabase.from("produk").update(payload).eq("id", id);
    updateError = res.error;
  }

  if (updateError) {
    return { error: updateError.message || "Gagal memperbarui data produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function hapusProduk(idOrFormData) {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  const id = idOrFormData instanceof FormData ? idOrFormData.get("id") : idOrFormData;
  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const { error: deleteError } = await supabase
    .from("produk")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { error: deleteError.message || "Gagal menghapus produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { sukses: true };
}

export async function buatDeskripsiAI(nama, kategori = "Umum") {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  if (!nama || typeof nama !== "string" || !nama.trim()) {
    return { error: "Nama produk harus diisi terlebih dahulu sebelum membuat deskripsi AI." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "GEMINI_API_KEY belum disetel di environment variable server (.env.local)." };
  }

  try {
    const prompt = `Anda adalah copywriter profesional untuk katalog produk UMKM Indonesia.
Buatlah deskripsi produk yang menarik, ramah, meyakinkan pembeli, dan singkat (2-3 kalimat padat) untuk produk berikut:
Nama Produk: ${nama.trim()}
Kategori: ${kategori?.trim() || "Umum"}

Ketentuan:
- Langsung berikan teks deskripsi saja tanpa pengantar atau tanda petik.
- Tonjolkan rasa/kualitas bahan, keunikan, atau manfaat produk.
- Gunakan bahasa Indonesia yang baik, santun, dan menggugah selera/minat.`;

    const model = "gemini-3.8-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.json().catch(() => null);
      return {
        error:
          errBody?.error?.message ||
          `Gemini API mengembalikan status error ${response.status}.`,
      };
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) {
      return { error: "AI tidak menghasilkan teks deskripsi." };
    }

    // Bersihkan tanda petik di awal/akhir jika ada
    const deskripsi = rawText.replace(/^["']|["']$/g, "").trim();

    return { deskripsi };
  } catch (err) {
    return { error: `Gagal memanggil Gemini AI: ${err.message}` };
  }
}
