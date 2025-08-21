/** @type {import(\"next\").NextConfig} */
const nextConfig = {
  // Otimizações de performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },
  
  // Compressão
  compress: true,
  
  // Cache de assets estáticos
  generateEtags: false,
  
  // Otimização de imagens
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  
  // Headers de cache
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=30, stale-while-revalidate=60",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ]
  },
  
  // Otimização de bundle
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\\\/]node_modules[\\\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
