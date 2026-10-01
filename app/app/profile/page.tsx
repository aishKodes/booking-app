import { AppProfile } from "@/components/mobile/profile";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const p = await searchParams;
  return <AppProfile key={p.section || "profile"} initialSection={p.section} />;
}
