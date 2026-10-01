"use client";
import { useState } from "react";
import { Bell, Check, Clock3, Info, RotateCcw, Settings2, Store } from "lucide-react";
import { useDemo } from "@/lib/store";
import { restaurant } from "@/lib/demo-data";
import { AdminHeading } from "./shell";
import { ConfirmDialog, useToast } from "@/components/ui";
export function SettingsPage() {
  const { data, updateSettings, reset } = useDemo();
  const toast = useToast();
  const [form, setForm] = useState(data?.settings || restaurant);
  const [resetOpen, setResetOpen] = useState(false);
  const [error, setError] = useState("");
  if (!data) return null;
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      form.lunchOpen >= form.lunchClose ||
      form.dinnerOpen >= form.dinnerClose ||
      form.lunchClose > form.dinnerOpen
    ) {
      setError(
        "Opening times must come before closing times, and lunch must finish before dinner starts.",
      );
      return;
    }
    updateSettings(form);
    setError("");
    toast("Restaurant settings saved.");
  };
  return (
    <>
      <AdminHeading
        eyebrow="SET UP FOR A GOOD SERVICE"
        title="The details behind the evening."
        description="Restaurant information and booking rules, all in one place."
      />
      <form onSubmit={save} className="settings-form">
        <section className="settings-section">
          <div className="settings-section-intro">
            <Store size={22} />
            <h2>Restaurant profile</h2>
            <p>The same details appear on your public site and reservation confirmations.</p>
          </div>
          <div className="admin-card settings-fields">
            <div className="form-grid">
              <label>
                Restaurant name
                <input value="ARDO" readOnly />
                <small>The demo brand is fixed.</small>
              </label>
              <label>
                City
                <input value="Kolkata" readOnly />
              </label>
              <label className="full-width">
                Restaurant address
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </label>
              <label>
                Phone number
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label>
                Email address
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
            </div>
          </div>
        </section>
        <section className="settings-section">
          <div className="settings-section-intro">
            <Clock3 size={22} />
            <h2>Operating hours</h2>
            <p>Two services, every day. Available booking slots follow these hours.</p>
          </div>
          <div className="admin-card settings-fields">
            <div className="operating-hours-row">
              <strong>Lunch service</strong>
              <label>
                Opens
                <input
                  type="time"
                  required
                  value={form.lunchOpen}
                  onChange={(e) => setForm({ ...form, lunchOpen: e.target.value })}
                />
              </label>
              <span>to</span>
              <label>
                Closes
                <input
                  type="time"
                  required
                  value={form.lunchClose}
                  onChange={(e) => setForm({ ...form, lunchClose: e.target.value })}
                />
              </label>
            </div>
            <div className="operating-hours-row">
              <strong>Dinner service</strong>
              <label>
                Opens
                <input
                  type="time"
                  required
                  value={form.dinnerOpen}
                  onChange={(e) => setForm({ ...form, dinnerOpen: e.target.value })}
                />
              </label>
              <span>to</span>
              <label>
                Closes
                <input
                  type="time"
                  required
                  value={form.dinnerClose}
                  onChange={(e) => setForm({ ...form, dinnerClose: e.target.value })}
                />
              </label>
            </div>
            <p className="settings-help">
              Last online arrival is at least one hour before closing. Slot availability is
              simulated.
            </p>
          </div>
        </section>
        <section className="settings-section">
          <div className="settings-section-intro">
            <Settings2 size={22} />
            <h2>Reservation rules</h2>
            <p>A little structure for a smoother service.</p>
          </div>
          <div className="admin-card settings-fields">
            <div className="form-grid">
              {(
                [
                  ["bookingWindow", "Booking window (days)", 1, 180],
                  ["minimumNotice", "Minimum notice (minutes)", 0, 120],
                  ["maxPartySize", "Maximum online party", 1, 8],
                  ["duration", "Reservation duration (minutes)", 60, 180],
                  ["gracePeriod", "Grace period (minutes)", 5, 30],
                ] as const
              ).map(([key, label, min, max]) => (
                <label key={key}>
                  {label}
                  <input
                    required
                    type="number"
                    min={min}
                    max={max}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                  />
                </label>
              ))}
            </div>
            <div className="settings-seating">
              <strong>Seating preferences</strong>
              <p>Main dining · Window · Terrace · No preference</p>
              <small>
                Preferences are requests. Table capacity and overlapping bookings are checked when
                assigning.
              </small>
            </div>
          </div>
        </section>
        <section className="settings-section">
          <div className="settings-section-intro">
            <Bell size={22} />
            <h2>Notifications</h2>
            <p>Preferences for this demo workspace.</p>
          </div>
          <div className="admin-card settings-fields">
            <label className="settings-toggle">
              <div>
                <strong>Unread activity indicator</strong>
                <span>Highlight new activity in the dashboard header.</span>
              </div>
              <input
                type="checkbox"
                checked={form.bookingAlerts}
                onChange={(e) => setForm({ ...form, bookingAlerts: e.target.checked })}
              />
            </label>
            <label className="settings-toggle">
              <div>
                <strong>Email preference</strong>
                <span>Saved for demonstration. No emails are sent.</span>
              </div>
              <input
                type="checkbox"
                checked={form.emailNotifications}
                onChange={(e) => setForm({ ...form, emailNotifications: e.target.checked })}
              />
            </label>
          </div>
        </section>
        <div className="settings-save">
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <button className="button button-primary" type="submit">
            Save settings <Check size={17} />
          </button>
        </div>
      </form>
      <section className="settings-section demo-settings">
        <div className="settings-section-intro">
          <Info size={22} />
          <h2>Demo environment</h2>
          <p>A fresh start for the next presentation.</p>
        </div>
        <div className="admin-card settings-fields">
          <div className="demo-settings-info">
            <strong>Everything lives in this browser.</strong>
            <p>
              Reservations, guest profiles, menu edits, table state, settings, and activity are
              saved locally. There’s no backend or real authentication. Data is shared across tabs
              on this origin.
            </p>
          </div>
          <div className="reset-demo-row">
            <div>
              <strong>Reset demo data</strong>
              <span>Restore the original data, dated for today.</span>
            </div>
            <button className="button button-danger-outline" onClick={() => setResetOpen(true)}>
              <RotateCcw size={16} />
              Reset demo data
            </button>
          </div>
        </div>
      </section>
      {resetOpen && (
        <ConfirmDialog
          title="A fresh start for the demo?"
          description="This restores seed reservations, guests, tables, menu, settings, and notifications. Your locally created bookings and edits will be cleared."
          confirm="Reset demo data"
          danger
          onClose={() => setResetOpen(false)}
          onConfirm={() => {
            reset();
            setForm(restaurant);
            toast("Demo reset. Everything is ready for your next presentation.");
          }}
        />
      )}
    </>
  );
}
