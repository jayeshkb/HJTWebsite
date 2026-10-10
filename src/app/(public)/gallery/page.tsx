import type { Metadata } from "next";
import { GalleryAlbums } from "@/components/gallery/gallery-albums";
import { InfoPage } from "@/components/public/info-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from Hindu-Jain Temple programs and community events.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <InfoPage
      eyebrow="Temple memories"
      title="Gallery"
      introduction="Explore photographs from temple worship, cultural programs, and community gatherings."
    >
      <GalleryAlbums />
    </InfoPage>
  );
}