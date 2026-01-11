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

const STEP = 2;
const LARGE_STEP = 10;

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
	const handleDrag = useCallback(
		(x: number, y: number) => {
			const newSaturation = Math.round(x * 100);
			const newLightness = Math.round((1 - y) * 100);
			onChange(newSaturation, newLightness);
		},
		[onChange]
	);

	const { containerRef, handleMouseDown, handleTouchStart } = useDrag({
		onDrag: handleDrag,
	});

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			const step = e.shiftKey ? LARGE_STEP : STEP;
			let newSaturation = saturation;
			let newLightness = lightness;

			switch (e.key) {
				case "ArrowLeft":
					newSaturation = Math.max(0, saturation - step);
					break;
				case "ArrowRight":
					newSaturation = Math.min(100, saturation + step);
					break;
				case "ArrowUp":
					newLightness = Math.min(100, lightness + step);
					break;
				case "ArrowDown":
					newLightness = Math.max(0, lightness - step);
					break;
				default:
					return;
			}

			e.preventDefault();
			onChange(newSaturation, newLightness);
		},
		[saturation, lightness, onChange]
	);

	// Calculate cursor position
	const cursorX = saturation;
	const cursorY = 100 - lightness;

	return (
		<div
			ref={containerRef}
			role="application"
			aria-label={`Color saturation and lightness picker. Saturation: ${saturation}%, Lightness: ${lightness}%`}
			tabIndex={0}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			onKeyDown={handleKeyDown}
			className={cn(
				"relative h-48 w-full cursor-crosshair overflow-hidden rounded-lg",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
