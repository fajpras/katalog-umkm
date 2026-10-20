import FormUlasan from "@/components/FormUlasan";

export default function SeksiUlasan({ produkId, daftarUlasan = [] }) {
  const totalUlasan = daftarUlasan.length;
  const rataRata =
    totalUlasan > 0
      ? (
          daftarUlasan.reduce((acc, u) => acc + Number(u.rating || 0), 0) /
          totalUlasan
        ).toFixed(1)
      : null;

  return (
    <section
      aria-labelledby="judul-ulasan"
      className="mt-14 border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="judul-ulasan"
            className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)] sm:text-2xl"
          >
            Ulasan & Penilaian Pelanggan
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Penilaian asli dari pembeli produk ini
          </p>
        </div>

        {rataRata && (
          <div className="flex items-center gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/60 px-4 py-2 dark:border-amber-900/50 dark:bg-amber-950/30">
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-[family-name:var(--font-display)]">
              ★ {rataRata}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              dari {totalUlasan} ulasan
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Kolom Form Ulasan Baru */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 sm:p-6 self-start">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)] mb-3">
            Tulis Ulasan Anda
          </h3>
          <FormUlasan produkId={produkId} />
        </div>

        {/* Kolom Daftar Ulasan */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {daftarUlasan.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/80 bg-white px-6 py-12 text-center dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <span className="text-3xl">💬</span>
              <p className="mt-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Belum ada ulasan untuk produk ini
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                Jadilah pelanggan pertama yang membagikan pengalaman rasa dan kualitas produk ini!
              </p>
            </div>
          ) : (
            daftarUlasan.map((u) => (
              <div
                key={u.id}
                className="flex flex-col gap-2 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                    {u.nama}
                  </span>
                  <div className="flex text-amber-400 text-xs">
                    {"★".repeat(u.rating)}
                    {"☆".repeat(Math.max(0, 5 - u.rating))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                  {u.komentar}
                </p>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString("id-ID", {
                        dateStyle: "long",
                      })
                    : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
