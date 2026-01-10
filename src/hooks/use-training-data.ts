"use client";

import { useCallback, useMemo, useState } from "react";
import type { TrainingExample } from "@/types";

import { generateTrainingColors, hexToNormalizedRgb } from "@/lib/colors";

const DEFAULT_COLOR_COUNT = 20;
const MIN_RECOMMENDED_EXAMPLES = 5;

interface UseTrainingDataOptions {
	colorCount?: number;
}

interface UseTrainingDataReturn {
	/** Array of hex colors for training */
	colors: string[];
	/** Current color index */
	currentIndex: number;
	/** Current color being displayed */
	currentColor: string;
	/** Collected training examples */
	trainingData: TrainingExample[];
	/** Number of examples collected */
	exampleCount: number;
	/** Whether we have enough examples for reliable training */
	hasEnoughExamples: boolean;
	/** Whether all colors have been used */
	isComplete: boolean;
	/** Progress percentage (0-100) */
	progress: number;
	/** Add a training example (user selected dark/white text) */
	addExample: (choice: "dark" | "light") => void;
	/** Skip to next color without adding example */
	skip: () => void;
	/** Reset training data and generate new colors */
	reset: () => void;
}

/**
 * Hook for managing training data collection
 */
export function useTrainingData(
	options: UseTrainingDataOptions = {}
): UseTrainingDataReturn {
	const { colorCount = DEFAULT_COLOR_COUNT } = options;

	// Generate colors once on mount
	const [colors, setColors] = useState<string[]>(() =>
		generateTrainingColors(colorCount)
	);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [trainingData, setTrainingData] = useState<TrainingExample[]>([]);

	const currentColor = colors[currentIndex] ?? colors[0];
	const exampleCount = trainingData.length;
	const hasEnoughExamples = exampleCount >= MIN_RECOMMENDED_EXAMPLES;
	const isComplete = currentIndex >= colors.length;
	const progress = Math.min(
		100,
		Math.round((currentIndex / colors.length) * 100)
	);

	const addExample = useCallback(
		(choice: "dark" | "light") => {
			const rgb = hexToNormalizedRgb(currentColor);
			if (!rgb) return;

			const example: TrainingExample = {
				input: rgb,
				output: choice === "dark" ? { dark: 1 } : { light: 1 },
			};

			setTrainingData((prev) => [...prev, example]);
			setCurrentIndex((prev) => prev + 1);
		},
		[currentColor]
	);

	const skip = useCallback(() => {
		setCurrentIndex((prev) => prev + 1);
	}, []);

	const reset = useCallback(() => {
		setColors(generateTrainingColors(colorCount));
		setCurrentIndex(0);
		setTrainingData([]);
	}, [colorCount]);

	return useMemo(
		() => ({
			colors,
			currentIndex,
			currentColor,
			trainingData,
			exampleCount,
			hasEnoughExamples,
			isComplete,
			progress,
			addExample,
			skip,
			reset,
		}),
		[
			colors,
			currentIndex,
			currentColor,
			trainingData,
			exampleCount,
			hasEnoughExamples,
			isComplete,
			progress,
			addExample,
			skip,
			reset,
		]
	);
}
