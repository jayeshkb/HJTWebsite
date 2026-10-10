import {
  AnnouncementPriority,
  EventCategory,
  PrismaClient,
  RoleCode,
} from "@prisma/client";

const prisma = new PrismaClient();

const roleRecords = [
  { code: RoleCode.SUPER_ADMIN, name: "Super administrator" },
  { code: RoleCode.ADMIN, name: "Administrator" },
  { code: RoleCode.CONTENT_EDITOR, name: "Content editor" },
  { code: RoleCode.FINANCE, name: "Finance" },
];

function dayOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(11, 0, 0, 0);
  return date;
}

async function seedDemoContent() {
  const eventRecords = [
    { slug: "demo-diwali-gathering", title: "DEMO: Diwali community gathering", days: 14, category: EventCategory.FESTIVAL },
    { slug: "demo-monthly-havan", title: "DEMO: Monthly Havan", days: 30, category: EventCategory.PUJA },
    { slug: "demo-cultural-program", title: "DEMO: Cultural program", days: 45, category: EventCategory.CULTURAL },
    { slug: "demo-spring-puja", title: "DEMO: Spring Puja", days: -14, category: EventCategory.PUJA },
    { slug: "demo-community-festival", title: "DEMO: Community festival", days: -35, category: EventCategory.FESTIVAL },
    { slug: "demo-vidya-celebration", title: "DEMO: Vidya Mandir celebration", days: -60, category: EventCategory.EDUCATION },
  ];

  for (const event of eventRecords) {
    const startsAt = dayOffset(event.days);
    const endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000);
    const data = {
      title: event.title,
      shortDescription: "DEMO CONTENT: Replace with a temple-approved event description.",
      fullDescription: "This is development seed data and must not be presented as a real temple event.",
      startsAt,
      endsAt,
      location: "DEMO: Hindu-Jain Temple",
      category: event.category,
      featured: false,
      status: "PUBLISHED" as const,
    };

    await prisma.event.upsert({
      where: { slug: event.slug },
      update: data,
      create: { slug: event.slug, ...data },
    });
  }

  await prisma.announcement.upsert({
    where: { id: "demo-announcement-hours" },
    update: {
      title: "DEMO: Check seasonal hours",
      message: "DEMO CONTENT: Replace with a verified temple announcement.",
      publishAt: dayOffset(-1),
      expiresAt: dayOffset(14),
      priority: AnnouncementPriority.NORMAL,
      active: true,
    },
    create: {
      id: "demo-announcement-hours",
      title: "DEMO: Check seasonal hours",
      message: "DEMO CONTENT: Replace with a verified temple announcement.",
      publishAt: dayOffset(-1),
      expiresAt: dayOffset(14),
      priority: AnnouncementPriority.NORMAL,
      active: true,
    },
  });

  const hallRecords = [
    { id: "demo-hall-a", name: "DEMO: Community Hall A", capacity: 150 },
    { id: "demo-hall-b", name: "DEMO: Community Hall B", capacity: 75 },
  ];

  for (const hall of hallRecords) {
    const description = "DEMO CONTENT: Replace with approved facility details and rental rules.";
    await prisma.hall.upsert({
      where: { id: hall.id },
      update: { ...hall, description, active: true },
      create: {
        ...hall,
        description,
        active: true,
        amenities: {
          create: [{ name: "DEMO: Tables and chairs" }, { name: "DEMO: Kitchen access" }],
        },
      },
    });
  }

  const serviceTypes = ["DEMO: Puja", "DEMO: Havan", "DEMO: Special occasion"];
  for (const [index, name] of serviceTypes.entries()) {
    await prisma.priestServiceType.upsert({
      where: { id: `demo-priest-service-${index + 1}` },
      update: { name, description: "DEMO CONTENT: Replace with approved service information.", active: true },
      create: {
        id: `demo-priest-service-${index + 1}`,
        name,
        description: "DEMO CONTENT: Replace with approved service information.",
        active: true,
      },
    });
  }

  const membershipNames = ["Membership", "Trustees", "Life Membership", "Life Trustees"];
  for (const [index, name] of membershipNames.entries()) {
    await prisma.membershipType.upsert({
      where: { id: `demo-membership-${index + 1}` },
      update: { name: `DEMO: ${name}`, description: "DEMO CONTENT: Add approved eligibility and benefits.", active: true },
      create: {
        id: `demo-membership-${index + 1}`,
        name: `DEMO: ${name}`,
        description: "DEMO CONTENT: Add approved eligibility and benefits.",
        active: true,
      },
    });
  }

  const fundNames = ["General donation", "Temple improvement", "Community services"];
  for (const [index, name] of fundNames.entries()) {
    await prisma.donationFund.upsert({
      where: { id: `demo-donation-fund-${index + 1}` },
      update: { name: `DEMO: ${name}`, description: "DEMO CONTENT: Replace with an approved fund description.", active: true },
      create: {
        id: `demo-donation-fund-${index + 1}`,
        name: `DEMO: ${name}`,
        description: "DEMO CONTENT: Replace with an approved fund description.",
        active: true,
      },
    });
  }

  const albumRecords = [
    { id: "demo-gallery-diwali", slug: "demo-diwali", title: "DEMO: Diwali celebration" },
    { id: "demo-gallery-vidya", slug: "demo-vidya-mandir", title: "DEMO: Vidya Mandir" },
  ];

  for (const album of albumRecords) {
    await prisma.galleryAlbum.upsert({
      where: { slug: album.slug },
      update: {
        title: album.title,
        description: "DEMO CONTENT: Add reviewed, rights-cleared images and captions.",
        status: "DRAFT",
      },
      create: {
        ...album,
        description: "DEMO CONTENT: Add reviewed, rights-cleared images and captions.",
        status: "DRAFT",
      },
    });
  }
}

async function main() {
  for (const role of roleRecords) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name },
      create: role,
    });
  }

  if (process.env.NODE_ENV !== "development" || process.env.ALLOW_DEMO_SEED !== "true") {
    console.info("Role records are ready. Demo content was skipped.");
    return;
  }

  await seedDemoContent();
  console.info("DEMO seed data created for development only.");
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });