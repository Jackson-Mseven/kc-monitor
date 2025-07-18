import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    // 让内置图片 loader 忽略 .svg
    const assetRule = config.module.rules.find((rule: any) => rule?.oneOf)
    assetRule.oneOf.forEach((r: any) => {
      if (
        Array.isArray(r?.test) ? r.test.some((t: any) => t?.test?.('.svg')) : r.test?.test?.('.svg')
      ) {
        r.exclude = /\.svg$/i
      }
    })

    // 再用 SVGR 处理 .svg
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
}

export default nextConfig
