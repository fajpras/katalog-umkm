import KartuProduk from "@/components/KartuProduk";
import { toko } from "@/lib/toko";
import { buatKlienServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = buatKlienServer();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message;
  }

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl font-[family-name:var(--font-display)] text-zinc-900 dark:text-zinc-50">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">{toko.tagline}</p>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2
          id="judul-produk"
          className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-display)]"
        >
          Produk kami
        </h2>

        {pesanError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <p className="font-semibold">Gagal memuat produk: {pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">Belum ada produk</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
