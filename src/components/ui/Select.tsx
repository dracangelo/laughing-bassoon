import type { SelectHTMLAttributes } from "react";

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`min-h-11 rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100 outline-none ring-aceBlue/0 transition focus:border-aceBlue focus:ring-2 focus:ring-aceBlue/30 ${className}`}
      {...props}
    />
  );
}
