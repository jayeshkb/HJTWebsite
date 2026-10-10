import {
  ArrowRight,
  CalendarDays,
  HandHeart,
  Landmark,
  Mail,
  MapPin,
  Phone,
  School,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HomeHighlights } from "@/components/public/home-highlights";

export const dynamic = "force-dynamic";

const quickActions = [
  {
    title: "Puja & Havan Schedule",
    description: "See worship times and upcoming observances.",
    href: "/temple/puja-havan-schedule",
    icon: CalendarDays,
  },
  {
    title: "Request a Priest",
    description: "Share your service needs with the temple office.",
    href: "/services/priest-request",
    icon: Landmark,
  },
  {
    title: "Become a Member",
    description: "Learn about membership and submit an application.",
    href: "/membership",
    icon: UsersRound,
  },
  {
    title: "Reserve a Hall",
    description: "Explore the halls and request a reservation.",
    href: "/community-hall",
    icon: CalendarDays,
  },
  {
    title: "Vidya Mandir",
    description: "Discover classes, programs, and schedules.",
    href: "/vidya-mandir",
    icon: School,
  },
  {
    title: "Support the Temple",
    description: "Make a donation for temple and community services.",
    href: "/donate",
    icon: HandHeart,
  },
];

export default function Home() {
  const templeStructuredData = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Hindu-Jain Temple",
    url: "https://www.hindujaintemple.org/",
    telephone: "+1-724-325-2073",
    address: {
      "@type": "PostalAddress",
      streetAddress: "615 Illini Dr",
      addressLocality: "Monroeville",
      addressRegion: "PA",
      postalCode: "15146",
      addressCountry: "US",
    },
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(templeStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="welcome-band" aria-labelledby="welcome-title">
        <div className="site-width welcome-inner">
          <div className="welcome-copy">
            <p className="eyebrow">A place to worship, learn, and belong</p>
            <h1 id="welcome-title">
              One home for Hindu and Jain traditions.
            </h1>
            <p className="welcome-description">
              The Hindu-Jain Temple welcomes our community for shared worship,
              cultural programs, and service in Monroeville, Pennsylvania.
            </p>
            <div className="welcome-actions">
              <Link className="button button-light" href="/temple/puja-havan-schedule">
                View puja schedule <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="welcome-secondary" href="/events">
                Explore temple events
              </Link>
            </div>
          </div>
          <div className="welcome-photo-frame">
            <Image
              className="welcome-photo"
              src="/temple-front.jpg"
              alt="The Hindu-Jain Temple in Monroeville"
              fill
              priority
              sizes="(max-width: 640px) 92vw, (max-width: 900px) 45vw, 40vw"
            />
          </div>
        </div>
        <span className="welcome-rule" aria-hidden="true" />
      </section>

      <section className="quick-section" aria-labelledby="quick-title">
        <div className="site-width">
          <div className="section-intro">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="section-heading" id="quick-title">
                How can we help?
              </h2>
            </div>
            <p className="section-summary">
              Find the information or service you need.
            </p>
          </div>
          <div className="action-grid">
            {quickActions.map(({ title, description, href, icon: Icon }) => (
              <Link className="action-link" href={href} key={title}>
                <span className="action-icon" aria-hidden="true">
                  <Icon size={24} strokeWidth={1.7} />
                </span>
                <span className="action-copy">
                  <span className="action-title">{title}</span>
                  <span className="action-description">{description}</span>
                </span>
                <ArrowRight className="action-arrow" size={19} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="temple-section" aria-labelledby="temple-title">
        <div className="site-width temple-grid">
          <div>
            <p className="eyebrow">Welcome to Monroeville</p>
            <h2 className="section-heading" id="temple-title">
              A shared spiritual home, open to all.
            </h2>
            <p className="temple-description">
              The world’s first unified Hindu–Jain temple brings people
              together through worship, cultural traditions, and community
              care.
            </p>
            <Link className="text-link" href="/temple">
              About the temple <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="visit-panel">
            <p className="visit-heading">Plan your visit</p>
            <p className="visit-hours">Typically open daily, 9 AM–8 PM</p>
            <p className="visit-note">
              Hours may change for seasons and special programs. Please check
              the schedule before your visit.
            </p>
            <div className="visit-divider" />
            <a href="https://maps.google.com/?q=615+Illini+Dr,+Monroeville,+PA+15146" target="_blank" rel="noreferrer">
              <MapPin size={19} aria-hidden="true" />
              <span>615 Illini Dr<br />Monroeville, PA 15146</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="tel:+17243252073">
              <Phone size={19} aria-hidden="true" />
              <span>(724) 325-2073</span>
            </a>
            <a href="mailto:office@hindujaintemple.org">
              <Mail size={19} aria-hidden="true" />
              <span>office@hindujaintemple.org</span>
            </a>
          </div>
        </div>
      </section>

      <section className="events-section" aria-labelledby="events-title">
        <div className="site-width events-inner">
          <div>
            <p className="eyebrow">Gather with us</p>
            <h2 className="section-heading" id="events-title">
              Worship and community life
            </h2>
            <p>
              Temple pujas, havans, festivals, and cultural programs are held
              throughout the year. Check the schedule for current dates and
              details.
            </p>
          </div>
          <HomeHighlights />
        </div>
      </section>

      <section className="community-band" aria-labelledby="community-title">
        <div className="site-width community-inner">
          <div className="community-symbol" aria-hidden="true">
            <UsersRound size={31} strokeWidth={1.5} />
          </div>
          <div>
            <p className="eyebrow">A temple sustained by its community</p>
            <h2 id="community-title">There is a place for you here.</h2>
            <p>Join, volunteer, learn, or support the temple’s work.</p>
          </div>
          <div className="community-actions">
            <Link className="button button-maroon" href="/membership">
              Become a member <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="text-link" href="/donate">Make a donation</Link>
          </div>
        </div>
      </section>
    </main>
  );
}