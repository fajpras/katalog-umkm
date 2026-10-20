import Link from "next/link";
import { toko } from "@/lib/toko";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200/80 bg-white transition-colors dark:border-zinc-800/80 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]">
            {toko.nama}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{toko.alamat}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{toko.jamBuka}</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link
            href="/tentang"
            className="text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            Tentang Toko
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
          <Link
            href="/admin"
            className="text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            Masuk sebagai Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
