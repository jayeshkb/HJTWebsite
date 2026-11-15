"use server";

import { RoleCode } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";
import { z } from "zod";
import { hashAdminInviteToken, parseAdminInvitePayload } from "@/lib/auth/admin-invites";
import { prisma } from "@/lib/db/prisma";

export type AdminSetupState = {
  error?: string;
  complete?: boolean;
};

const setupSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  password: z.string().min(12).max(128),
  confirmation: z.string(),
});

export async function completeAdminSetup(_previousState: AdminSetupState, formData: FormData): Promise<AdminSetupState> {
  const parsed = setupSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });

  if (!parsed.success) return { error: "Use a password between 12 and 128 characters." };
  if (parsed.data.password !== parsed.data.confirmation) return { error: "The passwords do not match." };

  const identifier = `admin-invite:${hashAdminInviteToken(parsed.data.token)}`;
  let invite;
  try {
    invite = await prisma.verification.findFirst({
      where: { identifier, expiresAt: { gt: new Date() } },
    });
  } catch {
    return { error: "Account setup is temporarily unavailable." };
  }

  const payload = invite ? parseAdminInvitePayload(invite.value) : null;
  if (!invite || !payload) return { error: "This setup link is invalid, expired, or already used." };

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    await prisma.$transaction(async (transaction) => {
      const consumed = await transaction.verification.deleteMany({
        where: { id: invite.id, expiresAt: { gt: new Date() } },
      });
      if (consumed.count !== 1) throw new Error("INVITE_UNAVAILABLE");

      if (await transaction.user.findUnique({ where: { email: payload.email } })) {
        throw new Error("ACCOUNT_EXISTS");
      }

      const role = await transaction.role.findUnique({ where: { code: payload.role as RoleCode } });
      if (!role) throw new Error("ROLE_MISSING");

      const user = await transaction.user.create({
        data: { name: payload.name, email: payload.email },
      });

      await transaction.account.create({
        data: {
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: passwordHash,
        },
      });

      const adminUser = await transaction.adminUser.create({
        data: {
          userId: user.id,
          roles: { create: { roleId: role.id } },
        },
      });

      await transaction.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: "ADMIN_ACCOUNT_SETUP_COMPLETED",
          entityType: "AdminUser",
          entityId: adminUser.id,
          after: { email: payload.email, role: payload.role, invitedByAdminUserId: payload.invitedByAdminUserId },
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && ["INVITE_UNAVAILABLE", "ACCOUNT_EXISTS", "ROLE_MISSING"].includes(error.message)) {
      return { error: "This setup link is invalid, expired, or already used." };
    }
    return { error: "Account setup could not be completed. Please contact the site administrator." };
  }

  return { complete: true };
}