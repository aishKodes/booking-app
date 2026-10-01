import { AdminReservations } from "@/components/admin/reservations";
export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const { booking } = await searchParams;
  return <AdminReservations key={booking || "book"} initialBooking={booking} />;
}
