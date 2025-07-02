/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "magentodev.winkpayments.io", // for Magento product images
      "via.placeholder.com",        // fallback placeholder image
    ],
  },
};

module.exports = nextConfig;

