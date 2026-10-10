import type { Metadata } from "next";
import { InfoPage } from "@/components/public/info-page";

export const metadata: Metadata = {
  title: "Community Hall",
  description: "Learn about community hall reservations at the Hindu-Jain Temple.",
  alternates: { canonical: "/community-hall" },
};

export default function CommunityHallPage() {
  return (
    <InfoPage
      eyebrow="Gather together"
      title="Community hall reservations"
      introduction="The temple has two separate halls for community gatherings and events. The temple team reviews every reservation request before confirming availability."
      actions={[
        { label: "Ask about hall availability", href: "mailto:office@hindujaintemple.org" },
        { label: "Call the temple office", href: "tel:+17243252073", secondary: true },
      ]}
      blocks={[
        {
          heading: "Request and approval",
          paragraphs: [
            "A reservation request is not a confirmed booking. Temple administrators review each request and contact the organizer about availability, current pricing, and applicable rules.",
            "Pricing, rental terms, and setup arrangements can change. The temple office will provide the current details before a request is approved.",
          ],
        },
        {
          heading: "Plan with the temple",
          paragraphs: ["When contacting the office, include your preferred date and times, event type, expected attendance, and any setup needs."],
        },
      ]}
    />
  );
}