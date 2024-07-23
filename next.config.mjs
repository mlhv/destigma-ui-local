/** @type {import('next').NextConfig} */

const nextConfig = {
    /*async rewrites() { // Proxy for hono backend and node frontend api requests
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3003/api/v1/:path*'
            }
        ]
    }, */
};

export default nextConfig
