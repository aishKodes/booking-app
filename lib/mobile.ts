import type { DemoState } from "./types";
import { dateOffset, isBookingPast, niceDate, niceTime, today } from "./utils";
export const experiences = [
  {
    id: "chef",
    title: "The chef’s table",
    subtitle: "Six courses. A slower evening.",
    image: "/images/grill.jpg",
    href: "/app/reserve?occasion=Celebration",
  },
  {
    id: "brunch",
    title: "Weekend brunch",
    subtitle: "Good afternoons start here.",
    image: "/images/garden.jpg",
    href: "/app/reserve?time=12:30",
  },
  {
    id: "date",
    title: "Dinner for two",
    subtitle: "A little time, just for you.",
    image: "/images/cocktail.jpg",
    href: "/app/reserve?occasion=Date+Night&guests=2",
  },
  {
    id: "private",
    title: "Your own occasion",
    subtitle: "Bring all your favourite people.",
    image: "/images/interior.jpg",
    href: "/app/profile?section=private",
  },
];
export function customerBookings(data: DemoState) {
  return data.reservations
    .filter((r) => r.customerBooking)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
}
export function upcomingBookings(data: DemoState) {
  return customerBookings(data).filter(
    (r) =>
      !["cancelled", "no-show", "completed"].includes(r.status) &&
      (!isBookingPast(r.date, r.time) || r.status === "seated" || r.status === "arriving"),
  );
}
export function appNotifications(data: DemoState) {
  const bookings = customerBookings(data)
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return [
    ...bookings.slice(0, 5).map((r) => ({
      id: `${r.id}-${r.updatedAt}-${r.status}`,
      title:
        r.status === "seated"
          ? "Your table is ready"
          : r.status === "cancelled"
            ? "Booking cancelled"
            : r.status === "completed"
              ? "Thank you for joining us"
              : r.status === "arriving"
                ? "Welcome to ARDO"
                : "You have a dinner plan",
      text:
        r.status === "cancelled"
          ? `${r.confirmationCode} has been cancelled. There’s always another evening.`
          : `${niceDate(r.date)} · ${niceTime(r.time)} · ${r.partySize} guests. ${r.status === "seated" ? "Make yourself at home." : r.seatingPreference + " seating requested."}`,
      href: `/app/bookings/${r.id}`,
    })),
    ...upcomingBookings(data)
      .filter((r) => r.date === dateOffset(1))
      .slice(0, 1)
      .map((r) => ({
        id: `reminder-${r.id}-${today()}`,
        title: "See you tomorrow",
        text: `Your table for ${r.partySize} is booked for ${niceTime(r.time)}. We’re looking forward to it.`,
        href: `/app/bookings/${r.id}`,
      })),
    {
      id: "brunch-2026",
      title: "Make a Sunday of it",
      text: `Weekend brunch. ${niceTime(data.settings.lunchOpen)}–${niceTime(data.settings.lunchClose)}. Take your time.`,
      href: "/app/reserve?time=12:30",
    },
  ];
}
