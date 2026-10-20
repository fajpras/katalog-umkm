"use server";

import { redirect } from "next/navigation";
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

