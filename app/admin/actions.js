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

function validasiProduk(data) {
  const errors = {};
  const nama = data?.get?.("nama")?.toString()?.trim() || "";
  const hargaRaw = data?.get?.("harga")?.toString()?.trim() || "";
  const hargaDiskonRaw = data?.get?.("harga_diskon")?.toString()?.trim() || "";
  const kategori = data?.get?.("kategori")?.toString()?.trim() || "";
  const stokRaw = data?.get?.("stok")?.toString()?.trim() || "";

  if (!nama) {
    errors.nama = "Nama produk wajib diisi.";
  } else if (nama.length < 3) {
    errors.nama = "Nama produk minimal 3 karakter.";
  }

  if (!hargaRaw) {
    errors.harga = "Harga produk wajib diisi.";
  } else {
    const harga = Number(hargaRaw);
    if (isNaN(harga) || harga <= 0) {
      errors.harga = "Harga harus berupa angka lebih dari 0.";
    }
  }

  if (hargaDiskonRaw) {
    const hargaDiskon = Number(hargaDiskonRaw);
    const harga = Number(hargaRaw);
    if (isNaN(hargaDiskon) || hargaDiskon < 0) {
      errors.harga_diskon = "Harga diskon harus berupa angka valid.";
    } else if (!isNaN(harga) && hargaDiskon >= harga) {
      errors.harga_diskon = "Harga diskon harus lebih murah dari harga normal.";
    }
  }

  if (!kategori) {
    errors.kategori = "Kategori wajib dipilih atau diisi.";
  }

  if (stokRaw !== "") {
    const stok = Number(stokRaw);
    if (isNaN(stok) || stok < 0) {
      errors.stok = "Jumlah stok tidak boleh negatif.";
    }
  }

  return errors;
}

function ambilNilaiForm(data) {
  return {
    nama: data?.get?.("nama")?.toString() || "",
    harga: data?.get?.("harga")?.toString() || "",
    harga_diskon: data?.get?.("harga_diskon")?.toString() || "",
    kategori: data?.get?.("kategori")?.toString() || "",
    label: data?.get?.("label")?.toString() || "",
    stok: data?.get?.("stok")?.toString() || "",
    tersedia: data?.get?.("tersedia") === "true",
    foto_url: data?.get?.("foto_url")?.toString() || "",
    foto_galeri: data?.get?.("foto_galeri")?.toString() || "",
    deskripsi: data?.get?.("deskripsi")?.toString() || "",
  };
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
  const errors = validasiProduk(data);
  const values = ambilNilaiForm(data);

  if (Object.keys(errors).length > 0) {
    return {
      error: "Terdapat isian yang belum sesuai. Silakan periksa kembali formulir.",
      errors,
      values,
    };
  }

  const nama = values.nama.trim();
  const hargaRaw = values.harga.trim();
  const hargaDiskonRaw = values.harga_diskon.trim();
  const kategori = values.kategori.trim();
  const label = values.label.trim() || null;
  const foto_url = values.foto_url.trim() || "/produk/kopi.svg";
  const deskripsi = values.deskripsi.trim();
  const fotoGaleriRaw = values.foto_galeri.trim();
  const foto_galeri = fotoGaleriRaw
    ? fotoGaleriRaw
        .split(/[\n,]/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    : [];
  const stokRaw = values.stok.trim();
  const stok = stokRaw !== "" ? parseInt(stokRaw, 10) : 10;
  const tersedia = values.tersedia;

  const harga = parseInt(hargaRaw, 10);
  const harga_diskon = hargaDiskonRaw !== "" ? parseInt(hargaDiskonRaw, 10) : null;

  const payload = {
    nama,
    harga,
    harga_diskon: harga_diskon !== null && !isNaN(harga_diskon) ? harga_diskon : null,
    kategori,
    label: label || null,
    foto_url,
    deskripsi,
    foto_galeri,
    stok: isNaN(stok) ? 0 : stok,
    tersedia,
  };

  let p = { ...payload };
  let insertError = null;
  while (true) {
    const res = await supabase.from("produk").insert(p);
    if (!res.error) {
      insertError = null;
      break;
    }
    insertError = res.error;
    if (res.error.code === "42703") {
      const msg = res.error.message || "";
      let stripped = false;
      for (const col of ["foto_galeri", "stok", "tersedia", "harga_diskon", "label"]) {
        if (msg.includes(col) && p[col] !== undefined) {
          delete p[col];
          stripped = true;
          break;
        }
      }
      if (stripped) continue;
    }
    break;
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

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  const errors = validasiProduk(data);
  const values = ambilNilaiForm(data);

  if (Object.keys(errors).length > 0) {
    return {
      error: "Terdapat isian yang belum sesuai. Silakan periksa kembali formulir.",
      errors,
      values: { ...values, id },
    };
  }

  const nama = values.nama.trim();
  const hargaRaw = values.harga.trim();
  const hargaDiskonRaw = values.harga_diskon.trim();
  const kategori = values.kategori.trim();
  const label = values.label.trim() || null;
  const foto_url = values.foto_url.trim() || "/produk/kopi.svg";
  const deskripsi = values.deskripsi.trim();
  const fotoGaleriRaw = values.foto_galeri.trim();
  const foto_galeri = fotoGaleriRaw
    ? fotoGaleriRaw
        .split(/[\n,]/)
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    : [];
  const stokRaw = values.stok.trim();
  const stok = stokRaw !== "" ? parseInt(stokRaw, 10) : 10;
  const tersedia = values.tersedia;

  const harga = parseInt(hargaRaw, 10);
  const harga_diskon = hargaDiskonRaw !== "" ? parseInt(hargaDiskonRaw, 10) : null;

  const payload = {
    nama,
    harga,
    harga_diskon: harga_diskon !== null && !isNaN(harga_diskon) ? harga_diskon : null,
    kategori,
    label: label || null,
    foto_url,
    deskripsi,
    foto_galeri,
    stok: isNaN(stok) ? 0 : stok,
    tersedia,
  };

  let p = { ...payload };
  let updateError = null;
  while (true) {
    const res = await supabase.from("produk").update(p).eq("id", id);
    if (!res.error) {
      updateError = null;
      break;
    }
    updateError = res.error;
    if (res.error.code === "42703") {
      const msg = res.error.message || "";
      let stripped = false;
      for (const col of ["foto_galeri", "stok", "tersedia", "harga_diskon", "label"]) {
        if (msg.includes(col) && p[col] !== undefined) {
          delete p[col];
          stripped = true;
          break;
        }
      }
      if (stripped) continue;
    }
    break;
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

export async function uploadFoto(formData) {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login. Silakan login kembali." };
  }

  const file = formData?.get?.("file");
  if (!file || typeof file === "string" || !file.name) {
    return { error: "File tidak ditemukan atau belum dipilih." };
  }

  // 1. Validasi Ukuran (Maks 2 MB)
  const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
  if (file.size > MAX_SIZE) {
    return { error: `Ukuran file terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maksimal ukuran file adalah 2 MB.` };
  }

  // 2. Validasi Ekstensi & MIME Type (hanya jpg, png, webp)
  const namaAsli = file.name.toLowerCase();
  const ekstensiDiizinkan = [".jpg", ".jpeg", ".png", ".webp"];
  const mimeDiizinkan = ["image/jpeg", "image/png", "image/webp"];

  const ekstensiValid = ekstensiDiizinkan.some((ext) => namaAsli.endsWith(ext));
  const mimeValid = mimeDiizinkan.includes(file.type);

  if (!ekstensiValid || !mimeValid) {
    return {
      error: "Tipe file tidak valid. Hanya file gambar (.jpg, .jpeg, .png, .webp) yang diperbolehkan.",
    };
  }

  // 3. Nama file acak
  const ekstensi = namaAsli.split(".").pop();
  const namaAcak = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ekstensi}`;
  const pathUpload = `${namaAcak}`;

  // 4. Konversi ke Buffer & Upload ke Storage Bucket "produk"
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("produk")
      .upload(pathUpload, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return {
        error: `Gagal mengunggah file ke Supabase Storage: ${uploadError.message}`,
      };
    }

    const { data: urlData } = supabase.storage
      .from("produk")
      .getPublicUrl(pathUpload);

    return { url: urlData.publicUrl };
  } catch (err) {
    return { error: `Terjadi kesalahan saat upload: ${err.message}` };
  }
}

export async function tambahKategori(prevState, formData) {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login." };
  }

  const data = formData instanceof FormData ? formData : prevState;
  const nama = data?.get?.("nama")?.toString()?.trim() || "";

  if (!nama) {
    return { error: "Nama kategori wajib diisi." };
  }

  const { error } = await supabase.from("kategori").insert({ nama });
  if (error) {
    if (error.code === "23505") {
      return { error: "Kategori dengan nama tersebut sudah ada." };
    }
    return { error: error.message || "Gagal menambahkan kategori." };
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/admin");
  revalidatePath("/");
  return { sukses: "Kategori baru berhasil ditambahkan." };
}

export async function ubahKategori(prevState, formData) {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login." };
  }

  const data = formData instanceof FormData ? formData : prevState;
  const id = data?.get?.("id")?.toString();
  const namaBaru = data?.get?.("nama")?.toString()?.trim() || "";
  const namaLama = data?.get?.("nama_lama")?.toString()?.trim() || "";

  if (!id || !namaBaru) {
    return { error: "Nama kategori wajib diisi." };
  }

  const { error } = await supabase
    .from("kategori")
    .update({ nama: namaBaru })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Gagal mengubah nama kategori." };
  }

  // Update nama kategori di seluruh produk terkait jika nama berubah
  if (namaLama && namaLama !== namaBaru) {
    await supabase
      .from("produk")
      .update({ kategori: namaBaru })
      .eq("kategori", namaLama);
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/admin");
  revalidatePath("/");
  return { sukses: "Kategori berhasil diperbarui." };
}

export async function hapusKategori(id, namaKategori) {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login." };
  }

  if (!id) {
    return { error: "ID kategori tidak valid." };
  }

  // Cek apakah ada produk yang masih memakai kategori ini
  if (namaKategori) {
    const { count, error: countErr } = await supabase
      .from("produk")
      .select("id", { count: "exact", head: true })
      .eq("kategori", namaKategori);

    if (!countErr && count > 0) {
      return {
        error: `Kategori "${namaKategori}" tidak dapat dihapus karena masih digunakan oleh ${count} produk. Ubah atau hapus produk terkait terlebih dahulu.`,
      };
    }
  }

  const { error } = await supabase.from("kategori").delete().eq("id", id);
  if (error) {
    return { error: error.message || "Gagal menghapus kategori." };
  }

  revalidatePath("/admin/kategori");
  revalidatePath("/admin");
  revalidatePath("/");
  return { sukses: true };
}

export async function toggleAktifProduk(id, statusAktifSekarang) {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum login." };
  }

  if (!id) return { error: "ID produk tidak valid." };

  const { error } = await supabase
    .from("produk")
    .update({ aktif: !statusAktifSekarang })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Gagal mengubah status aktif produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return { sukses: true };
}
