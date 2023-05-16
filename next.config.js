/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	images: {
		path: "/",
		domains: ["placehold.co"],
	},
};

module.exports = nextConfig;
