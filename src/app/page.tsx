"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useModelHistory } from "@/hooks/use-model-history";
import type { AppPhase, TrainingExample, TrainingPreset } from "@/types";

import { DEMO_TRAINING_DATA } from "@/lib/demo-data";
import { IntroContainer } from "@/components/intro";
import { SavedModelsContainer } from "@/components/saved-models";
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
	const [isDemo, setIsDemo] = useState(false);

	const { hasModels, isLoading, save } = useModelHistory();

	// Determine initial phase based on saved models (only on mount)
	useEffect(() => {
		if (isLoading || phase !== null) return;
		setPhase(hasModels ? "saved-models" : "intro");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading]);

	const handleIntroComplete = useCallback(() => {
		setPhase("training");
	}, []);

	const handleIntroSkip = useCallback(() => {
		setPhase("training");
	}, []);

	const handleDemo = useCallback(() => {
		setTrainingState({ data: DEMO_TRAINING_DATA, preset: "balanced" });
		setLoadedModelJson(null);
		setIsModelSaved(false);
		setIsDemo(true);
		setPhase("results");
	}, []);

	const handleTrainingComplete = useCallback(
		(data: TrainingExample[], preset: TrainingPreset) => {
			setTrainingState({ data, preset });
			setLoadedModelJson(null);
			setIsModelSaved(false);
			setIsDemo(false);
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
			setIsModelSaved(false); // Don't show "saved" message - it's already saved
			setPhase("results");
		},
		[]
	);

	const handleStartNew = useCallback(() => {
		setPhase("intro");
	}, []);

	const handleViewSavedModels = useCallback(() => {
		setPhase("saved-models");
	}, []);

	// Loading state
	if (phase === null) {
		return (
			<div className="flex min-h-full items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			</div>
		);
	}

	// Render based on current phase
	switch (phase) {
		case "saved-models":
			return (
				<SavedModelsContainer
					onLoadModel={handleLoadModel}
					onStartNew={handleStartNew}
				/>
			);

		case "intro":
			return (
				<IntroContainer
					onComplete={handleIntroComplete}
					onSkip={handleIntroSkip}
					onDemo={handleDemo}
				/>
			);

		case "training":
			return (
				<TrainingContainer
					onComplete={handleTrainingComplete}
					onBack={handleBackToIntro}
					onViewSaved={hasModels ? handleViewSavedModels : undefined}
				/>
			);

		case "results":
			if (!trainingState) {
				return (
					<IntroContainer
						onComplete={handleIntroComplete}
						onSkip={handleIntroSkip}
						onDemo={handleDemo}
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
					onViewSaved={hasModels ? handleViewSavedModels : undefined}
					isDemo={isDemo}
				/>
			);

		default:
			return (
				<IntroContainer
					onComplete={handleIntroComplete}
					onSkip={handleIntroSkip}
					onDemo={handleDemo}
				/>
			);
	}
}
