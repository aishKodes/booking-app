"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  List,
  Search,
  SlidersHorizontal,
  ChartGantt,
  X,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { AdminHeading } from "./shell";
import { ReservationTable } from "./reservation-table";
import { ReservationDetail } from "./reservation-detail";
import { EmptyState } from "@/components/ui";
import { dateOffset, minutes, niceDate, niceTime, today } from "@/lib/utils";
export function AdminReservations({ initialBooking }: { initialBooking?: string }) {
  const { data } = useDemo();
  const [date, setDate] = useState("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [party, setParty] = useState("All parties");
  const [seating, setSeating] = useState("All seating");
  const [time, setTime] = useState("All service");
  const [view, setView] = useState("List");
  const [selected, setSelected] = useState<string | null>(initialBooking || null);
  const [pagination, setPagination] = useState({ key: "", page: 1 });
  if (!data) return null;
  const filtered = data.reservations
    .filter(
      (r) =>
        (date === "all" || r.date === date) &&
        (status === "All statuses" || r.status === status) &&
        (party === "All parties" ||
          (party === "5+ guests" ? r.partySize >= 5 : r.partySize <= 4)) &&
        (seating === "All seating" || r.seatingPreference === seating) &&
        (time === "All service" ||
          (time === "Lunch" && r.time < "16:00") ||
          (time === "Dinner" && r.time >= "16:00")) &&
        `${r.guestName} ${r.phone} ${r.confirmationCode}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      date === "all"
        ? b.date.localeCompare(a.date) || a.time.localeCompare(b.time)
        : a.time.localeCompare(b.time),
    );
  const filterKey = [date, search, status, party, seating, time].join("|");
  const page = pagination.key === filterKey ? pagination.page : 1;
  const pageCount = Math.max(1, Math.ceil(filtered.length / 20));
  const pageRows = filtered.slice((page - 1) * 20, page * 20);
  const timelineDate = date === "all" ? today() : date;
  const timeline = filtered.filter(
    (r) => r.date === timelineDate && r.time >= "18:00" && r.status !== "cancelled",
  );
  const clear = () => {
    setSearch("");
    setStatus("All statuses");
    setParty("All parties");
    setSeating("All seating");
    setTime("All service");
  };
  return (
    <>
      <AdminHeading
        eyebrow="THE RESERVATION BOOK"
        title="Every table has a story."
        description="Plan the service. Welcome the guests. Keep everything in sync."
      >
        <Link className="button button-primary" href="/restaurant/reserve">
          <CalendarPlus size={16} />
          New reservation
        </Link>
      </AdminHeading>
      <div className="reservation-controls">
        <div className="date-navigation">
          <div className="segmented">
            {[
              ["all", "All dates"],
              [today(), "Today"],
              [dateOffset(1), "Tomorrow"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={date === value ? "active" : ""}
                onClick={() => setDate(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="date-navigation-calendar">
            <button
              aria-label="Previous day"
              className="icon-button"
              onClick={() => setDate(dateOffset(-1, date === "all" ? today() : date))}
            >
              <ChevronLeft size={17} />
            </button>
            <label>
              <CalendarDays size={16} />
              <input
                type="date"
                aria-label="Reservation date filter"
                value={date === "all" ? "" : date}
                onChange={(e) => setDate(e.target.value || "all")}
              />
            </label>
            <button
              aria-label="Next day"
              className="icon-button"
              onClick={() => setDate(dateOffset(1, date === "all" ? today() : date))}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
        <div className="segmented view-selector">
          <button className={view === "List" ? "active" : ""} onClick={() => setView("List")}>
            <List size={16} />
            List
          </button>
          <button
            className={view === "Timeline" ? "active" : ""}
            onClick={() => setView("Timeline")}
          >
            <ChartGantt size={16} />
            Timeline
          </button>
        </div>
      </div>
      <section className="admin-card">
        <div className="admin-filter-bar">
          <div className="search-field">
            <Search size={17} />
            <input
              aria-label="Search reservations"
              placeholder="Search name, phone or booking code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button aria-label="Clear search" onClick={() => setSearch("")}>
                <X size={15} />
              </button>
            )}
          </div>
          <div className="admin-filters">
            <SlidersHorizontal size={15} />
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {[
                "All statuses",
                "confirmed",
                "arriving",
                "seated",
                "completed",
                "cancelled",
                "no-show",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              aria-label="Filter by party size"
              value={party}
              onChange={(e) => setParty(e.target.value)}
            >
              {["All parties", "1–4 guests", "5+ guests"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              aria-label="Filter by seating"
              value={seating}
              onChange={(e) => setSeating(e.target.value)}
            >
              {["All seating", "Main dining", "Window", "Terrace", "No preference"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              aria-label="Filter by service"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {["All service", "Lunch", "Dinner"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        {view === "List" ? (
          filtered.length ? (
            <ReservationTable
              reservations={pageRows}
              onSelect={setSelected}
              showDate={date === "all"}
            />
          ) : (
            <EmptyState
              title="A quiet page in the reservation book."
              description="No reservations match these filters."
            >
              <button className="button button-secondary" onClick={clear}>
                Clear filters
              </button>
            </EmptyState>
          )
        ) : (
          <div className="timeline-section">
            <div className="timeline-heading">
              <h2>Dinner service · {niceDate(timelineDate)}</h2>
              <span>Each booking includes {data.settings.duration} minutes at the table</span>
            </div>
            {timeline.length === 0 ? (
              <EmptyState
                title="Room for a good evening."
                description="No dinner reservations for this date and filter."
              />
            ) : (
              <div className="timeline-scroll">
                <div className="reservation-timeline">
                  <div className="timeline-hours">
                    <span>Guest / party</span>
                    {[18, 19, 20, 21, 22, 23].map((h) => (
                      <span key={h}>{h - 12} PM</span>
                    ))}
                  </div>
                  {timeline.map((r) => (
                    <div className="timeline-row" key={r.id}>
                      <div>
                        <strong>{r.guestName}</strong>
                        <small>
                          {r.partySize} guests ·{" "}
                          {r.tableId
                            ? `T${data.tables.find((t) => t.id === r.tableId)?.number}`
                            : "Unassigned"}
                        </small>
                      </div>
                      <div className="timeline-track">
                        <button
                          className={`timeline-booking timeline-${r.status}`}
                          style={{
                            left: `${((minutes(r.time) - 1080) / 360) * 100}%`,
                            width: `${(Math.min(data.settings.duration, 1440 - minutes(r.time)) / 360) * 100}%`,
                          }}
                          onClick={() => setSelected(r.id)}
                        >
                          <span>{niceTime(r.time)}</span>
                          <small>{r.status}</small>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="table-footer">
          <span>
            {view === "List" ? filtered.length : timeline.length} reservations ·{" "}
            {date === "all" && view === "List" ? "All dates" : niceDate(timelineDate)}
          </span>
          <div className="pagination-actions">
            {view === "List" && pageCount > 1 && (
              <>
                <span>
                  Page {page} of {pageCount}
                </span>
                <button
                  className="icon-button"
                  aria-label="Previous page"
                  disabled={page === 1}
                  onClick={() => setPagination({ key: filterKey, page: page - 1 })}
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Next page"
                  disabled={page === pageCount}
                  onClick={() => setPagination({ key: filterKey, page: page + 1 })}
                >
                  <ChevronRight size={15} />
                </button>
              </>
            )}
            <button className="small-link" onClick={clear}>
              Reset filters
            </button>
          </div>
        </div>
      </section>
      {selected && <ReservationDetail id={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
