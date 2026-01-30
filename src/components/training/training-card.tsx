"use client";

import { cn } from "@/lib/utils";

interface TrainingCardProps {
	backgroundColor: string;
	textColor: "black" | "white";
	onClick: () => void;
	className?: string;
}

/**
 * Individual training card showing text on a background color
 * User clicks the card with more readable text
 */
export function TrainingCard({
	backgroundColor,
	textColor,
	onClick,
	className,
}: TrainingCardProps) {
	const textColorValue = textColor === "black" ? "#000000" : "#ffffff";

	return (
		<div className="flex flex-1 flex-col gap-2">
			<button
				type="button"
				onClick={onClick}
				aria-label={`Select ${textColor} text as more readable on this background`}
				className={cn(
					"group relative flex min-h-[140px] cursor-pointer items-center justify-center rounded-xl border-2 border-transparent p-6 text-lg font-medium transition-all lg:min-h-[200px]",
					"hover:border-foreground/30 hover:shadow-lg",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					"active:scale-[0.98]",
					className
				)}
				style={{
					backgroundColor,
					color: textColorValue,
				}}
			>
				<span className="select-none" aria-hidden="true">
					Which text is easier to read?
				</span>
			</button>
			<span
				className="text-center text-xs text-muted-foreground"
				aria-hidden="true"
			>
				{textColor === "black" ? "Black text" : "White text"}
			</span>
		</div>
	);
}
