"use client";

import { useCallback, useEffect, useState } from "react";
import type { SavedModel, TrainingExample, TrainingPreset } from "@/types";

import {
	deleteModel,
	getSavedModels,
	hasSavedModels,
	renameModel,
	saveModel,
} from "@/lib/storage";

interface UseModelHistoryReturn {
	models: SavedModel[];
	hasModels: boolean;
	isLoading: boolean;
	save: (
		modelJson: string,
		trainingData: TrainingExample[],
		preset: TrainingPreset,
		name?: string
	) => SavedModel;
	remove: (id: string) => void;
	rename: (id: string, name: string) => void;
	refresh: () => void;
}

/**
 * Hook for managing saved model history
 */
export function useModelHistory(): UseModelHistoryReturn {
	const [models, setModels] = useState<SavedModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Load models on mount
	useEffect(() => {
		setModels(getSavedModels());
		setIsLoading(false);
	}, []);

	const refresh = useCallback(() => {
		setModels(getSavedModels());
	}, []);

	const save = useCallback(
		(
			modelJson: string,
			trainingData: TrainingExample[],
			preset: TrainingPreset,
			name?: string
		) => {
			const saved = saveModel(modelJson, trainingData, preset, name);
			refresh();
			return saved;
		},
		[refresh]
	);

	const remove = useCallback(
		(id: string) => {
			deleteModel(id);
			refresh();
		},
		[refresh]
	);

	const rename = useCallback(
		(id: string, name: string) => {
			renameModel(id, name);
			refresh();
		},
		[refresh]
	);

	return {
		models,
		hasModels: models.length > 0,
		isLoading,
		save,
		remove,
		rename,
		refresh,
	};
}

/**
 * Check if saved models exist (for initial phase determination)
 */
export function checkForSavedModels(): boolean {
	if (typeof window === "undefined") return false;
	return hasSavedModels();
}
