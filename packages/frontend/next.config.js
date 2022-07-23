/* eslint-env node */
// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  images: {
    domains: ['localhost', 'ipfs.io', 'gateway.ipfs.io', 'cdn-icons-png.flaticon.com'],
    dangerouslyAllowSVG: true,
  },
}

module.exports = nextConfig
