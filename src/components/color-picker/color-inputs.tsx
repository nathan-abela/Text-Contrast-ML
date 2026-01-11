"use client";

import { useCallback, useEffect, useState } from "react";
import type { HSLColor, RGBColor } from "@/types";

import { cn } from "@/lib/utils";

type InputMode = "hex" | "rgb" | "hsl";

interface ColorInputsProps {
	hex: string;
	rgb: RGBColor;
	hsl: HSLColor;
	onHexChange: (hex: string) => void;
	onRgbChange: (rgb: RGBColor) => void;
	onHslChange: (hsl: HSLColor) => void;
	className?: string;
}

/**
 * Single number input component
 */
function NumberInput({
	value,
	onChange,
	min,
	max,
	label,
}: {
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	label: string;
}) {
	const [localValue, setLocalValue] = useState(String(value));

	useEffect(() => {
		setLocalValue(String(value));
	}, [value]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setLocalValue(newValue);

			const num = parseInt(newValue, 10);
			if (!isNaN(num) && num >= min && num <= max) {
				onChange(num);
			}
		},
		[onChange, min, max]
	);

	const handleBlur = useCallback(() => {
		const num = parseInt(localValue, 10);
		if (isNaN(num) || num < min) {
			setLocalValue(String(min));
			onChange(min);
		} else if (num > max) {
			setLocalValue(String(max));
			onChange(max);
		}
	}, [localValue, min, max, onChange]);

	return (
		<div className="flex flex-col gap-1">
			<label className="text-xs text-muted-foreground">{label}</label>
			<input
				type="number"
				value={localValue}
				onChange={handleChange}
				onBlur={handleBlur}
				min={min}
				max={max}
				className="w-full rounded-md border bg-background px-2 py-1.5 text-center text-sm font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"
			/>
		</div>
	);
}

/**
 * Color input fields with mode switcher (Hex, RGB, HSL)
 */
export function ColorInputs({
	hex,
	rgb,
	hsl,
	onHexChange,
	onRgbChange,
	onHslChange,
	className,
}: ColorInputsProps) {
	const [mode, setMode] = useState<InputMode>("hex");
	const [localHex, setLocalHex] = useState(hex);

	useEffect(() => {
		setLocalHex(hex);
	}, [hex]);

	const handleHexChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			let value = e.target.value;
			// Ensure it starts with #
			if (!value.startsWith("#")) {
				value = "#" + value;
			}
			setLocalHex(value);

			// Only update parent if valid hex
			if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
				onHexChange(value.toLowerCase());
			}
		},
		[onHexChange]
	);

	const handleHexBlur = useCallback(() => {
		// Validate and fix hex on blur
		let value = localHex.replace(/[^0-9A-Fa-f#]/g, "");
		if (!value.startsWith("#")) {
			value = "#" + value;
		}
		// Pad short values
		if (value.length < 7) {
			value = value.padEnd(7, "0");
		}
		value = value.slice(0, 7).toLowerCase();
		setLocalHex(value);
		onHexChange(value);
	}, [localHex, onHexChange]);

	const modes: { key: InputMode; label: string }[] = [
		{ key: "hex", label: "Hex" },
		{ key: "rgb", label: "RGB" },
		{ key: "hsl", label: "HSL" },
	];

	return (
		<div className={cn("space-y-3", className)}>
			{/* Mode switcher */}
			<div
				className="flex gap-1"
				role="tablist"
				aria-label="Color input format"
			>
				{modes.map((m) => (
					<button
						key={m.key}
						type="button"
						role="tab"
						aria-selected={mode === m.key}
						aria-controls={`color-input-${m.key}`}
						onClick={() => setMode(m.key)}
						className={cn(
							"flex-1 rounded-md px-2 py-1 text-xs transition-colors",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
							mode === m.key
								? "bg-foreground text-background"
								: "bg-muted hover:bg-muted/80"
						)}
					>
						{m.label}
					</button>
				))}
			</div>

			{/* Inputs based on mode */}
			{mode === "hex" && (
				<div
					id="color-input-hex"
					role="tabpanel"
					className="flex flex-col gap-1"
				>
					<label
						htmlFor="hex-input"
						className="text-xs text-muted-foreground"
					>
						Hex
					</label>
					<input
						id="hex-input"
						type="text"
						value={localHex}
						onChange={handleHexChange}
						onBlur={handleHexBlur}
						maxLength={7}
						className="w-full rounded-md border bg-background px-3 py-1.5 text-center font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring"
						placeholder="#000000"
					/>
				</div>
			)}

			{mode === "rgb" && (
				<div
					id="color-input-rgb"
					role="tabpanel"
					className="grid grid-cols-3 gap-2"
				>
					<NumberInput
						value={rgb.r}
						onChange={(r) => onRgbChange({ ...rgb, r })}
						min={0}
						max={255}
						label="R"
					/>
					<NumberInput
						value={rgb.g}
						onChange={(g) => onRgbChange({ ...rgb, g })}
						min={0}
						max={255}
						label="G"
					/>
					<NumberInput
						value={rgb.b}
						onChange={(b) => onRgbChange({ ...rgb, b })}
						min={0}
						max={255}
						label="B"
					/>
				</div>
			)}

			{mode === "hsl" && (
				<div
					id="color-input-hsl"
					role="tabpanel"
					className="grid grid-cols-3 gap-2"
				>
					<NumberInput
						value={hsl.h}
						onChange={(h) => onHslChange({ ...hsl, h })}
						min={0}
						max={360}
						label="H"
					/>
					<NumberInput
						value={hsl.s}
						onChange={(s) => onHslChange({ ...hsl, s })}
						min={0}
						max={100}
						label="S"
					/>
					<NumberInput
						value={hsl.l}
						onChange={(l) => onHslChange({ ...hsl, l })}
						min={0}
						max={100}
						label="L"
					/>
				</div>
			)}
		</div>
	);
}
