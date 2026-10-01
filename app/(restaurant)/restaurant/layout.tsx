import { RestaurantHeader, RestaurantFooter } from "@/components/restaurant/shell";
export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RestaurantHeader />
      <main id="main">{children}</main>
      <RestaurantFooter />
    </>
  );
}
