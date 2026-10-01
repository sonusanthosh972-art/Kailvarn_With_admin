/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `next build` also emits .next/standalone: a self-contained server.js with
  // only the node_modules it needs, for uploading to a Node.js host (see
  // tools/package-deploy.sh). Has no effect on `next dev`.
  output: 'standalone',
  experimental: {
    // proxy.js matches /api/admin/*, and Next buffers request bodies passing
    // through the proxy only up to 10MB by default -- larger walkthrough
    // videos arrived truncated and request.formData() threw. Must stay above
    // MAX_VIDEO_BYTES (120MB) in app/api/admin/designs/[id]/video/route.js
    // plus multipart overhead.
    proxyClientMaxBodySize: '130mb',
  },
  // app/api/redesign-room reads public/redesign-styles/* via a computed
  // process.cwd() path, which makes the tracer copy the whole project into
  // the standalone bundle (dev HTTPS keys, photos, old copies...). It only
  // needs public/, which the deploy package ships anyway — keep the rest out.
  outputFileTracingExcludes: {
    '*': [
      './certificates/**',
      './deploy/**',
      './.static-build/**',
      './kailvarn-site/**',
      './new/**',
      './out/**',
      './docs/**',
      './tools/**',
      './.agents/**',
      './src/**',
      './app/**',
      './*.jpeg',
      './*.md',
      './.env*',
    ],
  },
  // Dev server blocks cross-origin requests to internal dev resources
  // (e.g. /_next/hmr) by default. Without this, loading the site from a
  // LAN IP (phone testing, nginx proxy on 9006) breaks hydration entirely --
  // client components never activate, so anything that depends on JS
  // (Framer Motion animations, filter clicks) stays stuck at its initial
  // state while server-rendered markup (header/footer) still shows.
  allowedDevOrigins: ['172.29.7.22', '172.29.7.101'],
};

export default nextConfig;
