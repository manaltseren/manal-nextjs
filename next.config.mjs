/** @type {import('next').NextConfig} */
const nextConfig = {
  // The About page is now the home page; keep old links working.
  async redirects() {
    return [{ source: "/about", destination: "/", permanent: true }];
  },
};

export default nextConfig;
