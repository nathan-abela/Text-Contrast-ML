"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
// Import directly to avoid barrel export pulling in brain.js
import { useModelHistory } from "@/hooks/use-model-history";
import type { AppPhase, TrainingExample, TrainingPreset } from "@/types";

import { IntroContainer } from "@/components/intro";
import { ResumeContainer } from "@/components/resume";
import { TrainingContainer } from "@/components/training";

// Dynamic import for ResultsContainer to avoid SSR with Brain.js
const ResultsContainer = dynamic(
	() => import("@/components/results").then((mod) => mod.ResultsContainer),
	{
		ssr: false,
		loading: () => (
			<div className="flex min-h-full items-center justify-center">
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
	const [phase, setPhase] = useState<AppPhase | null>(null);
	const [trainingState, setTrainingState] = useState<TrainingState | null>(
		null
	);
	const [isModelSaved, setIsModelSaved] = useState(false);
	const [loadedModelJson, setLoadedModelJson] = useState<string | null>(null);

	const { hasModels, isLoading, save } = useModelHistory();

	// Determine initial phase based on saved models
	useEffect(() => {
		if (isLoading) return;
		setPhase(hasModels ? "resume" : "intro");
	}, [isLoading, hasModels]);

	const handleIntroComplete = useCallback(() => {
		setPhase("training");
	}, []);

	const handleIntroSkip = useCallback(() => {
		setPhase("training");
	}, []);

	const handleTrainingComplete = useCallback(
		(data: TrainingExample[], preset: TrainingPreset) => {
			setTrainingState({ data, preset });
			setLoadedModelJson(null);
			setIsModelSaved(false);
			setPhase("results");
		},
		[]
	);

	const handleBackToIntro = useCallback(() => {
		setPhase("intro");
	}, []);

	const handleRetrain = useCallback(() => {
		setIsModelSaved(false);
		setLoadedModelJson(null);
		setPhase("training");
	}, []);

	const handleReset = useCallback(() => {
		setTrainingState(null);
		setIsModelSaved(false);
		setLoadedModelJson(null);
		setPhase("intro");
	}, []);

	const handleSaveModel = useCallback(
		(modelJson: string) => {
			if (!trainingState) return;
			save(modelJson, trainingState.data, trainingState.preset);
			setIsModelSaved(true);
		},
		[trainingState, save]
	);

	const handleLoadModel = useCallback(
		(
			modelJson: string,
			trainingData: TrainingExample[],
			preset: TrainingPreset
		) => {
			setTrainingState({ data: trainingData, preset });
			setLoadedModelJson(modelJson);
			setIsModelSaved(true);
			setPhase("results");
		},
		[]
	);

	const handleStartNew = useCallback(() => {
		setPhase("intro");
	}, []);

	// Loading state
	if (phase === null) {
		return (
			<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			</div>
		);
	}

	// Render based on current phase
	switch (phase) {
		case "resume":
			return (
				<ResumeContainer
					onLoadModel={handleLoadModel}
					onStartNew={handleStartNew}
				/>
			);

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
					onSave={handleSaveModel}
					isSaved={isModelSaved}
					loadedModelJson={loadedModelJson}
				/>
			);

		default:
			return (
				<IntroContainer
					onComplete={handleIntroComplete}
					onSkip={handleIntroSkip}
				/>
			);
	}
}
