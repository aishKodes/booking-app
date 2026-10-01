"use client";
import { useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppSheet } from "./shared";
import { niceDate } from "@/lib/utils";
export function AppCalendar({
  selected,
  min,
  max,
  onSelect,
  onClose,
}: {
  selected: string;
  min: string;
  max: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}) {
  const [month, setMonth] = useState(startOfMonth(parseISO(selected)));
  const dates = eachDayOfInterval({ start: month, end: endOfMonth(month) });
  const prev = startOfMonth(parseISO(min)) < month;
  const next = endOfMonth(month) < parseISO(max);
  return (
    <AppSheet title="Find your evening" onClose={onClose}>
      <div className="ma-calendar-heading">
        <button
          className="ma-icon"
          aria-label="Previous month"
          disabled={!prev}
          onClick={() => setMonth(addMonths(month, -1))}
        >
          <ChevronLeft size={20} />
        </button>
        <strong>{format(month, "MMMM yyyy")}</strong>
        <button
          className="ma-icon"
          aria-label="Next month"
          disabled={!next}
          onClick={() => setMonth(addMonths(month, 1))}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="ma-calendar-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
        {Array.from({ length: month.getDay() }, (_, i) => (
          <span key={"blank" + i} />
        ))}
        {dates.map((d) => {
          const date = format(d, "yyyy-MM-dd");
          return (
            <button
              key={date}
              disabled={date < min || date > max}
              aria-label={niceDate(date, "EEEE, d MMMM yyyy")}
              aria-pressed={date === selected}
              className={date === selected ? "selected" : ""}
              onClick={() => {
                onSelect(date);
                onClose();
              }}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>
      <p className="ma-sheet-footnote">
        A little advance planning. Tables available until {niceDate(max, "d MMMM")}.
      </p>
    </AppSheet>
  );
}
