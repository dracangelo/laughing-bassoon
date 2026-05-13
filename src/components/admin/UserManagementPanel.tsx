"use client";

import { useState } from "react";
import type { StoredIpBlock, StoredUser } from "@/lib/persistence";

export function UserManagementPanel({
  initialUsers,
  initialIpBlocks
}: {
  initialUsers: StoredUser[];
  initialIpBlocks: StoredIpBlock[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [ipBlocks, setIpBlocks] = useState(initialIpBlocks);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function updateRole(userId: number, role: string) {
    setPending(true);
    setMessage("");

    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, role })
    });
    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setMessage(data.error || "Role update failed.");
      return;
    }

    setUsers((current) => current.map((user) => (user.id === userId ? data.user : user)));
    setMessage(`Updated ${data.user.email} to ${data.user.role}.`);
  }

  async function addIpBlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ipAddress: String(form.get("ipAddress") || ""),
        reason: String(form.get("reason") || ""),
        redirectUrl: String(form.get("redirectUrl") || "") || undefined
      })
    });

    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setMessage(data.error || "IP block failed.");
      return;
    }

    setIpBlocks((current) => [data.block, ...current]);
    event.currentTarget.reset();
    setMessage(`Blocked ${data.block.ipAddress}.`);
  }

  async function removeIpBlock(blockId: number) {
    setPending(true);
    setMessage("");

    const response = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ blockId })
    });

    const data = await response.json();
    setPending(false);

    if (!response.ok) {
      setMessage(data.error || "IP unblock failed.");
      return;
    }

    setIpBlocks((current) => current.filter((block) => block.id !== blockId));
    setMessage(`Removed ${data.block.ipAddress}.`);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-4">
            <p className="text-sm font-bold text-slate-500">Users</p>
            <p className="text-3xl font-black text-aceBlue">{users.length}</p>
          </article>
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-4">
            <p className="text-sm font-bold text-slate-500">B2B accounts</p>
            <p className="text-3xl font-black text-slate-100">{users.filter((user) => user.role === "b2b").length}</p>
          </article>
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-4">
            <p className="text-sm font-bold text-slate-500">Blocked IPs</p>
            <p className="text-3xl font-black text-red-300">{ipBlocks.length}</p>
          </article>
        </div>
        {users.map((user) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={user.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-black text-slate-100">{user.email}</h2>
                <p className="text-slate-400">
                  {user.firstName || "User"} {user.lastName || ""} {user.company ? `· ${user.company}` : ""}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {user.phone || "No phone"} · joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <select
                className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100"
                defaultValue={user.role}
                disabled={pending}
                onChange={(event) => updateRole(user.id, event.target.value)}
              >
                {["customer", "b2b", "admin"].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-4">
        <form className="grid gap-3 rounded-[24px] border border-slate-800 bg-[#141b22] p-5" onSubmit={addIpBlock}>
          <h2 className="font-black text-slate-100">Block IP</h2>
          <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" name="ipAddress" placeholder="IP address" required />
          <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" name="reason" placeholder="Reason" required />
          <input className="rounded-2xl border border-slate-700 bg-[#0e1419] px-3 py-2 text-slate-100" name="redirectUrl" placeholder="Redirect URL (optional)" />
          <button className="rounded-2xl bg-aceBlue px-4 py-3 font-black text-[#081018]" disabled={pending} type="submit">
            {pending ? "Saving..." : "Add block"}
          </button>
        </form>

        {ipBlocks.map((block) => (
          <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={block.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-black text-slate-100">{block.ipAddress}</h2>
                <p className="text-slate-400">{block.reason}</p>
              </div>
              <button
                className="rounded-xl border border-red-900 bg-red-950/60 px-3 py-2 text-sm font-bold text-red-200"
                disabled={pending}
                onClick={() => removeIpBlock(block.id)}
                type="button"
              >
                Remove
              </button>
            </div>
          </article>
        ))}

        {message ? <p className="text-sm text-slate-400">{message}</p> : null}
      </div>
    </div>
  );
}
