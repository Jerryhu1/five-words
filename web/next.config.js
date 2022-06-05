module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NODE_ENV === "production" ?
                    "https://five-words-server.herokuapp.com/:path*"
                    : 'http://localhost:8080/:path*' // Proxy to Backend
            },
            {
                source: '/ws/:path*',
                destination: process.env.NODE_ENV === "production" ?
                    "wss://five-words-server.herokuapp.com/:path*"
                    : 'ws://localhost:8080/:path*' // Proxy to Backend
            }
        ]
    }
}