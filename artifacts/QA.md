# ARDO validation

Verified in the Codex in-app browser on 1–2 October 2026.

## Customer → operations walkthrough

- Created a four-person Window reservation with Anniversary and a special request. Empty contact details produced validation feedback.
- Confirmed, refreshed, and found the saved booking in My Reservations. Modified its time while preserving its reference.
- Found that same booking in admin, assigned T8, checked in, and seated the party. Attempting to seat without a table produced clear feedback.
- Floor reflected the occupied table. Completing the booking added one visit and four covers to the guest profile and put T8 in turnover. Marking it ready restored availability.
- Saved guest notes and VIP status, then verified persistence after refresh.
- Created and cancelled a second booking on mobile. Cancellation remained in history after refresh and matched the existing guest by email.

## Other interactions

- Menu price and availability changes persisted and appeared on the public menu. Availability synchronized to a second tab without refreshing.
- Booking grace-period settings appeared on the public booking pass.
- Calendar and CSV controls gave download feedback.
- Global search opened the matching guest profile. Notifications showed booking and service events.
- A fictional private dining enquiry, including its occasion notes, appeared in admin notifications.
- Mobile admin navigation, today filter, detail drawer, and check-in worked. Escape closed dialogs.
- Reset restored guests, reservations, menu prices and availability, tables, settings, and notifications, and cleared customer-created bookings. Final demo data is reset.

## Layout and production checks

48 layout checks covered `/`, `/menu`, `/reserve`, `/reservations`, `/admin`, `/admin/floor`, `/admin/analytics`, and `/admin/settings` at widths **375, 390, 768, 1024, 1440, and 1920 px**. No horizontal page overflow or broken images were reported. Public mobile booking and navigation, desktop floor, and dashboard were visually reviewed. About, Contact, and Private Dining also passed production page checks.

The final production browser session reported no console warnings or errors. TypeScript, ESLint, Prettier, and `npm run build` passed. Focused calculations checked first versus repeat visits, history outside the report period, cancellation rates, excluded cancelled covers, and seed values.

## Preview files

- `ardo-home-desktop.jpg`
- `ardo-admin-desktop.jpg`
- `ardo-floor-desktop.jpg`
- `ardo-booking-mobile.jpg`

This is a browser-local fictional demo. No live email, SMS, authentication, payment, or cross-device service was tested or implemented.
