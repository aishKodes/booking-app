"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ChefHat,
  LayoutDashboard,
  Map,
  Menu,
  Search,
  Settings2,
  Users,
  X,
} from "lucide-react";
import { LoadingState, Modal } from "@/components/ui";
import { useDemo } from "@/lib/store";
import { initials, niceDate, today } from "@/lib/utils";
const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarDays },
  { href: "/admin/floor", label: "Floor plan", icon: Map },
  { href: "/admin/guests", label: "Guest book", icon: Users },
  { href: "/admin/menu", label: "Menu", icon: ChefHat },
  { href: "/admin/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
];
export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { data, readNotifications } = useDemo();
  const [mobile, setMobile] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [command, setCommand] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifications(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const current = navigation.find((n) => n.href === path)?.label || "Overview";
  const nav = (
    <>
      <Link href="/admin" className="admin-brand">
        <span>a.</span>
        <div>
          ARDO<small>RESTAURANT OS</small>
        </div>
      </Link>
      <div className="restaurant-switcher">
        <span className="switcher-avatar">A</span>
        <div>
          ARDO, Park Street<small>Kolkata · Single location</small>
        </div>
      </div>
      <span className="sidebar-label">WORKSPACE</span>
      <nav aria-label="Admin navigation">
        {navigation.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={path === n.href ? "active" : ""}
            onClick={() => setMobile(false)}
          >
            <n.icon size={19} />
            <span>{n.label}</span>
            {n.href === "/admin/reservations" && data && (
              <small>
                {
                  data.reservations.filter(
                    (r) => r.date === today() && !["cancelled", "no-show"].includes(r.status),
                  ).length
                }
              </small>
            )}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="demo-environment">
          <i />
          Demo environment<span>All changes saved locally</span>
        </div>
        <Link href="/restaurant" className="public-site-link">
          View restaurant site <ArrowUpRight size={16} />
        </Link>
        <Link href="/" className="public-site-link">
          All demo experiences <ArrowUpRight size={16} />
        </Link>
        <div className="manager-profile">
          <span>NS</span>
          <div>
            Neel Sinha<small>Restaurant manager</small>
          </div>
        </div>
      </div>
    </>
  );
  const results = search.trim()
    ? [
        ...(data?.reservations || [])
          .filter((r) =>
            `${r.guestName} ${r.confirmationCode}`.toLowerCase().includes(search.toLowerCase()),
          )
          .slice(0, 4)
          .map((r) => ({
            title: r.guestName,
            sub: `${r.confirmationCode} · ${r.date}`,
            url: `/admin/reservations?booking=${r.id}`,
            type: "Reservation",
          })),
        ...(data?.guests || [])
          .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 3)
          .map((g) => ({
            title: g.name,
            sub: g.email,
            url: `/admin/guests?guest=${g.id}`,
            type: "Guest",
          })),
        ...(data?.menu || [])
          .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 3)
          .map((m) => ({
            title: m.name,
            sub: m.category,
            url: `/admin/menu?item=${m.id}`,
            type: "Menu",
          })),
      ]
    : [];
  return (
    <div className="admin-app">
      <a href="#admin-main" className="skip-link">
        Skip to content
      </a>
      <aside className="admin-sidebar">{nav}</aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <button
              className="icon-button admin-mobile-menu"
              onClick={() => setMobile(true)}
              aria-label="Open admin navigation"
            >
              <Menu size={21} />
            </button>
            <span>Workspace</span>
            <span>/</span>
            <strong>{current}</strong>
          </div>
          <div className="admin-topbar-actions">
            <button
              className="command-trigger"
              aria-label="Search workspace"
              onClick={() => setCommand(true)}
            >
              <Search size={17} />
              <span>Search anything</span>
              <kbd>⌘ K</kbd>
            </button>
            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                aria-expanded={notifications}
                onClick={() => {
                  setNotifications((v) => !v);
                  if (!notifications) readNotifications();
                }}
              >
                <Bell size={19} />
                {data?.settings.bookingAlerts && data.activities.some((a) => !a.read) && <i />}
              </button>
              {notifications && (
                <>
                  <button
                    className="dropdown-dismiss"
                    aria-label="Close notifications"
                    onClick={() => setNotifications(false)}
                  />
                  <div className="notifications">
                    <div>
                      <strong>Notifications</strong>
                      <button
                        className="icon-button"
                        aria-label="Close notifications"
                        onClick={() => setNotifications(false)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {data?.activities.slice(0, 7).map((a) => (
                      <article key={a.id}>
                        <span className="notification-symbol">
                          <CalendarDays size={16} />
                        </span>
                        <div>
                          <strong>{a.title}</strong>
                          <p>{a.description}</p>
                        </div>
                      </article>
                    ))}
                    <span className="notifications-footnote">Updates from this demo workspace</span>
                  </div>
                </>
              )}
            </div>
            <span className="topbar-avatar">NS</span>
          </div>
        </header>
        <main id="admin-main" className="admin-main">
          {data ? children : <LoadingState />}
        </main>
        <footer className="admin-footer">
          <span>
            <i /> Local demo · Changes persist in this browser
          </span>
          <span>ARDO Restaurant OS</span>
        </footer>
      </div>
      {mobile && (
        <Modal title="Your workspace" onClose={() => setMobile(false)}>
          <div className="admin-mobile-nav">
            {navigation.map((n) => (
              <Link href={n.href} key={n.href} onClick={() => setMobile(false)}>
                <n.icon size={20} />
                {n.label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <Link href="/restaurant" onClick={() => setMobile(false)}>
              Restaurant website <ArrowUpRight size={16} />
            </Link>
          </div>
        </Modal>
      )}
      {command && (
        <Modal
          title="Find it in a moment."
          onClose={() => {
            setCommand(false);
            setSearch("");
          }}
        >
          <div className="search-field">
            <Search size={18} />
            <input
              autoFocus
              aria-label="Search workspace"
              placeholder="Guests, bookings, menu items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="command-results">
            {results.map((r, i) => (
              <Link
                key={i}
                href={r.url}
                onClick={() => {
                  setCommand(false);
                  setSearch("");
                }}
              >
                <span className="command-avatar">{initials(r.title)}</span>
                <div>
                  <strong>{r.title}</strong>
                  <span>{r.sub}</span>
                </div>
                <small>{r.type}</small>
                <ArrowUpRight size={16} />
              </Link>
            ))}
            {search && results.length === 0 && (
              <p className="muted">No matches. Try a name or booking reference.</p>
            )}
            {!search && (
              <>
                <span className="eyebrow">QUICK LINKS</span>
                {navigation.map((n) => (
                  <Link key={n.href} href={n.href} onClick={() => setCommand(false)}>
                    <n.icon size={18} />
                    {n.label}
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
export function AdminHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="admin-page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="admin-heading-actions">{children}</div>}
    </div>
  );
}
export function AdminDate() {
  return (
    <span className="admin-date">
      <CalendarDays size={16} />
      {niceDate(today(), "EEEE, d MMMM")}
    </span>
  );
}
