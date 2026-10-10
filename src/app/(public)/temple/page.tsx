import type { Metadata } from "next";
import { InfoPage } from "@/components/public/info-page";

export const metadata: Metadata = {
  title: "Temple",
  description: "Visit the Hindu-Jain Temple, a shared home for worship in Monroeville, Pennsylvania.",
  alternates: { canonical: "/temple" },
};

export default function TemplePage() {
  return (
    <InfoPage
      eyebrow="Our temple"
      title="A shared spiritual home"
      introduction="The Hindu-Jain Temple in Monroeville is the world’s first unified Hindu–Jain temple, bringing the community together for worship, cultural programs, and service."
      actions={[{ label: "Puja and Havan schedule", href: "/temple/puja-havan-schedule" }]}
      blocks={[
        {
          heading: "Plan your visit",
          paragraphs: [
            "The temple is located at 615 Illini Dr, Monroeville, PA 15146. Hours are typically 9 AM–8 PM and may vary by season or special program.",
            "For current hours and worship times, please check the published schedule or contact the temple office before travelling.",
          ],
        },
        {
          heading: "Worship and community",
          paragraphs: [
            "The temple is a place for shared worship, cultural programs, learning, and community services. Visitors are welcome.",
          ],
        },
      ]}
    />
  );
}