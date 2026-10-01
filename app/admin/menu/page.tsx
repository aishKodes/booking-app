import { AdminMenu } from "@/components/admin/menu";
export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item } = await searchParams;
  return <AdminMenu key={item || "menu"} initialItem={item} />;
}
