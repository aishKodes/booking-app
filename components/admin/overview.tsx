"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Armchair,
  CalendarPlus,
  Clock3,
  Sparkles,
  Users,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { AdminDate, AdminHeading } from "./shell";
import { ReservationTable } from "./reservation-table";
import { ReservationDetail } from "./reservation-detail";
import { TrendChart } from "./charts";
import { analytics } from "@/lib/analytics";
import { money, niceDate, niceTime, today } from "@/lib/utils";
export function Overview() {
  const { data } = useDemo();
  const [selected, setSelected] = useState<string | null>(null);
  if (!data) return null;
  const rows = data.reservations
    .filter((r) => r.date === today())
    .sort((a, b) => a.time.localeCompare(b.time));
  const live = data.reservations.filter((r) => r.status === "seated");
  const arrivals = data.reservations.filter((r) => r.status === "arriving");
  const active = rows.filter((r) => !["cancelled", "no-show"].includes(r.status));
  const covers = active.reduce((sum, r) => sum + r.partySize, 0);
  const seated = live.reduce((sum, r) => sum + r.partySize, 0);
  const capacity = data.tables.reduce((sum, t) => sum + t.capacity, 0);
  const occupancy = Math.round((seated / capacity) * 100);
  const stats = analytics(data);
  const newBooking = data.reservations.find((r) => r.customerBooking && r.status === "confirmed");
  return (
    <>
      <AdminHeading
        eyebrow="YOUR RESTAURANT, AT A GLANCE"
        title="A good evening starts here."
        description="Welcome back, Neel. Here’s what’s happening at ARDO."
      >
        <AdminDate />
        <Link href="/restaurant/reserve" className="button button-primary">
          <CalendarPlus size={16} />
          New reservation
        </Link>
      </AdminHeading>
      {newBooking && (
        <button className="new-reservation-alert" onClick={() => setSelected(newBooking.id)}>
          <span className="alert-icon">
            <CalendarPlus size={18} />
          </span>
          <div>
            <strong>A new table to welcome.</strong>
            <span>
              {newBooking.guestName} · {newBooking.partySize} guests · {niceDate(newBooking.date)}{" "}
              at {niceTime(newBooking.time)}
            </span>
          </div>
          <span>
            View booking <ArrowUpRight size={16} />
          </span>
        </button>
      )}
      <div className="kpi-row">
        <div>
          <span>Today’s covers</span>
          <strong>
            {covers}
            <small>guests</small>
          </strong>
          <p>
            <Users size={13} /> {active.length} reservations on the books
          </p>
        </div>
        <div>
          <span>Reservations</span>
          <strong>
            {active.length}
            <small>today</small>
          </strong>
          <p>
            {rows.filter((r) => r.status === "completed").length} completed ·{" "}
            {rows.filter((r) => r.status === "cancelled").length} cancelled
          </p>
        </div>
        <div>
          <span>Live occupancy</span>
          <strong>
            {occupancy}
            <small>%</small>
          </strong>
          <p>
            <i className="green-dot" /> {live.length} of {data.tables.length} tables occupied
          </p>
        </div>
        <div>
          <span>Expected spend</span>
          <strong className="revenue-value">{money(covers * 1450)}</strong>
          <p>Forecast at ₹1,450 per cover</p>
        </div>
      </div>
      <div className="overview-main-grid">
        <section className="admin-card today-card">
          <div className="card-heading">
            <div>
              <h2>
                Today’s reservations <span className="count-chip">{rows.length}</span>
              </h2>
              <p>The people making an evening of it.</p>
            </div>
            <Link href="/admin/reservations" className="small-link">
              View all <ArrowUpRight size={15} />
            </Link>
          </div>
          <ReservationTable
            reservations={rows.filter((r) => r.status !== "cancelled").slice(0, 6)}
            onSelect={setSelected}
          />
          <div className="table-footer">
            <span>
              <i className="green-dot" /> All reservations synced
            </span>
            <Link href="/admin/reservations">
              Open reservation book <ArrowRight size={14} />
            </Link>
          </div>
        </section>
        <aside className="service-card">
          <div className="service-top">
            <span className="live-label">
              <i /> SERVICE SNAPSHOT
            </span>
            <span>Dinner</span>
          </div>
          <h2>
            The room,
            <br />
            right now.
          </h2>
          <div className="service-cover-number">
            {seated}
            <span>/ {capacity}</span>
          </div>
          <span className="service-cover-label">guests currently seated</span>
          <div className="service-progress">
            <i style={{ width: `${occupancy}%` }} />
          </div>
          <div className="service-stat-grid">
            <div>
              <strong>{live.length}</strong>
              <span>tables occupied</span>
            </div>
            <div>
              <strong>{arrivals.length}</strong>
              <span>{arrivals.length === 1 ? "party" : "parties"} checked in</span>
            </div>
          </div>
          <div className="mini-floor">
            {data.tables.map((t) => {
              const occupied = live.some((r) => r.tableId === t.id);
              const reserved = data.reservations.some(
                (r) =>
                  r.tableId === t.id &&
                  ["confirmed", "arriving"].includes(r.status) &&
                  r.date >= today(),
              );
              const state = occupied
                ? "occupied"
                : t.turnover
                  ? "turnover"
                  : reserved
                    ? "reserved"
                    : "available";
              return (
                <Link
                  href="/admin/floor"
                  aria-label={`Table ${t.number}, ${state === "turnover" ? "needs reset" : state}`}
                  className={state}
                  key={t.id}
                >
                  T{t.number}
                </Link>
              );
            })}
          </div>
          <Link href="/admin/floor" className="service-floor-link">
            Open floor plan <ArrowUpRight size={18} />
          </Link>
          <span className="service-demo-note">Illustrative service · Persisted demo state</span>
        </aside>
      </div>
      <div className="overview-bottom-grid">
        <section className="admin-card">
          <div className="card-heading">
            <div>
              <h2>Reservations this week</h2>
              <p>A little perspective on the past seven days.</p>
            </div>
            <span className="chart-total">
              {stats.total}
              <small>bookings</small>
            </span>
          </div>
          <TrendChart data={stats.daily} />
          <div className="chart-insight">
            <Sparkles size={15} /> Based on your actual demo reservation history.
          </div>
        </section>
        <section className="admin-card attention-card">
          <div className="card-heading">
            <div>
              <h2>A little extra attention</h2>
              <p>Small details. Better evenings.</p>
            </div>
            <Sparkles size={18} />
          </div>
          {rows
            .filter((r) => r.occasion !== "None" && r.status !== "cancelled")
            .slice(0, 3)
            .map((r) => (
              <button className="attention-item" key={r.id} onClick={() => setSelected(r.id)}>
                <span className="attention-icon">{r.occasion === "Birthday" ? "✧" : "♡"}</span>
                <div>
                  <strong>{r.guestName}</strong>
                  <span>
                    {r.occasion} · {niceTime(r.time)} · {r.partySize} guests
                  </span>
                </div>
                <ArrowUpRight size={16} />
              </button>
            ))}
          <div className="attention-note">
            <Armchair size={18} />
            <div>
              <strong>
                {data.tables.filter((t) => t.turnover).length} table ready for a reset
              </strong>
              <span>A quick turnover keeps the evening moving.</span>
            </div>
          </div>
          <div className="attention-note">
            <Clock3 size={18} />
            <div>
              <strong>{data.settings.gracePeriod}-minute grace period</strong>
              <span>A little room for Kolkata traffic.</span>
            </div>
          </div>
        </section>
      </div>
      {selected && <ReservationDetail id={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
