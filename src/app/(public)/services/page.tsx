import type { Metadata } from "next";
import { InfoPage } from "@/components/public/info-page";

export const metadata: Metadata = {
  title: "Services",
  description: "Temple worship schedules, priest services, and community support.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <InfoPage
      eyebrow="Temple services"
      title="Worship and community services"
      introduction="Find worship schedules and request information for temple services. Each request is coordinated by the temple team."
      blocks={[
        {
          heading: "Puja and Havan",
          paragraphs: ["View published worship dates and observances. Special pujas are held on set schedules."],
        },
        {
          heading: "Priest service requests",
          paragraphs: ["The temple office coordinates each request directly. Submitting a request does not confirm priest availability."],
        },
        {
          heading: "Community support",
          paragraphs: ["For questions about services, please contact the temple office by phone or email."],
        },
      ]}
      actions={[
        { label: "Puja and Havan schedule", href: "/temple/puja-havan-schedule" },
        { label: "Request a priest", href: "/services/priest-request", secondary: true },
      ]}
    />
  );
}