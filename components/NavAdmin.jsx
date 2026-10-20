import Link from "next/link";
import { keluar } from "@/app/admin/actions";

export default function NavAdmin() {
  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-zinc-200/80 pb-4 text-sm dark:border-zinc-800/80">
      <Link
        href="/admin"
        className="font-semibold text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
      >
        Produk
      </Link>
      <Link
        href="/admin/kategori"
        className="font-semibold text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
      >
        Kategori
      </Link>
      <Link
        href="/admin/banner"
        className="font-semibold text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
      >
        Banner
      </Link>
      <Link
        href="/admin/ulasan"
        className="font-semibold text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
      >
        Ulasan
      </Link>
      <Link
        href="/admin/password"
        className="font-semibold text-zinc-900 transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
      >
        Ganti password
      </Link>
      <form action={keluar} className="ml-auto">
        <button
          type="submit"
          className="text-xs font-semibold text-zinc-500 transition-colors hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400"
        >
          Keluar
        </button>
      </form>
    </nav>
  );
}
