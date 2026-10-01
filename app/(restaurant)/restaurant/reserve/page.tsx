import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/booking-flow";
import { LoadingState } from "@/components/ui";
export const metadata: Metadata = { title: "Reserve a table" };
export default function ReservePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BookingFlow />
    </Suspense>
  );
}
