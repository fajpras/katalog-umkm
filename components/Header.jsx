import Link from "next/link";
import { toko } from "@/lib/toko";
import SakelarTema from "@/components/SakelarTema";
import TombolKeranjangHeader from "@/components/TombolKeranjangHeader";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl transition-colors dark:border-zinc-800/80 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-500 font-[family-name:var(--font-display)]"
        >
          {toko.nama}
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/tentang"
            className="text-xs sm:text-sm font-semibold text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
          >
            Tentang
          </Link>
          <TombolKeranjangHeader />
          <SakelarTema />
        </div>
      </div>
    </header>
  );
}
