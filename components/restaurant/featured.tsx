"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useDemo } from "@/lib/store";
import { menuItems } from "@/lib/demo-data";
import { money } from "@/lib/utils";
export function FeaturedDishes() {
  const { data } = useDemo();
  const items = (data?.menu || menuItems)
    .filter((m) => m.featured && m.available && m.image)
    .slice(0, 3);
  return (
    <section className="container section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">FROM OUR KITCHEN</span>
          <h2>
            Some very good reasons
            <br />
            to pull up a chair.
          </h2>
        </div>
        <Link className="text-link" href="/restaurant/menu">
          Explore the full menu <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="dish-grid">
        {items.map((m, i) => (
          <Link
            className="dish-card"
            href={`/restaurant/menu?search=${encodeURIComponent(m.name)}`}
            key={m.id}
          >
            <div className="dish-image">
              <Image src={m.image!} alt={m.name} fill sizes="(max-width: 700px) 90vw, 33vw" />
              <span className="dish-number">0{i + 1}</span>
              <span className="dish-arrow">
                <ArrowUpRight size={21} />
              </span>
            </div>
            <div className="dish-meta">
              <h3>{m.name}</h3>
              <span>{money(m.price)}</span>
            </div>
            <p>{m.description}</p>
            <span className="dietary-label">
              <i className={m.dietary === "Non-vegetarian" ? "nonveg" : ""} />
              {m.dietary}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
