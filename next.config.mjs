/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
        domains: ['sscar.to'], // Add all domains from where you load images
      },
       webpack(config) {
        config.module.rules.push({
          test: /\.worker\.ts$/,
          use: { loader: 'worker-loader' },
        })
    return config
  },
    };
export default nextConfig;

// module.exports = nextConfig;
// module.exports = nextConfig
