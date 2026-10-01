"use client";
import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { createGuestApp, createSeed } from "./demo-data";
import type {
  Activity,
  BookingInput,
  DemoState,
  Guest,
  GuestAppState,
  MenuItem,
  Reservation,
  ReservationStatus,
  Settings,
} from "./types";
import { dateOffset, isBookingPast, minutes, slotState, today } from "./utils";
const KEY = "ardo-demo-v1";
type Result = { ok: boolean; error?: string; reservation?: Reservation };
interface Store {
  data: DemoState | null;
  persistenceError: string | null;
  book: (input: BookingInput, editId?: string, source?: "Website" | "Mobile App") => Result;
  updateApp: (patch: Partial<GuestAppState>) => void;
  setStatus: (id: string, status: ReservationStatus) => Result;
  assignTable: (id: string, tableId: string) => Result;
  updateMenu: (id: string, patch: Partial<MenuItem>) => void;
  updateGuest: (id: string, patch: Partial<Guest>) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  clearTable: (id: string) => void;
  reset: () => void;
  readNotifications: () => void;
  notify: (title: string, description: string) => void;
}
const Context = createContext<Store | null>(null);
const activity = (title: string, description: string): Activity => ({
  id: crypto.randomUUID(),
  title,
  description,
  createdAt: new Date().toISOString(),
  read: false,
});
// Cached browser snapshot. React uses a null server snapshot for stable hydration.
type Snapshot = { data: DemoState | null; persistenceError: string | null };
const serverSnapshot: Snapshot = { data: null, persistenceError: null };
let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();
function validState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const s = value as Partial<DemoState>;
  return (
    s.version === 1 &&
    Array.isArray(s.reservations) &&
    Array.isArray(s.guests) &&
    Array.isArray(s.tables) &&
    Array.isArray(s.menu) &&
    Array.isArray(s.activities) &&
    !!s.settings
  );
}
// Add app preferences to earlier saved demos without replacing their bookings or edits.
function normalizeState(value: DemoState): DemoState {
  const defaults = createGuestApp();
  return {
    ...value,
    guestApp: {
      ...defaults,
      ...value.guestApp,
      profile: { ...defaults.profile, ...value.guestApp?.profile },
    },
  };
}
function getSnapshot(): Snapshot {
  if (snapshot) return snapshot;
  try {
    const saved = localStorage.getItem(KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : null;
    const initial = validState(parsed) ? normalizeState(parsed) : createSeed();
    localStorage.setItem(KEY, JSON.stringify(initial));
    snapshot = { data: initial, persistenceError: null };
  } catch {
    snapshot = {
      data: createSeed(),
      persistenceError: "Browser storage is unavailable. Changes will last for this session only.",
    };
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const sync = (e: StorageEvent) => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      const next: unknown = JSON.parse(e.newValue);
      if (validState(next)) {
        snapshot = { data: normalizeState(next), persistenceError: null };
        listeners.forEach((fn) => fn());
      }
    } catch {
      /* Preserve the valid current snapshot. */
    }
  };
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}
const state = {
  get current() {
    return getSnapshot().data;
  },
};
export function DemoProvider({ children }: { children: ReactNode }) {
  const { data, persistenceError } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => serverSnapshot,
  );
  const commit = useCallback((next: DemoState) => {
    let persistenceError: string | null = null;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      persistenceError =
        "Browser storage is full or unavailable. This update is saved for the current session only.";
    }
    snapshot = { data: next, persistenceError };
    listeners.forEach((fn) => fn());
  }, []);
  const book = useCallback(
    (
      input: BookingInput,
      editId?: string,
      source: "Website" | "Mobile App" = "Website",
    ): Result => {
      const s = state.current;
      if (!s) return { ok: false, error: "Please wait while we prepare your table." };
      if (
        !input.guestName.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
        input.phone.replace(/\D/g, "").length < 10
      )
        return {
          ok: false,
          error:
            "Please enter your name, a valid email and a phone number with at least 10 digits.",
        };
      if (
        input.partySize < 1 ||
        input.partySize > s.settings.maxPartySize ||
        !Number.isInteger(input.partySize)
      )
        return {
          ok: false,
          error: `Online bookings are for 1–${s.settings.maxPartySize} guests. Please contact us for a larger party.`,
        };
      if (
        input.date < today() ||
        input.date > dateOffset(s.settings.bookingWindow) ||
        isBookingPast(input.date, input.time) ||
        new Date(`${input.date}T${input.time}:00+05:30`).getTime() - Date.now() <
          s.settings.minimumNotice * 60000
      )
        return {
          ok: false,
          error: `Choose a future time with at least ${s.settings.minimumNotice} minutes’ notice, within the next ${s.settings.bookingWindow} days.`,
        };
      const lunch =
        input.time >= s.settings.lunchOpen &&
        minutes(input.time) <= minutes(s.settings.lunchClose) - 60;
      const dinner =
        input.time >= s.settings.dinnerOpen &&
        minutes(input.time) <= minutes(s.settings.dinnerClose) - 60;
      if (
        (!lunch && !dinner) ||
        slotState(input.date, input.time, input.partySize) === "unavailable"
      )
        return { ok: false, error: "That time is unavailable. Please choose another table time." };
      const previous = s.reservations.find((r) => r.id === editId);
      if (editId && (!previous || !["confirmed", "arriving"].includes(previous.status)))
        return { ok: false, error: "This reservation can no longer be modified online." };
      const existingGuest = s.guests.find(
        (g) => g.email.toLowerCase() === input.email.toLowerCase().trim(),
      );
      const guestId = existingGuest?.id || crypto.randomUUID();
      const guest: Guest = existingGuest
        ? { ...existingGuest, name: input.guestName.trim(), phone: input.phone.trim() }
        : {
            id: guestId,
            name: input.guestName.trim(),
            email: input.email.toLowerCase().trim(),
            phone: input.phone.trim(),
            tags: [],
            notes: "",
            favoriteTable: "",
          };
      const now = new Date().toISOString();
      let code = previous?.confirmationCode || `ARD-${Math.floor(10000 + Math.random() * 90000)}`;
      while (!previous && s.reservations.some((r) => r.confirmationCode === code))
        code = `ARD-${Math.floor(10000 + Math.random() * 90000)}`;
      const r: Reservation = {
        ...input,
        guestName: guest.name,
        email: guest.email,
        phone: guest.phone,
        id: previous?.id || crypto.randomUUID(),
        confirmationCode: code,
        guestId,
        tableId: null,
        status: "confirmed",
        source: previous?.source || source,
        createdAt: previous?.createdAt || now,
        updatedAt: now,
        customerBooking: true,
      };
      commit({
        ...s,
        guests: existingGuest
          ? s.guests.map((g) => (g.id === guestId ? guest : g))
          : [guest, ...s.guests],
        reservations: previous
          ? s.reservations.map((row) => (row.id === previous.id ? r : row))
          : [r, ...s.reservations],
        activities: [
          activity(
            previous ? "Reservation modified" : "New reservation",
            `${r.guestName} · ${r.partySize} guests · ${r.date} at ${r.time}`,
          ),
          ...s.activities,
        ],
      });
      return { ok: true, reservation: r };
    },
    [commit],
  );
  const setStatus = useCallback(
    (id: string, status: ReservationStatus): Result => {
      const s = state.current;
      const r = s?.reservations.find((row) => row.id === id);
      if (!s || !r) return { ok: false, error: "Reservation not found." };
      if (status === "seated" && !r.tableId)
        return { ok: false, error: "Assign a table before seating this guest." };
      if (
        status === "seated" &&
        s.reservations.some(
          (row) => row.id !== id && row.tableId === r.tableId && row.status === "seated",
        )
      )
        return { ok: false, error: "This table is occupied. Please choose another table." };
      commit({
        ...s,
        reservations: s.reservations.map((row) =>
          row.id === id ? { ...row, status, updatedAt: new Date().toISOString() } : row,
        ),
        tables:
          status === "completed" && r.tableId
            ? s.tables.map((t) => (t.id === r.tableId ? { ...t, turnover: true } : t))
            : status === "seated"
              ? s.tables.map((t) => (t.id === r.tableId ? { ...t, turnover: false } : t))
              : s.tables,
        activities: [
          activity(
            `Reservation ${status === "arriving" ? "checked in" : status}`,
            `${r.guestName} · ${r.confirmationCode}`,
          ),
          ...s.activities,
        ],
      });
      return { ok: true };
    },
    [commit],
  );
  const assignTable = useCallback(
    (id: string, tableId: string): Result => {
      const s = state.current;
      const r = s?.reservations.find((row) => row.id === id);
      const t = s?.tables.find((table) => table.id === tableId);
      if (!s || !r || !t) return { ok: false, error: "Choose a reservation and a table." };
      if (!["confirmed", "arriving", "seated"].includes(r.status))
        return { ok: false, error: "Only active reservations can be assigned a table." };
      if (t.capacity < r.partySize)
        return {
          ok: false,
          error: `Table ${t.number} seats ${t.capacity}. Choose a larger table.`,
        };
      if (t.turnover) return { ok: false, error: "Reset this table before assigning it." };
      const conflict = s.reservations.some(
        (row) =>
          row.id !== id &&
          row.tableId === tableId &&
          row.date === r.date &&
          ["confirmed", "arriving", "seated"].includes(row.status) &&
          Math.abs(minutes(row.time) - minutes(r.time)) < s.settings.duration,
      );
      if (conflict)
        return {
          ok: false,
          error: "This table has an overlapping reservation. Choose another table.",
        };
      commit({
        ...s,
        reservations: s.reservations.map((row) =>
          row.id === id ? { ...row, tableId, updatedAt: new Date().toISOString() } : row,
        ),
        activities: [
          activity(`Assigned to Table ${t.number}`, `${r.guestName} · ${r.partySize} guests`),
          ...s.activities,
        ],
      });
      return { ok: true };
    },
    [commit],
  );
  const updateMenu = (id: string, patch: Partial<MenuItem>) => {
    const s = state.current;
    if (s) commit({ ...s, menu: s.menu.map((m) => (m.id === id ? { ...m, ...patch } : m)) });
  };
  const updateGuest = (id: string, patch: Partial<Guest>) => {
    const s = state.current;
    if (s) commit({ ...s, guests: s.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)) });
  };
  const updateSettings = (patch: Partial<Settings>) => {
    const s = state.current;
    if (s) commit({ ...s, settings: { ...s.settings, ...patch } });
  };
  const updateApp = (patch: Partial<GuestAppState>) => {
    const s = state.current;
    if (s) commit({ ...s, guestApp: { ...s.guestApp, ...patch } });
  };
  const clearTable = (id: string) => {
    const s = state.current;
    if (s)
      commit({ ...s, tables: s.tables.map((t) => (t.id === id ? { ...t, turnover: false } : t)) });
  };
  const readNotifications = () => {
    const s = state.current;
    if (s) commit({ ...s, activities: s.activities.map((a) => ({ ...a, read: true })) });
  };
  const notify = (title: string, description: string) => {
    const s = state.current;
    if (s) commit({ ...s, activities: [activity(title, description), ...s.activities] });
  };
  return (
    <Context.Provider
      value={{
        data,
        persistenceError,
        book,
        setStatus,
        assignTable,
        updateMenu,
        updateGuest,
        updateSettings,
        updateApp,
        clearTable,
        reset: () => commit(createSeed()),
        readNotifications,
        notify,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const context = useContext(Context);
  if (!context) throw new Error("useDemo requires DemoProvider");
  return context;
}
