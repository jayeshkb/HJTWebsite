import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { getPublicHighlights } from "@/services/home/public-highlights";

function getSafeAnnouncementLink(linkUrl: string | null) {
  if (!linkUrl) {
    return null;
  }

  if (linkUrl.startsWith("/") && !linkUrl.startsWith("//")) {
    return linkUrl;
  }

  try {
    const url = new URL(linkUrl);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  }).format(date);
}

export async function HomeHighlights() {
  const highlights = await getPublicHighlights();

  if (!highlights) {
    return <p className="content-notice" role="status">Temple announcements and event listings are temporarily unavailable. Please contact the temple office for current information.</p>;
  }

  return (
    <div className="home-highlights">
      <section aria-labelledby="home-announcements-title">
        <h3 id="home-announcements-title">Announcements</h3>
        {highlights.announcements.length > 0 ? (
          <ul>
            {highlights.announcements.map((announcement) => {
              const href = getSafeAnnouncementLink(announcement.linkUrl);

              return (
                <li key={announcement.id}>
                  <div className="highlight-copy">
                    {href?.startsWith("/") ? (
                      <Link href={href}>{announcement.title}</Link>
                    ) : href ? (
                      <a href={href} rel="noreferrer">{announcement.title}</a>
                    ) : (
                      <strong>{announcement.title}</strong>
                    )}
                    <p>{announcement.message}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="highlights-empty">There are no current announcements.</p>
        )}
      </section>
      <section aria-labelledby="home-upcoming-title">
        <h3 id="home-upcoming-title">Upcoming events</h3>
        {highlights.events.length > 0 ? (
          <ul>
            {highlights.events.map((event) => (
              <li key={event.id}>
                <CalendarDays size={19} aria-hidden="true" />
                <div className="highlight-copy">
                  <Link href={`/events/${event.slug}`}>{event.title}</Link>
                  <p>{formatDate(event.startsAt)} · {event.shortDescription}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="highlights-empty">There are no upcoming events published right now.</p>
        )}
        <Link className="text-link" href="/events">View all events</Link>
      </section>
    </div>
  );
}