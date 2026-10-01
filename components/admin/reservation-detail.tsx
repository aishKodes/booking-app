"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Armchair,
  CalendarDays,
  Clock3,
  Mail,
  Phone,
  Users,
  ArrowUpRight,
  Check,
  UserRoundCheck,
  CircleCheck,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { ConfirmDialog, Modal, StatusBadge, useToast } from "@/components/ui";
import { initials, niceDate, niceTime } from "@/lib/utils";
import type { ReservationStatus } from "@/lib/types";
export function ReservationDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, setStatus, assignTable } = useDemo();
  const toast = useToast();
  const [tableId, setTableId] = useState("");
  const [confirm, setConfirm] = useState<ReservationStatus | null>(null);
  const r = data?.reservations.find((row) => row.id === id);
  if (!data || !r) return null;
  const guest = data.guests.find((g) => g.id === r.guestId);
  const visits = data.reservations.filter(
    (row) => row.guestId === r.guestId && row.status === "completed",
  ).length;
  const changeStatus = (status: ReservationStatus) => {
    const result = setStatus(id, status);
    toast(
      result.ok
        ? status === "arriving"
          ? `${r.guestName} is checked in.`
          : `Reservation marked ${status}.`
        : result.error || "Couldn’t update reservation.",
      !result.ok,
    );
  };
  const active = ["confirmed", "arriving", "seated"].includes(r.status);
  return (
    <>
      <Modal drawer title="Reservation details" onClose={onClose}>
        <div className="detail-guest">
          <span className="guest-avatar large">{initials(r.guestName)}</span>
          <div>
            <h3>{r.guestName}</h3>
            <span>
              {visits
                ? `Returning guest · ${visits} ${visits === 1 ? "visit" : "visits"}`
                : "First visit · Let’s make it a good one"}
            </span>
          </div>
          <StatusBadge status={r.status} />
        </div>
        <div className="detail-contact">
          <span>
            <Phone size={16} />
            {r.phone}
          </span>
          <span>
            <Mail size={16} />
            {r.email}
          </span>
        </div>
        {guest?.tags.length ? (
          <div className="guest-tags">
            {guest.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        ) : null}
        <div className="detail-booking-grid">
          <div>
            <CalendarDays size={18} />
            <span>Date</span>
            <strong>{niceDate(r.date, "EEE, d MMM yyyy")}</strong>
          </div>
          <div>
            <Clock3 size={18} />
            <span>Time</span>
            <strong>{niceTime(r.time)}</strong>
          </div>
          <div>
            <Users size={18} />
            <span>Party size</span>
            <strong>{r.partySize} guests</strong>
          </div>
          <div>
            <Armchair size={18} />
            <span>Preference</span>
            <strong>{r.seatingPreference}</strong>
          </div>
        </div>
        {r.occasion !== "None" && (
          <div className="occasion-note">
            <span>✦</span>
            <div>
              <strong>{r.occasion}</strong>
              <span>A little extra attention goes a long way.</span>
            </div>
          </div>
        )}
        <section className="drawer-section">
          <h3>Table assignment</h3>
          <p className="muted">
            {r.tableId
              ? `Currently assigned to Table ${data.tables.find((t) => t.id === r.tableId)?.number}.`
              : "Choose the right spot for this party."}
          </p>
          {active && (
            <div className="assign-control">
              <select
                aria-label="Assign a table"
                value={tableId || r.tableId || ""}
                onChange={(e) => setTableId(e.target.value)}
              >
                <option value="">Select a table</option>
                {data.tables
                  .filter((t) => t.capacity >= r.partySize)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      T{t.number} · {t.capacity} seats · {t.section}
                      {t.turnover ? " · Needs reset" : ""}
                    </option>
                  ))}
              </select>
              <button
                className="button button-primary"
                onClick={() => {
                  const result = assignTable(r.id, tableId || r.tableId || "");
                  toast(
                    result.ok
                      ? `Assigned to Table ${data.tables.find((t) => t.id === (tableId || r.tableId))?.number}.`
                      : result.error || "Choose a table.",
                    !result.ok,
                  );
                }}
              >
                Assign
              </button>
            </div>
          )}
        </section>
        <section className="drawer-section">
          <h3>Notes for service</h3>
          <p className="note-box">
            {r.specialRequests || "No special requests for this reservation."}
          </p>
          {guest?.notes && (
            <p className="internal-note">
              <strong>Guest preference</strong>
              {guest.notes}
            </p>
          )}
        </section>
        <section className="drawer-section">
          <h3>Booking information</h3>
          <dl className="detail-definition">
            <dt>Reference</dt>
            <dd>{r.confirmationCode}</dd>
            <dt>Source</dt>
            <dd>{r.source}</dd>
            <dt>Created</dt>
            <dd>{niceDate(r.createdAt.slice(0, 10), "d MMM yyyy")}</dd>
          </dl>
          <Link className="small-link" href={`/admin/guests?guest=${r.guestId}`} onClick={onClose}>
            Open guest profile <ArrowUpRight size={14} />
          </Link>
        </section>
        {active && (
          <div className="drawer-sticky-actions">
            {r.status === "confirmed" && (
              <button className="button button-primary" onClick={() => changeStatus("arriving")}>
                <UserRoundCheck size={17} />
                Check in guest
              </button>
            )}
            {["confirmed", "arriving"].includes(r.status) && (
              <button
                className={`button ${r.status === "arriving" ? "button-primary" : "button-secondary"}`}
                onClick={() => changeStatus("seated")}
              >
                <Armchair size={17} />
                Seat guests
              </button>
            )}
            {r.status === "seated" && (
              <button className="button button-primary" onClick={() => changeStatus("completed")}>
                <CircleCheck size={18} />
                Complete visit
              </button>
            )}
            <div>
              <button className="small-link" onClick={() => setConfirm("cancelled")}>
                Cancel reservation
              </button>
              {r.status !== "seated" && (
                <button className="small-link muted" onClick={() => setConfirm("no-show")}>
                  Mark no-show
                </button>
              )}
            </div>
          </div>
        )}
        {["cancelled", "no-show"].includes(r.status) && (
          <button className="button button-secondary" onClick={() => changeStatus("confirmed")}>
            <Check size={17} />
            Restore reservation
          </button>
        )}
      </Modal>
      {confirm && (
        <ConfirmDialog
          title={
            confirm === "cancelled" ? "Cancel this reservation?" : "Mark this guest as a no-show?"
          }
          description="This change will be saved to the reservation and guest history."
          confirm={confirm === "cancelled" ? "Cancel reservation" : "Mark no-show"}
          danger
          onClose={() => setConfirm(null)}
          onConfirm={() => changeStatus(confirm)}
        />
      )}
    </>
  );
}
