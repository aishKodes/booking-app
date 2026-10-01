import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/mobile/shell";
import "./mobile.css";
export const metadata: Metadata = {
  title: "Guest app",
  description: "Your next good evening, in your pocket. The ARDO mobile guest experience.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "ARDO" },
  icons: { apple: "/app-icon-192.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf8f3",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
