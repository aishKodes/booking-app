import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/ui";
import "./globals.css";
const sans = localFont({
  src: [
    { path: "../public/fonts/sans-0.ttf", weight: "400" },
    { path: "../public/fonts/sans-1.ttf", weight: "500" },
    { path: "../public/fonts/sans-2.ttf", weight: "600" },
    { path: "../public/fonts/sans-3.ttf", weight: "700" },
  ],
  variable: "--font-sans",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "../public/fonts/serif-2.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/serif-3.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/serif-4.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/serif-0.ttf", weight: "400", style: "italic" },
    { path: "../public/fonts/serif-1.ttf", weight: "500", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  ),
  title: { default: "ARDO — Contemporary Indian, Kolkata", template: "%s · ARDO" },
  description:
    "Wood fire. Seasonal produce. Good company. Discover ARDO, a fictional contemporary Indian restaurant in Kolkata, and reserve your table.",
  openGraph: {
    title: "ARDO — A little fire. A lot of feeling.",
    description:
      "Contemporary Indian dining in the heart of Kolkata. A fictional restaurant technology demo.",
    images: [{ url: "/images/dining.jpg", width: 1800, height: 1200 }],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
