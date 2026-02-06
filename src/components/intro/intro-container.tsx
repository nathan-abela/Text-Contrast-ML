"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";

import { INTRO_STEP_COUNT, IntroStep } from "./intro-step";

interface IntroContainerProps {
	onComplete: () => void;
	onSkip: () => void;
	onDemo: () => void;
}

/**
 * Container for the intro/ onboarding flow
 * Manages step navigation and provides skip functionality
 */
export function IntroContainer({
	onComplete,
	onSkip,
	onDemo,
}: IntroContainerProps) {
	const [currentStep, setCurrentStep] = useState(0);

	const isLastStep = currentStep === INTRO_STEP_COUNT - 1;

	const handleNext = useCallback(() => {
		if (isLastStep) {
			onComplete();
		} else {
			setCurrentStep((prev) => prev + 1);
		}
	}, [isLastStep, onComplete]);

	const handleBack = useCallback(() => {
		setCurrentStep((prev) => Math.max(0, prev - 1));
	}, []);

	return (
		<div className="flex min-h-full flex-col">
			{/* Skip button - always visible */}
			<div className="border-b">
				<div className="container flex items-center justify-between py-2 sm:py-4">
					<div>
						{isLastStep && (
							<Button
								variant="outline"
								size="sm"
								onClick={onDemo}
							>
								Try demo
							</Button>
						)}
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={onSkip}
						className="text-muted-foreground hover:text-foreground"
					>
						Skip intro
					</Button>
				</div>
			</div>

			{/* Step content */}
			<div className="flex flex-1 items-center justify-center px-4 py-8">
				<IntroStep step={currentStep} />
			</div>

			{/* Navigation */}
			<div className="border-t bg-background/80 backdrop-blur-sm">
				<div className="container flex items-center justify-between gap-4 py-4">
					{/* Step indicators */}
					<div
						role="tablist"
						aria-label="Intro steps"
						className="flex gap-2"
					>
						{Array.from({ length: INTRO_STEP_COUNT }).map(
							(_, i) => (
								<div
									key={i}
									role="tab"
									aria-selected={i === currentStep}
									aria-label={`Step ${i + 1} of ${INTRO_STEP_COUNT}`} // prettier-ignore
									className={`h-2 w-10 rounded-full transition-colors ${
										i === currentStep
											? "bg-foreground"
											: i < currentStep
											? "bg-foreground/50"
											: "bg-muted-foreground/30"
									}`}
								/>
							)
						)}
					</div>

					{/* Navigation buttons */}
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={handleBack}
							className={currentStep === 0 ? "invisible" : ""}
						>
							Back
						</Button>
						<Button onClick={handleNext}>
							{isLastStep ? "Start" : "Next"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
