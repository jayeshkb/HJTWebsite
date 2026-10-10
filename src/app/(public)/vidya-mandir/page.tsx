import type { Metadata } from "next";
import { InfoPage } from "@/components/public/info-page";

export const metadata: Metadata = {
  title: "Vidya Mandir",
  description: "Learn about the Hindu-Jain Temple Vidya Mandir program.",
  alternates: { canonical: "/vidya-mandir" },
};

export default function VidyaMandirPage() {
  return (
    <InfoPage
      eyebrow="Learning and values"
      title="Vidya Mandir"
      introduction="Vidya Mandir supports children’s learning, cultural connection, and service through temple community programs."
      actions={[
        { label: "Visit the Vidya Mandir website", href: "https://sites.google.com/view/hjtvidyamandir/home", external: true },
        { label: "Contact the temple", href: "/contact", secondary: true },
      ]}
      blocks={[
        {
          heading: "Program pillars",
          paragraphs: ["The current program information describes five areas of learning:"],
          points: ["Dharma", "Physical development", "Sanskriti", "Academic learning", "Community sewa"],
        },
        {
          heading: "Classes and registration",
          paragraphs: ["Schedules and enrollment details change by session. Please use the current Vidya Mandir website or contact the temple office for the latest information."],
        },
      ]}
    />
  );
}