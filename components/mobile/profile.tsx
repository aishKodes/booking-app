"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Heart,
  Leaf,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import type { GuestAppState, Seating } from "@/lib/types";
import { useToast } from "@/components/ui";
import { directionsUrl, initials, niceTime, today } from "@/lib/utils";
import { experiences, upcomingBookings } from "@/lib/mobile";
import { AppSheet } from "./shared";
type Sheet =
  "edit" | "preferences" | "notifications" | "help" | "about" | "experiences" | "private" | null;
export function AppProfile({ initialSection }: { initialSection?: string }) {
  const { data, updateApp } = useDemo();
  const [sheet, setSheet] = useState<Sheet>(initialSection === "private" ? "private" : null);
  const toast = useToast();
  if (!data) return null;
  const p = data.guestApp.profile;
  const row = (title: string, sub: string, Icon: typeof Heart, action: () => void) => (
    <button className="ma-profile-row" onClick={action}>
      <span>
        <Icon size={21} />
      </span>
      <div>
        <strong>{title}</strong>
        <small>{sub}</small>
      </div>
      <ChevronRight size={18} />
    </button>
  );
  return (
    <div className="ma-profile">
      <div className="ma-profile-hero">
        <span>{p.name ? initials(p.name) : <UserRound size={31} />}</span>
        <h2>{p.name || "Make yourself at home."}</h2>
        <p>{p.email || "A little about you. A better welcome from us."}</p>
        <button onClick={() => setSheet("edit")}>
          {p.name ? "Edit profile" : "Add your details"}
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="ma-profile-stats">
        <Link href="/app/bookings">
          <strong>{upcomingBookings(data).length}</strong>
          <span>upcoming plans</span>
        </Link>
        <Link href="/app/explore?saved=1">
          <strong>{data.guestApp.favoriteDishes.length}</strong>
          <span>saved dishes</span>
        </Link>
        <button onClick={() => setSheet("experiences")}>
          <strong>{data.guestApp.favoriteExperiences.length}</strong>
          <span>experiences</span>
        </button>
      </div>
      <div className="ma-profile-group">
        <span className="ma-kicker">YOUR ARDO</span>
        <Link className="ma-profile-row" href="/app/bookings">
          <span>
            <CalendarDays size={21} />
          </span>
          <div>
            <strong>My bookings</strong>
            <small>Every good evening, in one place</small>
          </div>
          <ChevronRight size={18} />
        </Link>
        <Link className="ma-profile-row" href="/app/explore?saved=1">
          <span>
            <Heart size={21} />
          </span>
          <div>
            <strong>Favourite dishes</strong>
            <small>A little shortlist for next time</small>
          </div>
          <ChevronRight size={18} />
        </Link>
        {row("Dining preferences", `${p.dietary} · ${p.seating}`, Leaf, () =>
          setSheet("preferences"),
        )}
        {row(
          "Notifications",
          p.notifications ? "Updates for your next evening" : "Updates muted",
          Bell,
          () => setSheet("notifications"),
        )}
      </div>
      <div className="ma-profile-group">
        <span className="ma-kicker">A LITTLE MORE</span>
        {row("Help & contact", "We’re here to help", CircleHelp, () => setSheet("help"))}
        {row("Private dining", "For your own occasion", Sparkles, () => setSheet("private"))}
        {row("About ARDO", "Indian roots. A fresh point of view.", MapPin, () => setSheet("about"))}
      </div>
      <Link href="/" className="ma-demo-return">
        <LogOut size={18} />
        Explore all three experiences
        <ChevronRight size={17} />
      </Link>
      <p className="ma-demo-note">
        ARDO Guest App · Fictional restaurant demo
        <br />
        Your details and plans are saved on this device.
      </p>
      {sheet === "edit" && (
        <AppSheet title="A little about you" onClose={() => setSheet(null)}>
          <ProfileEditor
            profile={p}
            onSave={(profile) => {
              updateApp({ profile });
              setSheet(null);
              toast("Your profile is saved.");
            }}
          />
        </AppSheet>
      )}
      {sheet === "preferences" && (
        <AppSheet title="Your kind of evening" onClose={() => setSheet(null)}>
          <PreferenceEditor
            profile={p}
            onSave={(profile) => {
              updateApp({ profile });
              setSheet(null);
              toast("Dining preferences saved.");
            }}
          />
        </AppSheet>
      )}
      {sheet === "notifications" && (
        <AppSheet title="Keep you in the loop" onClose={() => setSheet(null)}>
          <div className="ma-toggle-row">
            <div>
              <strong>Booking & restaurant updates</strong>
              <p>A subtle unread indicator for your plans and what’s happening at ARDO.</p>
            </div>
            <input
              type="checkbox"
              aria-label="App notification preference"
              checked={p.notifications}
              onChange={(e) => updateApp({ profile: { ...p, notifications: e.target.checked } })}
            />
          </div>
          <p className="ma-sheet-footnote">
            This saves your in-app preference. No push notifications, emails, or texts are sent.
          </p>
        </AppSheet>
      )}
      {sheet === "help" && (
        <AppSheet title="A warm welcome, always" onClose={() => setSheet(null)}>
          <p className="ma-sheet-intro">
            A change of plans or something we should know? Our team is here.
          </p>
          <div className="ma-contact-links">
            <a href={`tel:${data.settings.phone.replace(/\s/g, "")}`}>
              <Phone size={20} />
              <div>
                Call the restaurant<small>{data.settings.phone}</small>
              </div>
              <ChevronRight size={18} />
            </a>
            <a href={`mailto:${data.settings.email}`}>
              <Mail size={20} />
              <div>
                Email our team<small>{data.settings.email}</small>
              </div>
              <ChevronRight size={18} />
            </a>
            <a href={directionsUrl} target="_blank" rel="noreferrer">
              <MapPin size={20} />
              <div>
                Find us on Park Street<small>{data.settings.address}</small>
              </div>
              <ChevronRight size={18} />
            </a>
          </div>
          <p className="ma-sheet-footnote">
            Contact details and venue are fictional. Directions show the Park Street neighbourhood.
          </p>
        </AppSheet>
      )}
      {sheet === "about" && (
        <AppSheet title="Good food. Good company." onClose={() => setSheet(null)}>
          <div className="ma-about-image">
            <Image src="/images/interior.jpg" alt="The warm ARDO dining room" fill sizes="420px" />
          </div>
          <div className="ma-about-copy">
            <h3>
              Rooted here.
              <br />
              Open to everywhere.
            </h3>
            <p>
              Indian ingredients, a hot tandoor, and a little curiosity. A place for Kolkata to come
              together over something good.
            </p>
            <div>
              <strong>Every day</strong>
              <p>
                Lunch · {niceTime(data.settings.lunchOpen)}–{niceTime(data.settings.lunchClose)}
                <br />
                Dinner · {niceTime(data.settings.dinnerOpen)}–{niceTime(data.settings.dinnerClose)}
              </p>
            </div>
            <Link href="/restaurant/about" className="ma-secondary">
              Read our story
              <ChevronRight size={17} />
            </Link>
          </div>
        </AppSheet>
      )}
      {sheet === "experiences" && (
        <AppSheet title="Evenings worth saving" onClose={() => setSheet(null)}>
          <div className="ma-saved-experiences">
            {experiences
              .filter((e) => data.guestApp.favoriteExperiences.includes(e.id))
              .map((e) => (
                <Link href={e.href} key={e.id} onClick={() => setSheet(null)}>
                  <Image src={e.image} alt="" width={66} height={66} />
                  <div>
                    <strong>{e.title}</strong>
                    <p>{e.subtitle}</p>
                  </div>
                  <ChevronRight size={17} />
                </Link>
              ))}
            {!data.guestApp.favoriteExperiences.length && (
              <p className="ma-sheet-intro">
                Save an experience from Home. We’ll keep your next occasion right here.
              </p>
            )}
          </div>
        </AppSheet>
      )}
      {sheet === "private" && (
        <AppSheet title="Your people. Your evening." onClose={() => setSheet(null)}>
          <PrivateEnquiry profile={p} onClose={() => setSheet(null)} />
        </AppSheet>
      )}
    </div>
  );
}
function ProfileEditor({
  profile,
  onSave,
}: {
  profile: GuestAppState["profile"];
  onSave: (p: GuestAppState["profile"]) => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  return (
    <form
      className="ma-guest-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (
          !draft.name.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) ||
          draft.phone.replace(/\D/g, "").length < 10
        ) {
          setError("Add a name, a valid email, and a phone number with at least 10 digits.");
          return;
        }
        onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim().toLowerCase() });
      }}
    >
      <label>
        Name
        <input
          aria-label="Profile name"
          autoComplete="name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </label>
      <label>
        Phone
        <input
          type="tel"
          aria-label="Profile phone"
          autoComplete="tel"
          value={draft.phone}
          onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
        />
      </label>
      <label>
        Email
        <input
          type="email"
          aria-label="Profile email"
          autoComplete="email"
          value={draft.email}
          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
        />
      </label>
      {error && (
        <p className="ma-form-error" role="alert">
          {error}
        </p>
      )}
      <button className="ma-primary" type="submit">
        Save profile
        <ChevronRight size={18} />
      </button>
    </form>
  );
}
function PreferenceEditor({
  profile,
  onSave,
}: {
  profile: GuestAppState["profile"];
  onSave: (p: GuestAppState["profile"]) => void;
}) {
  const [draft, setDraft] = useState(profile);
  return (
    <div className="ma-preferences">
      <h3>At the table</h3>
      <div className="ma-occasion-grid">
        {["No preference", "Vegetarian", "Vegan"].map((d) => (
          <button
            key={d}
            aria-pressed={draft.dietary === d}
            className={draft.dietary === d ? "selected" : ""}
            onClick={() => setDraft({ ...draft, dietary: d })}
          >
            {d}
          </button>
        ))}
      </div>
      <h3>Your favourite spot</h3>
      <div className="ma-option-list">
        {["No preference", "Main dining", "Window", "Terrace"].map((s) => (
          <button
            key={s}
            aria-pressed={draft.seating === s}
            onClick={() => setDraft({ ...draft, seating: s as Seating })}
          >
            <span>{s}</span>
            <i className={draft.seating === s ? "selected" : ""} />
          </button>
        ))}
      </div>
      <button className="ma-primary" onClick={() => onSave(draft)}>
        Save preferences
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
function PrivateEnquiry({
  profile,
  onClose,
}: {
  profile: GuestAppState["profile"];
  onClose: () => void;
}) {
  const { notify } = useDemo();
  const toast = useToast();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("9–12");
  const [notes, setNotes] = useState("");
  return (
    <form
      className="ma-guest-form"
      onSubmit={(e) => {
        e.preventDefault();
        notify(
          "Private dining enquiry",
          `${name} · ${guests} guests · ${date} · ${email} · ${notes}`,
        );
        onClose();
        toast("Your enquiry is saved in the demo dashboard.");
      }}
    >
      <p className="ma-sheet-intro">
        For 8–30 of your favourite people. Tell us a little about the occasion.
      </p>
      <label>
        Name
        <input
          aria-label="Enquiry name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Email
        <input
          aria-label="Enquiry email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <div className="ma-form-pair">
        <label>
          Date
          <input
            aria-label="Enquiry date"
            type="date"
            required
            min={today()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Guests
          <select
            aria-label="Enquiry guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          >
            {["9–12", "13–20", "21–30"].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Your occasion
        <textarea
          aria-label="Enquiry occasion"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="A birthday, a milestone, the whole team…"
        />
      </label>
      <button className="ma-primary" type="submit">
        Save enquiry
        <ChevronRight size={18} />
      </button>
      <p className="ma-sheet-footnote">Saved in this demo’s notifications. No email is sent.</p>
    </form>
  );
}
