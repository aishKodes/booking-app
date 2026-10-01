"use client";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { useDemo } from "@/lib/store";
import { today, dateOffset } from "@/lib/utils";
export function PrivateInquiry() {
  const [sent, setSent] = useState(false);
  const { notify } = useDemo();
  return sent ? (
    <div className="inquiry-success">
      <Check size={32} />
      <h2>We’ve saved your occasion.</h2>
      <p>
        Your enquiry is now in the demo dashboard’s notifications. In a live restaurant, our events
        team would follow up personally.
      </p>
      <button className="text-link" onClick={() => setSent(false)}>
        Plan another occasion <ArrowUpRight size={17} />
      </button>
    </div>
  ) : (
    <form
      className="inquiry-form"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        notify(
          "Private dining enquiry",
          `${f.get("name")} · ${f.get("guests")} guests · ${f.get("date")} · ${f.get("email")} · ${f.get("notes") || "No additional notes"}`,
        );
        setSent(true);
      }}
    >
      <span className="eyebrow">LET’S PLAN SOMETHING</span>
      <h2>
        Tell us a little
        <br />
        about your occasion.
      </h2>
      <div className="form-grid">
        <label>
          Your name
          <input name="name" autoComplete="name" required placeholder="Full name" />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </label>
        <label>
          Preferred date
          <input name="date" type="date" min={today()} max={dateOffset(180)} required />
        </label>
        <label>
          Number of guests
          <select name="guests">
            <option>9–12</option>
            <option>13–20</option>
            <option>21–30</option>
          </select>
        </label>
        <label className="full-width">
          The occasion
          <textarea
            name="notes"
            rows={3}
            maxLength={500}
            placeholder="A birthday, a team dinner, or just a good reason to gather…"
          />
        </label>
      </div>
      <button className="button button-primary" type="submit">
        Send an enquiry <ArrowUpRight size={18} />
      </button>
      <small>Demo enquiry · Saved in this browser. No email is sent.</small>
    </form>
  );
}
