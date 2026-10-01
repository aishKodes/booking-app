import Image from "next/image";
import type { Metadata } from "next";
import { PrivateInquiry } from "@/components/restaurant/private-inquiry";
export const metadata: Metadata = { title: "Private dining" };
export default function PrivateDining() {
  return (
    <div className="container public-page">
      <div className="page-intro">
        <span className="eyebrow">SOME MOMENTS NEED THEIR OWN ROOM</span>
        <h1>
          Your people.
          <br />
          <em>Your evening.</em>
        </h1>
        <p>
          A birthday. A milestone. The whole team, finally together.
          <br />
          We’ll make room for the occasion.
        </p>
      </div>
      <div className="private-grid">
        <div>
          <div className="private-image">
            <Image
              src="/images/interior.jpg"
              alt="An intimate dining room for a private event"
              fill
              preload
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className="private-facts">
            <div>
              <strong>8–30</strong>
              <span>of your favourite people</span>
            </div>
            <div>
              <strong>Your menu</strong>
              <span>thoughtfully put together</span>
            </div>
            <div>
              <strong>Every detail</strong>
              <span>taken care of</span>
            </div>
          </div>
        </div>
        <PrivateInquiry />
      </div>
    </div>
  );
}
