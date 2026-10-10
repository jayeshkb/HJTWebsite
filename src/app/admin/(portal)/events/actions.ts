"use server";

import { ContentStatus, EventCategory } from "@prisma/client";
import { fromZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireAdminPermission } from "@/lib/auth/permissions";

const localDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const eventSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().max(180).optional(),
  shortDescription: z.string().trim().min(5).max(500),
  fullDescription: z.string().trim().max(20000).optional(),
  startsAt: z.string().regex(localDateTimePattern),
  endsAt: z.string().regex(localDateTimePattern).optional(),
  location: z.string().trim().max(240).optional(),
  category: z.enum(EventCategory),
  registrationUrl: z.union([z.url(), z.literal("")]).optional(),
  registrationRequired: z.boolean(),
  featured: z.boolean(),
  publishNow: z.boolean(),
});

function createEventSlug(title: string) {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function readCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function createEvent(formData: FormData) {
  const { adminUser } = await requireAdminPermission("content:manage");
  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    shortDescription: formData.get("shortDescription"),
    fullDescription: formData.get("fullDescription") || undefined,
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    location: formData.get("location") || undefined,
    category: formData.get("category"),
    registrationUrl: formData.get("registrationUrl") || undefined,
    registrationRequired: readCheckbox(formData, "registrationRequired"),
    featured: readCheckbox(formData, "featured"),
    publishNow: readCheckbox(formData, "publishNow"),
  });

  if (!parsed.success) {
    redirect("/admin/events?error=invalid-event");
  }

  const slug = parsed.data.slug || createEventSlug(parsed.data.title);
  if (!slug) {
    redirect("/admin/events?error=invalid-slug");
  }

  const startsAt = fromZonedTime(parsed.data.startsAt, "America/New_York");
  const endsAt = parsed.data.endsAt ? fromZonedTime(parsed.data.endsAt, "America/New_York") : null;
  if (Number.isNaN(startsAt.getTime()) || (endsAt && (Number.isNaN(endsAt.getTime()) || endsAt <= startsAt))) {
    redirect("/admin/events?error=invalid-dates");
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const event = await transaction.event.create({
        data: {
          title: parsed.data.title,
          slug,
          shortDescription: parsed.data.shortDescription,
          fullDescription: parsed.data.fullDescription || null,
          startsAt,
          endsAt,
          location: parsed.data.location || null,
          category: parsed.data.category,
          registrationUrl: parsed.data.registrationUrl || null,
          registrationRequired: parsed.data.registrationRequired,
          featured: parsed.data.featured,
          status: parsed.data.publishNow ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
        },
      });

      await transaction.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: parsed.data.publishNow ? "EVENT_PUBLISHED" : "EVENT_CREATED",
          entityType: "Event",
          entityId: event.id,
          after: { title: event.title, slug: event.slug, status: event.status },
        },
      });
    });
  } catch {
    redirect("/admin/events?error=event-save-failed");
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/temple/puja-havan-schedule");
  revalidatePath("/sitemap.xml");
  redirect("/admin/events?saved=1");
}

const eventStatusSchema = z.object({
  eventId: z.string().min(1),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED]),
});

export async function updateEventStatus(formData: FormData) {
  const { adminUser } = await requireAdminPermission("content:manage");
  const parsed = eventStatusSchema.safeParse({
    eventId: formData.get("eventId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect("/admin/events?error=invalid-event");
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const before = await transaction.event.findUniqueOrThrow({ where: { id: parsed.data.eventId } });
      const event = await transaction.event.update({
        where: { id: before.id },
        data: { status: parsed.data.status },
      });
      await transaction.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: parsed.data.status === ContentStatus.PUBLISHED ? "EVENT_PUBLISHED" : "EVENT_UNPUBLISHED",
          entityType: "Event",
          entityId: event.id,
          before: { status: before.status },
          after: { status: event.status },
        },
      });
    });
  } catch {
    redirect("/admin/events?error=event-update-failed");
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/sitemap.xml");
  redirect("/admin/events?saved=1");
}