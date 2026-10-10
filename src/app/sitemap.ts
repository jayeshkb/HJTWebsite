import type { MetadataRoute } from "next";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const publicPaths = [
  "/",
  "/temple",
  "/temple/puja-havan-schedule",
  "/services",
  "/services/priest-request",
  "/events",
  "/membership",
  "/community-hall",
  "/vidya-mandir",
  "/gallery",
  "/contact",
  "/donate",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hindujaintemple.org";
  const pages: MetadataRoute.Sitemap = publicPaths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  try {
    const [events, albums] = await Promise.all([
      prisma.event.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
      prisma.galleryAlbum.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    pages.push(
      ...events.map((event) => ({
        url: new URL(`/events/${event.slug}`, siteUrl).toString(),
        lastModified: event.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...albums.map((album) => ({
        url: new URL(`/gallery/${album.slug}`, siteUrl).toString(),
        lastModified: album.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    );
  } catch {
    return pages;
  }

  return pages;
}