"use client";

import { useCallback } from "react";

import { cn } from "@/lib/utils";

import { useDrag } from "./use-drag";

interface HueSliderProps {
	hue: number;
	onChange: (hue: number) => void;
	className?: string;
}

/**
 * Horizontal hue slider (0-360 degrees)
 */
export function HueSlider({ hue, onChange, className }: HueSliderProps) {
	const handleDrag = useCallback(
		(x: number) => {
			const newHue = Math.round(x * 360);
			onChange(newHue);
		},
		[onChange]
	);

	const { containerRef, handleMouseDown, handleTouchStart } = useDrag({
		onDrag: handleDrag,
	});

	// Calculate cursor position
	const cursorX = (hue / 360) * 100;

	return (
		<div
			ref={containerRef}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			className={cn(
				"relative h-4 w-full cursor-pointer overflow-hidden rounded-full",
				className
			)}
			style={{
				background: `linear-gradient(to right,
					hsl(0, 100%, 50%),
					hsl(60, 100%, 50%),
					hsl(120, 100%, 50%),
					hsl(180, 100%, 50%),
					hsl(240, 100%, 50%),
					hsl(300, 100%, 50%),
					hsl(360, 100%, 50%)
				)`,
			}}
		>
			{/* Cursor indicator */}
			<div
				className="pointer-events-none absolute top-1/2 h-5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
				style={{
					left: `${cursorX}%`,
					backgroundColor: `hsl(${hue}, 100%, 50%)`,
				}}
			/>
		</div>
	);
}
