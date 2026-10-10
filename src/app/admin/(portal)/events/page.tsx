import type { Metadata } from "next";
import { ContentStatus } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import { createEvent, updateEventStatus } from "./actions";
import { prisma } from "@/lib/db/prisma";
import { requireAdminPermission } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage events",
  robots: { index: false, follow: false },
};

type EventsPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      select: { id: true, title: true, slug: true, startsAt: true, status: true, category: true },
      orderBy: { startsAt: "desc" },
      take: 100,
    });
    return { events, unavailable: false };
  } catch {
    return { events: [], unavailable: true };
  }
}

export default async function AdminEventsPage({ searchParams }: EventsPageProps) {
  await requireAdminPermission("content:manage");
  const [query, data] = await Promise.all([searchParams, getEvents()]);

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Content</p>
          <h1>Events</h1>
        </div>
        <p>Draft, publish, and maintain the temple event calendar.</p>
      </div>

      {query.saved && <p className="admin-feedback" role="status">Event changes saved.</p>}
      {query.error && <p className="admin-feedback is-error" role="alert">The event could not be saved. Check the fields and try again.</p>}
      {data.unavailable && <p className="admin-feedback is-error" role="status">Events are unavailable until the database is connected.</p>}

      <section className="admin-module" aria-labelledby="event-list-title">
        <div className="admin-module-heading">
          <h2 id="event-list-title">Current events</h2>
          <span>{data.events.length} records</span>
        </div>
        {data.events.length === 0 ? (
          <p className="admin-empty">No event records are available.</p>
        ) : (
          <div className="admin-record-list">
            {data.events.map((event) => (
              <article className="admin-record" key={event.id}>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.category} · {formatInTimeZone(event.startsAt, "America/New_York", "yyyy-MM-dd HH:mm")} Eastern · {event.status}</p>
                </div>
                <form action={updateEventStatus}>
                  <input type="hidden" name="eventId" value={event.id} />
                  <input type="hidden" name="status" value={event.status === ContentStatus.PUBLISHED ? ContentStatus.DRAFT : ContentStatus.PUBLISHED} />
                  <button className="admin-text-button" type="submit">
                    {event.status === ContentStatus.PUBLISHED ? "Unpublish" : "Publish"}
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-module" aria-labelledby="new-event-title">
        <div className="admin-module-heading"><h2 id="new-event-title">Add an event</h2></div>
        <form className="admin-content-form" action={createEvent}>
          <div className="admin-content-grid">
            <div className="admin-form-field">
              <label htmlFor="event-title">Title</label>
              <input id="event-title" name="title" type="text" required minLength={3} maxLength={160} />
            </div>
            <div className="admin-form-field">
              <label htmlFor="event-slug">URL slug <span>Optional</span></label>
              <input id="event-slug" name="slug" type="text" maxLength={180} pattern="[a-zA-Z0-9-]+" />
            </div>
            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="event-short-description">Short description</label>
              <textarea id="event-short-description" name="shortDescription" rows={3} required minLength={5} maxLength={500} />
            </div>
            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="event-description">Full description <span>Optional</span></label>
              <textarea id="event-description" name="fullDescription" rows={5} maxLength={20000} />
            </div>
            <div className="admin-form-field">
              <label htmlFor="event-start">Start date and time (Eastern)</label>
              <input id="event-start" name="startsAt" type="datetime-local" required />
            </div>
            <div className="admin-form-field">
              <label htmlFor="event-end">End date and time (Eastern) <span>Optional</span></label>
              <input id="event-end" name="endsAt" type="datetime-local" />
            </div>
            <div className="admin-form-field">
              <label htmlFor="event-location">Location <span>Optional</span></label>
              <input id="event-location" name="location" type="text" maxLength={240} />
            </div>
            <div className="admin-form-field">
              <label htmlFor="event-category">Category</label>
              <select id="event-category" name="category" defaultValue="COMMUNITY">
                <option value="FESTIVAL">Festival</option>
                <option value="PUJA">Puja</option>
                <option value="CULTURAL">Cultural</option>
                <option value="EDUCATION">Education</option>
                <option value="COMMUNITY">Community</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="admin-form-field admin-form-field-wide">
              <label htmlFor="event-registration-url">Registration URL <span>Optional, https://</span></label>
              <input id="event-registration-url" name="registrationUrl" type="url" />
            </div>
          </div>
          <div className="admin-checkbox-row">
            <label><input name="registrationRequired" type="checkbox" /> Registration required</label>
            <label><input name="featured" type="checkbox" /> Feature on event list</label>
            <label><input name="publishNow" type="checkbox" /> Publish immediately</label>
          </div>
          <button className="admin-button admin-button-primary" type="submit">Save event</button>
        </form>
      </section>
    </>
  );
}