"use server";

import { AnnouncementPriority } from "@prisma/client";
import { fromZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";

const localDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const announcementSchema = z.object({
  title: z.string().trim().min(3).max(160),
  message: z.string().trim().min(5).max(4000),
  linkUrl: z.string().trim().max(2048).optional(),
  publishAt: z.string().regex(localDateTimePattern),
  expiresAt: z.string().regex(localDateTimePattern).optional(),
  priority: z.enum(AnnouncementPriority),
  active: z.boolean(),
});

function isSafeLink(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function readCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function createAnnouncement(formData: FormData) {
  const { adminUser } = await requireAdminPermission("content:manage");
  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    message: formData.get("message"),
    linkUrl: formData.get("linkUrl") || undefined,
    publishAt: formData.get("publishAt"),
    expiresAt: formData.get("expiresAt") || undefined,
    priority: formData.get("priority"),
    active: readCheckbox(formData, "active"),
  });

  if (!parsed.success || (parsed.data.linkUrl && !isSafeLink(parsed.data.linkUrl))) {
    redirect("/admin/announcements?error=invalid-announcement");
  }

  const publishAt = fromZonedTime(parsed.data.publishAt, "America/New_York");
  const expiresAt = parsed.data.expiresAt
    ? fromZonedTime(parsed.data.expiresAt, "America/New_York")
    : null;

  if (Number.isNaN(publishAt.getTime()) || (expiresAt && (Number.isNaN(expiresAt.getTime()) || expiresAt <= publishAt))) {
    redirect("/admin/announcements?error=invalid-dates");
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const announcement = await transaction.announcement.create({
        data: {
          title: parsed.data.title,
          message: parsed.data.message,
          linkUrl: parsed.data.linkUrl || null,
          publishAt,
          expiresAt,
          priority: parsed.data.priority,
          active: parsed.data.active,
        },
      });

      await transaction.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: parsed.data.active ? "ANNOUNCEMENT_PUBLISHED" : "ANNOUNCEMENT_CREATED",
          entityType: "Announcement",
          entityId: announcement.id,
          after: { title: announcement.title, active: announcement.active },
        },
      });
    });
  } catch {
    redirect("/admin/announcements?error=save-failed");
  }

  revalidatePath("/");
  redirect("/admin/announcements?saved=1");
}

const announcementStatusSchema = z.object({
  announcementId: z.string().min(1),
  active: z.enum(["true", "false"]),
});

export async function updateAnnouncementStatus(formData: FormData) {
  const { adminUser } = await requireAdminPermission("content:manage");
  const parsed = announcementStatusSchema.safeParse({
    announcementId: formData.get("announcementId"),
    active: formData.get("active"),
  });

  if (!parsed.success) redirect("/admin/announcements?error=invalid-announcement");

  const active = parsed.data.active === "true";

  try {
    await prisma.$transaction(async (transaction) => {
      const before = await transaction.announcement.findUniqueOrThrow({ where: { id: parsed.data.announcementId } });
      const announcement = await transaction.announcement.update({
        where: { id: before.id },
        data: { active },
      });

      await transaction.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: active ? "ANNOUNCEMENT_PUBLISHED" : "ANNOUNCEMENT_UNPUBLISHED",
          entityType: "Announcement",
          entityId: announcement.id,
          before: { active: before.active },
          after: { active: announcement.active },
        },
      });
    });
  } catch {
    redirect("/admin/announcements?error=update-failed");
  }

  revalidatePath("/");
  redirect("/admin/announcements?saved=1");
}