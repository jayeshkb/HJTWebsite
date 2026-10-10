import { ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const publicAlbumFields = {
  id: true,
  title: true,
  slug: true,
  description: true,
  eventDate: true,
  images: {
    select: {
      id: true,
      imageUrl: true,
      caption: true,
      altText: true,
      displayOrder: true,
    },
    orderBy: { displayOrder: "asc" },
  },
} satisfies Prisma.GalleryAlbumSelect;

export type PublicAlbum = Prisma.GalleryAlbumGetPayload<{ select: typeof publicAlbumFields }>;

export async function getPublishedAlbums(): Promise<PublicAlbum[] | null> {
  try {
    return await prisma.galleryAlbum.findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: publicAlbumFields,
      orderBy: [{ eventDate: "desc" }, { title: "asc" }],
    });
  } catch {
    return null;
  }
}

export async function getPublishedAlbum(slug: string) {
  try {
    const album = await prisma.galleryAlbum.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      select: publicAlbumFields,
    });
    return { album, unavailable: false };
  } catch {
    return { album: null, unavailable: true };
  }
}