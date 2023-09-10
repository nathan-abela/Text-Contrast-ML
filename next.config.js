/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
	basePath: isProd ? "/Text-Contrast-ML" : "",
	assetPrefix: isProd ? "/Text-Contrast-ML" : "",
	output: "export",
};

module.exports = nextConfig;
