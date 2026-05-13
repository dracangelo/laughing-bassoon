import { SessionManagementPanel } from "@/components/admin/SessionManagementPanel";
import type { StoredIpBlock, StoredSession, StoredUser } from "@/lib/persistence";
import { UserManagementPanel } from "@/components/admin/UserManagementPanel";
import { getIpBlocks, getSessions, getUsers } from "@/lib/data-access";

export default async function UsersPage() {
  const [users, ipBlocks, sessions] = await Promise.all([getUsers(), getIpBlocks(), getSessions()]);
  return (
    <main className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="text-4xl font-black text-slate-100">User & IP Management</h1>
      <p className="mt-3 text-slate-400">Manage sessions, roles, blocked IPs and redirect targets.</p>
      <div className="mt-6">
        <UserManagementPanel initialIpBlocks={ipBlocks as StoredIpBlock[]} initialUsers={users as StoredUser[]} />
      </div>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-black text-slate-100">Session inventory</h2>
        <SessionManagementPanel initialSessions={sessions as StoredSession[]} users={users as StoredUser[]} />
      </section>
    </main>
  );
}
