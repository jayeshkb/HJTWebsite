import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { InfoPage } from "@/components/public/info-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the Hindu-Jain Temple in Monroeville, Pennsylvania.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Get in touch"
      title="Contact the temple"
      introduction="The temple office can help with worship schedules, priest services, membership, hall reservations, and community programs."
      actions={[
        {
          label: "Get directions",
          href: "https://www.google.com/maps/search/?api=1&query=615+Illini+Dr+Monroeville+PA+15146",
          external: true,
          secondary: true,
        },
      ]}
      blocks={[
        {
          heading: "Visit or call",
          paragraphs: [
            "615 Illini Dr, Monroeville, PA 15146",
            "Phone: (724) 325-2073",
            "Email: office@hindujaintemple.org",
            "Typical hours are 9 AM–8 PM; seasonal hours and special events may differ.",
          ],
        },
      ]}
    >
      <iframe
        className="contact-map"
        title="Map showing Hindu-Jain Temple in Monroeville, Pennsylvania"
        src="https://maps.google.com/maps?output=embed&q=615%20Illini%20Dr%2C%20Monroeville%2C%20PA%2015146"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <ContactForm />
    </InfoPage>
  );
}