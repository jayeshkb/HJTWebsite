"use server";

import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100, "Name is too long."),
  email: z.email("Enter a valid email address.").max(254, "Email address is too long."),
  phone: z.string().trim().max(32, "Phone number is too long.").optional(),
  message: z.string().trim().min(10, "Please add a little more detail.").max(4000, "Message is too long."),
});

type ContactField = "name" | "email" | "phone" | "message";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<ContactField, string[]>>;
};

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honeypot = formData.get("companyWebsite");
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return { status: "success", message: "Your message has been received." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
      },
    });
  } catch {
    return {
      status: "error",
      message: "Your message could not be sent right now. Please call or email the temple office.",
    };
  }

  return {
    status: "success",
    message: "Your message has been received. The temple office will follow up.",
  };
}