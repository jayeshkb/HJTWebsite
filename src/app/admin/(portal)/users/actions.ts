"use server";

import { RoleCode } from "@prisma/client";
import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { createAdminInviteToken, hashAdminInviteToken } from "@/lib/auth/admin-invites";
import { prisma } from "@/lib/db/prisma";

export type AdminInviteState = {
  error?: string;
  inviteUrl?: string;
  invitedEmail?: string;
};

const inviteRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().toLowerCase().max(254),
  role: z.enum([RoleCode.ADMIN, RoleCode.CONTENT_EDITOR, RoleCode.FINANCE]),
});

function getSiteOrigin() {
  const configuredUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && url.hostname === "localhost")) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

export async function createAdminInvite(_previousState: AdminInviteState, formData: FormData): Promise<AdminInviteState> {
  const { adminUser } = await requireAdminPermission("users:manage");
  const parsed = inviteRequestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) return { error: "Enter a valid name, email, and role." };

  const siteOrigin = getSiteOrigin();
  if (!siteOrigin) return { error: "Set BETTER_AUTH_URL to the site's HTTPS address before creating invites." };

  const token = createAdminInviteToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    await prisma.$transaction(async (transaction) => {
      if (await transaction.user.findUnique({ where: { email: parsed.data.email } })) {
        throw new Error("USER_EXISTS");
      }

      const invite = await transaction.verification.create({
        data: {
          identifier: `admin-invite:${hashAdminInviteToken(token)}`,
          value: JSON.stringify({
            ...parsed.data,
            invitedByAdminUserId: adminUser.id,
          }),
          expiresAt,
        },
      });

      await transaction.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: "ADMIN_INVITE_CREATED",
          entityType: "AdminInvite",
          entityId: invite.id,
          after: { email: parsed.data.email, role: parsed.data.role, expiresAt: expiresAt.toISOString() },
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_EXISTS") {
      return { error: "An account already uses that email address." };
    }
    return { error: "The invitation could not be created. Please try again." };
  }

  const inviteUrl = new URL("/admin/setup", siteOrigin);
  inviteUrl.searchParams.set("token", token);
  return { inviteUrl: inviteUrl.toString(), invitedEmail: parsed.data.email };
}