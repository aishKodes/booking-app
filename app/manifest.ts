import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ARDO · Your table, your evening",
    short_name: "ARDO",
    description: "Discover the menu, reserve a table, and make an evening of it.",
    start_url: "/app",
    scope: "/app",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#be3442",
    icons: [
      { src: "/app-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/app-icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
