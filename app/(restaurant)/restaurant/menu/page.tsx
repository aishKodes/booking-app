import { Suspense } from "react";
import type { Metadata } from "next";
import { MenuBrowser } from "@/components/restaurant/menu-browser";
export const metadata: Metadata = { title: "The menu" };
export default function MenuPage() {
  return (
    <div className="container public-page">
      <div className="page-intro">
        <span className="eyebrow">SEASONAL. SOULFUL. SHARED.</span>
        <h1>
          Good things
          <br />
          <em>come to the table.</em>
        </h1>
        <p>
          From the first small plate to the last spoonful.
          <br />
          Indian roots. A little room for discovery.
        </p>
      </div>
      <Suspense fallback={<div className="skeleton" style={{ height: 400 }} />}>
        <MenuBrowser />
      </Suspense>
    </div>
  );
}
