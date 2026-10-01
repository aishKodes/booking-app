# ARDO ecosystem extension · QA

Verified on 2 October 2026 using the Codex in-app browser against localhost. Existing website and admin components were preserved; public pages were moved under `/restaurant` and their links updated. A backup of the earlier implementation was saved before restructuring.

## Cross-product scenario

- Launcher exposes three distinct products and navigates to each correctly.
- App created **ARD-69170**: Ishita Banerjee, Friday 9 October, 8 PM, four guests, Window, Anniversary, and a service request.
- Confirmation rendered as a mobile booking pass. The booking appeared in Upcoming and remained after reload.
- Admin displayed the same booking with **Mobile App** source. Assigned Table 8, checked in, and seated the guest.
- App reflected **Seated**, **Table 8**, and a guest notification that the table was ready.
- Preserved website created **ARD-42250**, two guests at 8:30 PM. Admin showed **Website** source; app displayed the same booking.
- Edited that website booking through the app to 10 October at 9 PM. The reference and Website source were retained. Cancellation through the app appeared in admin.
- Created app booking **ARD-64253** using Home quick booking. Saved profile and Window preference prefilled correctly. App cancellation appeared in admin with Mobile App source.
- With app and admin open in separate tabs, app cancellation updated the open admin drawer without refreshing. Restoring it in admin updated the open app screen without refreshing.
- Final browser demo retains the first seated mobile booking, a cancelled website booking, and the restored second mobile booking. Existing seed records and settings were retained; no global reset was performed.

## Mobile interactions

- Calendar opens as a bottom sheet, disables past dates, and supports month navigation. A date outside the initial seven days becomes visibly selected in the date strip.
- Unavailable 7:30 PM slot is disabled. Service switching requires a valid new selection.
- Missing contact details and missing time selection produce useful errors. Booking errors remain in the persistent action area above bottom navigation.
- Three booking steps, previous-step controls, confirmation, modification, cancellation confirmation, and booking history segments work.
- Dish detail sheet includes image, price, dietary tags, allergens, and a reservation link.
- Menu search, empty search results, category chips, and dietary filters work.
- Saved garden plate and Vegetarian/Window preferences survived reload. Saved chef’s table appears in Profile experiences.
- Profile editing and sheet dismissal work. Escape closes a native dialog sheet.
- Guest notifications reflect reservation updates and show a weekend brunch item.
- Notification muting survived a reload; restored updates afterwards. A private dining enquiry for 12 October reached admin notifications with the supplied guest and occasion details.
- Calendar utility initiated an invitation download. Native sharing/clipboard availability depends on the browser.
- At a reduced 390×550 viewport, the profile sheet and Save action remained within the viewport. Physical device keyboard and installation were not tested.

## Responsive matrix

All five app tabs were checked at **375, 390, 430, 1024, and 1440px**. See `responsive-app-matrix.json` for 25 recorded measurements.

- Mobile: app width equals viewport, frame removed, bottom navigation at viewport bottom.
- Desktop: app frame remains 420px wide; screen content scrolls inside it.
- Document width equals viewport at all five sizes; no page horizontal overflow.
- Persistent booking action area reduces the content scroller without covering it.
- No failed loaded images were found in the matrix.
- Launcher checked on a small phone and desktop; website and admin navigation checked after restructuring.

## Artifacts

- `mobile-app-home-390.jpg`
- `mobile-app-confirmation-390.jpg`
- `mobile-app-calendar-375.jpg`
- `mobile-app-explore-430.jpg`
- `mobile-app-desktop-1024.jpg`
- `mobile-app-desktop-1440.jpg`
- `demo-launcher-desktop-1440.jpg`
- `app-cancellation-in-admin.jpg`
- `responsive-app-matrix.json`

## Production verification

- `npm run format:check` — passed.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — passed; 24 static pages generated, dynamic routes compiled.
- Started the production server on `http://127.0.0.1:3000`.
- All 20 primary launcher, restaurant, admin, and app routes loaded with their expected headings, no page overflow, and no failed loaded images. Measurements: `production-route-checks.json`.
- All six legacy public routes and an existing reservation detail URL redirected correctly, including query parameters and the booking ID. Measurements: `redirect-checks.json`.
- Verified generated standalone manifest, `/app` start URL, mobile metadata, `viewport-fit=cover`, and 192px/512px/maskable PNG dimensions.
- Final production browser console contained no errors or warnings.
- Adjusted featured dish image sizing to request an appropriate resolution for full-width mobile cards; verified the browser selected the 640px image variant.

The production launcher is left open as the demo entry point. Existing website/admin QA evidence remains in the original `QA.md` and screenshots.
