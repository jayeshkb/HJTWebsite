import { ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const eventPreviewFields = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  startsAt: true,
} satisfies Prisma.EventSelect;

export async function getPublicHighlights() {
  const now = new Date();

  try {
    const [announcements, events] = await Promise.all([
      prisma.announcement.findMany({
        where: {
          active: true,
          publishAt: { lte: now },
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
        select: {
          id: true,
          title: true,
          message: true,
          priority: true,
          linkUrl: true,
        },
        orderBy: [{ priority: "desc" }, { publishAt: "desc" }],
        take: 3,
      }),
      prisma.event.findMany({
        where: { status: ContentStatus.PUBLISHED, startsAt: { gte: now } },
        select: eventPreviewFields,
        orderBy: { startsAt: "asc" },
        take: 3,
      }),
    ]);

    return { announcements, events };
  } catch {
    return null;
  }
}