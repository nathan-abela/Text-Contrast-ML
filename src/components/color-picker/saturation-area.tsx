"use client";

import { useCallback } from "react";

import { cn } from "@/lib/utils";

import { useDrag } from "./use-drag";

interface SaturationAreaProps {
	hue: number;
	saturation: number;
	value: number;
	onChange: (saturation: number, value: number) => void;
	className?: string;
}

const STEP = 2;
const LARGE_STEP = 10;

/**
 * Saturation/Brightness picker area (HSV model)
 * X-axis: Saturation (0-100)
 * Y-axis: Value/Brightness (100-0, inverted so bright is at top)
 */
export function SaturationArea({
	hue,
	saturation,
	value,
	onChange,
	className,
}: SaturationAreaProps) {
	const handleDrag = useCallback(
		(x: number, y: number) => {
			const newSaturation = Math.round(x * 100);
			const newValue = Math.round((1 - y) * 100);
			onChange(newSaturation, newValue);
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
			let newValue = value;

			switch (e.key) {
				case "ArrowLeft":
					newSaturation = Math.max(0, saturation - step);
					break;
				case "ArrowRight":
					newSaturation = Math.min(100, saturation + step);
					break;
				case "ArrowUp":
					newValue = Math.min(100, value + step);
					break;
				case "ArrowDown":
					newValue = Math.max(0, value - step);
					break;
				default:
					return;
			}

			e.preventDefault();
			onChange(newSaturation, newValue);
		},
		[saturation, value, onChange]
	);

	// Calculate cursor position
	const cursorX = saturation;
	const cursorY = 100 - value;

	return (
		<div
			ref={containerRef}
			role="application"
			aria-label={`Color saturation and brightness picker. Saturation: ${saturation}%, Brightness: ${value}%`}
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
