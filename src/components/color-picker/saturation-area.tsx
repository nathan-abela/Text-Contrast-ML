"use client";

import { useCallback } from "react";

import { cn } from "@/lib/utils";

import { useDrag } from "./use-drag";

interface SaturationAreaProps {
	hue: number;
	saturation: number;
	lightness: number;
	onChange: (saturation: number, lightness: number) => void;
	className?: string;
}

/**
 * Saturation/Brightness picker area
 * X-axis: Saturation (0-100)
 * Y-axis: Brightness/Value (100-0, inverted so bright is at top)
 */
export function SaturationArea({
	hue,
	saturation,
	lightness,
	onChange,
	className,
}: SaturationAreaProps) {
	// Convert HSL lightness to HSV value for positioning
	// This is an approximation for the visual picker
	const handleDrag = useCallback(
		(x: number, y: number) => {
			const newSaturation = Math.round(x * 100);
			// Invert Y so top is bright (high lightness)
			const newLightness = Math.round((1 - y) * 100);
			onChange(newSaturation, newLightness);
		},
		[onChange]
	);

	const { containerRef, handleMouseDown, handleTouchStart } = useDrag({
		onDrag: handleDrag,
	});

	// Calculate cursor position
	const cursorX = saturation;
	const cursorY = 100 - lightness;

	return (
		<div
			ref={containerRef}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			className={cn(
				"relative h-48 w-full cursor-crosshair overflow-hidden rounded-lg",
				className
			)}
			style={{
				background: `
					linear-gradient(to top, #000, transparent),
					linear-gradient(to right, #fff, transparent),
					hsl(${hue}, 100%, 50%)
				`,
			}}
		>
			{/* Cursor indicator */}
			<div
				className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
				style={{
					left: `${cursorX}%`,
					top: `${cursorY}%`,
				}}
			/>
		</div>
	);
}
