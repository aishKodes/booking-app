"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarPlus,
  Check,
  MapPin,
  Share2,
  CalendarDays,
  Clock3,
  Users,
  Armchair,
  X,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { ConfirmDialog, EmptyState, LoadingState, StatusBadge, useToast } from "@/components/ui";
import { directionsUrl, downloadCalendar, niceDate, niceTime } from "@/lib/utils";
export function ReservationPass({ id }: { id: string }) {
  const { data, setStatus } = useDemo();
  const [cancel, setCancel] = useState(false);
  const toast = useToast();
  if (!data) return <LoadingState />;
  const r = data.reservations.find((row) => row.id === id && row.customerBooking);
  if (!r)
    return (
      <div className="container public-page">
        <EmptyState
          title="We couldn’t find this reservation."
          description="Your bookings are saved in the browser where you made them."
        >
          <Link href="/restaurant/reservations" className="button button-primary">
            My reservations
          </Link>
        </EmptyState>
      </div>
    );
  const active = ["confirmed", "arriving"].includes(r.status);
  const share = async () => {
    const text = `${data.settings.name} · ${niceDate(r.date)} at ${niceTime(r.time)} · ${r.partySize} guests · ${r.confirmationCode}`;
    try {
      if (navigator.share) await navigator.share({ title: "Our table at ARDO", text });
      else {
        await navigator.clipboard.writeText(text);
        toast("Reservation details copied to clipboard.");
      }
    } catch (e) {
      if (!(e instanceof Error && e.name === "AbortError"))
        toast("Sharing isn’t available. Your booking code is shown below.", true);
    }
  };
  return (
    <div className="container confirmation-page">
      <Link href="/restaurant/reservations" className="back-link">
        <ArrowLeft size={16} /> My reservations
      </Link>
      <div className="confirmation-heading">
        <span className={`success-icon ${r.status === "cancelled" ? "cancelled-icon" : ""}`}>
          {r.status === "cancelled" ? <X size={28} /> : <Check size={28} />}
        </span>
        <span className="eyebrow">
          {r.status === "cancelled"
            ? "UNTIL NEXT TIME"
            : r.status === "completed"
              ? "GOOD EVENINGS. GOOD MEMORIES."
              : "WE’RE LOOKING FORWARD TO IT"}
        </span>
        <h1>
          {r.status === "cancelled"
            ? "Plans change."
            : r.status === "completed"
              ? "Thank you for joining us."
              : "Your table is waiting."}
        </h1>
        <p>
          {r.status === "cancelled"
            ? "Your booking is cancelled. We’ll keep a seat for another evening."
            : r.status === "completed"
              ? `It was lovely having you, ${r.guestName.split(" ")[0]}. Here’s a little record of your visit.`
              : `You’re all set, ${r.guestName.split(" ")[0]}. Here are the details for your evening.`}
        </p>
      </div>
      <div className="reservation-pass">
        <div className="pass-top">
          <span className="brand">
            ARDO<span>FIRE. FOOD. FEELING.</span>
          </span>
          <StatusBadge status={r.status} />
        </div>
        <div className="pass-location">
          <MapPin size={15} />
          {data.settings.address}
        </div>
        <div className="pass-grid">
          <div>
            <CalendarDays size={20} />
            <span>Date</span>
            <strong>{niceDate(r.date, "EEE, d MMM yyyy")}</strong>
          </div>
          <div>
            <Clock3 size={20} />
            <span>Time</span>
            <strong>{niceTime(r.time)}</strong>
          </div>
          <div>
            <Users size={20} />
            <span>Party size</span>
            <strong>
              {r.partySize} {r.partySize === 1 ? "guest" : "guests"}
            </strong>
          </div>
          <div>
            <Armchair size={20} />
            <span>Seating preference</span>
            <strong>{r.seatingPreference}</strong>
          </div>
        </div>
        <div className="pass-guest">
          <div>
            <span>RESERVED FOR</span>
            <strong>{r.guestName}</strong>
            <p>
              {r.email}
              <br />
              {r.phone}
            </p>
          </div>
          {r.occasion !== "None" && <span className="occasion-tag">{r.occasion}</span>}
        </div>
        {r.specialRequests && (
          <div className="pass-request">
            <strong>A little note for the team</strong>
            <p>{r.specialRequests}</p>
          </div>
        )}
        <div className="pass-code">
          <div>
            <span>YOUR BOOKING REFERENCE</span>
            <strong>{r.confirmationCode}</strong>
          </div>
          <span className="pass-monogram">a.</span>
        </div>
      </div>
      <div className="pass-actions">
        {r.status !== "cancelled" && (
          <button
            className="button button-secondary"
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
            <CalendarPlus size={17} /> Add to calendar
          </button>
        )}
        <a
          className="button button-secondary"
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={17} /> Directions
        </a>
        <button className="button button-secondary" onClick={share}>
          <Share2 size={17} /> Share details
        </button>
      </div>
      {active && (
        <div className="pass-manage">
          <Link href={`/restaurant/reserve?edit=${r.id}`} className="text-link">
            Modify booking <ArrowUpRight size={15} />
          </Link>
          <button className="small-link muted" onClick={() => setCancel(true)}>
            Cancel booking
          </button>
        </div>
      )}
      <div className="confirmation-help">
        <p>
          We’ll hold your table for {data.settings.gracePeriod} minutes.
          <br />
          Questions or a change of plans? {data.settings.phone}
        </p>
        <small>
          Fictional restaurant demo · No email or SMS is sent.
          <br />
          Your reservation is saved in this browser and visible in the{" "}
          <Link href="/admin/reservations">restaurant dashboard</Link>.
        </small>
      </div>
      {cancel && (
        <ConfirmDialog
          title="Cancel your evening?"
          description="Your reservation will be marked as cancelled. You can always book another table when the time is right."
          confirm="Cancel reservation"
          danger
          onClose={() => setCancel(false)}
          onConfirm={() => {
            setStatus(r.id, "cancelled");
            toast("Your reservation has been cancelled.");
          }}
        />
      )}
    </div>
  );
}
