// Origins allowed to embed /map in an <iframe>, e.g. "https://partner-site.org https://another.org".
// Defaults to "*" (any origin) — tighten via this env var for production.
const MAP_EMBED_ALLOWED_ANCESTORS = process.env.MAP_EMBED_ALLOWED_ANCESTORS || "*"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Allow the map route to be embedded via <iframe>.
        source: "/map",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${MAP_EMBED_ALLOWED_ANCESTORS};`,
          },
        ],
      },
      {
        // Everything else stays un-embeddable by default (clickjacking protection).
        source: "/((?!map).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none';" },
        ],
      },
    ]
  },
}

export default nextConfig
