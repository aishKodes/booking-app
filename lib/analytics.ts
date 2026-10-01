import type { DemoState } from "./types";
import { dateOffset, niceDate, today } from "./utils";
export function analytics(s: DemoState, days = 7) {
  const start = dateOffset(-(days - 1));
  const rows = s.reservations.filter((r) => r.date >= start && r.date <= today());
  const active = rows.filter((r) => !["cancelled", "no-show"].includes(r.status));
  const daily = Array.from({ length: days }, (_, i) => {
    const date = dateOffset(i - days + 1);
    const bookings = active.filter((r) => r.date === date);
    return {
      date,
      label: niceDate(date, days === 7 ? "EEE" : "d MMM"),
      reservations: bookings.length,
      covers: bookings.reduce((sum, r) => sum + r.partySize, 0),
    };
  });
  const hourly = Array.from({ length: 6 }, (_, i) => {
    const h = i + 18;
    const bookings = active.filter((r) => Number(r.time.slice(0, 2)) === h);
    return { label: `${h - 12} PM`, covers: bookings.reduce((sum, r) => sum + r.partySize, 0) };
  });
  const sources = ["Website", "Mobile App", "Phone", "Walk-in"]
    .map((name) => ({ name, value: rows.filter((r) => r.source === name).length }))
    .filter((d) => d.value > 0);
  const party = [1, 2, 3, 4, 5, 6, 7, 8]
    .map((n) => ({ label: `${n}`, reservations: active.filter((r) => r.partySize === n).length }))
    .filter((p) => p.reservations > 0);
  const guests = [...new Set(active.map((r) => r.guestId))];
  const returning = guests.filter((id) =>
    active.some(
      (booking) =>
        booking.guestId === id &&
        s.reservations.some(
          (previous) =>
            previous.guestId === id &&
            previous.status === "completed" &&
            `${previous.date}T${previous.time}` < `${booking.date}T${booking.time}`,
        ),
    ),
  ).length;
  return {
    daily,
    hourly,
    sources,
    party,
    total: rows.length,
    covers: active.reduce((sum, r) => sum + r.partySize, 0),
    cancellation: rows.length
      ? (rows.filter((r) => r.status === "cancelled").length / rows.length) * 100
      : 0,
    averageParty: active.length
      ? active.reduce((sum, r) => sum + r.partySize, 0) / active.length
      : 0,
    returning: guests.length ? (returning / guests.length) * 100 : 0,
    peak: hourly.reduce((best, h) => (h.covers > best.covers ? h : best), hourly[0]),
  };
}
