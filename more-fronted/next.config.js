/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Ignore Solana dependencies (we only need Aptos/Movement)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@solana-program/system': false,
      '@solana/web3.js': false,
      'bs58': false,
      'borsh': false,
    };

    // Externalize optional peer dependencies on server
    if (isServer) {
      config.externals = [
        ...config.externals,
        'encoding',
      ];
    }

    return config;
  },
}

module.exports = nextConfig

