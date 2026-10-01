import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Layers3,
  MapPin,
  Monitor,
  Smartphone,
} from "lucide-react";
import "./launcher.css";
export const metadata: Metadata = {
  title: { absolute: "ARDO — One restaurant. Every touchpoint." },
  description:
    "Explore the connected ARDO restaurant website, management dashboard, and mobile guest application.",
};
export default function Page() {
  return (
    <div className="demo-launcher">
      <header className="dl-header">
        <Link href="/" className="dl-brand">
          ARDO<span>THE CONNECTED RESTAURANT</span>
        </Link>
        <div>
          <i />
          Interactive product demo<span>01 / THREE EXPERIENCES</span>
        </div>
      </header>
      <main className="dl-main">
        <div className="dl-intro">
          <div>
            <span className="dl-eyebrow">A LITTLE FIRE. A LOT OF POSSIBILITY.</span>
            <h1>
              One restaurant.
              <br />
              Every <em>touchpoint.</em>
            </h1>
          </div>
          <div className="dl-intro-aside">
            <p>
              A table for your guests.
              <br />A clear view for your team.
              <br />
              One connected experience.
            </p>
            <span>
              <Layers3 size={15} />
              Designed to work together
            </span>
          </div>
        </div>
        <div className="dl-products">
          <Link href="/restaurant" className="dl-product">
            <div className="dl-product-label">
              <span>01 — CUSTOMER WEB</span>
              <Monitor size={18} />
            </div>
            <div className="dl-preview dl-web-preview">
              <div className="dl-browser">
                <div>
                  <i />
                  <i />
                  <i />
                  <span>ardo.demo / restaurant</span>
                </div>
                <Image
                  src="/previews/website.jpg"
                  alt="Preview of the existing ARDO restaurant website"
                  width={1440}
                  height={1000}
                  sizes="(max-width:700px) 90vw, 440px"
                  preload
                />
              </div>
              <span className="dl-preview-note">A warm welcome, before the first visit.</span>
            </div>
            <div className="dl-product-copy">
              <h2>Restaurant Website</h2>
              <p>Discovery, the seasonal menu, and an effortless table reservation.</p>
              <span className="dl-product-cta">
                Open Booking Website
                <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
          <Link href="/admin" className="dl-product">
            <div className="dl-product-label">
              <span>02 — OPERATIONS</span>
              <Layers3 size={18} />
            </div>
            <div className="dl-preview dl-admin-preview">
              <div className="dl-browser">
                <div>
                  <i />
                  <i />
                  <i />
                  <span>ardo.demo / admin</span>
                </div>
                <Image
                  src="/previews/admin.jpg"
                  alt="Preview of the existing ARDO management dashboard"
                  width={1440}
                  height={1000}
                  sizes="(max-width:700px) 90vw, 440px"
                />
              </div>
              <span className="dl-preview-note">The details behind a very good service.</span>
            </div>
            <div className="dl-product-copy">
              <h2>Management Dashboard</h2>
              <p>Reservations, tables, guests, menus, and the patterns that help you plan.</p>
              <span className="dl-product-cta">
                Open Admin Panel
                <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
          <Link href="/app" className="dl-product dl-mobile-product">
            <div className="dl-product-label">
              <span>03 — MOBILE</span>
              <Smartphone size={18} />
            </div>
            <div className="dl-preview dl-app-preview">
              <div className="dl-mini-phone" aria-hidden="true">
                <div className="dl-mini-brand">
                  <span>a.</span>
                  <div>
                    ARDO<small>Park Street, Kolkata</small>
                  </div>
                  <span>◌</span>
                </div>
                <div className="dl-mini-greeting">
                  Hello.
                  <br />
                  Let’s make an evening.
                </div>
                <div className="dl-mini-quick">
                  <strong>Your next table</strong>
                  <span>
                    Tomorrow <i /> 2 guests <i /> 8:00 PM
                  </span>
                  <div>
                    Find a table <ChevronRight size={9} />
                  </div>
                </div>
                <div className="dl-mini-title">
                  Popular at ARDO <span>See all</span>
                </div>
                <div className="dl-mini-dishes">
                  <div>
                    <Image src="/images/chicken.jpg" alt="" width={98} height={62} />
                    <strong>Smoked butter chicken</strong>
                    <span>₹780</span>
                  </div>
                  <div>
                    <Image src="/images/garden.jpg" alt="" width={98} height={62} />
                    <strong>The garden plate</strong>
                    <span>₹480</span>
                  </div>
                </div>
                <div className="dl-mini-nav">
                  <span>
                    ⌂<small>Home</small>
                  </span>
                  <span>
                    ◉<small>Explore</small>
                  </span>
                  <span>
                    ＋<small>Reserve</small>
                  </span>
                  <span>
                    ▤<small>Bookings</small>
                  </span>
                  <span>
                    ◌<small>Profile</small>
                  </span>
                </div>
              </div>
              <span className="dl-app-tag">
                <Check size={11} />
                Made for a few good taps
              </span>
            </div>
            <div className="dl-product-copy">
              <h2>Mobile Booking App</h2>
              <p>A table in your pocket. Discover, reserve, and keep your next evening close.</p>
              <span className="dl-product-cta">
                Open Mobile App
                <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
        </div>
        <div className="dl-connected">
          <div>
            <span className="dl-connection-dot" />
            <strong>Three interfaces. The same evening.</strong>
            <p>Book on the website or app. Welcome your guests from the dashboard.</p>
          </div>
          <span>
            <MapPin size={14} />
            ARDO · Park Street, Kolkata
          </span>
        </div>
      </main>
      <footer className="dl-footer">
        <span>ARDO / RESTAURANT EXPERIENCE SUITE</span>
        <span>Fictional restaurant · Fully interactive frontend demo</span>
      </footer>
    </div>
  );
}
