import type { TrainingExample } from "@/types";

/**
 * Demo training data with well-chosen contrast examples
 * Based on relative luminance for optimal readability
 * Input values are normalized RGB (0-1 range)
 */
export const DEMO_TRAINING_DATA: TrainingExample[] = [
	// Dark backgrounds → use white text (dark: 1)
	{ input: { r: 0, g: 0, b: 0 }, output: { dark: 1 } }, // Black
	{ input: { r: 0.1, g: 0.1, b: 0.1 }, output: { dark: 1 } }, // Near black
	{ input: { r: 0.15, g: 0.15, b: 0.2 }, output: { dark: 1 } }, // Dark slate
	{ input: { r: 0.2, g: 0.1, b: 0.1 }, output: { dark: 1 } }, // Dark red
	{ input: { r: 0.1, g: 0.2, b: 0.1 }, output: { dark: 1 } }, // Dark green
	{ input: { r: 0.1, g: 0.1, b: 0.3 }, output: { dark: 1 } }, // Dark blue
	{ input: { r: 0.3, g: 0.1, b: 0.3 }, output: { dark: 1 } }, // Dark purple
	{ input: { r: 0.2, g: 0.2, b: 0.2 }, output: { dark: 1 } }, // Dark gray

	// Light backgrounds → use black text (light: 1)
	{ input: { r: 1, g: 1, b: 1 }, output: { light: 1 } }, // White
	{ input: { r: 0.95, g: 0.95, b: 0.95 }, output: { light: 1 } }, // Near white
	{ input: { r: 0.9, g: 0.9, b: 0.85 }, output: { light: 1 } }, // Cream
	{ input: { r: 1, g: 0.95, b: 0.8 }, output: { light: 1 } }, // Light yellow
	{ input: { r: 0.8, g: 0.9, b: 1 }, output: { light: 1 } }, // Light blue
	{ input: { r: 0.9, g: 1, b: 0.9 }, output: { light: 1 } }, // Light green
	{ input: { r: 1, g: 0.85, b: 0.85 }, output: { light: 1 } }, // Light pink
	{ input: { r: 0.85, g: 0.85, b: 0.9 }, output: { light: 1 } }, // Light lavender

	// Mid-tones - carefully chosen based on luminance
	{ input: { r: 0.5, g: 0.5, b: 0.5 }, output: { dark: 1 } }, // Medium gray
	{ input: { r: 0.6, g: 0.6, b: 0.6 }, output: { light: 1 } }, // Lighter gray
	{ input: { r: 0.9, g: 0.4, b: 0.4 }, output: { light: 1 } }, // Coral/salmon
	{ input: { r: 0.2, g: 0.5, b: 0.8 }, output: { dark: 1 } }, // Blue
	{ input: { r: 0.4, g: 0.7, b: 0.4 }, output: { light: 1 } }, // Green
	{ input: { r: 1, g: 0.8, b: 0 }, output: { light: 1 } }, // Yellow/gold
	{ input: { r: 1, g: 0.5, b: 0 }, output: { light: 1 } }, // Orange
	{ input: { r: 0.5, g: 0.2, b: 0.5 }, output: { dark: 1 } }, // Purple

	// Common UI colors
	{ input: { r: 0.2, g: 0.6, b: 0.86 }, output: { dark: 1 } }, // Dodger blue
	{ input: { r: 0.18, g: 0.8, b: 0.44 }, output: { light: 1 } }, // Emerald
	{ input: { r: 0.91, g: 0.3, b: 0.24 }, output: { dark: 1 } }, // Red
	{ input: { r: 0.95, g: 0.77, b: 0.06 }, output: { light: 1 } }, // Amber
	{ input: { r: 0.61, g: 0.35, b: 0.71 }, output: { dark: 1 } }, // Amethyst
	{ input: { r: 0.1, g: 0.74, b: 0.61 }, output: { light: 1 } }, // Turquoise
];
