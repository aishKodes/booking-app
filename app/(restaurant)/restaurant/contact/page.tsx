import type { Metadata } from "next";
import { VenueDetails } from "@/components/restaurant/venue";
export const metadata: Metadata = { title: "Find us" };
export default function ContactPage() {
  return (
    <div className="container public-page">
      <div className="page-intro">
        <span className="eyebrow">COME ON OVER</span>
        <h1>
          Good evenings
          <br />
          <em>start right here.</em>
        </h1>
        <p>In the middle of the city. A little away from the rush.</p>
      </div>
      <VenueDetails />
      <p className="demo-disclosure">
        The restaurant address and contact details are fictional. Directions open the real Park
        Street neighbourhood.
      </p>
    </div>
  );
}
