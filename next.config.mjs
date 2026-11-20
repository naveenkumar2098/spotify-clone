/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "htjpuviiqjyqaljyjzse.supabase.co",
                port: "", // Leave empty unless a specific port is required
                pathname: "/storage/v1/object/public/**",
            },
        ],
    }
};

export default nextConfig;
