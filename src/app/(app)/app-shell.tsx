"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import type { User } from "@/types";

export function AppShell({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:block">
        <Sidebar user={user} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
