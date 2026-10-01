/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Dev server blocks cross-origin requests to internal dev resources
  // (e.g. /_next/hmr) by default. Without this, loading the site from a
  // LAN IP (phone testing, nginx proxy on 9006) breaks hydration entirely --
  // client components never activate, so anything that depends on JS
  // (Framer Motion animations, filter clicks) stays stuck at its initial
  // state while server-rendered markup (header/footer) still shows.
  allowedDevOrigins: ['172.29.7.22', '172.29.7.101'],
};

export default nextConfig;
