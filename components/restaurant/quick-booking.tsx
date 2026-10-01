"use client";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, Users, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { dateOffset, niceTime, timeSlots, today } from "@/lib/utils";
import { useDemo } from "@/lib/store";
export function QuickBooking() {
  const router = useRouter();
  const { data } = useDemo();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState("2");
  return (
    <form
      className="quick-booking"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(
          `/restaurant/reserve?date=${date || dateOffset(1)}&time=${time}&guests=${guests}`,
        );
      }}
    >
      <div className="quick-title">
        <span className="eyebrow">THERE’S A PLACE FOR YOU</span>
        <h2>Let’s make plans.</h2>
      </div>
      <label>
        <span>
          <CalendarDays size={15} />
          Date
        </span>
        <input
          aria-label="Reservation date"
          type="date"
          required
          value={date || (data ? dateOffset(1) : "")}
          min={today()}
          max={dateOffset(data?.settings.bookingWindow || 60)}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label>
        <span>
          <Clock3 size={15} />
          Time
        </span>
        <select
          aria-label="Reservation time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          {timeSlots
            .filter((t) => t !== "19:30")
            .map((t) => (
              <option key={t} value={t}>
                {niceTime(t)}
              </option>
            ))}
        </select>
      </label>
      <label>
        <span>
          <Users size={15} />
          Party size
        </span>
        <select
          aria-label="Number of guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        >
          {Array.from({ length: data?.settings.maxPartySize || 8 }, (_, i) => i + 1).map((n) => (
            <option value={n} key={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>
      <button className="button button-primary" type="submit">
        Find a table <ArrowUpRight size={18} />
      </button>
    </form>
  );
}
