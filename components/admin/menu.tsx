"use client";
import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, ChefHat, Search, Star } from "lucide-react";
import { useDemo } from "@/lib/store";
import { AdminHeading } from "./shell";
import { categories } from "@/lib/demo-data";
import { EmptyState, Modal, useToast } from "@/components/ui";
import { money } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";
export function AdminMenu({ initialItem }: { initialItem?: string }) {
  const { data, updateMenu } = useDemo();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [editing, setEditing] = useState<MenuItem | null>(
    data?.menu.find((m) => m.id === initialItem) || null,
  );
  if (!data) return null;
  const rows = data.menu.filter(
    (m) =>
      (category === "All categories" || m.category === category) &&
      `${m.name} ${m.description}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <AdminHeading
        eyebrow="WHAT’S GOOD TODAY"
        title="A menu that stays in season."
        description="Keep the kitchen and the guest experience on the same page."
      >
        <a
          href="/restaurant/menu"
          target="_blank"
          rel="noreferrer"
          className="button button-secondary"
        >
          Preview public menu <ArrowUpRight size={16} />
        </a>
      </AdminHeading>
      <div className="menu-admin-summary">
        <span>
          <ChefHat size={19} />
          <strong>{data.menu.length}</strong> dishes on the menu
        </span>
        <span>
          <i className="green-dot" />
          <strong>{data.menu.filter((m) => m.available).length}</strong> available today
        </span>
        <span>
          <Star size={16} />
          <strong>{data.menu.filter((m) => m.featured).length}</strong> house favourites
        </span>
      </div>
      <section className="admin-card">
        <div className="admin-filter-bar">
          <div className="search-field">
            <Search size={17} />
            <input
              aria-label="Search menu items"
              placeholder="Find a dish or ingredient"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            aria-label="Menu category filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["All categories", ...categories].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="admin-menu-list">
          {rows.map((m) => (
            <article className="admin-menu-row" key={m.id}>
              <div className="admin-dish-thumb">
                {m.image ? (
                  <Image src={m.image} alt={m.name} fill sizes="64px" />
                ) : (
                  <ChefHat size={23} />
                )}
              </div>
              <div className="admin-dish-info">
                <button onClick={() => setEditing(m)}>{m.name}</button>
                <span>
                  {m.category} · {m.dietary}
                </span>
                <p>{m.description}</p>
              </div>
              <strong className="admin-dish-price">{money(m.price)}</strong>
              <button
                className={`feature-toggle ${m.featured ? "featured" : ""}`}
                aria-label={`${m.featured ? "Unfeature" : "Feature"} ${m.name}`}
                aria-pressed={m.featured}
                onClick={() => {
                  updateMenu(m.id, { featured: !m.featured });
                  toast(
                    m.featured ? "Removed from house favourites." : "Added to house favourites.",
                  );
                }}
              >
                <Star size={17} fill={m.featured ? "currentColor" : "none"} />
              </button>
              <div className="availability-control">
                <button
                  role="switch"
                  aria-checked={m.available}
                  className={`switch ${m.available ? "on" : ""}`}
                  aria-label={`${m.name} availability`}
                  onClick={() => {
                    updateMenu(m.id, { available: !m.available });
                    toast(`${m.name} marked ${m.available ? "sold out" : "available"}.`);
                  }}
                >
                  <i />
                </button>
                <span>{m.available ? "Available" : "Sold out"}</span>
              </div>
              <button
                className="icon-button edit-menu-button"
                onClick={() => setEditing(m)}
                aria-label={`Edit ${m.name}`}
              >
                <ArrowUpRight size={18} />
              </button>
            </article>
          ))}
        </div>
        {!rows.length && (
          <EmptyState
            title="That dish isn’t on this page."
            description="Try a different search or category."
          />
        )}
        <div className="table-footer">
          <span>{rows.length} dishes · Prices in INR</span>
          <span>
            <Check size={13} /> Changes appear on the restaurant menu
          </span>
        </div>
      </section>
      {editing && (
        <Modal drawer title="Edit menu item" onClose={() => setEditing(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateMenu(editing.id, editing);
              toast("Menu item updated. The public menu is in sync.");
              setEditing(null);
            }}
          >
            {editing.image && (
              <div className="menu-edit-image">
                <Image src={editing.image} alt={editing.name} fill sizes="450px" />
              </div>
            )}
            <div className="form-grid">
              <label className="full-width">
                Dish name
                <input
                  required
                  value={editing.name}
                  maxLength={80}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </label>
              <label>
                Category
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                Price (₹)
                <input
                  type="number"
                  required
                  min={1}
                  max={10000}
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                />
              </label>
              <label className="full-width">
                Description
                <textarea
                  required
                  rows={3}
                  value={editing.description}
                  maxLength={250}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </label>
              <label className="full-width">
                Dietary preference
                <select
                  value={editing.dietary}
                  onChange={(e) =>
                    setEditing({ ...editing, dietary: e.target.value as MenuItem["dietary"] })
                  }
                >
                  {["Vegetarian", "Vegan", "Non-vegetarian"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
              <label className="full-width">
                Allergens
                <input
                  value={editing.allergens}
                  onChange={(e) => setEditing({ ...editing, allergens: e.target.value })}
                />
              </label>
            </div>
            <div className="edit-checkboxes">
              {(
                [
                  ["available", "Available to order"],
                  ["featured", "House favourite"],
                  ["glutenFree", "Gluten-conscious"],
                  ["spicy", "Contains warming spice"],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={editing[key]}
                    onChange={(e) => setEditing({ ...editing, [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
            <button className="button button-primary full-button" type="submit">
              Save changes <Check size={17} />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
