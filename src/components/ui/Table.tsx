import type { ReactNode } from "react";

export function Table({
  headers,
  children
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-slate-800">
      <table className="w-full min-w-[640px] border-collapse bg-[#141b22] text-left text-sm">
        <thead className="bg-[#0f151b] text-xs uppercase tracking-[0.16em] text-slate-500">
          <tr>
            {headers.map((header) => (
              <th className="px-4 py-3 font-black" key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-300">{children}</tbody>
      </table>
    </div>
  );
}
