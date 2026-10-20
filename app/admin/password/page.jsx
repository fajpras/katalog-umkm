"use client";

import { useActionState } from "react";
import NavAdmin from "@/components/NavAdmin";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { gantiPassword } from "@/app/admin/actions";

export default function HalamanGantiPassword() {
  const [state, formAction, isPending] = useActionState(gantiPassword, null);

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

      {state?.error && (
        <div className="max-w-md rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          {state.error}
        </div>
      )}

      {state?.sukses && (
        <div className="max-w-md rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          {state.sukses}
        </div>
      )}

      <form action={formAction} className="flex max-w-md flex-col gap-4">
        <Input
          label="Password baru"
          name="password_baru"
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="Minimal 8 karakter"
          required
        />
        <Input
          label="Ulangi password baru"
          name="konfirmasi_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="Ulangi password di atas"
          required
        />
        <div className="pt-2">
          <Tombol type="submit" varian="admin" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan password baru"}
          </Tombol>
        </div>
      </form>
    </div>
  );
}
