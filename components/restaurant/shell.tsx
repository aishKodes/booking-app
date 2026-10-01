"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CalendarDays, Menu } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui";
import { useDemo } from "@/lib/store";
import { restaurant } from "@/lib/demo-data";
import { niceTime } from "@/lib/utils";
const links = [
  { href: "/restaurant/menu", label: "The menu" },
  { href: "/restaurant/about", label: "Our story" },
  { href: "/restaurant/private-dining", label: "Private dining" },
  { href: "/restaurant/contact", label: "Find us" },
];
export function RestaurantHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="restaurant-header">
        <div className="header-inner">
          <Link href="/restaurant" className="brand" aria-label="ARDO home">
            ARDO<span>FIRE. FOOD. FEELING.</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((l) => (
              <Link className={path === l.href ? "active" : ""} href={l.href} key={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              className="reservation-link"
              href="/restaurant/reservations"
              aria-label="My reservations"
            >
              <CalendarDays size={19} />
              <span>My bookings</span>
            </Link>
            <Link className="button button-primary header-reserve" href="/restaurant/reserve">
              Reserve a table <ArrowUpRight size={17} />
            </Link>
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      {open && (
        <Modal title="Make an evening of it." onClose={() => setOpen(false)}>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {[
              ...links,
              { href: "/restaurant/reservations", label: "My reservations" },
              { href: "/restaurant/reserve", label: "Reserve a table" },
              { href: "/admin", label: "Restaurant dashboard" },
            ].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
                <ArrowUpRight size={20} />
              </Link>
            ))}
          </nav>
        </Modal>
      )}
    </>
  );
}
export function RestaurantFooter() {
  const { data } = useDemo();
  const r = data?.settings || restaurant;
  return (
    <footer className="restaurant-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/restaurant" className="brand">
            ARDO<span>FIRE. FOOD. FEELING.</span>
          </Link>
          <p>
            A place for good food,
            <br />
            and even better company.
          </p>
        </div>
        <div>
          <h3>Come on over</h3>
          <p>
            {r.address}
            <br />
            {r.phone}
            <br />
            {r.email}
          </p>
        </div>
        <div>
          <h3>Every day, thoughtfully</h3>
          <p>
            Lunch · {niceTime(r.lunchOpen)} – {niceTime(r.lunchClose)}
            <br />
            Dinner · {niceTime(r.dinnerOpen)} – {niceTime(r.dinnerClose)}
          </p>
          <Link href="/restaurant/reserve" className="text-link">
            Your table is waiting <ArrowUpRight size={16} />
          </Link>
        </div>
        <div>
          <h3>A little more</h3>
          <Link href="/restaurant/menu">The menu</Link>
          <Link href="/restaurant/private-dining">Private dining</Link>
          <Link href="/restaurant/reservations">My reservations</Link>
          <Link href="/admin">
            Restaurant dashboard <ArrowUpRight size={14} />
          </Link>
          <Link href="/">
            All demo experiences <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 ARDO. Made for good evenings.</span>
        <span>Fictional restaurant · Interactive product demo</span>
      </div>
    </footer>
  );
}
