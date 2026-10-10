import Image from "next/image";
import Link from "next/link";
import { getPublishedAlbums } from "@/services/gallery/public-gallery";

export async function GalleryAlbums() {
  const albums = await getPublishedAlbums();

  if (!albums) {
    return <p className="content-notice" role="status">The photo gallery is temporarily unavailable. Please check again soon.</p>;
  }

  if (albums.length === 0) {
    return <p className="content-notice">There are no published photo albums yet. Please check again soon.</p>;
  }

  return (
    <div className="gallery-grid">
      {albums.map((album) => {
        const cover = album.images[0];

        return (
          <Link className="gallery-album" href={`/gallery/${album.slug}`} key={album.id}>
            <span className="gallery-image-frame">
              {cover ? (
                <Image
                  src={cover.imageUrl}
                  alt={cover.altText}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 900px) 45vw, 30vw"
                />
              ) : (
                <span className="gallery-no-image">Photos coming soon</span>
              )}
            </span>
            <span className="gallery-album-title">{album.title}</span>
            {album.eventDate && <time dateTime={album.eventDate.toISOString()}>{new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/New_York" }).format(album.eventDate)}</time>}
            {album.description && <span className="gallery-album-description">{album.description}</span>}
          </Link>
        );
      })}
    </div>
  );
}