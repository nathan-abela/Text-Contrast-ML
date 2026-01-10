"use client";

import { useCallback, useState } from "react";
import type { AppPhase, TrainingExample, TrainingPreset } from "@/types";

import { IntroContainer } from "@/components/intro";
import { TrainingContainer } from "@/components/training";

/**
 * Placeholder for results phase (to be implemented in next batch)
 */
function ResultsPlaceholder({
	onReset,
	exampleCount,
}: {
	onReset: () => void;
	exampleCount: number;
}) {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-4">
			<p className="text-muted-foreground">
				Results phase coming soon...
			</p>
			<p className="text-sm text-muted-foreground">
				Trained with {exampleCount} examples
			</p>
			<button
				onClick={onReset}
				className="text-sm underline hover:no-underline"
			>
				Start over
			</button>
		</div>
	);
}

/**
 * Training data state to pass between phases
 */
interface TrainingState {
	data: TrainingExample[];
	preset: TrainingPreset;
}

export default function HomePage() {
	const [phase, setPhase] = useState<AppPhase>("intro");
	const [trainingState, setTrainingState] = useState<TrainingState | null>(
		null
	);

	const handleIntroComplete = useCallback(() => {
		setPhase("training");
	}, []);

	const handleIntroSkip = useCallback(() => {
		setPhase("training");
	}, []);

	const handleTrainingComplete = useCallback(
		(data: TrainingExample[], preset: TrainingPreset) => {
			setTrainingState({ data, preset });
			setPhase("results");
		},
		[]
	);

	const handleBackToIntro = useCallback(() => {
		setPhase("intro");
	}, []);

	const handleReset = useCallback(() => {
		setTrainingState(null);
		setPhase("intro");
	}, []);

	// Render based on current phase
	switch (phase) {
		case "intro":
			return (
				<IntroContainer
					onComplete={handleIntroComplete}
					onSkip={handleIntroSkip}
				/>
			);

		case "training":
			return (
				<TrainingContainer
					onComplete={handleTrainingComplete}
					onBack={handleBackToIntro}
				/>
			);

		case "results":
			return (
				<ResultsPlaceholder
					onReset={handleReset}
					exampleCount={trainingState?.data.length ?? 0}
				/>
			);

		// Resume phase will be implemented with persistence
		case "resume":
		default:
			return (
				<IntroContainer
					onComplete={handleIntroComplete}
					onSkip={handleIntroSkip}
				/>
			);
	}
}
