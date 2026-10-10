import { ContentStatus, EventCategory, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

const publicEventFields = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  fullDescription: true,
  startsAt: true,
  endsAt: true,
  location: true,
  featuredImageUrl: true,
  category: true,
  registrationUrl: true,
  registrationRequired: true,
} satisfies Prisma.EventSelect;

export type PublicEvent = Prisma.EventGetPayload<{ select: typeof publicEventFields }>;

type PublicEventsResult = {
  upcoming: PublicEvent[];
  past: PublicEvent[];
};

export async function getPublicEvents(category?: EventCategory): Promise<PublicEventsResult | null> {
  const now = new Date();
  const where = {
    status: ContentStatus.PUBLISHED,
    ...(category ? { category } : {}),
  };

  try {
    const [upcoming, past] = await Promise.all([
      prisma.event.findMany({
        where: { ...where, startsAt: { gte: now } },
        select: publicEventFields,
        orderBy: { startsAt: "asc" },
        take: 12,
      }),
      prisma.event.findMany({
        where: { ...where, startsAt: { lt: now } },
        select: publicEventFields,
        orderBy: { startsAt: "desc" },
        take: 6,
      }),
    ]);

    return { upcoming, past };
  } catch {
    return null;
  }
}

export async function getPublicEvent(slug: string) {
  try {
    const event = await prisma.event.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      select: publicEventFields,
    });
    return { event, unavailable: false };
  } catch {
    return { event: null, unavailable: true };
  }
}