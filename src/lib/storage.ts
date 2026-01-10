import type { SavedModel } from "@/types";

const STORAGE_KEY = "text-contrast-ml-models";
const MAX_MODELS = 5;

/**
 * Generate a unique ID for a saved model
 */
function generateId(): string {
	return `model-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generate a default name for a saved model
 */
function generateName(index: number): string {
	return `Model ${index}`;
}

/**
 * Get all saved models from localStorage
 */
export function getSavedModels(): SavedModel[] {
	if (typeof window === "undefined") return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const models = JSON.parse(stored) as SavedModel[];
		// Sort by timestamp, newest first
		return models.sort((a, b) => b.timestamp - a.timestamp);
	} catch {
		return [];
	}
}

/**
 * Save a model to localStorage
 * If at max capacity, removes the oldest model
 */
export function saveModel(
	modelJson: string,
	trainingData: SavedModel["trainingData"],
	preset: SavedModel["preset"],
	name?: string
): SavedModel {
	const models = getSavedModels();

	// Generate name based on existing count
	const modelNumber = models.length + 1;
	const modelName = name || generateName(modelNumber);

	const newModel: SavedModel = {
		id: generateId(),
		name: modelName,
		timestamp: Date.now(),
		preset,
		exampleCount: trainingData.length,
		modelJson,
		trainingData,
	};

	// Add new model to the beginning
	models.unshift(newModel);

	// Keep only the most recent MAX_MODELS
	const trimmedModels = models.slice(0, MAX_MODELS);

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedModels));
	} catch {
		// Storage might be full, try removing oldest and retry
		const reducedModels = trimmedModels.slice(0, MAX_MODELS - 1);
		reducedModels.unshift(newModel);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedModels));
	}

	return newModel;
}

/**
 * Delete a saved model by ID
 */
export function deleteModel(id: string): void {
	const models = getSavedModels();
	const filtered = models.filter((m) => m.id !== id);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Get a single saved model by ID
 */
export function getModelById(id: string): SavedModel | null {
	const models = getSavedModels();
	return models.find((m) => m.id === id) ?? null;
}

/**
 * Update a model's name
 */
export function renameModel(id: string, name: string): void {
	const models = getSavedModels();
	const model = models.find((m) => m.id === id);
	if (model) {
		model.name = name;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
	}
}

/**
 * Check if there are any saved models
 */
export function hasSavedModels(): boolean {
	return getSavedModels().length > 0;
}

/**
 * Clear all saved models
 */
export function clearAllModels(): void {
	localStorage.removeItem(STORAGE_KEY);
}
