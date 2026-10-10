import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { RoleCode } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export type AdminPermission =
  | "dashboard:read"
  | "content:manage"
  | "priest:manage"
  | "halls:manage"
  | "memberships:manage"
  | "finance:manage"
  | "users:manage"
  | "contacts:manage"
  | "gallery:manage";

const rolePermissions: Record<RoleCode, readonly AdminPermission[]> = {
  SUPER_ADMIN: [
    "dashboard:read",
    "content:manage",
    "priest:manage",
    "halls:manage",
    "memberships:manage",
    "finance:manage",
    "users:manage",
    "contacts:manage",
    "gallery:manage",
  ],
  ADMIN: [
    "dashboard:read",
    "content:manage",
    "priest:manage",
    "halls:manage",
    "memberships:manage",
    "contacts:manage",
    "gallery:manage",
  ],
  CONTENT_EDITOR: ["dashboard:read", "content:manage", "gallery:manage"],
  FINANCE: ["dashboard:read", "memberships:manage", "finance:manage"],
};

export async function requireAdminPermission(permission: AdminPermission) {
  let session;

  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    redirect("/admin/sign-in");
  }

  if (!session) {
    redirect("/admin/sign-in");
  }

  let adminUser;

  try {
    adminUser = await prisma.adminUser.findUnique({
      where: { userId: session.user.id },
      include: { roles: { include: { role: true } } },
    });
  } catch {
    redirect("/admin/sign-in");
  }

  if (!adminUser?.active) {
    redirect("/admin/sign-in");
  }

  const hasPermission = adminUser.roles.some(({ role }) =>
    rolePermissions[role.code].includes(permission),
  );

  if (!hasPermission) {
    notFound();
  }

  return { session, adminUser };
}