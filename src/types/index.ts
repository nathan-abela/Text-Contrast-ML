/**
 * Application phase/ step management
 */
export type AppPhase = "resume" | "intro" | "training" | "results";

/**
 * Training data structure for Brain.js
 */
export interface TrainingExample {
	input: { r: number; g: number; b: number };
	output: { dark: number } | { light: number };
}

/**
 * Neural network prediction output
 */
export interface PredictionOutput {
	dark: number;
	light: number;
}

/**
 * Training preset configuration
 */
export type TrainingPreset = "quick" | "balanced" | "thorough";

export const TRAINING_PRESETS: Record<
	TrainingPreset,
	{ iterations: number; label: string }
> = {
	quick: { iterations: 100, label: "Quick" },
	balanced: { iterations: 1000, label: "Balanced" },
	thorough: { iterations: 5000, label: "Thorough" },
};

/**
 * Saved model in localStorage
 */
export interface SavedModel {
	id: string;
	timestamp: number;
	exampleCount: number;
	weights: object;
	trainingData: TrainingExample[];
}

/**
 * RGB color representation
 */
export interface RGBColor {
	r: number;
	g: number;
	b: number;
}

/**
 * HSL color representation
 */
export interface HSLColor {
	h: number;
	s: number;
	l: number;
}

// Re-export nav types for convenience
export type { NavItem } from "./nav";
