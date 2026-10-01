import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  devIndicators: false,
  async redirects() {
    return ["menu", "reserve", "reservations", "about", "contact", "private-dining"].map(
      (route) => ({
        source: `/${route}/:path*`,
        destination: `/restaurant/${route}/:path*`,
        permanent: false,
      }),
    );
  },
};
export default nextConfig;
