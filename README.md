# ARDO · A connected restaurant demo

A frontend-only sales demo for a fictional contemporary Indian restaurant in Kolkata. Three distinct experiences share the same reservations, tables, guests, menu, and settings: the restaurant website, a native-style mobile guest app, and the operations dashboard.

## Run

Requires Node.js 20.9 or later.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000) for the product launcher. Choose **Restaurant Website** (`/restaurant`), **Management Dashboard** (`/admin`), or **Mobile Booking App** (`/app`). No account or password is required.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Stack & structure

[Next.js App Router](https://nextjs.org/docs/app), React, TypeScript, Tailwind CSS, Motion, Lucide, Recharts, and date-fns. Photographs and fonts are served locally; building needs no external asset requests.

- `app/page.tsx`, `app/launcher.css` — the presentation launcher with previews of all three products.
- `app/(restaurant)/restaurant` — the preserved restaurant pages, menu, booking, confirmations, and saved reservations.
- `app/app`, `components/mobile` — guest app Home, Explore, Reserve, Bookings, and Profile; app-specific cards, booking pass, calendar, notifications, and bottom sheets.
- `app/admin` — overview, reservation book/timeline, floor, guest book, menu, analytics, and settings.
- `components/restaurant`, `components/booking`, `components/admin` — the existing website and complete operations interfaces.
- `lib/store.tsx` — shared browser store using `useSyncExternalStore`, stable hydration, and cross-tab synchronization.
- `lib/demo-data.ts` — central restaurant identity and deterministic seed data.
- `lib/types.ts`, `lib/utils.ts`, `lib/analytics.ts`, `lib/mobile.ts` — entities, booking/calendar utilities, data-derived charts, and guest-facing notifications and experiences.

Old public URLs (`/menu`, `/reserve`, `/reservations`, `/about`, `/contact`, `/private-dining`) redirect to their `/restaurant` counterparts, preserving path suffixes and query parameters.

## Mobile guest app

The app uses its own native-style presentation and components. Desktop displays a centered 420px app frame; screens up to 600px fill `100dvh` with no outer frame. The scrollable screen sits between a persistent header and bottom navigation. Booking controls stay above the navigation. Safe-area insets protect the top bar, bottom navigation, and mobile sheets.

Reservations use three short steps: table preferences, guest details, and review. The calendar, dish details, dietary filters, preferences, and notifications open as accessible native dialog sheets. Guest contact details prefill subsequent bookings. Dishes and experiences can be saved locally; dietary preferences inform Home recommendations.

The app includes a web manifest, standalone display configuration, ordinary and maskable icons, Apple web-app metadata, and a theme color. Installation depends on the browser/platform. No service worker or offline booking capability is included.

## Persistence

The first browser visit seeds `localStorage` under `ardo-demo-v1`. Mutations persist immediately and synchronize across tabs on the same origin. Website and app Bookings display the same customer-created reservations; admin sees the entire reservation book. New app bookings carry the **Mobile App** source; website bookings retain **Website**, including when edited through the app. Guest profiles match by email, and completed reservations determine visit counts and cover totals.

Saved data from the previous implementation is migrated by adding `guestApp` defaults. Existing reservations, guests, menu edits, table state, and settings are retained. App profile, favourites, dining preferences, and read notification IDs are persisted in the same store.

No backend, authentication server, email, SMS, or payment integration is present. Storage belongs to the current browser and origin; another device or a different port has separate data. If storage is unavailable, the app reports that changes last only for the session. All people, reviews, contacts, and restaurant details are fictional. Map directions open the real Park Street neighbourhood, not an actual ARDO venue.

Booking slots are simulated deterministically. Date, party size, notice, and opening hours are validated. Table assignment checks capacity, turnover state, and overlapping reservations. Seating requires an assigned, unoccupied table. Completing a visit places its table in turnover until it is marked ready. Analytics derive from the reservation dataset; expected spend is explicitly a forecast at ₹1,450 per cover.

To restore every dataset, open **Admin → Settings → Reset demo data** and confirm. Seed service dates are regenerated relative to the current day in `Asia/Kolkata`.

## Demo walkthrough

1. Open the launcher and choose **Mobile Booking App**. On desktop it opens in a subtle device frame.
2. Choose Reserve, four guests, a future Friday at 8 PM, and Window. Add fictional contact details, Anniversary, and a request.
3. Confirm, view the booking pass, open Bookings, and refresh. The booking remains.
4. Return to the launcher, choose Admin, and find the guest in Reservations. The source is **Mobile App**.
5. Assign a suitable ready table, check in, and seat the guests. Return to the app: the booking shows its status and assigned table. Separate tabs update live.
6. Choose Restaurant Website from the launcher. Create a booking in its preserved reservation flow and find the **Website** booking in admin and the app.
7. Modify or cancel an active booking in the app. Its reference is retained and admin updates immediately.
8. Save a dish and an experience; adjust dining preferences in Profile. Refresh to demonstrate persistence.
9. Complete a visit in admin. Guest book reflects the visit and Floor plan shows the table needing reset.
10. Use Admin → Settings → Reset demo data when preparing a fresh presentation. This also resets the guest app profile and favourites.

Browser QA notes and screenshots are in `artifacts/QA-ecosystem.md`; `artifacts/QA.md` records the original website/admin verification.

## Deploy to Vercel

Import this directory as a Next.js project. Use `npm run build`; no backend configuration is needed. Vercel's preview URL is used for social metadata automatically. Optionally set `NEXT_PUBLIC_SITE_URL` to your final public origin for canonical Open Graph image URLs. Browser data is separate for each deployment origin.

## Assets

Photography: [Unsplash](https://unsplash.com/license), downloaded and optimized in `public/images`. DM Sans and Cormorant Garamond: Google Fonts, bundled locally under the SIL Open Font License; see `public/fonts/*-LICENSE.txt`.
