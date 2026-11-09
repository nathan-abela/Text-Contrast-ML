"use client";

import { useCallback, useMemo } from "react";
import type { HSLColor, RGBColor } from "@/types";
import { HexColorPicker } from "react-colorful";

import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from "@/lib/colors";
import { cn } from "@/lib/utils";

import { ColorInputs } from "./color-inputs";

interface ColorPickerProps {
	value: string;
	onChange: (hex: string) => void;
	className?: string;
}

export function ColorPicker({
	value,
	onChange,
	className,
}: ColorPickerProps): JSX.Element {
	const rgb = useMemo(
		(): RGBColor => hexToRgb(value) ?? { r: 0, g: 0, b: 0 },
		[value]
	);
	const hsl = useMemo((): HSLColor => rgbToHsl(rgb), [rgb]);

	const handleRgbChange = useCallback(
		(newRgb: RGBColor) => onChange(rgbToHex(newRgb)),
		[onChange]
	);

	const handleHslChange = useCallback(
		(newHsl: HSLColor) => onChange(rgbToHex(hslToRgb(newHsl))),
		[onChange]
	);

	return (
		<div className={cn("flex w-56 flex-col gap-4", className)}>
			<HexColorPicker
				color={value}
				onChange={onChange}
				className="color-picker"
			/>
			<ColorInputs
				hex={value}
				rgb={rgb}
				hsl={hsl}
				onHexChange={onChange}
				onRgbChange={handleRgbChange}
				onHslChange={handleHslChange}
			/>
		</div>
	);
}
