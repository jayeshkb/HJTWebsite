import type { Metadata } from "next";
import { EventListing } from "@/components/events/event-listing";
import { InfoPage } from "@/components/public/info-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past Hindu-Jain Temple events in Monroeville, Pennsylvania.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <InfoPage
      eyebrow="Temple calendar"
      title="Events and gatherings"
      introduction="Join the community for worship, festivals, cultural programs, and learning. Event details are published by the temple."
    >
      <EventListing />
    </InfoPage>
  );
}