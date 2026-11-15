import type { Metadata } from "next";
import { AdminInviteForm } from "@/components/forms/admin-invite-form";
import { requireAdminPermission } from "@/lib/auth/permissions";

export const metadata: Metadata = {
  title: "Administrator access",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  await requireAdminPermission("users:manage");

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Access management</p>
          <h1>Administrators</h1>
        </div>
        <p>Create a one-time account setup link for an authorized team member.</p>
      </div>
      <AdminInviteForm />
    </>
  );
}