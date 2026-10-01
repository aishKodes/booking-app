"use client";
import { useState } from "react";
import { Armchair, ArrowUpRight, Clock3, LayoutGrid, Users, Utensils } from "lucide-react";
import { useDemo } from "@/lib/store";
import { AdminHeading } from "./shell";
import { Modal, StatusBadge, useToast } from "@/components/ui";
import { ReservationDetail } from "./reservation-detail";
import { niceDate, niceTime, today } from "@/lib/utils";
import type { DiningTable } from "@/lib/types";
export function FloorPlan() {
  const { data, assignTable, clearTable } = useDemo();
  const toast = useToast();
  const [section, setSection] = useState("All sections");
  const [selected, setSelected] = useState<DiningTable | null>(null);
  const [reservation, setReservation] = useState("");
  const [details, setDetails] = useState<string | null>(null);
  if (!data) return null;
  const tableReservations = (id: string) =>
    data.reservations
      .filter(
        (r) =>
          r.tableId === id &&
          ["confirmed", "arriving", "seated"].includes(r.status) &&
          (r.date >= today() || r.status === "seated"),
      )
      .sort((a, b) =>
        a.status === "seated"
          ? -1
          : b.status === "seated"
            ? 1
            : a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      );
  const status = (t: DiningTable) => {
    const rows = tableReservations(t.id);
    return rows.some((r) => r.status === "seated")
      ? "occupied"
      : t.turnover
        ? "turnover"
        : rows.length
          ? "reserved"
          : "available";
  };
  const tables = data.tables.filter((t) => section === "All sections" || t.section === section);
  const occupied = data.tables.filter((t) => status(t) === "occupied");
  const covers = data.reservations
    .filter((r) => r.status === "seated")
    .reduce((sum, r) => sum + r.partySize, 0);
  const checkedIn = data.reservations.filter((r) => r.status === "arriving").length;
  const selectedTable = data.tables.find((t) => t.id === selected?.id);
  const current = selectedTable ? tableReservations(selectedTable.id)[0] : undefined;
  const candidates = data.reservations.filter(
    (r) =>
      ["confirmed", "arriving"].includes(r.status) &&
      r.partySize <= (selectedTable?.capacity || 0) &&
      r.date >= today(),
  );
  return (
    <>
      <AdminHeading
        eyebrow="A PLACE FOR EVERYONE"
        title="Keep the evening moving."
        description="A clear view of your room. A little less guesswork."
      >
        <span className="live-service-tag">
          <i className="green-dot" />
          Service mode
        </span>
      </AdminHeading>
      <div className="floor-service-stats">
        <div>
          <Users size={19} />
          <span>
            Current covers<strong>{covers}</strong>
          </span>
        </div>
        <div>
          <Armchair size={19} />
          <span>
            Available tables
            <strong>{data.tables.filter((t) => status(t) === "available").length}</strong>
          </span>
        </div>
        <div>
          <Utensils size={19} />
          <span>
            Occupied<strong>{occupied.length}</strong>
          </span>
        </div>
        <div>
          <Clock3 size={19} />
          <span>
            Checked in
            <strong>
              {checkedIn} {checkedIn === 1 ? "party" : "parties"}
            </strong>
          </span>
        </div>
      </div>
      <section className="admin-card floor-card">
        <div className="floor-toolbar">
          <div className="floor-tabs">
            {["All sections", "Main dining", "Window", "Terrace", "Private dining"].map((s) => (
              <button
                className={section === s ? "active" : ""}
                key={s}
                onClick={() => setSection(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <span>
            <LayoutGrid size={15} /> {tables.length} tables
          </span>
        </div>
        <div className="floor-plan">
          <div className="floor-window-wall">
            <span>WINDOWS · PARK STREET</span>
          </div>
          <div className="floor-zone-label main-zone">MAIN DINING</div>
          <div className="floor-zone-label terrace-zone">TERRACE</div>
          <div className="floor-zone-label private-zone">PRIVATE DINING</div>
          <div className="floor-wall terrace-wall" />
          <div className="floor-entry">
            ENTRANCE <ArrowUpRight size={14} />
          </div>
          <div className="floor-bar">
            THE BAR <span>◦ ◦ ◦ ◦ ◦ ◦</span>
          </div>
          {tables.map((t) => {
            const state = status(t);
            const r = tableReservations(t.id)[0];
            return (
              <button
                className={`floor-table floor-${state} table-${t.shape} capacity-${t.capacity}`}
                key={t.id}
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
                onClick={() => {
                  setSelected(t);
                  setReservation("");
                }}
                aria-label={`Table ${t.number}, ${t.capacity} seats, ${state}`}
              >
                <span className="chair chair-top" />
                <span className="chair chair-bottom" />
                {t.capacity >= 4 && (
                  <>
                    <span className="chair chair-left" />
                    <span className="chair chair-right" />
                  </>
                )}
                <span className="table-surface">
                  <strong>T{t.number}</strong>
                  <small>{t.capacity} seats</small>
                </span>
                <span className="floor-table-state">
                  {state === "turnover" ? "Reset needed" : state}
                </span>
                {r && <span className="floor-table-guest">{r.guestName.split(" ")[0]}</span>}
              </button>
            );
          })}
        </div>
        <div className="mobile-floor-grid">
          {tables.map((t) => (
            <button
              className={`mobile-floor-table floor-${status(t)}`}
              key={t.id}
              onClick={() => {
                setSelected(t);
                setReservation("");
              }}
            >
              <span>
                <strong>T{t.number}</strong>
                <Armchair size={19} />
              </span>
              <span>
                {t.capacity} seats · {t.section}
              </span>
              <StatusBadge status={status(t)} />
            </button>
          ))}
        </div>
        <div className="floor-legend">
          {["available", "reserved", "occupied", "turnover"].map((s) => (
            <span key={s}>
              <i className={`legend-${s}`} />
              {s === "turnover" ? "Needs reset" : s}
            </span>
          ))}
          <span className="floor-tip">Select a table to manage its service.</span>
        </div>
      </section>
      {selectedTable && (
        <Modal title={`Table ${selectedTable.number}`} drawer onClose={() => setSelected(null)}>
          <div className="table-detail-hero">
            <Armchair size={42} />
            <div>
              <strong>{selectedTable.capacity} seats</strong>
              <span>{selectedTable.section}</span>
            </div>
            <StatusBadge status={status(selectedTable)} />
          </div>
          {current ? (
            <section className="drawer-section">
              <h3>{current.status === "seated" ? "Currently seated" : "Next reservation"}</h3>
              <button
                className="table-current-guest"
                onClick={() => {
                  setDetails(current.id);
                  setSelected(null);
                }}
              >
                <div>
                  <strong>{current.guestName}</strong>
                  <span>
                    {niceDate(current.date)} · {niceTime(current.time)} · {current.partySize} guests
                  </span>
                </div>
                <ArrowUpRight size={17} />
              </button>
              <StatusBadge status={current.status} />
              {current.specialRequests && <p className="note-box">{current.specialRequests}</p>}
            </section>
          ) : (
            <section className="drawer-section">
              <h3>A fresh table, ready for company.</h3>
              <p className="muted">No active reservation assigned.</p>
            </section>
          )}
          {selectedTable.turnover && (
            <section className="drawer-section">
              <h3>A quick reset.</h3>
              <p className="muted">Clear, clean, and set this table for the next guests.</p>
              <button
                className="button button-primary"
                onClick={() => {
                  clearTable(selectedTable.id);
                  toast(`Table ${selectedTable.number} is ready for guests.`);
                }}
              >
                Mark table ready
              </button>
            </section>
          )}
          <section className="drawer-section">
            <h3>Assign a reservation</h3>
            <p className="muted">Showing active parties that fit this table.</p>
            <label className="form-label">
              Reservation
              <select
                value={reservation}
                aria-label="Reservation to assign"
                onChange={(e) => setReservation(e.target.value)}
              >
                <option value="">Choose a reservation</option>
                {candidates.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.guestName} · {r.partySize} guests · {niceDate(r.date)} {niceTime(r.time)}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="button button-primary full-button"
              disabled={!reservation}
              onClick={() => {
                const result = assignTable(reservation, selectedTable.id);
                toast(
                  result.ok
                    ? `Reservation assigned to Table ${selectedTable.number}.`
                    : result.error || "Couldn’t assign table.",
                  !result.ok,
                );
              }}
            >
              Assign to Table {selectedTable.number}
            </button>
          </section>
          {selectedTable && tableReservations(selectedTable.id).length > 1 && (
            <section className="drawer-section">
              <h3>Coming up at this table</h3>
              {tableReservations(selectedTable.id)
                .slice(1)
                .map((r) => (
                  <p className="muted" key={r.id}>
                    {r.guestName} · {niceDate(r.date)} · {niceTime(r.time)}
                  </p>
                ))}
            </section>
          )}
        </Modal>
      )}
      {details && <ReservationDetail id={details} onClose={() => setDetails(null)} />}
    </>
  );
}
