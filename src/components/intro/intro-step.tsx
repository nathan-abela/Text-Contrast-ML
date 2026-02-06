"use client";

import { cn } from "@/lib/utils";

interface IntroStepProps {
	step: number;
	className?: string;
}

/**
 * Visual demonstration of good vs bad contrast
 */
function ContrastDemo({ good }: { good: boolean }) {
	const bgColor = good ? "#1a1a2e" : "#1a1a2e";
	const textColor = good ? "#ffffff" : "#3a3a4e";

	return (
		<div
			className="flex h-20 w-full items-center justify-center rounded-lg border border-foreground/20 text-lg font-medium transition-all sm:h-24 lg:h-32"
			style={{ backgroundColor: bgColor, color: textColor }}
		>
			{good ? "Easy to read" : "Hard to read"}
		</div>
	);
}

/**
 * Interactive training preview
 */
function TrainingPreview() {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<div className="flex h-20 items-center justify-center rounded-lg border border-transparent bg-[#e67e22] text-lg font-medium text-black sm:h-24 lg:h-32">
				Black text
			</div>
			<div className="flex h-20 items-center justify-center rounded-lg border border-transparent bg-[#e67e22] text-lg font-medium text-white sm:h-24 lg:h-32">
				White text
			</div>
		</div>
	);
}

/**
 * Individual intro step content
 */
export function IntroStep({ step, className }: IntroStepProps) {
	const steps = [
		{
			title: "Why Contrast Matters",
			description:
				"Text readability depends on the contrast between text and background colors. Good contrast makes content accessible to everyone.",
			content: (
				<div className="grid gap-4 sm:grid-cols-2">
					<ContrastDemo good />
					<ContrastDemo good={false} />
				</div>
			),
		},
		{
			title: "Teach the Machine",
			description:
				"You'll see random background colors. For each one, click the text that's easier to read. The neural network learns from your choices.",
			content: <TrainingPreview />,
		},
		{
			title: "See It Learn",
			description:
				"After training, pick any color and watch the AI predict the best text color. The more varied your examples, the better the predictions.",
			content: (
				<div className="flex h-20 items-center justify-center rounded-lg border border-transparent bg-muted/30 sm:h-24 lg:h-32">
					<div className="flex items-center gap-4">
						<div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
						<div className="text-2xl">→</div>
						<div className="flex h-12 items-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 px-4 font-semibold text-white">
							Aa
						</div>
					</div>
				</div>
			),
		},
	];

	const currentStep = steps[step];

	if (!currentStep) return null;

	return (
		<div className={cn("space-y-6", className)}>
			<div className="space-y-2 text-center">
				<h2 className="text-2xl font-semibold tracking-tight">
					{currentStep.title}
				</h2>
				<p className="mx-auto max-w-md text-muted-foreground">
					{currentStep.description}
				</p>
			</div>
			<div className="mx-auto max-w-lg">{currentStep.content}</div>
		</div>
	);
}

export const INTRO_STEP_COUNT = 3;
