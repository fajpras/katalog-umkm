export default function Input({
  label,
  name,
  type = "text",
  textarea = false,
  className = "",
  error = null,
  ...props
}) {
  const borderClass = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:border-red-500"
    : "border-zinc-200/80 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-800/80 dark:focus:border-indigo-400";

  const kelasInput = `w-full rounded-2xl border ${borderClass} bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${className}`;

  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
      {label}
      {textarea ? (
        <textarea name={name} rows={4} className={kelasInput} {...props} />
      ) : (
        <input name={name} type={type} className={kelasInput} {...props} />
      )}
      {error && (
        <span className="text-xs font-normal text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}
