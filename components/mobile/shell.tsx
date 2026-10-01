"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Compass,
  Home,
  MapPin,
  Plus,
  UserRound,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { initials } from "@/lib/utils";
import { appNotifications } from "@/lib/mobile";
import { LoadingState } from "@/components/ui";
import { AppActionsContext, AppSheet } from "./shared";
const tabs = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/explore", label: "Explore", icon: Compass },
  { href: "/app/reserve", label: "Reserve", icon: Plus },
  { href: "/app/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/app/profile", label: "Profile", icon: UserRound },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { data, updateApp } = useDemo();
  const [notifications, setNotifications] = useState(false);
  const [actionHost, setActionHost] = useState<HTMLDivElement | null>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(1);
  const back = path.startsWith("/app/bookings/") ? "/app/bookings" : "/app";
  const title = path.startsWith("/app/bookings/")
    ? "Your reservation"
    : tabs.find((t) => t.href === path)?.label;
  const messages = data ? appNotifications(data) : [];
  const unread =
    data?.guestApp.profile.notifications &&
    messages.some((n) => !data.guestApp.readNotifications.includes(n.id));
  useEffect(() => {
    scroll.current?.scrollTo({ top: 0 });
  }, [path]);
  return (
    <div className="ma-stage">
      <div className="ma-demo-context">
        <Link href="/">
          <ArrowLeft size={16} />
          All experiences
        </Link>
        <span className="ma-kicker">ARDO · GUEST APP</span>
        <h1>
          A table in
          <br />
          your pocket.
        </h1>
        <p>
          A little discovery.
          <br />A very good evening.
        </p>
        <div>
          <span />
          <small>Interactive mobile experience</small>
        </div>
        <Link href="/admin">
          Open management dashboard
          <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="ma-device">
        <div className="ma-device-status" aria-hidden="true">
          <span>9:41</span>
          <span>
            ●●● <b>◓</b> ▰
          </span>
        </div>
        <header className="ma-topbar">
          {path === "/app" ? (
            <div className="ma-app-brand">
              <span>a.</span>
              <div>
                <strong>ARDO</strong>
                <small>
                  <MapPin size={11} />
                  Park Street, Kolkata
                </small>
              </div>
            </div>
          ) : (
            <div className="ma-internal-title">
              <Link
                href={back}
                className="ma-icon"
                aria-label="Back"
                onClick={() => setDirection(-1)}
              >
                <ArrowLeft size={21} />
              </Link>
              <strong>{title === "Reserve" ? "Reserve a table" : title}</strong>
            </div>
          )}
          <div className="ma-header-actions">
            <button
              className="ma-icon"
              aria-label="App notifications"
              onClick={() => {
                setNotifications(true);
                if (data) updateApp({ readNotifications: messages.map((n) => n.id) });
              }}
            >
              <Bell size={20} />
              {unread && <i />}
            </button>
            <Link className="ma-avatar" href="/app/profile" aria-label="Your profile">
              {data?.guestApp.profile.name ? (
                initials(data.guestApp.profile.name)
              ) : (
                <UserRound size={19} />
              )}
            </Link>
          </div>
        </header>
        <AppActionsContext.Provider value={actionHost}>
          <div ref={scroll} className="ma-scroll" id="app-content">
            <motion.main
              key={path}
              className="ma-screen"
              initial={{ opacity: 0, x: direction * 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
            >
              {data ? children : <LoadingState />}
            </motion.main>
          </div>
        </AppActionsContext.Provider>
        <div ref={setActionHost} className="ma-actionhost" />
        <nav className="ma-bottom-nav" aria-label="App navigation">
          {tabs.map((t) => {
            const active = t.href === "/app" ? path === "/app" : path.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`${active ? "active" : ""} ${t.label === "Reserve" ? "reserve-tab" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setDirection(1)}
              >
                <span>
                  <t.icon size={21} strokeWidth={active ? 2.2 : 1.7} />
                </span>
                <small>{t.label}</small>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="ma-desktop-caption">
        <span>Guest app</span>
        <small>One restaurant. Every touchpoint.</small>
      </div>
      {notifications && (
        <AppSheet title="A little update" onClose={() => setNotifications(false)}>
          <div className="ma-notifications">
            {messages.map((n) => (
              <Link key={n.id} href={n.href} onClick={() => setNotifications(false)}>
                <span>
                  <CalendarDays size={20} />
                </span>
                <div>
                  <h3>{n.title}</h3>
                  <p>{n.text}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="ma-sheet-footnote">Updates from your bookings and the ARDO kitchen.</p>
        </AppSheet>
      )}
    </div>
  );
}
