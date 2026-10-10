import type { ReactNode } from "react";
import { AdminHeader } from "@/components/layout/admin-header";
import { requireAdminPermission } from "@/lib/auth/permissions";

export default async function AdminPortalLayout({ children }: { children: ReactNode }) {
  const { session, adminUser } = await requireAdminPermission("dashboard:read");
  const canManageFinance = adminUser.roles.some(({ role }) => role.code === "SUPER_ADMIN" || role.code === "FINANCE");

  return (
    <div className="admin-shell">
      <AdminHeader administratorName={session.user.name} canManageFinance={canManageFinance} />
      <main className="admin-main">{children}</main>
    </div>
  );
}