"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, Users, Armchair } from "lucide-react";
import { useDemo } from "@/lib/store";
import { ConfirmDialog, EmptyState, LoadingState, StatusBadge, useToast } from "@/components/ui";
import { isBookingPast, niceDate, niceTime } from "@/lib/utils";
export function MyReservations() {
  const { data, setStatus } = useDemo();
  const [tab, setTab] = useState("Upcoming");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const toast = useToast();
  if (!data) return <LoadingState />;
  const bookings = data.reservations.filter((r) => r.customerBooking);
  const isPast = (r: (typeof bookings)[number]) =>
    ["completed", "no-show"].includes(r.status) ||
    (isBookingPast(r.date, r.time) && !["arriving", "seated"].includes(r.status));
  const matches = bookings
    .filter((r) =>
      tab === "Cancelled"
        ? r.status === "cancelled"
        : tab === "Past"
          ? r.status !== "cancelled" && isPast(r)
          : r.status !== "cancelled" && !isPast(r),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return (
    <>
      <div className="tabs reservation-tabs">
        {["Upcoming", "Past", "Cancelled"].map((t) => (
          <button className={tab === t ? "active" : ""} key={t} onClick={() => setTab(t)}>
            {t}
            <span>
              {
                bookings.filter((r) =>
                  t === "Cancelled"
                    ? r.status === "cancelled"
                    : t === "Past"
                      ? r.status !== "cancelled" && isPast(r)
                      : r.status !== "cancelled" && !isPast(r),
                ).length
              }
            </span>
          </button>
        ))}
      </div>
      {matches.length === 0 ? (
        <EmptyState
          title={
            tab === "Upcoming"
              ? "An evening waiting to happen."
              : `No ${tab.toLowerCase()} reservations.`
          }
          description={
            tab === "Upcoming"
              ? "Your next good evening starts with a table. Let’s find you one."
              : "Your reservations will appear here, saved in this browser."
          }
        >
          <Link href="/restaurant/reserve" className="button button-primary">
            Find a table <ArrowUpRight size={17} />
          </Link>
        </EmptyState>
      ) : (
        <div className="my-bookings">
          {matches.map((r) => (
            <article className="my-booking" key={r.id}>
              <div className="booking-date-block">
                <span>{niceDate(r.date, "MMM")}</span>
                <strong>{niceDate(r.date, "dd")}</strong>
                <span>{niceDate(r.date, "EEE")}</span>
              </div>
              <div className="my-booking-main">
                <div className="my-booking-title">
                  <h2>An evening at ARDO</h2>
                  <StatusBadge status={r.status} />
                </div>
                <p>
                  {r.confirmationCode} · Reserved for {r.guestName}
                </p>
                <div className="my-booking-meta">
                  <span>
                    <CalendarDays size={15} />
                    {niceDate(r.date)}
                  </span>
                  <span>
                    <Clock3 size={15} />
                    {niceTime(r.time)}
                  </span>
                  <span>
                    <Users size={15} />
                    {r.partySize} guests
                  </span>
                  <span>
                    <Armchair size={15} />
                    {r.seatingPreference}
                  </span>
                </div>
              </div>
              <div className="my-booking-actions">
                <Link href={`/restaurant/reservations/${r.id}`} className="button button-secondary">
                  View booking <ArrowUpRight size={16} />
                </Link>
                {["confirmed", "arriving"].includes(r.status) && (
                  <div>
                    <Link href={`/restaurant/reserve?edit=${r.id}`}>Modify</Link>
                    <button onClick={() => setCancelId(r.id)}>Cancel</button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      <p className="demo-disclosure">
        Your bookings are saved on this device. All restaurant and guest details in this demo are
        fictional.
      </p>
      {cancelId && (
        <ConfirmDialog
          title="Cancel this reservation?"
          description="We’ll mark this booking as cancelled. It will remain in your reservation history."
          confirm="Cancel reservation"
          danger
          onClose={() => setCancelId(null)}
          onConfirm={() => {
            setStatus(cancelId, "cancelled");
            toast("Your booking has been cancelled.");
          }}
        />
      )}
    </>
  );
}
