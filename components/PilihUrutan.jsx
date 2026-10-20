"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PilihUrutan({ urutAktif = "terbaru" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "terbaru") {
      params.set("urut", val);
    } else {
      params.delete("urut");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <label htmlFor="pilih-urutan" className="shrink-0 font-medium text-zinc-500 dark:text-zinc-400">
        Urutkan:
      </label>
      <select
        id="pilih-urutan"
        value={urutAktif}
        onChange={handleChange}
        className="h-9 rounded-xl border border-zinc-200/80 bg-white px-3 py-1 text-xs font-semibold text-zinc-800 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-200 dark:focus:border-emerald-400"
      >
        <option value="terbaru">Terbaru</option>
        <option value="termurah">Termurah</option>
        <option value="termahal">Termahal</option>
      </select>
    </div>
  );
}
