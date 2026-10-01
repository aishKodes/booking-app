import { AppExplore } from "@/components/mobile/explore";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const p = await searchParams;
  return <AppExplore key={p.saved || "all"} favorites={p.saved === "1"} />;
}
