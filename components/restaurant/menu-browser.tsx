"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, SlidersHorizontal, Flame, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { categories, menuItems } from "@/lib/demo-data";
import { useDemo } from "@/lib/store";
import { money } from "@/lib/utils";
import { EmptyState } from "@/components/ui";
export function MenuBrowser() {
  const params = useSearchParams();
  const { data } = useDemo();
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState("All dishes");
  const [diet, setDiet] = useState("All preferences");
  const filtered = (data?.menu || menuItems).filter(
    (m) =>
      (category === "All dishes" || m.category === category) &&
      (diet === "All preferences" ||
        (diet === "Vegetarian" && m.dietary !== "Non-vegetarian") ||
        (diet === "Vegan" && m.dietary === "Vegan") ||
        (diet === "Gluten-conscious" && m.glutenFree)) &&
      `${m.name} ${m.description}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="menu-toolbar">
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Search dishes"
            placeholder="Something on your mind? Search the menu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button aria-label="Clear search" onClick={() => setSearch("")}>
              <X size={16} />
            </button>
          )}
        </div>
        <label className="filter-select">
          <SlidersHorizontal size={17} />
          <select
            aria-label="Dietary preference"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          >
            {["All preferences", "Vegetarian", "Vegan", "Gluten-conscious"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      <nav className="menu-categories" aria-label="Menu categories">
        {["All dishes", ...categories].map((c) => (
          <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </nav>
      {filtered.length === 0 ? (
        <EmptyState
          title="Nothing on the menu matches just yet."
          description="Try another dish or ease up on the filters."
        >
          <button
            className="button button-secondary"
            onClick={() => {
              setSearch("");
              setDiet("All preferences");
              setCategory("All dishes");
            }}
          >
            Show the full menu
          </button>
        </EmptyState>
      ) : (
        categories.map((c) => {
          const items = filtered.filter((m) => m.category === c);
          return (
            items.length > 0 && (
              <section className="menu-section" key={c}>
                <div className="menu-section-title">
                  <span className="eyebrow">0{categories.indexOf(c) + 1}</span>
                  <h2>{c}</h2>
                  <span>
                    {c === "Small Plates"
                      ? "A good place to begin."
                      : c === "Drinks"
                        ? "Something to raise a glass to."
                        : c === "Desserts"
                          ? "Leave a little room."
                          : "Made to order. Best shared."}
                  </span>
                </div>
                <div className="menu-items">
                  {items.map((m) => (
                    <article className={`menu-item ${!m.available ? "sold-out" : ""}`} key={m.id}>
                      {m.image && (
                        <div className="menu-item-image">
                          <Image src={m.image} alt={m.name} fill sizes="120px" />
                        </div>
                      )}
                      <div className="menu-item-copy">
                        <div className="menu-item-title">
                          <h3>{m.name}</h3>
                          <span>{money(m.price)}</span>
                        </div>
                        <p>{m.description}</p>
                        <div className="menu-item-tags">
                          <span className="dietary-label">
                            <i className={m.dietary === "Non-vegetarian" ? "nonveg" : ""} />
                            {m.dietary}
                          </span>
                          {m.featured && <span className="chef-pick">House favourite</span>}
                          {m.spicy && (
                            <span title="Warming spice">
                              <Flame size={13} />
                              Spiced
                            </span>
                          )}
                          {!m.available && <span className="soldout-label">Unavailable today</span>}
                        </div>
                        <small>Contains: {m.allergens.toLowerCase()}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )
          );
        })
      )}
      <div className="menu-footnote">
        <p>
          Seasonal ingredients may change. Please tell our team about allergies.
          <br />
          Gluten-conscious dishes are prepared in a shared kitchen. Prices in INR, taxes extra.
        </p>
        <Link href="/restaurant/reserve" className="text-link">
          Ready for a table? <ArrowUpRight size={17} />
        </Link>
      </div>
    </>
  );
}
