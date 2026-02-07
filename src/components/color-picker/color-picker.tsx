"use client";

import { useCallback, useMemo } from "react";
import type { HSLColor, HSVColor, RGBColor } from "@/types";

import {
	hexToRgb,
	hslToRgb,
	hsvToRgb,
	rgbToHex,
	rgbToHsl,
	rgbToHsv,
} from "@/lib/colors";
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
	// Convert hex to RGB, HSL, and HSV
	const rgb = useMemo((): RGBColor => {
		const parsed = hexToRgb(value);
		return parsed ?? { r: 0, g: 0, b: 0 };
	}, [value]);

	const hsl = useMemo((): HSLColor => {
		return rgbToHsl(rgb);
	}, [rgb]);

	const hsv = useMemo((): HSVColor => {
		return rgbToHsv(rgb);
	}, [rgb]);

	// Handle saturation area changes (uses HSV model)
	const handleSaturationChange = useCallback(
		(saturation: number, valueComponent: number) => {
			const newHsv: HSVColor = { h: hsv.h, s: saturation, v: valueComponent };
			const newRgb = hsvToRgb(newHsv);
			onChange(rgbToHex(newRgb));
		},
		[hsv.h, onChange]
	);

	// Handle hue slider changes (uses HSV to preserve saturation/value)
	const handleHueChange = useCallback(
		(hue: number) => {
			const newHsv: HSVColor = { h: hue, s: hsv.s, v: hsv.v };
			const newRgb = hsvToRgb(newHsv);
			onChange(rgbToHex(newRgb));
		},
		[hsv.s, hsv.v, onChange]
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
			{/* Saturation/Value area (HSV model) */}
			<SaturationArea
				hue={hsv.h}
				saturation={hsv.s}
				value={hsv.v}
				onChange={handleSaturationChange}
			/>

			{/* Hue slider */}
			<HueSlider hue={hsv.h} onChange={handleHueChange} />

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
