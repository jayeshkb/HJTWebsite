import type { Metadata } from "next";
import { EventCategory } from "@prisma/client";
import { EventListing } from "@/components/events/event-listing";
import { InfoPage } from "@/components/public/info-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Puja and Havan Schedule",
  description: "Published puja and Havan dates at the Hindu-Jain Temple in Monroeville.",
  alternates: { canonical: "/temple/puja-havan-schedule" },
};

export default function PujaHavanSchedulePage() {
  return (
    <InfoPage
      eyebrow="Worship schedule"
      title="Puja and Havan"
      introduction="View worship services and observances published by the temple. Special pujas are held on set schedules; please confirm details before travelling."
      actions={[{ label: "Contact the temple", href: "/contact", secondary: true }]}
    >
      <EventListing category={EventCategory.PUJA} />
    </InfoPage>
  );
}