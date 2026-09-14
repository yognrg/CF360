"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Role, User } from "@/lib/types";

const ROLE_LABEL: Record<Role, string> = {
  raiser: "Request Raiser",
  producer: "Producer",
  admin: "Admin",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TopBar({
  currentUser,
  users,
}: {
  currentUser: User;
  users: User[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const switchUser = async (userId: string) => {
    if (userId === currentUser.id) return setOpen(false);
    setSwitching(true);
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setSwitching(false);
    setOpen(false);
    router.refresh();
  };

  return (
    <header className="flex h-topbar shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <Link href="/pipeline" className="text-title font-bold text-primary">
        CF360
      </Link>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="rounded-control p-1.5 text-text-sub hover:bg-bg"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-control py-1 pl-1 pr-2 hover:bg-bg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-primary-soft text-caption font-semibold text-primary">
              {initials(currentUser.name)}
            </span>
            <span className="text-label text-text">{currentUser.name}</span>
            <ChevronDown className="h-4 w-4 text-text-faint" />
          </button>

          {open && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-card border border-border bg-surface shadow-toast">
              <div className="border-b border-line px-4 py-2">
                <p className="text-caption font-medium text-text-faint">
                  SWITCH USER (DEMO)
                </p>
              </div>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  disabled={switching}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-bg disabled:opacity-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-bg text-caption font-semibold text-text-sub">
                    {initials(u.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-label text-text">
                      {u.name}
                    </span>
                    <span className="block text-caption text-text-faint">
                      {ROLE_LABEL[u.role]}
                    </span>
                  </span>
                  {u.id === currentUser.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { ROLE_LABEL };
