"use client";

import { useMemo, useState } from "react";
import type { StoredSession, StoredUser } from "@/lib/persistence";
import { describeUserAgent } from "@/lib/turboContent";

export function SessionManagementPanel({
  initialSessions,
  users
}: {
  initialSessions: StoredSession[];
  users: StoredUser[];
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const [message, setMessage] = useState("");
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const groupedUsers = useMemo(
    () =>
      users.map((user) => ({
        user,
        sessions: sessions.filter((session) => session.userId === user.id)
      })),
    [sessions, users]
  );

  async function revokeSession(sessionId: string) {
    setPendingKey(sessionId);
    setMessage("");
    const response = await fetch("/api/admin/sessions", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
    const data = await response.json();
    setPendingKey(null);
    if (!response.ok) {
      setMessage(data.error || "Could not revoke session.");
      return;
    }
    setSessions((current) => current.map((session) => (session.id === sessionId ? data.session : session)));
    setMessage(`Revoked session ${sessionId.slice(0, 8)}.`);
  }

  async function revokeUserSessions(userId: number) {
    setPendingKey(`user-${userId}`);
    setMessage("");
    const response = await fetch("/api/admin/sessions", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId })
    });
    const data = await response.json();
    setPendingKey(null);
    if (!response.ok) {
      setMessage(data.error || "Could not revoke user sessions.");
      return;
    }
    const revokedIds = new Set((data.sessions as StoredSession[]).filter((session) => session.revokedAt).map((session) => session.id));
    setSessions((current) => current.map((session) => (revokedIds.has(session.id) ? { ...session, revokedAt: new Date().toISOString() } : session)));
    setMessage("Revoked all sessions for that user.");
  }

  return (
    <div className="grid gap-4">
      {groupedUsers.map(({ user, sessions: userSessions }) => (
        <article className="rounded-[24px] border border-slate-800 bg-[#141b22] p-5" key={user.id}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-black text-slate-100">{user.email}</h2>
              <p className="text-sm text-slate-400">
                {userSessions.filter((session) => !session.revokedAt && new Date(session.expiresAt).getTime() > Date.now()).length} active sessions
              </p>
            </div>
            <button
              className="rounded-xl border border-red-900 bg-red-950/60 px-3 py-2 text-sm font-bold text-red-200"
              disabled={pendingKey === `user-${user.id}`}
              onClick={() => revokeUserSessions(user.id)}
              type="button"
            >
              Revoke all
            </button>
          </div>
          <div className="grid gap-3">
            {userSessions.length ? (
              userSessions.map((session) => {
                const active = !session.revokedAt && new Date(session.expiresAt).getTime() > Date.now();
                return (
                  <div className="rounded-2xl border border-slate-800 bg-[#0f151b] p-4" key={session.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-100">{describeUserAgent(session.userAgent)}</p>
                        <p className="mt-1 text-sm text-slate-400">{session.id.slice(0, 8)}...</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {session.ipAddress || "Unknown IP"} · last seen {new Date(session.lastSeenAt).toLocaleString()} · started {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${active ? "bg-emerald-950 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                          {active ? "active" : session.revokedAt ? "revoked" : "expired"}
                        </span>
                        {active ? (
                          <button
                            className="rounded-xl border border-red-900 bg-red-950/60 px-3 py-2 text-sm font-bold text-red-200"
                            disabled={pendingKey === session.id}
                            onClick={() => revokeSession(session.id)}
                            type="button"
                          >
                            Revoke
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">No tracked sessions for this user yet.</p>
            )}
          </div>
        </article>
      ))}
      {message ? <p className="text-sm text-slate-400">{message}</p> : null}
    </div>
  );
}
