"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Heart,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useDemo } from "@/lib/store";
import type { MenuItem } from "@/lib/types";
import { dateOffset, directionsUrl, niceTime, today } from "@/lib/utils";
import { experiences, upcomingBookings } from "@/lib/mobile";
import { BookingCard, DishCard, DishDetail, SectionTitle } from "./shared";
export function AppHome() {
  const { data, updateApp } = useDemo();
  const [dish, setDish] = useState<MenuItem | null>(null);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(dateOffset(1));
  const [time, setTime] = useState("20:00");
  if (!data) return null;
  const next = upcomingBookings(data)[0];
  const popular = data.menu.filter((m) => m.featured && m.image && m.available).slice(0, 4);
  const recommended = data.menu
    .filter(
      (m) =>
        m.available &&
        (data.guestApp.profile.dietary === "No preference" ||
          m.dietary === data.guestApp.profile.dietary),
    )
    .slice(0, 2);
  return (
    <div className="ma-home">
      <div className="ma-home-greeting">
        <span className="ma-kicker">A LITTLE SOMETHING TO LOOK FORWARD TO</span>
        <h2>
          Hello{data.guestApp.profile.name ? `, ${data.guestApp.profile.name.split(" ")[0]}` : ""}.
          <br />
          Let’s make an evening.
        </h2>
        <p>Good food. Your favourite people. Right here.</p>
      </div>
      <section className="ma-quick">
        <div className="ma-quick-heading">
          <h3>Your next table</h3>
          <span>INSTANT CONFIRMATION</span>
        </div>
        <div className="ma-quick-fields">
          <label>
            <CalendarDays size={17} />
            <select
              aria-label="Quick booking date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            >
              <option value={today()}>Today</option>
              <option value={dateOffset(1)}>Tomorrow</option>
              <option value={dateOffset(2)}>In two days</option>
            </select>
          </label>
          <label>
            <Users size={17} />
            <select
              aria-label="Quick booking guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {Array.from({ length: data.settings.maxPartySize }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i === 0 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
          <label>
            <select
              aria-label="Quick booking time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {["18:30", "19:00", "20:00", "20:30", "21:00"].map((t) => (
                <option key={t} value={t}>
                  {niceTime(t)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Link
          className="ma-primary"
          href={`/app/reserve?date=${date}&guests=${guests}&time=${time}`}
        >
          Find a table
          <ArrowUpRight size={18} />
        </Link>
        <p>No reservation fee. Just a good evening.</p>
      </section>
      {next && (
        <section>
          <SectionTitle title="Your next good evening" href="/app/bookings" />
          <BookingCard reservation={next} simple />
        </section>
      )}
      <section>
        <SectionTitle title="Popular at ARDO" href="/app/explore" />
        <div className="ma-horizontal ma-popular">
          {popular.map((m) => (
            <DishCard key={m.id} item={m} onOpen={() => setDish(m)} />
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title="Make an occasion of it" />
        <div className="ma-horizontal ma-experiences">
          {experiences.map((e) => {
            const saved = data.guestApp.favoriteExperiences.includes(e.id);
            return (
              <article key={e.id}>
                <Link href={e.href}>
                  <Image src={e.image} alt="" fill sizes="230px" />
                  <div>
                    <span>THE ARDO WAY</span>
                    <h3>{e.title}</h3>
                    <p>{e.subtitle}</p>
                  </div>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  aria-label={`${saved ? "Unsave" : "Save"} ${e.title}`}
                  aria-pressed={saved}
                  onClick={() =>
                    updateApp({
                      favoriteExperiences: saved
                        ? data.guestApp.favoriteExperiences.filter((id) => id !== e.id)
                        : [...data.guestApp.favoriteExperiences, e.id],
                    })
                  }
                >
                  <Heart size={17} fill={saved ? "currentColor" : "none"} />
                </motion.button>
              </article>
            );
          })}
        </div>
      </section>
      <Link className="ma-brunch" href="/app/reserve?time=12:30">
        <span>WEEKEND PLANS, SORTED</span>
        <div>
          <h3>
            A Sunday without
            <br />
            the hurry.
          </h3>
          <ChevronRight size={22} />
        </div>
        <p>
          Brunch · {niceTime(data.settings.lunchOpen)}–{niceTime(data.settings.lunchClose)}
        </p>
      </Link>
      <section>
        <SectionTitle title="A few good suggestions" href="/app/explore" />
        {recommended.map((m) => (
          <DishCard key={m.id} item={m} compact onOpen={() => setDish(m)} />
        ))}
      </section>
      <section className="ma-venue">
        <div>
          <span className="ma-venue-mark">a.</span>
          <div>
            <h3>ARDO, Park Street</h3>
            <p>Contemporary Indian · ₹₹₹</p>
            <span>
              <Star size={12} fill="currentColor" />
              4.8 <i />
              Dinner until {niceTime(data.settings.dinnerClose)}
            </span>
          </div>
        </div>
        <p>{data.settings.address}</p>
        <footer>
          <a href={directionsUrl} target="_blank" rel="noreferrer">
            <MapPin size={16} />
            Directions
          </a>
          <a href={`tel:${data.settings.phone.replace(/\s/g, "")}`}>
            <Phone size={16} />
            Call restaurant
          </a>
        </footer>
      </section>
      <p className="ma-demo-note">Fictional restaurant. A real feel for what’s possible.</p>
      {dish && (
        <DishDetail
          item={data.menu.find((m) => m.id === dish.id) || dish}
          onClose={() => setDish(null)}
        />
      )}
    </div>
  );
}
