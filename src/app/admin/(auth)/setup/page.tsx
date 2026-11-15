import type { Metadata } from "next";
import { AdminSetupForm } from "@/components/forms/admin-setup-form";
import { hashAdminInviteToken, parseAdminInvitePayload } from "@/lib/auth/admin-invites";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Set up administrator access",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function AdminSetupPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const { token } = await searchParams;
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return <SetupUnavailable />;
  }

  let payload = null;
  try {
    const invite = await prisma.verification.findFirst({
      where: {
        identifier: `admin-invite:${hashAdminInviteToken(token)}`,
        expiresAt: { gt: new Date() },
      },
    });
    payload = invite ? parseAdminInvitePayload(invite.value) : null;
  } catch {}

  if (!payload) return <SetupUnavailable />;

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-wrap">
        <p className="admin-eyebrow">Hindu-Jain Temple</p>
        <h1>Set up administrator access</h1>
        <p className="admin-auth-description">Create a password for your invited account.</p>
        <AdminSetupForm token={token} email={payload.email} />
      </div>
    </main>
  );
}

function SetupUnavailable() {
  return (
    <main className="admin-auth-page">
      <div className="admin-auth-wrap">
        <p className="admin-eyebrow">Hindu-Jain Temple</p>
        <h1>Setup link unavailable</h1>
        <p className="admin-auth-description">This link is invalid, expired, or already used. Ask an administrator for a new invitation.</p>
      </div>
    </main>
  );
}