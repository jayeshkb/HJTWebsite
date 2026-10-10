"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export function AdminTwoFactorForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submitCode(formData: FormData) {
    setPending(true);
    setMessage("");

    try {
      const result = await authClient.twoFactor.verifyTotp({
        code: String(formData.get("code") ?? "").replace(/\s/g, ""),
      });

      if (result.error) {
        setMessage("That verification code was not accepted. Try again or use a backup code.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setMessage("Verification is temporarily unavailable. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="admin-auth-form" action={(formData) => void submitCode(formData)}>
      <div className="admin-form-field">
        <label htmlFor="admin-totp-code">Authentication code</label>
        <input
          id="admin-totp-code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,8}"
          required
          maxLength={8}
          aria-describedby="totp-hint"
        />
        <span className="admin-auth-hint" id="totp-hint">Enter the current code from your authenticator app.</span>
      </div>
      {message && <p className="admin-form-message" role="alert">{message}</p>}
      <button className="admin-button admin-button-primary" type="submit" disabled={pending}>
        <ShieldCheck size={18} aria-hidden="true" />
        {pending ? "Verifying…" : "Verify code"}
      </button>
    </form>
  );
}