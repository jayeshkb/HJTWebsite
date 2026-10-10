"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/app/(public)/contact/actions";

const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );

  return (
    <form className="contact-form" action={formAction}>
      <h2>Send a message</h2>
      <p className="contact-form-intro">The temple office will follow up using the contact information you provide.</p>

      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="companyWebsite">Leave this field blank</label>
        <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            aria-invalid={Boolean(state.fieldErrors?.name?.length)}
            aria-describedby={state.fieldErrors?.name?.length ? "contact-name-error" : undefined}
          />
          {state.fieldErrors?.name?.[0] && <span className="field-error" id="contact-name-error">{state.fieldErrors.name[0]}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="contact-email">Email <span aria-hidden="true">*</span></label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            aria-invalid={Boolean(state.fieldErrors?.email?.length)}
            aria-describedby={state.fieldErrors?.email?.length ? "contact-email-error" : undefined}
          />
          {state.fieldErrors?.email?.[0] && <span className="field-error" id="contact-email-error">{state.fieldErrors.email[0]}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="contact-phone">Phone</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={32}
            aria-invalid={Boolean(state.fieldErrors?.phone?.length)}
            aria-describedby={state.fieldErrors?.phone?.length ? "contact-phone-error" : undefined}
          />
          {state.fieldErrors?.phone?.[0] && <span className="field-error" id="contact-phone-error">{state.fieldErrors.phone[0]}</span>}
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="contact-message">Message <span aria-hidden="true">*</span></label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            minLength={10}
            maxLength={4000}
            aria-invalid={Boolean(state.fieldErrors?.message?.length)}
            aria-describedby={state.fieldErrors?.message?.length ? "contact-message-error" : undefined}
          />
          {state.fieldErrors?.message?.[0] && <span className="field-error" id="contact-message-error">{state.fieldErrors.message[0]}</span>}
        </div>
      </div>

      {state.message && (
        <p className={`form-feedback ${state.status === "error" ? "is-error" : "is-success"}`} role={state.status === "error" ? "alert" : "status"}>
          {state.message}
        </p>
      )}

      <button className="button button-maroon contact-submit" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
        {!pending && <ArrowRight size={18} aria-hidden="true" />}
      </button>
    </form>
  );
}