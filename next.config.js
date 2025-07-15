/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Configurar porta personalizada
  env: {
    PORT: '3001',
  },
};

module.exports = nextConfig; 