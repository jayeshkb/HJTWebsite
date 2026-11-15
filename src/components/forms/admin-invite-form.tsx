"use client";

import { useActionState, useState } from "react";
import { Copy, UserPlus } from "lucide-react";
import { createAdminInvite, type AdminInviteState } from "@/app/admin/(portal)/users/actions";

const initialState: AdminInviteState = {};

export function AdminInviteForm() {
  const [state, formAction, pending] = useActionState(createAdminInvite, initialState);
  const [copied, setCopied] = useState(false);

  async function copyInviteLink() {
    if (!state.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(state.inviteUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="admin-module">
      <div className="admin-module-heading">
        <h2>Invite an administrator</h2>
        <span>Setup links expire after 24 hours</span>
      </div>
      <div className="admin-module-body">
        <form className="admin-auth-form" action={formAction}>
          <div className="admin-form-field">
            <label htmlFor="invite-name">Name</label>
            <input id="invite-name" name="name" autoComplete="name" minLength={2} maxLength={120} required />
          </div>
          <div className="admin-form-field">
            <label htmlFor="invite-email">Email</label>
            <input id="invite-email" name="email" type="email" autoComplete="email" maxLength={254} required />
          </div>
          <div className="admin-form-field">
            <label htmlFor="invite-role">Role</label>
            <select id="invite-role" name="role" defaultValue="ADMIN">
              <option value="ADMIN">Administrator</option>
              <option value="CONTENT_EDITOR">Content editor</option>
              <option value="FINANCE">Finance</option>
            </select>
          </div>
          {state.error && <p className="admin-form-message" role="alert">{state.error}</p>}
          <button className="admin-button admin-button-primary" type="submit" disabled={pending}>
            <UserPlus size={18} aria-hidden="true" />
            {pending ? "Creating link…" : "Create setup link"}
          </button>
        </form>
        {state.inviteUrl && (
          <div className="admin-invite-result" aria-live="polite">
            <p className="admin-form-message is-success">Setup link for {state.invitedEmail}</p>
            <div className="admin-copy-row">
              <input aria-label="One-time administrator setup link" readOnly value={state.inviteUrl} onFocus={(event) => event.currentTarget.select()} />
              <button className="admin-button admin-button-primary" type="button" onClick={() => void copyInviteLink()}>
                <Copy size={17} aria-hidden="true" />
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}