import { readAppData } from "@/lib/persistence";

export default async function UsersPage() {
  const data = await readAppData();
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="text-4xl font-black text-slate-100">User & IP Management</h1>
      <p className="mt-3 text-slate-400">Manage sessions, roles, blocked IPs and redirect targets.</p>
      <div className="mt-6 grid gap-4">
        {data.users.map((user) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={user.id}>
            <h2 className="font-black text-slate-100">{user.email}</h2>
            <p className="text-slate-400">{user.role}</p>
          </article>
        ))}
        {data.ipBlocks.map((block) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={block.id}>
            <h2 className="font-black text-slate-100">{block.ipAddress}</h2>
            <p className="text-slate-400">{block.reason}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
