import { getCurrentUser, can } from "@/lib/auth";
import { listUsers } from "@/lib/db";
import { NAV_ITEMS } from "@/lib/nav";
import { SideNav } from "@/components/shell/side-nav";
import { TopBar } from "@/components/shell/top-bar";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  const users = listUsers();
  const items = NAV_ITEMS.filter((item) => can(user, item.cap));

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar currentUser={user} users={users} />
      <div className="flex min-h-0 flex-1">
        <SideNav items={items} />
        <main className="scrollbar-thin min-w-0 flex-1 overflow-y-auto bg-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
