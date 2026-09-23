/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
      images: {
        domains: ['https://stellar-signs.com'], // Add all domains from where you load images
      },
       webpack(config) {
        config.module.rules.push({
          test: /\.worker\.ts$/,
          use: { loader: 'worker-loader' },
        })
    return config
  },
    };

module.exports = nextConfig;
// module.exports = nextConfig
