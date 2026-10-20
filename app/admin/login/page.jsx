"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { login } from "@/app/admin/actions";

export default function HalamanLogin() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-12">
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-8">
        <div>
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Panel Pemilik Toko
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 font-[family-name:var(--font-display)]">
            Masuk Admin
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Masuk dengan akun terdaftar untuk mengelola katalog produk.
          </p>
        </div>

        {state?.error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
            {state.error}
          </div>
        )}

        <form action={formAction} className="mt-5 flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@toko.com"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
          <div className="pt-2">
            <Tombol type="submit" varian="admin" disabled={isPending} className="w-full">
              {isPending ? "Memeriksa..." : "Masuk"}
            </Tombol>
          </div>
        </form>
      </div>
    </div>
  );
}

