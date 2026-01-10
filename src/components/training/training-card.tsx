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
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group relative flex min-h-[140px] flex-1 cursor-pointer items-center justify-center rounded-xl border-2 border-transparent p-6 text-lg font-medium transition-all",
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
			<span className="select-none">Which text is easier to read?</span>
			<span
				className={cn(
					"absolute bottom-3 left-1/2 -translate-x-1/2 text-xs opacity-60 transition-opacity",
					"group-hover:opacity-100"
				)}
			>
				{textColor === "black" ? "Black text" : "White text"}
			</span>
		</button>
	);
}
