/** @type {import('next').NextConfig} */

// Determines if the current environment is production
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
	/**
	 * Sets the base path for the application.
	 * For deploying to a subdirectory (ex. GitHub Pages).
	 * Uses '/Text-Contrast-ML' in production, empty otherwise.
	 */
	basePath: isProd ? "/Text-Contrast-ML" : "",
	/**
	 * Sets the asset prefix for the application.
	 * For serving assets from a different domain.
	 * Uses '/Text-Contrast-ML' in production, empty otherwise.
	 */
	assetPrefix: isProd ? "/Text-Contrast-ML" : "",
	output: "export",
};

module.exports = nextConfig;
