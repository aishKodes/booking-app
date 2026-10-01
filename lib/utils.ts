import { addDays, format, parseISO } from "date-fns";
export function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function dateOffset(days: number, base = today()) {
  return format(addDays(parseISO(base), days), "yyyy-MM-dd");
}
export function niceDate(date: string, pattern = "EEE, d MMM") {
  return format(parseISO(date), pattern);
}
export function niceTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
export function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
export function minutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
export function currentMinutes() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  return minutes(parts);
}
export const timeSlots = [
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];
export function slotState(date: string, time: string, party: number) {
  if (time === "19:30") return "unavailable";
  if (time === "20:00") return "popular";
  if ((Number(date.slice(-2)) + party) % 3 === 0 && time === "19:00") return "almost full";
  return "available";
}
export function isBookingPast(date: string, time: string) {
  return new Date(`${date}T${time}:00+05:30`).getTime() < Date.now();
}
export const directionsUrl = "https://www.google.com/maps/search/?api=1&query=Park+Street+Kolkata";
export function downloadCalendar(
  r: { guestName: string; date: string; time: string; confirmationCode: string },
  name: string,
  address: string,
  duration: number,
) {
  const start = new Date(`${r.date}T${r.time}:00+05:30`);
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ARDO//Reservations//EN",
    "BEGIN:VEVENT",
    `UID:${r.confirmationCode}@ardo.demo`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(new Date(start.getTime() + duration * 60000))}`,
    `SUMMARY:${escape(`Dinner at ${name}`)}`,
    `LOCATION:${escape(address)}`,
    `DESCRIPTION:${escape(`Reservation ${r.confirmationCode} for ${r.guestName}. Fictional restaurant demo.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const url = URL.createObjectURL(
    new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${r.confirmationCode}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
