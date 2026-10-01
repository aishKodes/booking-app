import { AppBookingDetail } from "@/components/mobile/bookings";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const [{ id }, p] = await Promise.all([params, searchParams]);
  return <AppBookingDetail id={id} confirmed={p.confirmed === "1"} />;
}
