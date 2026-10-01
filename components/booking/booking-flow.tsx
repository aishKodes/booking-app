"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Armchair,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  ShieldCheck,
  Sun,
  Users,
  RectangleHorizontal,
  Sparkles,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { useToast, LoadingState } from "@/components/ui";
import {
  currentMinutes,
  dateOffset,
  minutes,
  niceDate,
  niceTime,
  slotState,
  timeSlots,
  today,
} from "@/lib/utils";
import type { BookingInput, Seating } from "@/lib/types";
const seatingOptions: { name: Seating; description: string; icon: typeof Armchair }[] = [
  { name: "No preference", description: "Find me a lovely spot", icon: Sparkles },
  { name: "Main dining", description: "At the heart of the room", icon: Armchair },
  { name: "Window", description: "A little city watching", icon: RectangleHorizontal },
  { name: "Terrace", description: "Dinner in the open air", icon: Sun },
];
const occasions = [
  "None",
  "Birthday",
  "Anniversary",
  "Business Dinner",
  "Date Night",
  "Celebration",
];
export function BookingFlow() {
  const { data } = useDemo();
  const params = useSearchParams();
  const editId = params.get("edit") || undefined;
  if (!data) return <LoadingState />;
  const existing = data.reservations.find((r) => r.id === editId);
  if (editId && (!existing || !["confirmed", "arriving"].includes(existing.status)))
    return (
      <div className="container public-page">
        <h1>This booking can’t be modified.</h1>
        <p>Please choose an active reservation from your bookings.</p>
        <Link href="/restaurant/reservations" className="button button-primary">
          My reservations
        </Link>
      </div>
    );
  const date = params.get("date");
  const time = params.get("time");
  const guests = Number(params.get("guests") || 2);
  const occasion = params.get("occasion");
  const initialBooking: BookingInput = existing || {
    date:
      date && date >= today() && date <= dateOffset(data.settings.bookingWindow)
        ? date
        : dateOffset(1),
    time: time && timeSlots.includes(time) && time !== "19:30" ? time : "20:00",
    partySize:
      guests >= 1 && guests <= data.settings.maxPartySize
        ? guests
        : Math.min(2, data.settings.maxPartySize),
    seatingPreference: "No preference",
    guestName: "",
    email: "",
    phone: "",
    occasion: occasion && occasions.includes(occasion) ? occasion : "None",
    specialRequests: "",
  };
  return <BookingForm key={params.toString()} initialBooking={initialBooking} editId={editId} />;
}
function BookingForm({
  initialBooking,
  editId,
}: {
  initialBooking: BookingInput;
  editId?: string;
}) {
  const { data, book } = useDemo();
  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [period, setPeriod] = useState(initialBooking.time < "16:00" ? "Lunch" : "Dinner");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<BookingInput>(initialBooking);
  if (!data) return <LoadingState />;
  const set = <K extends keyof BookingInput>(key: K, value: BookingInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };
  const disabled = (time: string) =>
    slotState(form.date, time, form.partySize) === "unavailable" ||
    form.date < today() ||
    (form.date === today() && minutes(time) < currentMinutes() + data.settings.minimumNotice) ||
    (time < "16:00"
      ? time < data.settings.lunchOpen || minutes(time) > minutes(data.settings.lunchClose) - 60
      : time < data.settings.dinnerOpen || minutes(time) > minutes(data.settings.dinnerClose) - 60);
  const advance = () => {
    if (
      step === 1 &&
      (!form.date || form.date > dateOffset(data.settings.bookingWindow) || disabled(form.time))
    ) {
      setError("Please choose an available date and time for your table.");
      return;
    }
    if (
      step === 2 &&
      (!form.guestName.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
        form.phone.replace(/\D/g, "").length < 10)
    ) {
      setError(
        "We’ll need your full name, a valid email and a phone number with at least 10 digits.",
      );
      return;
    }
    setError("");
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const confirm = () => {
    setBusy(true);
    const result = book(form, editId);
    if (result.ok && result.reservation) {
      toast(
        editId
          ? "Your reservation has been updated."
          : "Your table is confirmed. We look forward to seeing you.",
      );
      router.push(`/restaurant/reservations/${result.reservation.id}`);
    } else {
      setError(result.error || "Please check your reservation details.");
      setBusy(false);
    }
  };
  return (
    <div className="container booking-page">
      <div className="booking-intro">
        <Link href={editId ? "/restaurant/reservations" : "/restaurant"} className="back-link">
          <ArrowLeft size={16} />
          {editId ? "Back to my reservations" : "Back to ARDO"}
        </Link>
        <span className="eyebrow">
          {editId ? "A LITTLE CHANGE OF PLANS" : "THERE’S A PLACE FOR YOU"}
        </span>
        <h1>
          {editId ? (
            "Let’s adjust your evening."
          ) : (
            <>
              Your evening. <br />
              <em>Your table.</em>
            </>
          )}
        </h1>
        <p>A few details, and we’ll take care of the rest.</p>
      </div>
      <div className="booking-layout">
        <div className="booking-panel">
          <nav className="booking-steps" aria-label="Booking progress">
            {["Your table", "About you", "Review & confirm"].map((label, i) => (
              <button
                key={label}
                disabled={i + 1 > step}
                className={step === i + 1 ? "active" : i + 1 < step ? "done" : ""}
                onClick={() => {
                  setStep(i + 1);
                  setError("");
                }}
              >
                <span>{i + 1 < step ? <Check size={14} /> : `0${i + 1}`}</span>
                {label}
              </button>
            ))}
          </nav>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="booking-step-content"
            >
              {step === 1 && (
                <>
                  <div className="booking-field-heading">
                    <h2>Who’s coming?</h2>
                    <span>A seat for everyone.</span>
                  </div>
                  <div className="party-selector" role="group" aria-label="Party size">
                    {Array.from({ length: data.settings.maxPartySize }, (_, i) => i + 1).map(
                      (n) => (
                        <button
                          aria-pressed={form.partySize === n}
                          className={form.partySize === n ? "selected" : ""}
                          key={n}
                          onClick={() => set("partySize", n)}
                        >
                          {n}
                          <span>{n === 1 ? "guest" : "guests"}</span>
                        </button>
                      ),
                    )}
                  </div>
                  <Link className="small-link" href="/restaurant/private-dining">
                    More than {data.settings.maxPartySize}? Let’s plan something together{" "}
                    <ArrowUpRight size={13} />
                  </Link>
                  <div className="booking-field-heading">
                    <h2>Save the date.</h2>
                    <label className="calendar-input">
                      <CalendarDays size={16} />
                      <input
                        type="date"
                        aria-label="Choose another date"
                        value={form.date}
                        min={today()}
                        max={dateOffset(data.settings.bookingWindow)}
                        onChange={(e) => set("date", e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="date-selector">
                    {Array.from({ length: 5 }, (_, i) => dateOffset(i)).map((date, i) => (
                      <button
                        key={date}
                        aria-pressed={form.date === date}
                        className={form.date === date ? "selected" : ""}
                        onClick={() => set("date", date)}
                      >
                        <span>
                          {i === 0 ? "Today" : i === 1 ? "Tomorrow" : niceDate(date, "EEE")}
                        </span>
                        <strong>{niceDate(date, "dd")}</strong>
                        <span>{niceDate(date, "MMM")}</span>
                      </button>
                    ))}
                  </div>
                  <div className="booking-field-heading">
                    <h2>Make time for it.</h2>
                    <div className="segmented">
                      <button
                        className={period === "Lunch" ? "active" : ""}
                        onClick={() => {
                          setPeriod("Lunch");
                          set("time", "12:30");
                        }}
                      >
                        Lunch
                      </button>
                      <button
                        className={period === "Dinner" ? "active" : ""}
                        onClick={() => {
                          setPeriod("Dinner");
                          set("time", "20:00");
                        }}
                      >
                        Dinner
                      </button>
                    </div>
                  </div>
                  <div className="time-selector">
                    {timeSlots
                      .filter((t) => (period === "Dinner" ? t >= "18:00" : t < "16:00"))
                      .map((t) => (
                        <button
                          key={t}
                          disabled={disabled(t)}
                          aria-pressed={form.time === t}
                          className={form.time === t ? "selected" : ""}
                          onClick={() => set("time", t)}
                        >
                          <strong>{niceTime(t)}</strong>
                          <span>
                            {disabled(t)
                              ? "Unavailable"
                              : slotState(form.date, t, form.partySize) === "popular"
                                ? "Popular time"
                                : slotState(form.date, t, form.partySize) === "almost full"
                                  ? "2 tables left"
                                  : "Available"}
                          </span>
                        </button>
                      ))}
                  </div>
                  <div className="booking-field-heading">
                    <h2>Your favourite spot?</h2>
                    <span>We’ll do our best.</span>
                  </div>
                  <div className="seating-selector">
                    {seatingOptions.map((o) => (
                      <button
                        className={form.seatingPreference === o.name ? "selected" : ""}
                        key={o.name}
                        aria-pressed={form.seatingPreference === o.name}
                        onClick={() => set("seatingPreference", o.name)}
                      >
                        <o.icon size={22} />
                        <strong>{o.name}</strong>
                        <span>{o.description}</span>
                        {form.seatingPreference === o.name && (
                          <Check className="selection-check" size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="booking-fine-print">
                    Seating preferences are subject to availability. Every table gets the same warm
                    welcome.
                  </p>
                </>
              )}
              {step === 2 && (
                <>
                  <span className="eyebrow">A NAME TO WELCOME YOU BY</span>
                  <h2 className="step-title">A little about you.</h2>
                  <p className="muted">Your booking details stay right here in this browser.</p>
                  <div className="form-grid guest-form">
                    <label className="full-width">
                      Full name <span>*</span>
                      <input
                        autoComplete="name"
                        value={form.guestName}
                        onChange={(e) => set("guestName", e.target.value)}
                        placeholder="Your first and last name"
                        required
                        maxLength={80}
                      />
                    </label>
                    <label>
                      Email address <span>*</span>
                      <input
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="you@example.com"
                        required
                        maxLength={100}
                      />
                    </label>
                    <label>
                      Phone number <span>*</span>
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        maxLength={20}
                      />
                    </label>
                    <label className="full-width">
                      What’s the occasion?
                      <select
                        value={form.occasion}
                        onChange={(e) => set("occasion", e.target.value)}
                      >
                        {occasions.map((o) => (
                          <option key={o} value={o}>
                            {o === "None" ? "Just a good evening" : o}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="full-width">
                      Anything we should know? <small>Optional</small>
                      <textarea
                        rows={4}
                        value={form.specialRequests}
                        onChange={(e) => set("specialRequests", e.target.value)}
                        placeholder="Dietary preferences, a little surprise, or a favourite table…"
                        maxLength={500}
                      />
                      <small>Special requests are subject to availability.</small>
                    </label>
                  </div>
                  <div className="privacy-note">
                    <ShieldCheck size={19} />
                    <span>
                      No account needed. No payment required.
                      <br />
                      This is a fictional restaurant demo.
                    </span>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <span className="eyebrow">ONE LAST LOOK</span>
                  <h2 className="step-title">An evening to look forward to.</h2>
                  <p className="muted">Everything look right? Your table is just a click away.</p>
                  <div className="review-details">
                    <div>
                      <h3>Your table</h3>
                      <button className="small-link" onClick={() => setStep(1)}>
                        Edit <ArrowUpRight size={13} />
                      </button>
                    </div>
                    <dl>
                      <dt>Date</dt>
                      <dd>{niceDate(form.date, "EEEE, d MMMM yyyy")}</dd>
                      <dt>Time</dt>
                      <dd>{niceTime(form.time)}</dd>
                      <dt>Party</dt>
                      <dd>
                        {form.partySize} {form.partySize === 1 ? "guest" : "guests"}
                      </dd>
                      <dt>Seating</dt>
                      <dd>{form.seatingPreference}</dd>
                    </dl>
                    <div>
                      <h3>Your details</h3>
                      <button className="small-link" onClick={() => setStep(2)}>
                        Edit <ArrowUpRight size={13} />
                      </button>
                    </div>
                    <dl>
                      <dt>Guest</dt>
                      <dd>{form.guestName}</dd>
                      <dt>Email</dt>
                      <dd>{form.email}</dd>
                      <dt>Phone</dt>
                      <dd>{form.phone}</dd>
                      {form.occasion !== "None" && (
                        <>
                          <dt>Occasion</dt>
                          <dd>{form.occasion}</dd>
                        </>
                      )}
                      {form.specialRequests && (
                        <>
                          <dt>Requests</dt>
                          <dd>{form.specialRequests}</dd>
                        </>
                      )}
                    </dl>
                  </div>
                  <div className="booking-policy">
                    <Clock3 size={20} />
                    <div>
                      <strong>A little housekeeping.</strong>
                      <p>
                        Your table is reserved for {data.settings.duration} minutes and held for{" "}
                        {data.settings.gracePeriod} minutes after your booking time. Plans change —
                        you can modify or cancel online.
                      </p>
                    </div>
                  </div>
                </>
              )}
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <div className="booking-navigation">
                {step > 1 ? (
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setStep((s) => s - 1);
                      setError("");
                    }}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : (
                  <span className="instant-note">
                    <ShieldCheck size={16} />
                    Confirmed instantly
                  </span>
                )}
                <button
                  className="button button-primary"
                  disabled={busy}
                  onClick={step === 3 ? confirm : advance}
                >
                  {busy
                    ? "Saving your table…"
                    : step === 3
                      ? editId
                        ? "Confirm changes"
                        : "Confirm reservation"
                      : "Continue"}
                  {step === 3 ? <Check size={18} /> : <ArrowRight size={18} />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <aside className="booking-summary">
          <div className="summary-image">
            <Image
              src="/images/dining.jpg"
              alt="Your evening at ARDO"
              fill
              loading="eager"
              sizes="400px"
            />
            <span className="brand">ARDO</span>
          </div>
          <div className="summary-body">
            <span className="eyebrow">YOUR EVENING, AT A GLANCE</span>
            <h2>Good things ahead.</h2>
            <p>
              <MapPin size={15} />
              {data.settings.address}
            </p>
            <div className="summary-lines">
              <span>
                <CalendarDays size={18} />
                {form.date ? niceDate(form.date, "EEE, d MMMM") : "Select a date"}
              </span>
              <span>
                <Clock3 size={18} />
                {niceTime(form.time)}
              </span>
              <span>
                <Users size={18} />
                {form.partySize} {form.partySize === 1 ? "guest" : "guests"}
              </span>
              <span>
                <Armchair size={18} />
                {form.seatingPreference}
              </span>
            </div>
            <div className="summary-bottom">
              <ShieldCheck size={18} />
              <div>
                <strong>Book with a little peace of mind.</strong>
                <span>Instant confirmation · No booking fee</span>
              </div>
            </div>
          </div>
          <p className="summary-help">A little help? {data.settings.phone}</p>
        </aside>
      </div>
    </div>
  );
}
