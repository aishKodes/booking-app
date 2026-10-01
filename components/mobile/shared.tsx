"use client";
import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { CalendarDays, ChevronRight, Heart, Utensils, X } from "lucide-react";
import { motion } from "motion/react";
import { useDemo } from "@/lib/store";
import type { MenuItem, Reservation } from "@/lib/types";
import { money, niceDate, niceTime } from "@/lib/utils";
export const AppActionsContext = createContext<HTMLDivElement | null>(null);
export function AppActionBar({ children }: { children: ReactNode }) {
  const host = useContext(AppActionsContext);
  return host ? createPortal(<div className="ma-actionbar">{children}</div>, host) : null;
}

export function AppSheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="ma-sheet"
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="ma-sheet-panel">
        <div className="ma-sheet-handle" />
        <header>
          <h2 id={id}>{title}</h2>
          <button className="ma-icon" aria-label="Close sheet" onClick={onClose}>
            <X size={21} />
          </button>
        </header>
        <div className="ma-sheet-body">{children}</div>
      </div>
    </dialog>
  );
}
export function AppEmpty({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="ma-empty">
      <span>
        <CalendarDays size={28} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </div>
  );
}
export function SectionTitle({
  title,
  href,
  action = "See all",
}: {
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="ma-section-title">
      <h2>{title}</h2>
      {href && (
        <Link href={href}>
          {action}
          <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function FavoriteButton({ item }: { item: MenuItem }) {
  const { data, updateApp } = useDemo();
  const saved = data?.guestApp.favoriteDishes.includes(item.id);
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      className={`ma-favorite ${saved ? "saved" : ""}`}
      aria-label={`${saved ? "Unsave" : "Save"} ${item.name}`}
      aria-pressed={!!saved}
      onClick={() => {
        if (data)
          updateApp({
            favoriteDishes: saved
              ? data.guestApp.favoriteDishes.filter((id) => id !== item.id)
              : [...data.guestApp.favoriteDishes, item.id],
          });
      }}
    >
      <Heart size={19} fill={saved ? "currentColor" : "none"} />
    </motion.button>
  );
}
export function DishCard({
  item,
  onOpen,
  compact = false,
}: {
  item: MenuItem;
  onOpen: () => void;
  compact?: boolean;
}) {
  return (
    <article className={`ma-dish ${compact ? "compact" : ""}`}>
      <button className="ma-dish-open" onClick={onOpen} aria-label={`View ${item.name}`}>
        <div className="ma-dish-image">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes={compact ? "90px" : "(max-width: 600px) 100vw, 420px"}
              loading={compact ? "lazy" : "eager"}
            />
          ) : (
            <div className="ma-dish-monogram">
              <Utensils size={24} />
            </div>
          )}
          {!item.available && <span className="ma-sold-out">Sold out today</span>}
        </div>
        <div className="ma-dish-copy">
          <span className={`ma-diet-dot ${item.dietary === "Non-vegetarian" ? "nonveg" : ""}`} />
          <h3>{item.name}</h3>
          {compact && <p>{item.description}</p>}
          <div>
            <strong>{money(item.price)}</strong>
            {item.featured && <span>House favourite</span>}
          </div>
        </div>
      </button>
      <FavoriteButton item={item} />
    </article>
  );
}
export function DishDetail({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  return (
    <AppSheet title="From our kitchen" onClose={onClose}>
      <div className="ma-dish-detail">
        {item.image && (
          <div className="ma-detail-image">
            <Image src={item.image} alt={item.name} fill sizes="420px" />
          </div>
        )}
        <div className="ma-detail-name">
          <div>
            <span className="ma-kicker">{item.category}</span>
            <h3>{item.name}</h3>
          </div>
          <FavoriteButton item={item} />
        </div>
        <strong className="ma-detail-price">{money(item.price)}</strong>
        <p>{item.description}</p>
        <div className="ma-tags">
          <span>{item.dietary}</span>
          {item.glutenFree && <span>Gluten-conscious</span>}
          {item.spicy && <span>Warming spice</span>}
          {item.featured && <span>Chef’s favourite</span>}
        </div>
        <div className="ma-allergen">
          <strong>Allergens</strong>
          <p>
            {item.allergens}. Prepared in a shared kitchen. Please mention any allergies when
            booking.
          </p>
        </div>
        {!item.available && (
          <p className="ma-inline-note">Taking a little break. This dish is unavailable today.</p>
        )}
        <Link className="ma-primary" href="/app/reserve" onClick={onClose}>
          Make a dinner plan
          <ChevronRight size={18} />
        </Link>
        <small>Prices in INR. Taxes extra.</small>
      </div>
    </AppSheet>
  );
}
export function BookingCard({
  reservation: r,
  simple = false,
}: {
  reservation: Reservation;
  simple?: boolean;
}) {
  const { data } = useDemo();
  const table = data?.tables.find((t) => t.id === r.tableId);
  const editable = ["confirmed", "arriving"].includes(r.status);
  return (
    <article className={`ma-booking-card ${simple ? "simple" : ""}`}>
      <div className="ma-booking-card-top">
        <span className="ma-kicker">ARDO · PARK STREET</span>
        <span className={`ma-status ${r.status}`}>{r.status.replace("no-show", "No-show")}</span>
      </div>
      <Link href={`/app/bookings/${r.id}`} className="ma-booking-card-main">
        <div className="ma-booking-date">
          <strong>{niceDate(r.date, "dd")}</strong>
          <span>{niceDate(r.date, "MMM")}</span>
        </div>
        <div>
          <h3>{niceDate(r.date, "EEE, d MMM")}</h3>
          <p>
            {niceTime(r.time)} · {r.partySize} {r.partySize === 1 ? "guest" : "guests"}
          </p>
          <span>
            {table ? `Table ${table.number} · ${r.seatingPreference}` : r.seatingPreference}
          </span>
        </div>
        <ChevronRight size={19} />
      </Link>
      <div className="ma-booking-card-actions">
        {!simple && <span className="ma-booking-reference">{r.confirmationCode}</span>}
        <Link href={`/app/bookings/${r.id}`}>View booking</Link>
        {editable && <Link href={`/app/reserve?edit=${r.id}`}>Modify</Link>}
      </div>
    </article>
  );
}
