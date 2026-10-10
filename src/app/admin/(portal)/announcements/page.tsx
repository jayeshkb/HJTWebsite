import type { Metadata } from "next";
import { AnnouncementPriority } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { createAnnouncement, updateAnnouncementStatus } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage announcements",
  robots: { index: false, follow: false },
};

type AnnouncementsPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminAnnouncementsPage({ searchParams }: AnnouncementsPageProps) {
  await requireAdminPermission("content:manage");
  const [query, announcements] = await Promise.all([
    searchParams,
    prisma.announcement.findMany({ orderBy: [{ publishAt: "desc" }], take: 100 }),
  ]);

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">Content</p><h1>Announcements</h1></div>
        <p>Publish public notices on the temple homepage.</p>
      </div>

      {query.saved && <p className="admin-feedback" role="status">Announcement changes saved.</p>}
      {query.error && <p className="admin-feedback is-error" role="alert">The announcement could not be saved. Check the fields and try again.</p>}

      <section className="admin-module" aria-labelledby="announcements-list-title">
        <div className="admin-module-heading">
          <h2 id="announcements-list-title">Current notices</h2>
          <span>{announcements.length} records</span>
        </div>
        {announcements.length === 0 ? (
          <p className="admin-empty">No announcements yet. Create a notice below to add it to the homepage.</p>
        ) : (
          <div className="admin-record-list">
            {announcements.map((announcement) => (
              <article className="admin-record" key={announcement.id}>
                <div>
                  <h3>{announcement.title}</h3>
                  <p>{announcement.priority} · {announcement.active ? "Active" : "Inactive"} · Starts {formatInTimeZone(announcement.publishAt, "America/New_York", "yyyy-MM-dd HH:mm")} Eastern</p>
                  <p>{announcement.message}</p>
                </div>
                <form action={updateAnnouncementStatus}>
                  <input type="hidden" name="announcementId" value={announcement.id} />
                  <input type="hidden" name="active" value={announcement.active ? "false" : "true"} />
                  <button className="admin-text-button" type="submit">{announcement.active ? "Deactivate" : "Activate"}</button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-module" aria-labelledby="new-announcement-title">
        <div className="admin-module-heading"><h2 id="new-announcement-title">Create an announcement</h2></div>
        <form className="admin-content-form" action={createAnnouncement}>
          <div className="admin-content-grid">
            <div className="admin-form-field">
              <label htmlFor="announcement-title">Title</label>
              <input id="announcement-title" name="title" type="text" required minLength={3} maxLength={160} />
            </div>
            <div className="admin-form-field">
              <label htmlFor="announcement-priority">Priority</label>
              <select id="announcement-priority" name="priority" defaultValue={AnnouncementPriority.NORMAL}>
                {Object.values(AnnouncementPriority).map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </select>
            </div>
            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="announcement-message">Message</label>
              <textarea id="announcement-message" name="message" rows={4} required minLength={5} maxLength={4000} />
            </div>
            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="announcement-link">Link <span>Optional, internal path or http(s) URL</span></label>
              <input id="announcement-link" name="linkUrl" type="text" maxLength={2048} />
            </div>
            <div className="admin-form-field">
              <label htmlFor="announcement-publish-at">Publish date and time (Eastern)</label>
              <input id="announcement-publish-at" name="publishAt" type="datetime-local" required />
            </div>
            <div className="admin-form-field">
              <label htmlFor="announcement-expires-at">Expiration (Eastern) <span>Optional</span></label>
              <input id="announcement-expires-at" name="expiresAt" type="datetime-local" />
            </div>
          </div>
          <div className="admin-checkbox-row">
            <label><input name="active" type="checkbox" defaultChecked /> Active when saved</label>
          </div>
          <button className="admin-button admin-button-primary" type="submit">Save announcement</button>
        </form>
      </section>
    </>
  );
}