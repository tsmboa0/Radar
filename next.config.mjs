/** @type {import('next').NextConfig} */
const nextConfig = {

    images : {
        remotePatterns: [
            {
                protocol:"https",
                hostname: "pbs.twimg.com"
            },
            {
                protocol:"https",
                hostname: "res.cloudinary.com"
            },
        ]
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
