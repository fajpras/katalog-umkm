import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";

export default function TabelProduk({ daftarProduk = [] }) {
  if (!daftarProduk || daftarProduk.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50/50 px-6 py-14 text-center dark:border-zinc-800/80 dark:bg-zinc-900/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Belum ada produk
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Mulai tambahkan produk pertamamu untuk ditampilkan di katalog pengunjung.
        </p>
        <div className="mt-5">
          <Tombol href="/admin/produk/baru">+ Tambah Produk Pertama</Tombol>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-zinc-200/80 bg-zinc-50/70 text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-800/40 dark:text-zinc-400">
          <tr>
            <th className="px-5 py-3.5 font-semibold">Produk</th>
            <th className="px-5 py-3.5 font-semibold">Kategori</th>
            <th className="px-5 py-3.5 font-semibold">Harga</th>
            <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
          {daftarProduk.map((produk) => (
            <tr
              key={produk.id}
              className="group transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                    <img
                      src={produk.foto_url || "/produk/kopi.svg"}
                      alt={produk.nama}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {produk.nama}
                  </span>
                </div>
              </td>
              <td className="px-5 py-3.5">
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {produk.kategori || "Umum"}
                </span>
              </td>
              <td className="px-5 py-3.5 font-medium text-zinc-900 dark:text-zinc-100">
                {formatRupiah(produk.harga)}
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                    Ubah
                  </Tombol>
                  <Tombol type="button" varian="bahaya">
                    Hapus
                  </Tombol>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
