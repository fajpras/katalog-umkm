import { redirect } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormGantiPassword from "@/components/FormGantiPassword";
import { buatKlienSesi } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HalamanGantiPassword() {
  // Cek sesi di baris pertama
  const supabase = await buatKlienSesi();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col gap-6 py-6 sm:py-8">
      <NavAdmin />
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
          Ganti Password
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Ganti password bawaan secara berkala demi keamanan akun. Minimal 8 karakter.
        </p>
      </div>

      <FormGantiPassword />
    </div>
  );
}
