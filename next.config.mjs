/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "shop.medicalpantry.org",
        port: "",
        pathname: "/cdn/shop/files/**",
      },
    ],
  },
};

export default nextConfig;
