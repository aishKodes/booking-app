"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Leaf,
  MapPin,
  ShieldCheck,
  Star,
  Sun,
  Users,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { useToast } from "@/components/ui";
import type { BookingInput, DemoState, Seating } from "@/lib/types";
import { dateOffset, minutes, niceDate, niceTime, slotState, timeSlots, today } from "@/lib/utils";
import { AppActionBar, AppEmpty } from "./shared";
import { AppCalendar } from "./calendar";
const seating = [
  { name: "No preference", sub: "Find me a lovely spot", icon: Armchair },
  { name: "Main dining", sub: "In the heart of the room", icon: Users },
  { name: "Window", sub: "A little city watching", icon: Sun },
  { name: "Terrace", sub: "Dinner in the open air", icon: Leaf },
];
const occasions = [
  "None",
  "Birthday",
  "Anniversary",
  "Date Night",
  "Business Dinner",
  "Celebration",
];
export function AppReserve({ params }: { params: Record<string, string | undefined> }) {
  const { data } = useDemo();
  return data ? <ReserveForm data={data} params={params} /> : null;
}
function ReserveForm({
  data,
  params,
}: {
  data: DemoState;
  params: Record<string, string | undefined>;
}) {
  const { book, updateApp } = useDemo();
  const router = useRouter();
  const toast = useToast();
  const edit = params.edit;
  const existing = data.reservations.find((r) => r.id === edit && r.customerBooking);
  const p = data.guestApp.profile;
  const [form, setForm] = useState<BookingInput>(() => ({
    partySize:
      existing?.partySize ||
      Math.min(data.settings.maxPartySize, Math.max(1, Number(params.guests) || 2)),
    date:
      existing?.date ||
      (params.date &&
      params.date >= today() &&
      params.date <= dateOffset(data.settings.bookingWindow)
        ? params.date
        : dateOffset(1)),
    time: existing?.time || (timeSlots.includes(params.time || "") ? params.time! : "20:00"),
    seatingPreference: existing?.seatingPreference || p.seating,
    guestName: existing?.guestName || p.name,
    email: existing?.email || p.email,
    phone: existing?.phone || p.phone,
    occasion:
      existing?.occasion || (occasions.includes(params.occasion || "") ? params.occasion! : "None"),
    specialRequests: existing?.specialRequests || "",
  }));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [calendar, setCalendar] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [clock, setClock] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const [service, setService] = useState(form.time < "16:00" ? "Lunch" : "Dinner");
  const update = <K extends keyof BookingInput>(key: K, value: BookingInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };
  const validTime = (time: string) => {
    const s = data.settings;
    return (
      new Date(`${form.date}T${time}:00+05:30`).getTime() - clock >= s.minimumNotice * 60000 &&
      slotState(form.date, time, form.partySize) !== "unavailable"
    );
  };
  const slots = timeSlots.filter((t) =>
    service === "Lunch"
      ? t >= data.settings.lunchOpen && minutes(t) <= minutes(data.settings.lunchClose) - 60
      : t >= data.settings.dinnerOpen && minutes(t) <= minutes(data.settings.dinnerClose) - 60,
  );
  const stripStart = form.date > dateOffset(6) ? dateOffset(-2, form.date) : today();
  const visibleDates = Array.from({ length: 7 }, (_, i) => dateOffset(i, stripStart)).filter(
    (date) => date <= dateOffset(data.settings.bookingWindow),
  );
  const advance = () => {
    if (
      step === 0 &&
      (!validTime(form.time) ||
        !slots.includes(form.time) ||
        form.date < today() ||
        form.date > dateOffset(data.settings.bookingWindow))
    ) {
      setError("Choose an available date and time for your table.");
      return;
    }
    if (
      step === 1 &&
      (!form.guestName.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
        form.phone.replace(/\D/g, "").length < 10)
    ) {
      setError("Add your name, a valid email, and a phone number with at least 10 digits.");
      return;
    }
    setDirection(1);
    setError("");
    setStep((s) => s + 1);
    document.getElementById("app-content")?.scrollTo({ top: 0 });
  };
  const confirm = () => {
    if (busy) return;
    setBusy(true);
    const result = book(form, edit, "Mobile App");
    if (!result.ok || !result.reservation) {
      setError(result.error || "We couldn’t save this table. Please try again.");
      setBusy(false);
      return;
    }
    updateApp({
      profile: {
        ...p,
        name: form.guestName.trim(),
        email: form.email.toLowerCase().trim(),
        phone: form.phone.trim(),
      },
    });
    toast(edit ? "Your plans have been updated." : "Your table is confirmed.");
    router.push(`/app/bookings/${result.reservation.id}?confirmed=1`);
  };
  if (edit && (!existing || !["confirmed", "arriving"].includes(existing.status)))
    return (
      <AppEmpty
        title="This evening has moved on."
        text="This booking can no longer be modified. You can still view its details."
      >
        <Link className="ma-primary" href="/app/bookings">
          Your bookings
        </Link>
      </AppEmpty>
    );
  return (
    <div className="ma-reserve">
      <div className="ma-progress">
        <span>{edit ? "MODIFY YOUR BOOKING" : "A TABLE, IN A FEW TAPS"}</span>
        <strong>{step + 1} of 3</strong>
        <div>
          {[0, 1, 2].map((i) => (
            <i key={i} className={i <= step ? "active" : ""} />
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: direction * 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -12 }}
          transition={{ duration: 0.16 }}
        >
          {step === 0 && (
            <>
              <div className="ma-reserve-venue">
                <Image
                  src="/images/interior.jpg"
                  alt="The ARDO dining room"
                  width={68}
                  height={68}
                  loading="eager"
                />
                <div>
                  <h2>ARDO, Park Street</h2>
                  <span>
                    <Star size={12} fill="currentColor" />
                    4.8 <i />
                    Contemporary Indian
                  </span>
                  <p>
                    <MapPin size={12} />
                    Kolkata · ₹₹₹
                  </p>
                </div>
              </div>
              <section>
                <div className="ma-field-heading">
                  <h3>A seat for everyone</h3>
                  <span>Party size</span>
                </div>
                <div className="ma-party-strip" aria-label="App party size">
                  {Array.from({ length: data.settings.maxPartySize }, (_, i) => (
                    <button
                      key={i}
                      aria-label={`${i + 1} ${i === 0 ? "guest" : "guests"}`}
                      aria-pressed={form.partySize === i + 1}
                      className={form.partySize === i + 1 ? "selected" : ""}
                      onClick={() => update("partySize", i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <Link href="/app/profile?section=private" className="ma-small-link">
                  A bigger occasion? Let’s plan it.
                  <ChevronRight size={14} />
                </Link>
              </section>
              <section>
                <div className="ma-field-heading">
                  <h3>Save the evening</h3>
                  <button
                    className="ma-calendar-trigger"
                    aria-label="Open booking calendar"
                    onClick={() => setCalendar(true)}
                  >
                    <CalendarDays size={18} />
                    {niceDate(form.date, "MMM yyyy")}
                  </button>
                </div>
                <div className="ma-date-strip">
                  {visibleDates.map((d) => (
                    <button
                      key={d}
                      aria-label={niceDate(d, "EEEE, d MMMM")}
                      aria-pressed={form.date === d}
                      className={form.date === d ? "selected" : ""}
                      onClick={() => update("date", d)}
                    >
                      <span>
                        {d === today()
                          ? "Today"
                          : d === dateOffset(1)
                            ? "Tomorrow"
                            : niceDate(d, "EEE")}
                      </span>
                      <strong>{niceDate(d, "dd")}</strong>
                      <small>{niceDate(d, "MMM")}</small>
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <div className="ma-field-heading">
                  <h3>Make time for it</h3>
                  <div className="ma-service-toggle">
                    {["Lunch", "Dinner"].map((s) => (
                      <button
                        key={s}
                        className={service === s ? "active" : ""}
                        onClick={() => {
                          setService(s);
                          update("time", "");
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="ma-times">
                  {slots.map((t) => {
                    const state = slotState(form.date, t, form.partySize);
                    const available = validTime(t);
                    return (
                      <button
                        key={t}
                        disabled={!available}
                        aria-pressed={form.time === t}
                        aria-label={`${niceTime(t)}${!available ? " unavailable" : ""}`}
                        className={form.time === t ? "selected" : ""}
                        onClick={() => update("time", t)}
                      >
                        <strong>{niceTime(t)}</strong>
                        <span>
                          {!available
                            ? "Unavailable"
                            : state === "popular"
                              ? "Popular"
                              : state === "almost full"
                                ? "Almost full"
                                : "Available"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {slots.length === 0 && (
                  <p className="ma-inline-note">
                    No online times in this service. Try another service or contact our team.
                  </p>
                )}
              </section>
              <section>
                <div className="ma-field-heading">
                  <h3>Your favourite spot?</h3>
                  <span>We’ll do our best</span>
                </div>
                <div className="ma-seating">
                  {seating.map((s) => (
                    <button
                      key={s.name}
                      aria-pressed={form.seatingPreference === s.name}
                      className={form.seatingPreference === s.name ? "selected" : ""}
                      onClick={() => update("seatingPreference", s.name as Seating)}
                    >
                      <s.icon size={23} />
                      <strong>{s.name}</strong>
                      <small>{s.sub}</small>
                      {form.seatingPreference === s.name && <Check size={14} />}
                    </button>
                  ))}
                </div>
                <p className="ma-field-note">Seating is a preference, subject to availability.</p>
              </section>
            </>
          )}
          {step === 1 && (
            <div className="ma-guest-form">
              <div className="ma-step-title">
                <h2>Who’s joining us?</h2>
                <p>A few details for a warm welcome.</p>
              </div>
              <label>
                Your name
                <input
                  autoComplete="name"
                  aria-label="App guest name"
                  value={form.guestName}
                  placeholder="Full name"
                  onChange={(e) => update("guestName", e.target.value)}
                />
              </label>
              <label>
                Phone number
                <input
                  type="tel"
                  autoComplete="tel"
                  aria-label="App guest phone"
                  inputMode="tel"
                  value={form.phone}
                  placeholder="+91"
                  onChange={(e) => update("phone", e.target.value)}
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  aria-label="App guest email"
                  inputMode="email"
                  value={form.email}
                  placeholder="you@example.com"
                  onChange={(e) => update("email", e.target.value)}
                />
              </label>
              <div className="ma-field-heading">
                <h3>Make it an occasion</h3>
                <span>Optional</span>
              </div>
              <div className="ma-occasion-grid">
                {occasions.map((o) => (
                  <button
                    key={o}
                    className={form.occasion === o ? "selected" : ""}
                    aria-pressed={form.occasion === o}
                    onClick={() => update("occasion", o)}
                  >
                    {o === "None" ? "Just dinner" : o}
                  </button>
                ))}
              </div>
              <label>
                A note for our team
                <textarea
                  aria-label="App special requests"
                  value={form.specialRequests}
                  onChange={(e) => update("specialRequests", e.target.value)}
                  placeholder="Allergies, a quiet table, a little surprise…"
                  rows={3}
                />
              </label>
              <p className="ma-field-note">
                All contact details stay in this fictional demo. No messages are sent.
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="ma-review">
              <div className="ma-step-title">
                <h2>Looks like a good evening.</h2>
                <p>One last look before we save your table.</p>
              </div>
              <div className="ma-review-photo">
                <Image src="/images/dining.jpg" alt="Your evening at ARDO" fill sizes="380px" />
                <span>ARDO · PARK STREET</span>
              </div>
              <div className="ma-review-details">
                <div>
                  <CalendarDays size={21} />
                  <span>
                    Date<strong>{niceDate(form.date, "EEEE, d MMMM")}</strong>
                  </span>
                </div>
                <div>
                  <Users size={21} />
                  <span>
                    Your table
                    <strong>
                      {niceTime(form.time)} · {form.partySize}{" "}
                      {form.partySize === 1 ? "guest" : "guests"}
                    </strong>
                  </span>
                </div>
                <div>
                  <Armchair size={21} />
                  <span>
                    Seating preference<strong>{form.seatingPreference}</strong>
                  </span>
                </div>
              </div>
              <div className="ma-review-guest">
                <h3>{form.guestName}</h3>
                <p>
                  {form.phone}
                  <br />
                  {form.email}
                </p>
                {form.occasion !== "None" && <span>{form.occasion}</span>}
                {form.specialRequests && <blockquote>{form.specialRequests}</blockquote>}
              </div>
              <div className="ma-policy">
                <ShieldCheck size={20} />
                <p>
                  We’ll hold your table for {data.settings.gracePeriod} minutes. Change or cancel
                  your plans in Bookings. No reservation fee.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <AppActionBar>
        {error && (
          <p role="alert" className="ma-form-error ma-action-error">
            {error}
          </p>
        )}
        {step > 0 ? (
          <button
            className="ma-icon"
            aria-label="Previous booking step"
            onClick={() => {
              setDirection(-1);
              setError("");
              setStep((s) => s - 1);
              document.getElementById("app-content")?.scrollTo({ top: 0 });
            }}
          >
            <ArrowLeft size={21} />
          </button>
        ) : (
          <div className="ma-action-summary">
            <strong>
              {form.partySize} {form.partySize === 1 ? "guest" : "guests"} ·{" "}
              {niceDate(form.date, "d MMM")}
            </strong>
            <span>{form.time ? niceTime(form.time) : "Choose your time"}</span>
          </div>
        )}
        <button className="ma-primary" disabled={busy} onClick={step === 2 ? confirm : advance}>
          {busy
            ? "Saving your table…"
            : step === 2
              ? edit
                ? "Save changes"
                : "Confirm reservation"
              : "Continue"}
          {step === 2 ? <Check size={18} /> : <ArrowRight size={18} />}
        </button>
      </AppActionBar>
      {calendar && (
        <AppCalendar
          selected={form.date}
          min={today()}
          max={dateOffset(data.settings.bookingWindow)}
          onSelect={(d) => update("date", d)}
          onClose={() => setCalendar(false)}
        />
      )}
    </div>
  );
}
