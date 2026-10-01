import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export const metadata: Metadata = { title: "Our story" };
export default function AboutPage() {
  return (
    <div className="container public-page">
      <div className="page-intro">
        <span className="eyebrow">THE ARDO WAY</span>
        <h1>
          A table for
          <br />
          <em>the way we live.</em>
        </h1>
        <p>
          A little nostalgia. A little curiosity.
          <br />
          And a generous helping of Kolkata.
        </p>
      </div>
      <div className="about-hero">
        <Image
          src="/images/interior.jpg"
          alt="A welcoming room made for long dinners"
          fill
          preload
          sizes="100vw"
        />
        <span>Every evening starts with a warm welcome.</span>
      </div>
      <div className="about-editorial">
        <span className="eyebrow">OUR STORY</span>
        <div>
          <h2>
            We believe the best part
            <br />
            of dinner is who you share it with.
          </h2>
          <p>
            ARDO began with a simple idea: take the food we grew up with and give it a table of its
            own. Somewhere comfortable enough for a Tuesday, and special enough for an anniversary.
          </p>
          <p>
            Our kitchen is led by fictional chef Neel Mukherjee. He brings a love of Bengali
            markets, a well-travelled notebook, and a healthy respect for the tandoor. Local
            vegetables, patiently cooked sauces, and dishes that leave you reaching across the
            table.
          </p>
          <p>
            No dress code. No complicated rules. Just thoughtful food, a good drink, and people who
            are glad you came.
          </p>
          <Link href="/restaurant/reserve" className="text-link">
            Come make yourself at home <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div className="values-grid">
        {[
          [
            "01",
            "A little fire",
            "Our tandoor and grill do the talking. Char, warmth, and the kind of flavour you can’t rush.",
          ],
          [
            "02",
            "Closer to home",
            "Ingredients chosen with the seasons. Indian produce, familiar flavours, fresh thinking.",
          ],
          [
            "03",
            "Room for everyone",
            "Solo lunches, lively birthdays, unhurried dates. There’s a table for your kind of evening.",
          ],
        ].map(([n, title, copy]) => (
          <article key={n}>
            <span className="eyebrow">{n}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
      <p className="demo-disclosure">
        ARDO, its team, and its story are fictional. This is an interactive restaurant technology
        demonstration.
      </p>
    </div>
  );
}
