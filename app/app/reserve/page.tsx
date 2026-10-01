import { AppReserve } from "@/components/mobile/reserve";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const params = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
  );
  return <AppReserve key={JSON.stringify(params)} params={params} />;
}
