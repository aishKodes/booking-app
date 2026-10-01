"use client";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { useDemo } from "@/lib/store";
import { StatusBadge } from "@/components/ui";
import { initials, niceDate, niceTime } from "@/lib/utils";
import type { Reservation } from "@/lib/types";
export function ReservationTable({
  reservations,
  onSelect,
  showDate = false,
}: {
  reservations: Reservation[];
  onSelect: (id: string) => void;
  showDate?: boolean;
}) {
  const { data } = useDemo();
  return (
    <div className="reservation-table-wrap">
      <table className="reservation-table">
        <thead>
          <tr>
            <th>{showDate ? "Date & time" : "Time"}</th>
            <th>Guest</th>
            <th>Party</th>
            <th>Table</th>
            <th>Status</th>
            <th aria-label="View details" />
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr
              key={r.id}
              className={r.customerBooking ? "new-booking-row" : ""}
              onClick={() => onSelect(r.id)}
            >
              <td>
                <strong>{niceTime(r.time)}</strong>
                {showDate && <small>{niceDate(r.date)}</small>}
              </td>
              <td>
                <div className="table-guest">
                  <span className="guest-avatar">{initials(r.guestName)}</span>
                  <div>
                    <button
                      className="table-name"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(r.id);
                      }}
                    >
                      {r.guestName}
                      {r.customerBooking && <span className="new-label">NEW</span>}
                    </button>
                    <small>
                      {r.occasion !== "None" ? (
                        <>
                          <Sparkles size={11} /> {r.occasion}
                        </>
                      ) : (
                        r.seatingPreference
                      )}
                    </small>
                  </div>
                </div>
              </td>
              <td>
                {r.partySize} <span className="table-muted">guests</span>
              </td>
              <td>
                {r.tableId ? (
                  <span className="table-id">
                    T{data?.tables.find((t) => t.id === r.tableId)?.number}
                  </span>
                ) : (
                  <span className="table-muted">Unassigned</span>
                )}
              </td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td>
                <ChevronRight size={17} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="reservation-mobile-cards">
        {reservations.map((r) => (
          <button key={r.id} onClick={() => onSelect(r.id)} className="reservation-mobile-card">
            <div>
              <span className="guest-avatar">{initials(r.guestName)}</span>
              <strong>{r.guestName}</strong>
              <ArrowUpRight size={16} />
            </div>
            <span>
              {showDate ? `${niceDate(r.date)} · ` : ""}
              {niceTime(r.time)} · {r.partySize} guests ·{" "}
              {r.tableId
                ? `T${data?.tables.find((t) => t.id === r.tableId)?.number}`
                : "Unassigned"}
            </span>
            <StatusBadge status={r.status} />
          </button>
        ))}
      </div>
    </div>
  );
}
