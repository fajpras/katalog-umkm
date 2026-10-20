"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { gantiPassword } from "@/app/admin/actions";

export default function FormGantiPassword() {
  const [state, formAction, isPending] = useActionState(gantiPassword, null);

  return (
    <div className="flex max-w-md flex-col gap-4">
      {state?.error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          {state.error}
        </div>
      )}

      {state?.sukses && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          {state.sukses}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
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
