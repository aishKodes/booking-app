import { GuestBook } from "@/components/admin/guests";
export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ guest?: string }>;
}) {
  const { guest } = await searchParams;
  return <GuestBook key={guest || "guests"} initialGuest={guest} />;
}
