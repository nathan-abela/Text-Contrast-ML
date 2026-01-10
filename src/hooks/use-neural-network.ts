"use client";

import { useCallback, useRef, useState } from "react";
import {
	TRAINING_PRESETS,
	type PredictionOutput,
	type TrainingExample,
	type TrainingPreset,
} from "@/types";
import { NeuralNetwork } from "brain.js";

interface UseNeuralNetworkReturn {
	/** Whether the network is currently training */
	isTraining: boolean;
	/** Whether the network has been trained */
	isTrained: boolean;
	/** Training error (if any) */
	error: string | null;
	/** Train the network with examples */
	train: (data: TrainingExample[], preset: TrainingPreset) => Promise<void>;
	/** Make a prediction for a color */
	predict: (rgb: {
		r: number;
		g: number;
		b: number;
	}) => PredictionResult | null;
	/** Reset the network */
	reset: () => void;
	/** Export the trained network as JSON */
	exportModel: () => object | null;
	/** Import a previously trained network */
	importModel: (json: object) => boolean;
}

interface PredictionResult {
	/** Predicted text color: "dark" means use white text, "light" means use black text */
	prediction: "dark" | "light";
	/** Confidence percentage (0-100) */
	confidence: number;
	/** Raw output values from the network */
	raw: PredictionOutput;
}

// Use a simple type for Brain.js to avoid strict type checking issues
type BrainNetwork = NeuralNetwork<
	Record<string, number>,
	Record<string, number>
>;

/**
 * Hook for managing the Brain.js neural network
 * Handles training, prediction, and model import/export
 */
export function useNeuralNetwork(): UseNeuralNetworkReturn {
	const networkRef = useRef<BrainNetwork | null>(null);

	const [isTraining, setIsTraining] = useState(false);
	const [isTrained, setIsTrained] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const train = useCallback(
		async (
			data: TrainingExample[],
			preset: TrainingPreset
		): Promise<void> => {
			if (data.length === 0) {
				setError("No training data provided");
				return;
			}

			setIsTraining(true);
			setError(null);

			try {
				// Create new network
				const network = new NeuralNetwork() as BrainNetwork;
				const iterations = TRAINING_PRESETS[preset].iterations;

				// Train in a microtask to not block UI
				await new Promise<void>((resolve, reject) => {
					// Use setTimeout to allow UI to update
					setTimeout(() => {
						try {
							network.train(data, {
								iterations,
								errorThresh: 0.005,
								log: false,
							});
							networkRef.current = network;
							setIsTrained(true);
							resolve();
						} catch (err) {
							reject(err);
						}
					}, 10);
				});
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Training failed";
				setError(message);
				setIsTrained(false);
			} finally {
				setIsTraining(false);
			}
		},
		[]
	);

	const predict = useCallback(
		(rgb: { r: number; g: number; b: number }): PredictionResult | null => {
			if (!networkRef.current || !isTrained) {
				return null;
			}

			try {
				const output = networkRef.current.run(rgb) as Record<
					string,
					number
				>;

				// Determine prediction and confidence
				const darkScore = output.dark ?? 0;
				const lightScore = output.light ?? 0;

				const prediction: "dark" | "light" =
					darkScore > lightScore ? "dark" : "light";
				const confidence = Math.round(
					Math.max(darkScore, lightScore) * 100
				);

				return {
					prediction,
					confidence,
					raw: { dark: darkScore, light: lightScore },
				};
			} catch {
				return null;
			}
		},
		[isTrained]
	);

	const reset = useCallback(() => {
		networkRef.current = null;
		setIsTrained(false);
		setError(null);
	}, []);

	const exportModel = useCallback((): object | null => {
		if (!networkRef.current || !isTrained) {
			return null;
		}
		return networkRef.current.toJSON();
	}, [isTrained]);

	const importModel = useCallback((json: object): boolean => {
		try {
			const network = new NeuralNetwork() as BrainNetwork;
			network.fromJSON(json as ReturnType<typeof network.toJSON>);
			networkRef.current = network;
			setIsTrained(true);
			setError(null);
			return true;
		} catch {
			setError("Failed to import model");
			return false;
		}
	}, []);

	return {
		isTraining,
		isTrained,
		error,
		train,
		predict,
		reset,
		exportModel,
		importModel,
	};
}
