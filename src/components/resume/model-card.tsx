"use client";

import { useCallback, useState } from "react";
import { TRAINING_PRESETS, type SavedModel } from "@/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ModelCardProps {
	model: SavedModel;
	onLoad: (model: SavedModel) => void;
	onDelete: (id: string) => void;
	className?: string;
}

/**
 * Card displaying a saved model with load/delete actions
 */
export function ModelCard({
	model,
	onLoad,
	onDelete,
	className,
}: ModelCardProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = useCallback(() => {
		if (isDeleting) {
			onDelete(model.id);
		} else {
			setIsDeleting(true);
			// Reset after 3 seconds if not confirmed
			setTimeout(() => setIsDeleting(false), 3000);
		}
	}, [isDeleting, model.id, onDelete]);

	const handleLoad = useCallback(() => {
		onLoad(model);
	}, [model, onLoad]);

	// Format date
	const formattedDate = new Date(model.timestamp).toLocaleDateString(
		undefined,
		{
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}
	);

	return (
		<div
			className={cn(
				"flex flex-col gap-3 rounded-lg border bg-card p-4",
				className
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<h3 className="truncate font-medium">{model.name}</h3>
					<p className="text-sm text-muted-foreground">
						{formattedDate}
					</p>
				</div>
				<button
					onClick={handleDelete}
					className={cn(
						"shrink-0 rounded px-2 py-1 text-xs transition-colors",
						isDeleting
							? "bg-destructive text-destructive-foreground"
							: "text-muted-foreground hover:text-foreground"
					)}
				>
					{isDeleting ? "Confirm" : "Delete"}
				</button>
			</div>

			<div className="flex items-center gap-4 text-sm text-muted-foreground">
				<span>{model.exampleCount} examples</span>
				<span>{TRAINING_PRESETS[model.preset].label}</span>
			</div>

			<Button onClick={handleLoad} className="w-full">
				Load Model
			</Button>
		</div>
	);
}
