"use client";
import { useState } from "react";
import { ArrowUpRight, Crown, Mail, Phone, Search, Users, X } from "lucide-react";
import { useDemo } from "@/lib/store";
import { AdminHeading } from "./shell";
import { EmptyState, Modal, StatusBadge, useToast } from "@/components/ui";
import { initials, niceDate, niceTime } from "@/lib/utils";
import { ReservationDetail } from "./reservation-detail";
export function GuestBook({ initialGuest }: { initialGuest?: string }) {
  const { data, updateGuest } = useDemo();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All guests");
  const [selected, setSelected] = useState<string | null>(initialGuest || null);
  const [notes, setNotes] = useState(data?.guests.find((g) => g.id === initialGuest)?.notes || "");
  const [booking, setBooking] = useState<string | null>(null);
  if (!data) return null;
  const rows = data.guests.filter(
    (g) =>
      `${g.name} ${g.email} ${g.phone}`.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All guests" || g.tags.includes(filter)),
  );
  const history = (id: string) =>
    data.reservations.filter((r) => r.guestId === id).sort((a, b) => b.date.localeCompare(a.date));
  const visits = (id: string) => history(id).filter((r) => r.status === "completed");
  const guest = data.guests.find((g) => g.id === selected);
  const past = guest ? visits(guest.id) : [];
  const upcoming = guest
    ? history(guest.id).filter((r) => ["confirmed", "arriving", "seated"].includes(r.status))
    : [];
  const open = (id: string) => {
    setSelected(id);
    setNotes(data.guests.find((g) => g.id === id)?.notes || "");
  };
  return (
    <>
      <AdminHeading
        eyebrow="FAMILIAR FACES. BETTER SERVICE."
        title="Remember the little things."
        description="Your guest book, with the details that make a welcome personal."
      >
        <span className="admin-date">
          <Users size={17} />
          {data.guests.length} guests in your book
        </span>
      </AdminHeading>
      <div className="guest-summary">
        <div>
          <span className="guest-summary-icon">
            <Users size={21} />
          </span>
          <div>
            <strong>{data.guests.length}</strong>
            <span>guest profiles</span>
          </div>
        </div>
        <div>
          <span className="guest-summary-icon">
            <Crown size={21} />
          </span>
          <div>
            <strong>{data.guests.filter((g) => g.tags.includes("VIP")).length}</strong>
            <span>VIP guests</span>
          </div>
        </div>
        <div>
          <span className="guest-summary-icon">↻</span>
          <div>
            <strong>{data.guests.filter((g) => visits(g.id).length > 1).length}</strong>
            <span>returning guests</span>
          </div>
        </div>
      </div>
      <section className="admin-card">
        <div className="admin-filter-bar">
          <div className="search-field">
            <Search size={17} />
            <input
              value={search}
              aria-label="Search guests"
              placeholder="Search guests by name, email or phone"
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </div>
          <select
            aria-label="Guest filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {["All guests", "VIP", "Regular", "Vegetarian", "Corporate"].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
        {rows.length ? (
          <>
            <div className="guest-desktop-table">
              <table className="reservation-table guest-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Visits</th>
                    <th>Last visit</th>
                    <th>Total covers</th>
                    <th>Preferences</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((g) => (
                    <tr key={g.id} onClick={() => open(g.id)}>
                      <td>
                        <div className="table-guest">
                          <span className="guest-avatar">{initials(g.name)}</span>
                          <div>
                            <button
                              className="table-name"
                              onClick={(e) => {
                                e.stopPropagation();
                                open(g.id);
                              }}
                            >
                              {g.name}
                              {g.tags.includes("VIP") && <Crown size={13} className="vip-icon" />}
                            </button>
                            <small>{g.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{visits(g.id).length}</strong>
                      </td>
                      <td>
                        {visits(g.id)[0]
                          ? niceDate(visits(g.id)[0].date, "d MMM yyyy")
                          : "First visit ahead"}
                      </td>
                      <td>{visits(g.id).reduce((sum, r) => sum + r.partySize, 0)}</td>
                      <td>
                        <div className="guest-tags">
                          {g.tags.slice(0, 2).map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                          {!g.tags.length && <span>New guest</span>}
                        </div>
                      </td>
                      <td>
                        <ArrowUpRight size={16} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="guest-mobile-list">
              {rows.map((g) => (
                <button key={g.id} onClick={() => open(g.id)}>
                  <span className="guest-avatar">{initials(g.name)}</span>
                  <div>
                    <strong>{g.name}</strong>
                    <span>
                      {visits(g.id).length} visits · {g.phone}
                    </span>
                  </div>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No familiar faces here just yet."
            description="Try a different name or clear your guest filter."
          />
        )}
        <div className="table-footer">
          <span>{rows.length} guests · Fictional data</span>
          <span>New bookings create guest profiles automatically</span>
        </div>
      </section>
      {guest && (
        <Modal drawer title="Guest profile" onClose={() => setSelected(null)}>
          <div className="detail-guest">
            <span className="guest-avatar large">{initials(guest.name)}</span>
            <div>
              <h3>{guest.name}</h3>
              <span>
                {past.length
                  ? `A familiar face · ${past.length} completed ${past.length === 1 ? "visit" : "visits"}`
                  : "A new face to welcome"}
              </span>
            </div>
          </div>
          <div className="detail-contact">
            <span>
              <Phone size={16} />
              {guest.phone}
            </span>
            <span>
              <Mail size={16} />
              {guest.email}
            </span>
          </div>
          <div className="guest-tags">
            {guest.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="guest-profile-stats">
            <div>
              <strong>{past.length}</strong>
              <span>visits</span>
            </div>
            <div>
              <strong>{past.reduce((sum, r) => sum + r.partySize, 0)}</strong>
              <span>total covers</span>
            </div>
            <div>
              <strong>
                {past.length
                  ? (past.reduce((sum, r) => sum + r.partySize, 0) / past.length).toFixed(1)
                  : "—"}
              </strong>
              <span>avg. party</span>
            </div>
          </div>
          <section className="drawer-section">
            <h3>Preferences & service notes</h3>
            {guest.favoriteTable && (
              <p className="muted">
                Favourite spot · Table{" "}
                {data.tables.find((t) => t.id === guest.favoriteTable)?.number}
              </p>
            )}
            <label className="form-label">
              Internal notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="The little details that make their next visit better."
                maxLength={1000}
              />
            </label>
            <button
              className="button button-secondary"
              onClick={() => {
                updateGuest(guest.id, { notes });
                toast("Guest notes saved.");
              }}
            >
              Save notes
            </button>
            <button
              className="small-link vip-toggle"
              onClick={() => {
                updateGuest(guest.id, {
                  tags: guest.tags.includes("VIP")
                    ? guest.tags.filter((t) => t !== "VIP")
                    : [...guest.tags, "VIP"],
                });
                toast(guest.tags.includes("VIP") ? "VIP tag removed." : "Guest marked as VIP.");
              }}
            >
              <Crown size={15} />
              {guest.tags.includes("VIP") ? "Remove VIP status" : "Mark as VIP"}
            </button>
          </section>
          <section className="drawer-section">
            <h3>Upcoming & active bookings</h3>
            {upcoming.length ? (
              upcoming.map((r) => (
                <button
                  className="guest-booking-item"
                  key={r.id}
                  onClick={() => {
                    setSelected(null);
                    setBooking(r.id);
                  }}
                >
                  <div>
                    <strong>
                      {niceDate(r.date)} · {niceTime(r.time)}
                    </strong>
                    <span>
                      {r.partySize} guests ·{" "}
                      {r.occasion === "None" ? r.seatingPreference : r.occasion}
                    </span>
                  </div>
                  <StatusBadge status={r.status} />
                </button>
              ))
            ) : (
              <p className="muted">No upcoming bookings.</p>
            )}
          </section>
          <section className="drawer-section">
            <h3>Past visits</h3>
            {past.length ? (
              past.slice(0, 6).map((r) => (
                <div className="guest-booking-item" key={r.id}>
                  <div>
                    <strong>{niceDate(r.date, "d MMM yyyy")}</strong>
                    <span>
                      {r.partySize} guests · {niceTime(r.time)}
                    </span>
                  </div>
                  <StatusBadge status="completed" />
                </div>
              ))
            ) : (
              <p className="muted">Their first visit is still ahead.</p>
            )}
          </section>
        </Modal>
      )}
      {booking && <ReservationDetail id={booking} onClose={() => setBooking(null)} />}
    </>
  );
}
