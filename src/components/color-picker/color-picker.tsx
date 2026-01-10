"use client";

import { useCallback, useMemo } from "react";
import type { HSLColor, RGBColor } from "@/types";

import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from "@/lib/colors";
import { cn } from "@/lib/utils";

import { ColorInputs } from "./color-inputs";
import { HueSlider } from "./hue-slider";
import { SaturationArea } from "./saturation-area";

interface ColorPickerProps {
	value: string;
	onChange: (hex: string) => void;
	className?: string;
}

/**
 * Complete color picker with saturation area, hue slider, and input fields
 */
export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
	// Convert hex to RGB and HSL
	const rgb = useMemo((): RGBColor => {
		const parsed = hexToRgb(value);
		return parsed ?? { r: 0, g: 0, b: 0 };
	}, [value]);

	const hsl = useMemo((): HSLColor => {
		return rgbToHsl(rgb);
	}, [rgb]);

	// Handle saturation area changes
	const handleSaturationChange = useCallback(
		(saturation: number, lightness: number) => {
			const newHsl: HSLColor = { h: hsl.h, s: saturation, l: lightness };
			const newRgb = hslToRgb(newHsl);
			onChange(rgbToHex(newRgb));
		},
		[hsl.h, onChange]
	);

	// Handle hue slider changes
	const handleHueChange = useCallback(
		(hue: number) => {
			const newHsl: HSLColor = { h: hue, s: hsl.s, l: hsl.l };
			const newRgb = hslToRgb(newHsl);
			onChange(rgbToHex(newRgb));
		},
		[hsl.s, hsl.l, onChange]
	);

	// Handle hex input changes
	const handleHexChange = useCallback(
		(hex: string) => {
			onChange(hex);
		},
		[onChange]
	);

	// Handle RGB input changes
	const handleRgbChange = useCallback(
		(newRgb: RGBColor) => {
			onChange(rgbToHex(newRgb));
		},
		[onChange]
	);

	// Handle HSL input changes
	const handleHslChange = useCallback(
		(newHsl: HSLColor) => {
			const newRgb = hslToRgb(newHsl);
			onChange(rgbToHex(newRgb));
		},
		[onChange]
	);

	return (
		<div className={cn("flex flex-col gap-4 w-full max-w-xs", className)}>
			{/* Saturation/Lightness area */}
			<SaturationArea
				hue={hsl.h}
				saturation={hsl.s}
				lightness={hsl.l}
				onChange={handleSaturationChange}
			/>

			{/* Hue slider */}
			<HueSlider hue={hsl.h} onChange={handleHueChange} />

			{/* Color inputs */}
			<ColorInputs
				hex={value}
				rgb={rgb}
				hsl={hsl}
				onHexChange={handleHexChange}
				onRgbChange={handleRgbChange}
				onHslChange={handleHslChange}
			/>
		</div>
	);
}
