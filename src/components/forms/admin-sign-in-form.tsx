"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export function AdminSignInForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submitSignIn(formData: FormData) {
    setPending(true);
    setMessage("");

    try {
      const result = await authClient.signIn.email({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      if (result.error) {
        setMessage("Sign-in was unsuccessful. Check your details or contact the site administrator.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setMessage("Sign-in is temporarily unavailable. Please try again later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="admin-auth-form"
      action={(formData) => void submitSignIn(formData)}
      autoComplete="on"
    >
      <div className="admin-form-field">
        <label htmlFor="admin-email">Administrator email</label>
        <input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} />
      </div>
      <div className="admin-form-field">
        <label htmlFor="admin-password">Password</label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {message && <p className="admin-form-message" role="alert">{message}</p>}
      <button className="admin-button admin-button-primary" type="submit" disabled={pending}>
        <KeyRound size={18} aria-hidden="true" />
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}