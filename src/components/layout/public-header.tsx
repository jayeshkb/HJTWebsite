"use client";

import { Landmark, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Temple", href: "/temple" },
  { label: "Services", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Membership", href: "/membership" },
  { label: "Community Hall", href: "/community-hall" },
  { label: "Vidya Mandir", href: "/vidya-mandir" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="site-width utility-inner">
          <span>Monroeville, Pennsylvania</span>
          <a href="tel:+17243252073">Temple office: (724) 325-2073</a>
        </div>
      </div>
      <div className="site-width brand-row">
        <Link className="brand" href="/" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <Landmark size={25} strokeWidth={1.6} />
          </span>
          <span className="brand-copy">
            <span className="brand-name">Hindu-Jain Temple</span>
            <span className="brand-location">Monroeville, Pennsylvania</span>
          </span>
        </Link>
        <Link className="donate-button" href="/donate" onClick={closeMenu}>
          Donate
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <nav
        id="primary-navigation"
        className={`primary-navigation${menuOpen ? " is-open" : ""}`}
        aria-label="Primary navigation"
      >
        <div className="site-width navigation-inner">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}