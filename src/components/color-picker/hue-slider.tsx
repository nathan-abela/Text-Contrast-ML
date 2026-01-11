"use client";

import { useCallback } from "react";

import { cn } from "@/lib/utils";

import { useDrag } from "./use-drag";

interface HueSliderProps {
	hue: number;
	onChange: (hue: number) => void;
	className?: string;
}

const STEP = 5;
const LARGE_STEP = 30;

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

	// Keyboard navigation
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			const step = e.shiftKey ? LARGE_STEP : STEP;
			let newHue = hue;

			switch (e.key) {
				case "ArrowLeft":
					newHue = (hue - step + 360) % 360;
					break;
				case "ArrowRight":
					newHue = (hue + step) % 360;
					break;
				case "Home":
					newHue = 0;
					break;
				case "End":
					newHue = 359;
					break;
				default:
					return;
			}

			e.preventDefault();
			onChange(newHue);
		},
		[hue, onChange]
	);

	// Calculate cursor position
	const cursorX = (hue / 360) * 100;

	return (
		<div
			ref={containerRef}
			role="slider"
			aria-label="Hue"
			aria-valuemin={0}
			aria-valuemax={360}
			aria-valuenow={hue}
			aria-valuetext={`${hue} degrees`}
			tabIndex={0}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
			onKeyDown={handleKeyDown}
			className={cn(
				"relative h-4 w-full cursor-pointer overflow-hidden rounded-full",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
