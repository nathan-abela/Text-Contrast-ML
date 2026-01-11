"use client";

import { useCallback, useEffect, useState } from "react";
import { useNeuralNetwork } from "@/hooks";
import {
	TRAINING_PRESETS,
	type TrainingExample,
	type TrainingPreset,
} from "@/types";

import { hexToNormalizedRgb } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/color-picker";

interface ResultsContainerProps {
	trainingData: TrainingExample[];
	preset: TrainingPreset;
	onReset: () => void;
	onRetrain: () => void;
	onSave?: (modelJson: string) => void;
	isSaved?: boolean;
	loadedModelJson?: string | null;
	onViewSaved?: () => void;
}

/**
 * Results phase container
 * Trains the neural network and allows testing colors
 */
export function ResultsContainer({
	trainingData,
	preset,
	onReset,
	onRetrain,
	onSave,
	isSaved = false,
	loadedModelJson,
	onViewSaved,
}: ResultsContainerProps) {
	const {
		isTraining,
		isTrained,
		error,
		train,
		predict,
		exportModel,
		importModel,
	} = useNeuralNetwork();

	// Test color state (placeholder - will be replaced with color picker)
	const [testColor, setTestColor] = useState("#3498db");
	const [prediction, setPrediction] = useState<{
		result: "dark" | "light";
		confidence: number;
	} | null>(null);

	// Train network on mount or load saved model
	useEffect(() => {
		if (loadedModelJson) {
			// Load pre-trained model
			try {
				const modelData = JSON.parse(loadedModelJson);
				importModel(modelData);
			} catch {
				// Fall back to training if import fails
				train(trainingData, preset);
			}
		} else {
			// Train new model
			train(trainingData, preset);
		}
	}, [train, trainingData, preset, loadedModelJson, importModel]);

	// Update prediction when color or network changes
	useEffect(() => {
		if (!isTrained) {
			setPrediction(null);
			return;
		}

		const rgb = hexToNormalizedRgb(testColor);
		if (!rgb) {
			setPrediction(null);
			return;
		}

		const result = predict(rgb);
		if (result) {
			setPrediction({
				result: result.prediction,
				confidence: result.confidence,
			});
		}
	}, [testColor, isTrained, predict]);

	// Handle color picker change
	const handleColorChange = useCallback((hex: string) => {
		setTestColor(hex);
	}, []);

	// Handle save model
	const handleSave = useCallback(() => {
		if (!onSave || !isTrained) return;
		const modelJson = exportModel();
		if (modelJson) {
			onSave(JSON.stringify(modelJson));
		}
	}, [onSave, isTrained, exportModel]);

	// Determine text color based on prediction
	const textColor = prediction?.result === "dark" ? "#ffffff" : "#000000";

	// Loading state
	if (isTraining) {
		return (
			<div className="flex min-h-full flex-col items-center justify-center gap-4 p-4">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
				<p className="text-muted-foreground">
					Training with {trainingData.length} examples...
				</p>
				<p className="text-xs text-muted-foreground">
					{TRAINING_PRESETS[preset].label} mode (
					{TRAINING_PRESETS[preset].iterations} iterations)
				</p>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex min-h-full flex-col items-center justify-center gap-4 p-4">
				<p className="text-destructive">Training failed: {error}</p>
				<Button onClick={onRetrain}>Try Again</Button>
			</div>
		);
	}

	return (
		<div className="flex min-h-full flex-col">
			{/* Header */}
			<div className="border-b">
				<div className="container flex items-center justify-between py-4">
					<div>
						<h1 className="font-semibold">Model Trained</h1>
						<p className="text-sm text-muted-foreground">
							{trainingData.length} examples ·{" "}
							{TRAINING_PRESETS[preset].label} mode
						</p>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="flex flex-1 flex-col items-center justify-center gap-8 p-4">
				{/* Preview box */}
				<div
					className="flex h-48 w-full max-w-md items-center justify-center rounded-xl border-2 text-2xl font-semibold transition-colors"
					style={{
						backgroundColor: testColor,
						color: textColor,
						borderColor: prediction ? "transparent" : undefined,
					}}
				>
					{prediction ? (
						<div className="text-center">
							<div>Sample Text</div>
							<div className="mt-2 text-sm font-normal opacity-80">
								The quick brown fox jumps over the lazy dog
							</div>
						</div>
					) : (
						<span className="text-muted-foreground">
							Pick a color below
						</span>
					)}
				</div>

				{/* Confidence display */}
				{prediction && (
					<div className="text-center">
						<p className="text-lg">
							{prediction.result === "dark" ? "White" : "Black"}{" "}
							text recommended
						</p>
						<p className="text-sm text-muted-foreground">
							{prediction.confidence}% confident
						</p>
					</div>
				)}

				{/* Custom color picker */}
				<div className="flex flex-col items-center gap-4">
					<label className="text-sm text-muted-foreground">
						Test a background color
					</label>
					<ColorPicker
						value={testColor}
						onChange={handleColorChange}
					/>
				</div>
			</div>

			{/* Save confirmation */}
			{isSaved && (
				<div className="border-t bg-muted/50 px-4 py-2 text-center text-sm text-muted-foreground">
					Model saved to browser storage. You can access it from{" "}
					{onViewSaved ? (
						<button
							onClick={onViewSaved}
							className="underline hover:text-foreground"
						>
							Saved Models
						</button>
					) : (
						"Saved Models"
					)}{" "}
					on your next visit.
				</div>
			)}

			{/* Footer */}
			<div className="border-t bg-background/80 backdrop-blur-sm">
				<div className="container flex items-center justify-between py-4">
					<div className="flex items-center gap-2">
						<Button variant="ghost" onClick={onReset}>
							Start Over
						</Button>
						{onViewSaved && (
							<Button variant="ghost" onClick={onViewSaved}>
								Saved Models
							</Button>
						)}
					</div>
					<div className="flex gap-2">
						{onSave && !loadedModelJson && (
							<Button
								variant="outline"
								onClick={handleSave}
								disabled={isSaved || !isTrained}
							>
								{isSaved ? "Saved" : "Save Model"}
							</Button>
						)}
						<Button variant="outline" onClick={onRetrain}>
							{loadedModelJson ? "Train New" : "Train Again"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
