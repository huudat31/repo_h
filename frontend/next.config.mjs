/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/portal',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/portal/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
