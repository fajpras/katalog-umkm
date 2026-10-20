import Link from "next/link";

export default function PaginasiAdmin({ page, totalPages, totalData, q = "" }) {
  if (totalPages <= 1 && totalData <= 10) return null;

  const adaSebelumnya = page > 1;
  const adaBerikutnya = page < totalPages;

  const buatUrl = (targetPage) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (targetPage > 1) params.set("page", targetPage.toString());
    const query = params.toString();
    return query ? `/admin?${query}` : "/admin";
  };

  return (
    <nav
      aria-label="Paginasi tabel admin"
      className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200/80 px-2 pt-5 dark:border-zinc-800/80 sm:flex-row"
    >
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Menampilkan halaman <strong className="text-zinc-900 dark:text-zinc-100">{page}</strong> dari{" "}
        <strong className="text-zinc-900 dark:text-zinc-100">{totalPages}</strong> (Total {totalData} produk)
      </p>

      <div className="flex items-center gap-2">
        {adaSebelumnya ? (
          <Link
            href={buatUrl(page - 1)}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white px-3.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            &larr; Sebelumnya
          </Link>
        ) : (
          <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-xl border border-zinc-200/50 bg-zinc-50 px-3.5 text-xs font-semibold text-zinc-400 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-600">
            &larr; Sebelumnya
          </span>
        )}

        {adaBerikutnya ? (
          <Link
            href={buatUrl(page + 1)}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white px-3.5 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Berikutnya &rarr;
          </Link>
        ) : (
          <span className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-xl border border-zinc-200/50 bg-zinc-50 px-3.5 text-xs font-semibold text-zinc-400 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-600">
            Berikutnya &rarr;
          </span>
        )}
      </div>
    </nav>
  );
}
