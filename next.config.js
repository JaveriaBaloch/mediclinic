const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mediclinic123.s3.us-east-1.amazonaws.com',
            },
        ],
    },
};

module.exports = nextConfig;