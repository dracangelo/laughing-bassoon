"use client";

import { useState } from "react";
import type { StoredSession } from "@/lib/persistence";
import { describeUserAgent } from "@/lib/turboContent";

export function AccountSessionPanel({ initialSessions, currentSessionId }: { initialSessions: StoredSession[]; currentSessionId?: string }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  async function revokeSession(sessionId: string) {
    setPending(sessionId);
    setMessage("");
    const response = await fetch("/api/account/sessions", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
    const data = await response.json();
    setPending(null);
    if (!response.ok) {
      setMessage(data.error || "Could not revoke session.");
      return;
    }
    setSessions((current) => current.map((session) => (session.id === sessionId ? data.session : session)));
    setMessage("Session revoked.");
    if (sessionId === currentSessionId) {
      window.location.href = "/account";
    }
  }

  async function revokeOthers() {
    setPending("others");
    setMessage("");
    const response = await fetch("/api/account/sessions", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ revokeOthers: true })
    });
    const data = await response.json();
    setPending(null);
    if (!response.ok) {
      setMessage(data.error || "Could not revoke other sessions.");
      return;
    }
    const revokedIds = new Set((data.sessions as StoredSession[]).filter((session) => session.revokedAt).map((session) => session.id));
    setSessions((current) => current.map((session) => (revokedIds.has(session.id) ? { ...session, revokedAt: new Date().toISOString() } : session)));
    setMessage("Other sessions signed out.");
  }

  return (
    <section className="rounded-[28px] border border-slate-800 bg-[#141b22] p-6 shadow-ace">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-100">Session & device access</h2>
          <p className="text-sm text-slate-400">Review active logins and remove any device you do not recognise.</p>
        </div>
        <button
          className="rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-slate-200"
          disabled={pending === "others"}
          onClick={revokeOthers}
          type="button"
        >
          Sign out other devices
        </button>
      </div>
      <div className="grid gap-3">
        {sessions.map((session) => {
          const active = !session.revokedAt && new Date(session.expiresAt).getTime() > Date.now();
          const isCurrent = session.id === currentSessionId;
          return (
            <article className="rounded-[22px] border border-slate-800 bg-[#0f151b] p-4" key={session.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-100">{describeUserAgent(session.userAgent)}</p>
                  <p className="mt-1 text-sm text-slate-400">{session.ipAddress || "Unknown IP"} · started {new Date(session.createdAt).toLocaleString()}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Last seen {new Date(session.lastSeenAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${active ? "bg-emerald-950 text-emerald-300" : "bg-slate-800 text-slate-400"}`}>
                    {isCurrent && active ? "current session" : active ? "active" : session.revokedAt ? "revoked" : "expired"}
                  </span>
                  {active ? (
                    <button
                      className="rounded-xl border border-red-900 bg-red-950/60 px-3 py-2 text-sm font-bold text-red-200"
                      disabled={pending === session.id}
                      onClick={() => revokeSession(session.id)}
                      type="button"
                    >
                      Revoke
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {message ? <p className="mt-4 text-sm text-slate-400">{message}</p> : null}
    </section>
  );
}
