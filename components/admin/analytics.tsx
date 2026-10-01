"use client";
import { useState } from "react";
import { Download, Sparkles, Users, Clock3, Repeat2 } from "lucide-react";
import { useDemo } from "@/lib/store";
import { AdminHeading } from "./shell";
import { SourceChart, TrendChart } from "./charts";
import { analytics } from "@/lib/analytics";
import { useToast } from "@/components/ui";
export function AnalyticsPage() {
  const { data } = useDemo();
  const toast = useToast();
  const [days, setDays] = useState(7);
  if (!data) return null;
  const a = analytics(data, days);
  const exportReport = () => {
    const csv = [
      "Date,Reservations,Covers",
      ...a.daily.map((d) => `${d.date},${d.reservations},${d.covers}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `ardo-${days}-day-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast("Your reservation report has been downloaded.");
  };
  return (
    <>
      <AdminHeading
        eyebrow="SEE THE PATTERNS. PLAN AHEAD."
        title="A clearer picture of your restaurant."
        description="Real calculations from your persisted demo reservation book."
      >
        <button className="button button-secondary" onClick={exportReport}>
          <Download size={16} />
          Export report
        </button>
      </AdminHeading>
      <div className="analytics-period">
        <span>Reservation performance</span>
        <div className="segmented">
          {[7, 30, 90].map((d) => (
            <button key={d} className={days === d ? "active" : ""} onClick={() => setDays(d)}>
              {d} days
            </button>
          ))}
        </div>
      </div>
      <div className="kpi-row analytics-kpis">
        <div>
          <span>Reservations</span>
          <strong>{a.total}</strong>
          <p>In the past {days} days</p>
        </div>
        <div>
          <span>Total covers</span>
          <strong>{a.covers}</strong>
          <p>Excludes cancellations & no-shows</p>
        </div>
        <div>
          <span>Average party size</span>
          <strong>
            {a.averageParty.toFixed(1)}
            <small>guests</small>
          </strong>
          <p>A useful guide for table planning</p>
        </div>
        <div>
          <span>Cancellation rate</span>
          <strong>
            {a.cancellation.toFixed(1)}
            <small>%</small>
          </strong>
          <p>{Math.round((a.total * a.cancellation) / 100)} cancelled reservations</p>
        </div>
      </div>
      <div className="analytics-main-grid">
        <section className="admin-card">
          <div className="card-heading">
            <div>
              <h2>Reservations over time</h2>
              <p>Daily bookings, excluding cancellations and no-shows.</p>
            </div>
            <span className="chart-key">
              <i />
              Reservations
            </span>
          </div>
          <TrendChart data={a.daily} area />
          <div className="chart-insight">
            <Sparkles size={15} />
            {a.total
              ? `${a.daily.reduce((best, d) => (d.reservations > best.reservations ? d : best), a.daily[0]).label} has the most bookings in this period.`
              : "Your reservation patterns will appear here as bookings come in."}
          </div>
        </section>
        <section className="admin-card">
          <div className="card-heading">
            <div>
              <h2>Where bookings begin</h2>
              <p>Reservation source, including cancelled bookings.</p>
            </div>
          </div>
          <SourceChart data={a.sources} />
        </section>
      </div>
      <div className="analytics-bottom-grid">
        <section className="admin-card">
          <div className="card-heading">
            <div>
              <h2>Dinner, by the hour</h2>
              <p>Covers grouped by arrival hour.</p>
            </div>
            <Clock3 size={18} />
          </div>
          <TrendChart data={a.hourly} metric="covers" />
        </section>
        <section className="admin-card">
          <div className="card-heading">
            <div>
              <h2>Party size</h2>
              <p>The tables your guests need.</p>
            </div>
            <Users size={18} />
          </div>
          <TrendChart data={a.party} />
        </section>
        <section className="admin-card returning-card">
          <div className="card-heading">
            <div>
              <h2>A familiar welcome</h2>
              <p>Guests who have dined with you before.</p>
            </div>
            <Repeat2 size={18} />
          </div>
          <strong className="returning-number">
            {Math.round(a.returning)}
            <span>%</span>
          </strong>
          <p>
            of guests booked in this period have a completed visit before a booking in this period.
          </p>
          <div className="repeat-progress">
            <i style={{ width: `${a.returning}%` }} />
          </div>
          <span className="muted">Calculated from unique guest profiles.</span>
        </section>
      </div>
      <div className="analytics-insights">
        <Sparkles size={21} />
        <div>
          <strong>A useful thought for the next service.</strong>
          <p>
            {a.peak.covers
              ? `${a.peak.label} is your busiest dinner arrival hour, with ${a.peak.covers} covers in this period. Keep a little extra host capacity around that time.`
              : "Dinner service patterns will appear as you add reservations."}
          </p>
        </div>
      </div>
      <p className="analytics-note">
        Historical data is seeded, deterministic and fictional. New reservations and status changes
        update these charts automatically. Future bookings are excluded until their booking date.
      </p>
    </>
  );
}
