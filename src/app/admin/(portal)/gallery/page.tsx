import type { Metadata } from "next";
import { ContentStatus } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { addAlbumImage, createAlbum, updateAlbumStatus } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage gallery",
  robots: { index: false, follow: false },
};

type GalleryPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminGalleryPage({ searchParams }: GalleryPageProps) {
  await requireAdminPermission("gallery:manage");
  const [query, albums] = await Promise.all([
    searchParams,
    prisma.galleryAlbum.findMany({
      include: { images: { orderBy: { displayOrder: "asc" } } },
      orderBy: [{ eventDate: "desc" }, { title: "asc" }],
      take: 100,
    }),
  ]);

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">Content</p><h1>Gallery</h1></div>
        <p>Prepare albums and publish temple photographs.</p>
      </div>

      {query.saved && <p className="admin-feedback" role="status">Gallery changes saved.</p>}
      {query.error && <p className="admin-feedback is-error" role="alert">The gallery change could not be saved. Check the image URL and album details.</p>}

      <section className="admin-module" aria-labelledby="gallery-albums-title">
        <div className="admin-module-heading">
          <h2 id="gallery-albums-title">Albums</h2>
          <span>{albums.length} records</span>
        </div>
        {albums.length === 0 ? (
          <p className="admin-empty">No albums yet. Create an album below and publish it to show it on the public gallery.</p>
        ) : (
          <div className="admin-record-list">
            {albums.map((album) => (
              <article className="admin-record admin-gallery-record" key={album.id}>
                <div>
                  <h3>{album.title}</h3>
                  <p>/{album.slug} · {album.status} · {album.images.length} photos{album.eventDate ? ` · ${formatInTimeZone(album.eventDate, "America/New_York", "yyyy-MM-dd")}` : ""}</p>
                  {album.description && <p>{album.description}</p>}
                  <form className="admin-inline-form" action={addAlbumImage}>
                    <input type="hidden" name="albumId" value={album.id} />
                    <label className="admin-form-field"><span>Image URL</span><input name="imageUrl" type="url" required placeholder="https://…public.blob.vercel-storage.com/…" /></label>
                    <label className="admin-form-field"><span>Alt text</span><input name="altText" type="text" required minLength={3} maxLength={300} /></label>
                    <label className="admin-form-field"><span>Caption</span><input name="caption" type="text" maxLength={500} /></label>
                    <button className="admin-text-button" type="submit">Add photo</button>
                  </form>
                </div>
                <form action={updateAlbumStatus}>
                  <input type="hidden" name="albumId" value={album.id} />
                  <input type="hidden" name="status" value={album.status === ContentStatus.PUBLISHED ? ContentStatus.DRAFT : ContentStatus.PUBLISHED} />
                  <button className="admin-text-button" type="submit">{album.status === ContentStatus.PUBLISHED ? "Unpublish" : "Publish"}</button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-module" aria-labelledby="new-album-title">
        <div className="admin-module-heading"><h2 id="new-album-title">Create an album</h2></div>
        <form className="admin-content-form" action={createAlbum}>
          <div className="admin-content-grid">
            <div className="admin-form-field">
              <label htmlFor="album-title">Title</label>
              <input id="album-title" name="title" type="text" required minLength={3} maxLength={160} />
            </div>
            <div className="admin-form-field">
              <label htmlFor="album-slug">URL slug <span>Optional</span></label>
              <input id="album-slug" name="slug" type="text" maxLength={180} pattern="[a-zA-Z0-9-]+" />
            </div>
            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="album-description">Description</label>
              <textarea id="album-description" name="description" rows={3} maxLength={4000} />
            </div>
            <div className="admin-form-field">
              <label htmlFor="album-event-date">Event date <span>Optional</span></label>
              <input id="album-event-date" name="eventDate" type="date" />
            </div>
            <div className="admin-form-field">
              <label htmlFor="album-image-url">First photo URL <span>Optional</span></label>
              <input id="album-image-url" name="imageUrl" type="url" placeholder="https://…public.blob.vercel-storage.com/…" />
            </div>
            <div className="admin-form-field">
              <label htmlFor="album-alt-text">First photo alt text</label>
              <input id="album-alt-text" name="altText" type="text" maxLength={300} />
            </div>
            <div className="admin-form-field">
              <label htmlFor="album-caption">First photo caption <span>Optional</span></label>
              <input id="album-caption" name="caption" type="text" maxLength={500} />
            </div>
          </div>
          <div className="admin-checkbox-row">
            <label><input name="publishNow" type="checkbox" /> Publish album immediately</label>
          </div>
          <button className="admin-button admin-button-primary" type="submit">Save album</button>
        </form>
      </section>
    </>
  );
}