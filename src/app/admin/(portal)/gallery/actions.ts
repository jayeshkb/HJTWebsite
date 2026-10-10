"use server";

import { ContentStatus, Prisma } from "@prisma/client";
import { fromZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";

const localDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function createSlug(title: string) {
  return title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isAllowedImageUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && (
      (url.hostname === "www.hindujaintemple.org" && url.pathname.startsWith("/images/"))
      || url.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

const albumSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().max(180).optional(),
  description: z.string().trim().max(4000).optional(),
  eventDate: z.string().regex(localDatePattern).optional(),
  imageUrl: z.string().trim().max(2048).optional(),
  altText: z.string().trim().max(300).optional(),
  caption: z.string().trim().max(500).optional(),
  publishNow: z.boolean(),
});

function readCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function revalidateGallery(slug?: string) {
  revalidatePath("/gallery");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/gallery/${slug}`);
}

export async function createAlbum(formData: FormData) {
  const { adminUser } = await requireAdminPermission("gallery:manage");
  const parsed = albumSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    eventDate: formData.get("eventDate") || undefined,
    imageUrl: formData.get("imageUrl") || undefined,
    altText: formData.get("altText") || undefined,
    caption: formData.get("caption") || undefined,
    publishNow: readCheckbox(formData, "publishNow"),
  });

  if (!parsed.success) redirect("/admin/gallery?error=invalid-album");
  if (parsed.data.imageUrl && (!isAllowedImageUrl(parsed.data.imageUrl) || !parsed.data.altText)) {
    redirect("/admin/gallery?error=invalid-image");
  }

  const slug = parsed.data.slug || createSlug(parsed.data.title);
  if (!slug) redirect("/admin/gallery?error=invalid-slug");

  const eventDate = parsed.data.eventDate
    ? fromZonedTime(`${parsed.data.eventDate}T12:00`, "America/New_York")
    : null;

  try {
    await prisma.$transaction(async (transaction) => {
      const album = await transaction.galleryAlbum.create({
        data: {
          title: parsed.data.title,
          slug,
          description: parsed.data.description || null,
          eventDate,
          coverImageUrl: parsed.data.imageUrl || null,
          status: parsed.data.publishNow ? ContentStatus.PUBLISHED : ContentStatus.DRAFT,
          ...(parsed.data.imageUrl && parsed.data.altText ? {
            images: {
              create: {
                imageUrl: parsed.data.imageUrl,
                altText: parsed.data.altText,
                caption: parsed.data.caption || null,
              },
            },
          } : {}),
        },
      });

      await transaction.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: parsed.data.publishNow ? "GALLERY_ALBUM_PUBLISHED" : "GALLERY_ALBUM_CREATED",
          entityType: "GalleryAlbum",
          entityId: album.id,
          after: { title: album.title, slug: album.slug, status: album.status },
        },
      });
    });
  } catch (error) {
    const duplicateSlug = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
    redirect(duplicateSlug ? "/admin/gallery?error=duplicate-slug" : "/admin/gallery?error=save-failed");
  }

  revalidateGallery(slug);
  redirect("/admin/gallery?saved=1");
}

const imageSchema = z.object({
  albumId: z.string().min(1),
  imageUrl: z.string().trim().min(1).max(2048),
  altText: z.string().trim().min(3).max(300),
  caption: z.string().trim().max(500).optional(),
});

export async function addAlbumImage(formData: FormData) {
  const { adminUser } = await requireAdminPermission("gallery:manage");
  const parsed = imageSchema.safeParse({
    albumId: formData.get("albumId"),
    imageUrl: formData.get("imageUrl"),
    altText: formData.get("altText"),
    caption: formData.get("caption") || undefined,
  });

  if (!parsed.success || !isAllowedImageUrl(parsed.data.imageUrl)) {
    redirect("/admin/gallery?error=invalid-image");
  }

  let slug: string;
  try {
    slug = await prisma.$transaction(async (transaction) => {
      const album = await transaction.galleryAlbum.findUniqueOrThrow({ where: { id: parsed.data.albumId } });
      const imageCount = await transaction.galleryImage.count({ where: { albumId: album.id } });
      await transaction.galleryImage.create({
        data: {
          albumId: album.id,
          imageUrl: parsed.data.imageUrl,
          altText: parsed.data.altText,
          caption: parsed.data.caption || null,
          displayOrder: imageCount,
        },
      });
      if (!album.coverImageUrl) {
        await transaction.galleryAlbum.update({ where: { id: album.id }, data: { coverImageUrl: parsed.data.imageUrl } });
      }
      await transaction.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: "GALLERY_IMAGE_ADDED",
          entityType: "GalleryAlbum",
          entityId: album.id,
          after: { imageUrl: parsed.data.imageUrl },
        },
      });
      return album.slug;
    });
  } catch {
    redirect("/admin/gallery?error=image-save-failed");
  }

  revalidateGallery(slug);
  redirect("/admin/gallery?saved=1");
}

const albumStatusSchema = z.object({
  albumId: z.string().min(1),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED]),
});

export async function updateAlbumStatus(formData: FormData) {
  const { adminUser } = await requireAdminPermission("gallery:manage");
  const parsed = albumStatusSchema.safeParse({
    albumId: formData.get("albumId"),
    status: formData.get("status"),
  });

  if (!parsed.success) redirect("/admin/gallery?error=invalid-album");

  let slug: string;
  try {
    slug = await prisma.$transaction(async (transaction) => {
      const before = await transaction.galleryAlbum.findUniqueOrThrow({ where: { id: parsed.data.albumId } });
      const album = await transaction.galleryAlbum.update({ where: { id: before.id }, data: { status: parsed.data.status } });
      await transaction.auditLog.create({
        data: {
          adminUserId: adminUser.id,
          action: parsed.data.status === ContentStatus.PUBLISHED ? "GALLERY_ALBUM_PUBLISHED" : "GALLERY_ALBUM_UNPUBLISHED",
          entityType: "GalleryAlbum",
          entityId: album.id,
          before: { status: before.status },
          after: { status: album.status },
        },
      });
      return album.slug;
    });
  } catch {
    redirect("/admin/gallery?error=update-failed");
  }

  revalidateGallery(slug);
  redirect("/admin/gallery?saved=1");
}