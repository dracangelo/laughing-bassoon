import type { ReactNode } from "react";

export function Modal({
  title,
  children,
  open
}: {
  title: string;
  children: ReactNode;
  open: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4" role="dialog" aria-modal="true" aria-label={title}>
      <section className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace">
        <h2 className="mb-4 text-2xl font-black text-slate-100">{title}</h2>
        {children}
      </section>
    </div>
  );
}
