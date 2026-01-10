"use client";

import { useCallback, useState } from "react";
import type { AppPhase } from "@/types";

import { IntroContainer } from "@/components/intro";

/**
 * Placeholder for training phase
 */
function TrainingPlaceholder({ onComplete }: { onComplete: () => void }) {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-4">
			<p className="text-muted-foreground">
				Training phase coming soon...
			</p>
			<button
				onClick={onComplete}
				className="text-sm underline hover:no-underline"
			>
				Skip to results
			</button>
		</div>
	);
}

/**
 * Placeholder for results phase
 */
function ResultsPlaceholder({ onReset }: { onReset: () => void }) {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-4">
			<p className="text-muted-foreground">
				Results phase coming soon...
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

export default function HomePage() {
	const [phase, setPhase] = useState<AppPhase>("intro");

	const handleIntroComplete = useCallback(() => {
		setPhase("training");
	}, []);

	const handleIntroSkip = useCallback(() => {
		setPhase("training");
	}, []);

	const handleTrainingComplete = useCallback(() => {
		setPhase("results");
	}, []);

	const handleReset = useCallback(() => {
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
			return <TrainingPlaceholder onComplete={handleTrainingComplete} />;

		case "results":
			return <ResultsPlaceholder onReset={handleReset} />;

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
