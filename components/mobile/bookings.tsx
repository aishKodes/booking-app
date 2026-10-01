"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Armchair,
  ArrowUpRight,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  Share2,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { useToast } from "@/components/ui";
import { customerBookings, upcomingBookings } from "@/lib/mobile";
import { directionsUrl, downloadCalendar, niceDate, niceTime } from "@/lib/utils";
import { AppEmpty, AppSheet, BookingCard } from "./shared";
export function AppBookings() {
  const { data } = useDemo();
  const [tab, setTab] = useState("Upcoming");
  if (!data) return null;
  const all = customerBookings(data);
  const upcoming = upcomingBookings(data);
  const cancelled = all.filter((r) => r.status === "cancelled");
  const past = all.filter((r) => r.status !== "cancelled" && !upcoming.some((u) => u.id === r.id));
  const groups = {
    Upcoming: upcoming,
    Past: past.slice().reverse(),
    Cancelled: cancelled.slice().reverse(),
  };
  const rows = groups[tab as keyof typeof groups];
  return (
    <div className="ma-bookings">
      <div className="ma-step-title">
        <span className="ma-kicker">YOUR EVENINGS, ALL IN ONE PLACE</span>
        <h2>A few good plans.</h2>
        <p>Little changes. New occasions. All taken care of.</p>
      </div>
      <div className="ma-segments" aria-label="Booking history">
        {Object.entries(groups).map(([name, rows]) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
          >
            {name}
            <span>{rows.length}</span>
          </button>
        ))}
      </div>
      <div className="ma-booking-list">
        {rows.map((r) => (
          <BookingCard key={r.id} reservation={r} />
        ))}
      </div>
      {!rows.length && (
        <AppEmpty
          title={
            tab === "Upcoming"
              ? "An evening waiting to happen."
              : tab === "Past"
                ? "Good memories start here."
                : "A little room for changed plans."
          }
          text={
            tab === "Upcoming"
              ? "Your next good evening begins with a table. Let’s find one."
              : tab === "Past"
                ? "Completed visits will be right here, ready to remember."
                : "Cancelled plans stay here. You can always find another evening."
          }
        >
          <Link href="/app/reserve" className="ma-primary">
            Find your table
            <ArrowUpRight size={18} />
          </Link>
        </AppEmpty>
      )}
      <p className="ma-demo-note">
        Bookings made on the website appear here too.
        <br />
        Saved on this device, ready when you are.
      </p>
    </div>
  );
}
export function AppBookingDetail({ id, confirmed = false }: { id: string; confirmed?: boolean }) {
  const { data, setStatus } = useDemo();
  const toast = useToast();
  const [cancel, setCancel] = useState(false);
  if (!data) return null;
  const r = data.reservations.find((row) => row.id === id && row.customerBooking);
  if (!r)
    return (
      <AppEmpty
        title="We couldn’t find this table."
        text="Your bookings are saved in the browser where you made them."
      >
        <Link className="ma-primary" href="/app/bookings">
          Your bookings
        </Link>
      </AppEmpty>
    );
  const active = ["confirmed", "arriving"].includes(r.status);
  const table = data.tables.find((t) => t.id === r.tableId);
  const heading =
    r.status === "cancelled"
      ? "Plans change."
      : r.status === "completed"
        ? "A very good evening."
        : r.status === "seated"
          ? "Your table is ready."
          : r.status === "arriving"
            ? "A warm welcome awaits."
            : confirmed
              ? "You have a dinner plan."
              : "Your evening at ARDO.";
  const share = async () => {
    const text = `ARDO · ${niceDate(r.date)} at ${niceTime(r.time)} · ${r.partySize} guests · ${r.confirmationCode}`;
    try {
      if (navigator.share) await navigator.share({ title: "Our table at ARDO", text });
      else {
        await navigator.clipboard.writeText(text);
        toast("Booking details copied.");
      }
    } catch (e) {
      if (!(e instanceof Error && e.name === "AbortError"))
        toast("Sharing isn’t available. Your reference is below.", true);
    }
  };
  return (
    <div className="ma-pass-screen">
      <div className="ma-confirm-title">
        <motion.span
          className={`ma-success-mark ${r.status === "cancelled" ? "cancelled" : ""}`}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {r.status === "cancelled" ? <X size={27} /> : <Check size={27} />}
        </motion.span>
        <span className="ma-kicker">
          {r.status === "confirmed" ? "BOOKING CONFIRMED" : r.status.toUpperCase()}
        </span>
        <h2>{heading}</h2>
        <p>
          {r.status === "cancelled"
            ? "We’ll save you a seat for another evening."
            : r.status === "completed"
              ? `It was lovely having you, ${r.guestName.split(" ")[0]}.`
              : `We’re looking forward to seeing you, ${r.guestName.split(" ")[0]}.`}
        </p>
      </div>
      <section className="ma-pass">
        <div className="ma-pass-brand">
          <span>a.</span>
          <div>
            <strong>ARDO</strong>
            <small>PARK STREET, KOLKATA</small>
          </div>
          <span className={`ma-status ${r.status}`}>{r.status}</span>
        </div>
        <div className="ma-pass-main">
          <h3>{niceDate(r.date, "EEEE, d MMMM")}</h3>
          <strong>{niceTime(r.time)}</strong>
          <div>
            <span>
              <Users size={16} />
              {r.partySize} {r.partySize === 1 ? "guest" : "guests"}
            </span>
            <span>
              <Armchair size={16} />
              {table ? `Table ${table.number}` : r.seatingPreference}
            </span>
          </div>
        </div>
        <div className="ma-pass-guest">
          <span>RESERVED FOR</span>
          <strong>{r.guestName}</strong>
          <p>
            {r.email}
            <br />
            {r.phone}
          </p>
          {r.occasion !== "None" && <span className="ma-occasion-label">{r.occasion}</span>}
          {r.specialRequests && <p className="ma-pass-note">“{r.specialRequests}”</p>}
        </div>
        <div className="ma-pass-reference">
          <span>
            YOUR BOOKING REFERENCE<strong>{r.confirmationCode}</strong>
          </span>
          <span className="ma-pass-stamp">
            <Check size={18} />
            <small>ARDO</small>
          </span>
        </div>
      </section>
      {r.status !== "cancelled" && (
        <div className="ma-pass-utilities">
          <button
            onClick={() => {
              downloadCalendar(
                r,
                data.settings.name,
                data.settings.address,
                data.settings.duration,
              );
              toast("Calendar invitation downloaded.");
            }}
          >
            <CalendarPlus size={22} />
            <span>Calendar</span>
          </button>
          <a href={directionsUrl} target="_blank" rel="noreferrer">
            <MapPin size={22} />
            <span>Directions</span>
          </a>
          <button onClick={share}>
            <Share2 size={22} />
            <span>Share</span>
          </button>
        </div>
      )}
      {active && (
        <div className="ma-manage-booking">
          <Link className="ma-primary" href={`/app/reserve?edit=${r.id}`}>
            Modify reservation
            <ChevronRight size={18} />
          </Link>
          <button className="ma-cancel-booking" onClick={() => setCancel(true)}>
            Cancel reservation
          </button>
        </div>
      )}
      <div className="ma-policy">
        <ShieldCheck size={21} />
        <p>
          We’ll hold your table for {data.settings.gracePeriod} minutes. Seating preferences are
          requests. Need a hand?{" "}
          <a href={`tel:${data.settings.phone.replace(/\s/g, "")}`}>{data.settings.phone}</a>
        </p>
      </div>
      <Link className="ma-back-to-bookings" href="/app/bookings">
        <CalendarDays size={17} />
        All your bookings
        <ChevronRight size={17} />
      </Link>
      {r.status === "seated" && (
        <p className="ma-inline-note">
          <Clock3 size={17} />
          You’re seated{table ? ` at Table ${table.number}` : ""}. Make yourself at home.
        </p>
      )}
      {cancel && (
        <AppSheet title="Another evening, perhaps?" onClose={() => setCancel(false)}>
          <div className="ma-cancel-sheet">
            <div className="ma-cancel-icon">
              <CalendarDays size={29} />
            </div>
            <h3>Cancel this reservation?</h3>
            <p>
              Your table for {r.partySize} on {niceDate(r.date)} at {niceTime(r.time)} will be
              cancelled. The booking stays in your history.
            </p>
            <button
              className="ma-primary"
              onClick={() => {
                const result = setStatus(r.id, "cancelled");
                if (result.ok) {
                  setCancel(false);
                  toast("Reservation cancelled. Until next time.");
                } else toast(result.error || "Please try again.", true);
              }}
            >
              Yes, cancel reservation
            </button>
            <button className="ma-secondary" onClick={() => setCancel(false)}>
              Keep my table
            </button>
          </div>
        </AppSheet>
      )}
    </div>
  );
}
