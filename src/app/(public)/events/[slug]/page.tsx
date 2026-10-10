import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoPage } from "@/components/public/info-page";
import { getPublicEvent } from "@/services/events/public-events";

export const dynamic = "force-dynamic";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { event } = await getPublicEvent(slug);

  return {
    title: event?.title ?? "Temple event",
    description: event?.shortDescription ?? "Hindu-Jain Temple event details.",
    alternates: { canonical: `/events/${slug}` },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const { event, unavailable } = await getPublicEvent(slug);

  if (!event && !unavailable) {
    notFound();
  }

  if (unavailable) {
    return (
      <InfoPage
        eyebrow="Temple calendar"
        title="Event details unavailable"
        introduction="Event information is temporarily unavailable. Please contact the temple office for assistance."
        actions={[{ label: "Contact the temple", href: "/contact" }]}
      />
    );
  }

  if (!event) {
    notFound();
  }

  const startDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(event.startsAt);
  const endDate = event.endsAt
    ? new Intl.DateTimeFormat("en-US", {
        timeStyle: "short",
        timeZone: "America/New_York",
      }).format(event.endsAt)
    : null;

  return (
    <InfoPage
      eyebrow="Temple event"
      title={event.title}
      introduction={event.shortDescription}
      actions={event.registrationUrl ? [{ label: "Registration details", href: event.registrationUrl, external: true }] : []}
      blocks={event.fullDescription ? [{ heading: "About this event", paragraphs: [event.fullDescription] }] : []}
    >
      <div className="event-detail-meta">
        <p><CalendarDays size={20} aria-hidden="true" /><span>{startDate}{endDate ? ` – ${endDate}` : ""}</span></p>
        {event.location && <p><MapPin size={20} aria-hidden="true" /><span>{event.location}</span></p>}
        {event.registrationRequired && <p>Registration is required for this event.</p>}
      </div>
      <Link className="text-link" href="/events"><ArrowLeft size={18} aria-hidden="true" />All events</Link>
    </InfoPage>
  );
}