import type { Metadata } from "next";
import { AdminTwoFactorForm } from "@/components/forms/admin-two-factor-form";

export const metadata: Metadata = {
  title: "Verify administrator sign in",
  robots: { index: false, follow: false },
};

export default function AdminTwoFactorPage() {
  return (
    <main className="admin-auth-page">
      <div className="admin-auth-wrap">
        <p className="admin-eyebrow">Hindu-Jain Temple</p>
        <h1>Verify your sign in</h1>
        <p className="admin-auth-description">Use the authentication code from your registered device.</p>
        <AdminTwoFactorForm />
      </div>
    </main>
  );
}