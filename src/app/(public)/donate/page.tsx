import type { Metadata } from "next";
import { InfoPage } from "@/components/public/info-page";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support the Hindu-Jain Temple and its community services.",
  alternates: { canonical: "/donate" },
};

export default function DonatePage() {
  return (
    <InfoPage
      eyebrow="Support the temple"
      title="Your generosity sustains community"
      introduction="Donations support temple activities, worship, cultural programs, and community services."
      actions={[{
        label: "Continue to the temple’s current donation form",
        href: "https://www.hindujaintemple.org/membership-donations/donation",
        external: true,
      }]}
      blocks={[
        {
          heading: "Make a donation",
          paragraphs: ["The current temple donation form accepts PayPal. Donation categories and payment details are shown on the official form."],
        },
        {
          heading: "Questions about giving",
          paragraphs: ["For donation questions or to arrange a manual payment, contact the temple office at (724) 325-2073 or office@hindujaintemple.org."],
        },
      ]}
    />
  );
}