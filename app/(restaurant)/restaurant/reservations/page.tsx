import type { Metadata } from "next";
import { MyReservations } from "@/components/booking/my-reservations";
export const metadata: Metadata = {
  title: "My reservations",
  robots: { index: false, follow: false },
};
export default function ReservationsPage() {
  return (
    <div className="container public-page">
      <div className="page-intro">
        <span className="eyebrow">YOUR PLANS, ALL IN ONE PLACE</span>
        <h1>
          A few good evenings
          <br />
          <em>to look forward to.</em>
        </h1>
        <p>View your table, make a little change, or find your next one.</p>
      </div>
      <MyReservations />
    </div>
  );
}
