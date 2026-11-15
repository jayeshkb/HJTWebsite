import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";

export const adminInviteRoleSchema = z.enum(["ADMIN", "CONTENT_EDITOR", "FINANCE"]);

export const adminInvitePayloadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(254),
  role: adminInviteRoleSchema,
  invitedByAdminUserId: z.string().min(1),
});

export type AdminInvitePayload = z.infer<typeof adminInvitePayloadSchema>;

export function createAdminInviteToken() {
  return randomBytes(32).toString("base64url");
}

export function hashAdminInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function parseAdminInvitePayload(value: string): AdminInvitePayload | null {
  try {
    const result = adminInvitePayloadSchema.safeParse(JSON.parse(value));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}