"use client";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useDemo } from "@/lib/store";
import type { MenuItem } from "@/lib/types";
import { categories } from "@/lib/demo-data";
import { AppEmpty, AppSheet, DishCard, DishDetail } from "./shared";
export function AppExplore({ favorites = false }: { favorites?: boolean }) {
  const { data } = useDemo();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All dishes");
  const [diet, setDiet] = useState("All preferences");
  const [filters, setFilters] = useState(false);
  const [dish, setDish] = useState<MenuItem | null>(null);
  if (!data) return null;
  const rows = data.menu.filter(
    (m) =>
      (!favorites || data.guestApp.favoriteDishes.includes(m.id)) &&
      (category === "All dishes" ||
        (category === "Recommended" ? m.featured : m.category === category)) &&
      `${m.name} ${m.description}`.toLowerCase().includes(search.toLowerCase()) &&
      (diet === "All preferences" ||
        (diet === "Gluten-conscious" ? m.glutenFree : m.dietary === diet)),
  );
  return (
    <div className="ma-explore">
      <div className="ma-explore-intro">
        <span className="ma-kicker">SEASONAL. SOULFUL. SHARED.</span>
        <h2>{favorites ? "Your favourites." : "Find your next favourite."}</h2>
        <p>A little Indian soul. A little room for discovery.</p>
      </div>
      <div className="ma-explore-tools">
        <div className="ma-search">
          <Search size={19} />
          <input
            aria-label="Search app dishes"
            placeholder="Search dishes, ingredients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button aria-label="Clear dish search" onClick={() => setSearch("")}>
              <X size={17} />
            </button>
          )}
        </div>
        <button
          className={`ma-filter ${diet !== "All preferences" ? "selected" : ""}`}
          aria-label="Dietary filters"
          onClick={() => setFilters(true)}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>
      <div className="ma-chip-strip" aria-label="Dish categories">
        {["All dishes", "Recommended", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={category === c ? "active" : ""}
          >
            {c === "From the Grill" ? "Grill" : c}
          </button>
        ))}
      </div>
      <div className="ma-menu-caption">
        <span>
          {rows.length} {rows.length === 1 ? "dish" : "dishes"}
          {favorites ? " saved for later" : ""}
        </span>
        {diet !== "All preferences" && (
          <button onClick={() => setDiet("All preferences")}>
            {diet}
            <X size={13} />
          </button>
        )}
      </div>
      <div className="ma-menu-list">
        {rows.map((m, i) => (
          <DishCard
            key={m.id}
            item={m}
            compact={!(m.featured && m.image && i < 2)}
            onOpen={() => setDish(m)}
          />
        ))}
      </div>
      {!rows.length && (
        <AppEmpty
          title={
            favorites
              ? "Your favourites will feel at home here."
              : "Nothing on the menu quite matches."
          }
          text={
            favorites
              ? "Tap a heart on a dish to save it for your next visit."
              : "Try another category or dietary preference."
          }
        >
          {!favorites && (
            <button
              className="ma-primary"
              onClick={() => {
                setSearch("");
                setCategory("All dishes");
                setDiet("All preferences");
              }}
            >
              Show all dishes
            </button>
          )}
        </AppEmpty>
      )}
      <p className="ma-demo-note">
        Tell us about allergies when you reserve.
        <br />
        Gluten-conscious dishes share a kitchen. Taxes extra.
      </p>
      {dish && (
        <DishDetail
          item={data.menu.find((m) => m.id === dish.id) || dish}
          onClose={() => setDish(null)}
        />
      )}{" "}
      {filters && (
        <AppSheet title="A menu for you" onClose={() => setFilters(false)}>
          <p className="ma-sheet-intro">Choose a dietary preference.</p>
          <div className="ma-option-list">
            {["All preferences", "Vegetarian", "Vegan", "Gluten-conscious"].map((d) => (
              <button
                key={d}
                aria-pressed={diet === d}
                onClick={() => {
                  setDiet(d);
                  setFilters(false);
                }}
              >
                <span>{d}</span>
                <i className={diet === d ? "selected" : ""} />
              </button>
            ))}
          </div>
          <p className="ma-sheet-footnote">
            Our kitchen handles common allergens. Please ask the team about specific requirements.
          </p>
        </AppSheet>
      )}
    </div>
  );
}
