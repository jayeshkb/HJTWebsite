import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import type { EventCategory } from "@prisma/client";
import { getPublicEvents, type PublicEvent } from "@/services/events/public-events";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "America/New_York",
  }).format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(date);
}

function EventRows({ events }: { events: PublicEvent[] }) {
  return (
    <div className="event-list">
      {events.map((event) => (
        <article className="event-row" key={event.id}>
          <div className="event-date" aria-hidden="true"><CalendarDays size={23} strokeWidth={1.7} /></div>
          <div className="event-row-copy">
            <p className="event-date-text">
              <time dateTime={event.startsAt.toISOString()}>{formatDate(event.startsAt)}</time>
              {event.endsAt && <span> · {formatTime(event.startsAt)}–{formatTime(event.endsAt)}</span>}
            </p>
            <h3><Link href={`/events/${event.slug}`}>{event.title}</Link></h3>
            <p>{event.shortDescription}</p>
            {event.location && <span className="event-location"><MapPin size={15} aria-hidden="true" />{event.location}</span>}
          </div>
          <Link className="event-row-link" href={`/events/${event.slug}`} aria-label={`Read more about ${event.title}`}>
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  );
}

export async function EventListing({ category }: { category?: EventCategory }) {
  const result = await getPublicEvents(category);

  if (!result) {
    return (
      <p className="content-notice" role="status">
        The event calendar is temporarily unavailable. Please contact the temple office for current information.
      </p>
    );
  }

  return (
    <>
      <section className="event-list-section" aria-labelledby="upcoming-events-title">
        <h2 id="upcoming-events-title">Upcoming events</h2>
        {result.upcoming.length ? (
          <EventRows events={result.upcoming} />
        ) : (
          <p className="content-notice">There are no upcoming events published right now. Please check again soon.</p>
        )}
      </section>
      {result.past.length > 0 && (
        <section className="event-list-section past-events" aria-labelledby="past-events-title">
          <h2 id="past-events-title">Past events</h2>
          <EventRows events={result.past} />
        </section>
      )}
    </>
  );
}