import type { ReactNode } from "react";
import { AdminHeader } from "@/components/layout/admin-header";
import { requireAdminPermission } from "@/lib/auth/permissions";

export default async function AdminPortalLayout({ children }: { children: ReactNode }) {
  const { session } = await requireAdminPermission("dashboard:read");

  return (
    <div className="admin-shell">
      <AdminHeader administratorName={session.user.name} />
      <main className="admin-main">{children}</main>
    </div>
  );
}