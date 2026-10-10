import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { InfoPage } from "@/components/public/info-page";
import { getPublishedAlbum } from "@/services/gallery/public-gallery";

export const dynamic = "force-dynamic";

type AlbumPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { album } = await getPublishedAlbum(slug);

  return {
    title: album?.title ?? "Photo album",
    description: album?.description ?? "Hindu-Jain Temple photo album.",
    alternates: { canonical: `/gallery/${slug}` },
  };
}

export default async function GalleryAlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const { album, unavailable } = await getPublishedAlbum(slug);

  if (!album && !unavailable) {
    notFound();
  }

  if (unavailable) {
    return <InfoPage eyebrow="Temple memories" title="Gallery unavailable" introduction="The photo album is temporarily unavailable. Please check again soon." />;
  }

  if (!album) {
    notFound();
  }

  return (
    <InfoPage
      eyebrow="Temple memories"
      title={album.title}
      introduction={album.description ?? "Photographs from the Hindu-Jain Temple community."}
    >
      {album.images.length > 0 ? (
        <div className="gallery-photo-grid">
          {album.images.map((image) => (
            <figure className="gallery-photo" key={image.id}>
              <span className="gallery-photo-frame">
                <Image src={image.imageUrl} alt={image.altText} fill sizes="(max-width: 640px) 92vw, (max-width: 900px) 45vw, 30vw" />
              </span>
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      ) : (
        <p className="content-notice">Photos for this album are being prepared.</p>
      )}
      <Link className="text-link gallery-back-link" href="/gallery"><ArrowLeft size={18} aria-hidden="true" />All albums</Link>
    </InfoPage>
  );
}