import Link from "next/link";

export default function Paginasi({ page, totalPages, q = "", kategori = "", urut = "" }) {
  if (totalPages <= 1) return null;

  const buildUrl = (targetPage) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (kategori && kategori !== "Semua") params.set("kategori", kategori);
    if (urut && urut !== "terbaru") params.set("urut", urut);
    if (targetPage > 1) params.set("page", targetPage.toString());
    const str = params.toString();
    return str ? `/?${str}` : "/";
  };

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  const buttonClass =
    "inline-flex h-10 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white px-4 text-xs font-semibold text-zinc-700 shadow-sm transition-all hover:bg-zinc-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";

  return (
    <nav aria-label="Navigasi Halaman" className="flex items-center justify-center gap-3 pt-8">
      {isPrevDisabled ? (
        <button type="button" disabled className={buttonClass}>
          &larr; Sebelumnya
        </button>
      ) : (
        <Link href={buildUrl(page - 1)} className={buttonClass}>
          &larr; Sebelumnya
        </Link>
      )}

      <span className="px-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        Halaman {page} dari {totalPages}
      </span>

      {isNextDisabled ? (
        <button type="button" disabled className={buttonClass}>
          Berikutnya &rarr;
        </button>
      ) : (
        <Link href={buildUrl(page + 1)} className={buttonClass}>
          Berikutnya &rarr;
        </Link>
      )}
    </nav>
  );
}
