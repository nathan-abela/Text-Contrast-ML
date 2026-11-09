import type { HSLColor, RGBColor } from "@/types";

/**
 * Generate a random hex color
 */
export function generateRandomHex(): string {
	const hex = Math.floor(Math.random() * 16777215).toString(16);
	return `#${hex.padStart(6, "0")}`;
}

/**
 * Generate an array of random colors for training
 * Always includes black and white as the first two colors
 */
export function generateTrainingColors(count: number = 20): string[] {
	const colors: string[] = ["#000000", "#ffffff"];

	while (colors.length < count) {
		const color = generateRandomHex();
		// Avoid duplicates
		if (!colors.includes(color)) {
			colors.push(color);
		}
	}

	return colors;
}

/**
 * Convert hex color to RGB object
 * Supports both shorthand (#RGB) and full (#RRGGBB) formats
 */
export function hexToRgb(hex: string): RGBColor | null {
	// Remove # if present
	const cleanHex = hex.replace(/^#/, "");

	// Handle shorthand format (#RGB)
	let fullHex = cleanHex;
	if (cleanHex.length === 3) {
		fullHex = cleanHex
			.split("")
			.map((char) => char + char)
			.join("");
	}

	// Validate hex format
	if (!/^[0-9A-Fa-f]{6}$/.test(fullHex)) {
		return null;
	}

	const r = parseInt(fullHex.slice(0, 2), 16);
	const g = parseInt(fullHex.slice(2, 4), 16);
	const b = parseInt(fullHex.slice(4, 6), 16);

	return { r, g, b };
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(rgb: RGBColor): string {
	const toHex = (n: number): string => {
		const clamped = Math.max(0, Math.min(255, Math.round(n)));
		return clamped.toString(16).padStart(2, "0");
	};

	return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert RGB to normalized RGB (0-1 range) for neural network input
 */
export function normalizeRgb(rgb: RGBColor): RGBColor {
	return {
		r: rgb.r / 255,
		g: rgb.g / 255,
		b: rgb.b / 255,
	};
}

/**
 * Convert hex to normalized RGB for neural network input
 */
export function hexToNormalizedRgb(hex: string): RGBColor | null {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;
	return normalizeRgb(rgb);
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGBColor): HSLColor {
	const r = rgb.r / 255;
	const g = rgb.g / 255;
	const b = rgb.b / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;

	let h = 0;
	let s = 0;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			case b:
				h = ((r - g) / d + 4) / 6;
				break;
		}
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSLColor): RGBColor {
	const h = hsl.h / 360;
	const s = hsl.s / 100;
	const l = hsl.l / 100;

	let r: number, g: number, b: number;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number): number => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255),
	};
}

/**
 * Convert hex to HSL
 */
export function hexToHsl(hex: string): HSLColor | null {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;
	return rgbToHsl(rgb);
}

/**
 * Convert HSL to hex
 */
export function hslToHex(hsl: HSLColor): string {
	return rgbToHex(hslToRgb(hsl));
}

/**
 * Check if a color is valid hex format
 */
export function isValidHex(hex: string): boolean {
	return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}
