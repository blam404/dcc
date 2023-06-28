const path = require("path");
const { withPayload } = require("@payloadcms/next-payload");

/** @type {import("next").NextConfig} */

const nextConfig = withPayload(
	{
		experimental: {
			serverActions: true,
		},
		images: {
			domains: ["placehold.co"],
		},
	},
	{
		configPath: path.resolve(__dirname, "./payload/payload.config.ts"),
		payloadPath: path.resolve(process.cwd(), "./payload/payloadClient.ts"),
	}
);

module.exports = nextConfig;
