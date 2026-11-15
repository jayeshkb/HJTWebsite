"use client";

import Link from "next/link";
import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { completeAdminSetup, type AdminSetupState } from "@/app/admin/(auth)/setup/actions";

const initialState: AdminSetupState = {};

export function AdminSetupForm({ token, email }: { token: string; email: string }) {
  const [state, formAction, pending] = useActionState(completeAdminSetup, initialState);

  if (state.complete) {
    return (
      <>
        <p className="admin-feedback">Your administrator account is ready.</p>
        <Link className="admin-button admin-button-primary" href="/admin/sign-in">Continue to sign in</Link>
      </>
    );
  }

  return (
    <form className="admin-auth-form" action={formAction}>
      <input type="hidden" name="token" value={token} />
      <p className="admin-setup-details">Setting up access for <strong>{email}</strong></p>
      <div className="admin-form-field">
        <label htmlFor="setup-password">Create password</label>
        <input id="setup-password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
        <span className="admin-auth-hint">Use 12 to 128 characters.</span>
      </div>
      <div className="admin-form-field">
        <label htmlFor="setup-confirmation">Confirm password</label>
        <input id="setup-confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
      </div>
      {state.error && <p className="admin-form-message" role="alert">{state.error}</p>}
      <button className="admin-button admin-button-primary" type="submit" disabled={pending}>
        <KeyRound size={18} aria-hidden="true" />
        {pending ? "Setting up account…" : "Set up account"}
      </button>
    </form>
  );
}