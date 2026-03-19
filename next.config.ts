import type { NextConfig } from "next";

import withPlaiceholder from "@plaiceholder/next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	images: {
		minimumCacheTTL: 2678400,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "nativity-of-theotokos.s3.us-east-2.amazonaws.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "holytrinityorthodox.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "www.holytrinityorthodox.com",
				pathname: "/**",
			},
		],
	},
	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["@svgr/webpack"],
				as: "*.js",
			},
		},
	},
	webpack(config) {
		// Grab the existing rule that handles SVG imports
		const fileLoaderRule = config.module.rules.find(
			(rule: { test: { test: (arg0: string) => unknown } }) =>
				rule.test?.test?.(".svg"),
		);

		// Modify the file loader rule to ignore *.svg, since we have it handled now.
		fileLoaderRule.exclude = /\.svg$/i;

		config.module.rules.push(
			// Reapply the existing rule, but only for svg imports ending in ?url
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: {
					not: [...fileLoaderRule.resourceQuery.not, /url/],
				}, // exclude if *.svg?url
				use: ["@svgr/webpack"],
			},
		);

		return config;
	},
	cacheComponents: true,
	experimental: {
		authInterrupts: true,
		viewTransition: true,
	},
	allowedDevOrigins: ["192.168.100.7"],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withPlaiceholder(nextConfig));
