export default function Input({ label, name, type = "text", textarea = false, className = "", ...props }) {
  const kelasInput = `w-full rounded-2xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 ${className}`;

  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
      {label}
      {textarea ? (
        <textarea name={name} rows={4} className={kelasInput} {...props} />
      ) : (
        <input name={name} type={type} className={kelasInput} {...props} />
      )}
    </label>
  );
}
