"use client";

import { useCallback, useEffect, useState } from "react";
import { useTrainingData } from "@/hooks/use-training-data";
import {
	TRAINING_PRESETS,
	type TrainingExample,
	type TrainingPreset,
} from "@/types";

import { Button } from "@/components/ui/button";

import { TrainingCard } from "./training-card";

interface TrainingContainerProps {
	onComplete: (data: TrainingExample[], preset: TrainingPreset) => void;
	onBack: () => void;
	onViewSaved?: () => void;
}

/**
 * Container for the training phase
 * Manages color presentation and data collection
 */
export function TrainingContainer({
	onComplete,
	onBack,
	onViewSaved,
}: TrainingContainerProps) {
	const [selectedPreset, setSelectedPreset] =
		useState<TrainingPreset>("balanced");
	const [showWarning, setShowWarning] = useState(false);

	const {
		currentColor,
		currentIndex,
		colors,
		trainingData,
		exampleCount,
		hasEnoughExamples,
		isComplete,
		progress,
		addExample,
		reset,
	} = useTrainingData();

	// Handle selecting dark (white text)
	const handleSelectDark = useCallback(() => {
		addExample("dark");
	}, [addExample]);

	// Handle selecting light (black text)
	const handleSelectLight = useCallback(() => {
		addExample("light");
	}, [addExample]);

	// Handle finishing training
	const handleFinish = useCallback(() => {
		if (!hasEnoughExamples) {
			setShowWarning(true);
			return;
		}
		onComplete(trainingData, selectedPreset);
	}, [hasEnoughExamples, onComplete, trainingData, selectedPreset]);

	// Confirm finish with warning
	const handleConfirmFinish = useCallback(() => {
		onComplete(trainingData, selectedPreset);
	}, [onComplete, trainingData, selectedPreset]);

	// Auto-complete when all colors used
	useEffect(() => {
		if (isComplete && exampleCount > 0) {
			onComplete(trainingData, selectedPreset);
		}
	}, [isComplete, exampleCount, onComplete, trainingData, selectedPreset]);

	// Don't render if complete (will transition to results)
	if (isComplete) {
		return null;
	}

	return (
		<div className="flex min-h-full flex-col">
			{/* Header with progress */}
			<div className="border-b">
				<div className="container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">
							Example {currentIndex + 1} of {colors.length}
						</p>
						{/* Progress bar */}
						<div
							role="progressbar"
							aria-valuenow={progress}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-label="Training progress"
							className="h-1.5 w-32 overflow-hidden rounded-full bg-muted"
						>
							<div
								className="h-full bg-foreground transition-all duration-300"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>

					{/* Training preset selector */}
					<div className="flex items-center gap-2">
						<span className="text-xs text-muted-foreground">
							Training:
						</span>
						<div
							role="radiogroup"
							aria-label="Training intensity"
							className="flex gap-1"
						>
							{(
								Object.keys(
									TRAINING_PRESETS
								) as TrainingPreset[]
							).map((preset) => (
								<button
									key={preset}
									type="button"
									role="radio"
									aria-checked={selectedPreset === preset}
									onClick={() => setSelectedPreset(preset)}
									className={`rounded-md px-2 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
										selectedPreset === preset
											? "bg-foreground text-background"
											: "bg-muted hover:bg-muted/80"
									}`}
								>
									{TRAINING_PRESETS[preset].label}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Main training area */}
			<div className="flex flex-1 flex-col items-center justify-center p-4">
				<div className="w-full max-w-2xl space-y-6">
					{/* Instruction */}
					<p className="text-center text-muted-foreground">
						Click the box where the text is easier to read
					</p>

					{/* Training cards */}
					<div className="flex flex-col gap-4 sm:flex-row">
						<TrainingCard
							backgroundColor={currentColor}
							textColor="black"
							onClick={handleSelectLight}
						/>
						<TrainingCard
							backgroundColor={currentColor}
							textColor="white"
							onClick={handleSelectDark}
						/>
					</div>

					{/* Current color indicator */}
					<p className="text-center text-xs text-muted-foreground">
						Background: {currentColor}
					</p>
				</div>
			</div>

			{/* Warning modal */}
			{showWarning && (
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="warning-title"
					className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
				>
					<div className="mx-4 max-w-sm rounded-lg border bg-background p-6 shadow-lg">
						<h3 id="warning-title" className="font-semibold">
							Low training data
						</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							You&apos;ve only provided {exampleCount} example
							{exampleCount !== 1 ? "s" : ""}. For better
							predictions, we recommend at least 5 examples.
						</p>
						<div className="mt-4 flex gap-2">
							<Button
								variant="outline"
								onClick={() => setShowWarning(false)}
								className="flex-1"
							>
								Keep training
							</Button>
							<Button
								onClick={handleConfirmFinish}
								className="flex-1"
							>
								Continue anyway
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Footer with actions */}
			<div className="border-t bg-background/80 backdrop-blur-sm">
				<div className="container flex items-center justify-between py-4">
					<div className="flex items-center gap-2">
						<Button variant="ghost" onClick={onBack}>
							Back
						</Button>
						{onViewSaved && (
							<Button variant="ghost" onClick={onViewSaved}>
								Saved Models
							</Button>
						)}
					</div>

					<div className="flex items-center gap-4">
						<span className="hidden text-sm text-muted-foreground sm:inline">
							{exampleCount} example
							{exampleCount !== 1 ? "s" : ""} collected
						</span>
						{exampleCount > 0 && (
							<Button onClick={handleFinish}>
								Finish Training
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
