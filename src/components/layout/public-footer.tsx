import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="site-width footer-main">
        <div className="footer-intro">
          <p className="footer-brand">Hindu-Jain Temple</p>
          <p>
            A shared home for worship, learning, and community in Monroeville.
          </p>
        </div>
        <div className="footer-details">
          <a href="https://maps.google.com/?q=615+Illini+Dr,+Monroeville,+PA+15146" target="_blank" rel="noreferrer">
            <MapPin size={19} aria-hidden="true" />
            <span>615 Illini Dr, Monroeville, PA 15146</span>
          </a>
          <a href="tel:+17243252073">
            <Phone size={19} aria-hidden="true" />
            <span>(724) 325-2073</span>
          </a>
          <a href="mailto:office@hindujaintemple.org">
            <Mail size={19} aria-hidden="true" />
            <span>office@hindujaintemple.org</span>
          </a>
          <p>
            <Clock3 size={19} aria-hidden="true" />
            <span>Typically 9 AM–8 PM; hours may vary for seasons and events.</span>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="site-width footer-bottom-inner">
          <span>© {new Date().getFullYear()} Hindu-Jain Temple</span>
          <Link href="/contact">Contact the temple</Link>
        </div>
      </div>
    </footer>
  );
}