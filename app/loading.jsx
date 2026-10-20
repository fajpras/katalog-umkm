export default function Loading() {
  return (
    <div className="py-6">
      {/* Skeleton Banner Hero */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-100/60 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/40 sm:p-10">
        <div className="flex animate-pulse flex-col gap-3">
          <div className="h-5 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-9 w-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800 sm:w-80" />
          <div className="h-4 w-full max-w-md rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-3 h-12 w-full max-w-xl rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      {/* Skeleton Filter Chips */}
      <div className="mb-8 flex animate-pulse gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-8 w-20 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800"
          />
        ))}
      </div>

      {/* Skeleton Grid Kartu Produk */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
          <div
            key={item}
            className="flex animate-pulse flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-0 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900"
          >
            {/* Foto Skeleton */}
            <div className="aspect-[4/5] w-full bg-zinc-200 dark:bg-zinc-800" />

            {/* Info Skeleton */}
            <div className="flex flex-1 flex-col gap-2.5 p-4">
              <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-auto h-5 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
