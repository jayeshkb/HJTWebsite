"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

const adminNavigation = [
  { label: "Overview", href: "/admin" },
  { label: "Events", href: "/admin/events" },
  { label: "Announcements", href: "/admin/announcements" },
  { label: "Gallery", href: "/admin/gallery" },
];

export function AdminHeader({ administratorName, canManageFinance }: { administratorName: string; canManageFinance: boolean }) {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.replace("/admin/sign-in");
    router.refresh();
  }

  return (
    <header className="admin-header">
      <div className="admin-header-top">
        <Link className="admin-brand" href="/admin">Hindu-Jain Temple <span>Administration</span></Link>
        <div className="admin-account">
          <span>{administratorName}</span>
          <button className="admin-sign-out" type="button" onClick={signOut} aria-label="Sign out">
            <LogOut size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
      <nav className="admin-navigation" aria-label="Administration navigation">
        {adminNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        {canManageFinance && <Link href="/admin/payments">Payments</Link>}
      </nav>
    </header>
  );
}