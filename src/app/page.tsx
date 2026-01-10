"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import type { AppPhase, TrainingExample, TrainingPreset } from "@/types";

import { IntroContainer } from "@/components/intro";
import { TrainingContainer } from "@/components/training";

// Dynamic import for ResultsContainer to avoid SSR with Brain.js
const ResultsContainer = dynamic(
	() => import("@/components/results").then((mod) => mod.ResultsContainer),
	{
		ssr: false,
		loading: () => (
			<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			</div>
		),
	}
);

/**
 * Training data state to pass between phases
 */
interface TrainingState {
	data: TrainingExample[];
	preset: TrainingPreset;
}

export default function HomePage() {
	const [phase, setPhase] = useState<AppPhase>("intro");
	const [trainingState, setTrainingState] = useState<TrainingState | null>(null); // prettier-ignore

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

	const handleRetrain = useCallback(() => {
		setPhase("training");
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
			if (!trainingState) {
				// Should not happen, but handle gracefully
				return (
					<IntroContainer
						onComplete={handleIntroComplete}
						onSkip={handleIntroSkip}
					/>
				);
			}
			return (
				<ResultsContainer
					trainingData={trainingState.data}
					preset={trainingState.preset}
					onReset={handleReset}
					onRetrain={handleRetrain}
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
