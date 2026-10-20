"use client";

import { useEffect, useState } from "react";

export default function SakelarTema() {
  const [tema, setTema] = useState("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tersimpan = localStorage.getItem("tema") || "system";
    setTema(tersimpan);
  }, []);

  const gantiTema = (pilihan) => {
    setTema(pilihan);
    localStorage.setItem("tema", pilihan);

    const supportDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (pilihan === "dark" || (pilihan === "system" && supportDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (tema !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const tersimpan = localStorage.getItem("tema");
      if (tersimpan === "system" || !tersimpan) {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [tema]);

  if (!mounted) {
    return (
      <div className="flex h-8 w-24 items-center rounded-2xl border border-zinc-200/80 bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900" />
    );
  }

  return (
    <div
      role="group"
      aria-label="Pilih tema tampilan"
      className="inline-flex items-center rounded-2xl border border-zinc-200/80 bg-zinc-100/90 p-1 text-xs font-medium text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-300"
    >
      <button
        type="button"
        onClick={() => gantiTema("light")}
        className={`flex items-center gap-1 rounded-xl px-2 py-1 transition-all ${
          tema === "light"
            ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
            : "hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        title="Mode Terang"
        aria-label="Mode Terang"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
        <span className="hidden sm:inline">Terang</span>
      </button>

      <button
        type="button"
        onClick={() => gantiTema("dark")}
        className={`flex items-center gap-1 rounded-xl px-2 py-1 transition-all ${
          tema === "dark"
            ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
            : "hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        title="Mode Gelap"
        aria-label="Mode Gelap"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
        <span className="hidden sm:inline">Gelap</span>
      </button>

      <button
        type="button"
        onClick={() => gantiTema("system")}
        className={`flex items-center gap-1 rounded-xl px-2 py-1 transition-all ${
          tema === "system"
            ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
            : "hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        title="Ikuti Sistem"
        aria-label="Ikuti Sistem"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3"
          />
        </svg>
        <span className="hidden sm:inline">Sistem</span>
      </button>
    </div>
  );
}
