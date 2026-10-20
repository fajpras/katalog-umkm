import Link from "next/link";

const gaya = {
  utama:
    "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-sm hover:shadow-lg dark:bg-emerald-500 dark:hover:bg-emerald-600",
  admin:
    "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-sm hover:shadow-lg dark:bg-indigo-500 dark:hover:bg-indigo-600",
  ai:
    "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm hover:shadow-lg active:scale-95",
  garis:
    "border border-zinc-200/80 bg-white text-zinc-700 hover:bg-zinc-100 active:scale-95 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800",
  bahaya:
    "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-sm hover:shadow-lg dark:bg-red-500 dark:hover:bg-red-600",
};

export default function Tombol({ href, varian = "utama", className = "", children, ...props }) {
  const kelas = `inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:active:scale-100 dark:disabled:bg-zinc-800 ${gaya[varian] || gaya.utama} ${className}`;

  if (href) {
    return (
      <Link href={href} className={kelas}>
        {children}
      </Link>
    );
  }

  return (
    <button className={kelas} {...props}>
      {children}
    </button>
  );
}
