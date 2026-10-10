import type { Metadata } from "next";
import Link from "next/link";
import { AdminSignInForm } from "@/components/forms/admin-sign-in-form";

export const metadata: Metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};

export default function AdminSignInPage() {
  return (
    <main className="admin-auth-page">
      <div className="admin-auth-wrap">
        <p className="admin-eyebrow">Hindu-Jain Temple</p>
        <h1>Administrator sign in</h1>
        <p className="admin-auth-description">Authorized administrators only.</p>
        <AdminSignInForm />
        <Link className="admin-public-link" href="/">Return to the temple website</Link>
      </div>
    </main>
  );
}