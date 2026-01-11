"use client";

import { useCallback } from "react";
// Import directly to avoid barrel export pulling in brain.js
import { useModelHistory } from "@/hooks/use-model-history";
import type { SavedModel, TrainingExample, TrainingPreset } from "@/types";

import { Button } from "@/components/ui/button";

import { ModelCard } from "./model-card";

interface ResumeContainerProps {
	onLoadModel: (
		modelJson: string,
		trainingData: TrainingExample[],
		preset: TrainingPreset
	) => void;
	onStartNew: () => void;
}

/**
 * Resume phase - shows saved models and allows loading or starting fresh
 */
export function ResumeContainer({
	onLoadModel,
	onStartNew,
}: ResumeContainerProps) {
	const { models, remove, isLoading } = useModelHistory();

	const handleLoad = useCallback(
		(model: SavedModel) => {
			onLoadModel(model.modelJson, model.trainingData, model.preset);
		},
		[onLoadModel]
	);

	const handleDelete = useCallback(
		(id: string) => {
			remove(id);
		},
		[remove]
	);

	if (isLoading) {
		return (
			<div className="flex min-h-full items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			</div>
		);
	}

	return (
		<div className="flex min-h-full flex-col">
			{/* Header */}
			<div className="border-b">
				<div className="container py-6">
					<h1 className="text-2xl font-semibold">Welcome Back</h1>
					<p className="mt-1 text-muted-foreground">
						Load a saved model or start fresh
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="container flex-1 py-8">
				{models.length > 0 ? (
					<div className="mx-auto max-w-2xl space-y-6">
						<div className="grid gap-4 sm:grid-cols-2">
							{models.map((model) => (
								<ModelCard
									key={model.id}
									model={model}
									onLoad={handleLoad}
									onDelete={handleDelete}
								/>
							))}
						</div>

						<div className="flex justify-center pt-4">
							<Button variant="outline" onClick={onStartNew}>
								Train New Model
							</Button>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-4 py-12">
						<p className="text-muted-foreground">
							No saved models found
						</p>
						<Button onClick={onStartNew}>Get Started</Button>
					</div>
				)}
			</div>
		</div>
	);
}
