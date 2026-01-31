import { Metadata } from "next";
import Link from "next/link";
import {
	ArrowLeft,
	Eye,
	Hand,
	Layers,
	Lock,
	MousePointerClick,
	Network,
	SlidersHorizontal,
	TrendingUp,
	Wand2,
} from "lucide-react";

export const metadata: Metadata = {
	title: "Learn",
	description:
		"How Text Contrast ML uses neural networks to predict optimal text contrast from background colors.",
};

function SectionDivider() {
	return <hr className="border-border" />;
}

function Term({
	children,
	definition,
}: {
	children: React.ReactNode;
	definition: string;
}) {
	return (
		<span className="group relative inline">
			<span className="cursor-help border-b border-dashed border-muted-foreground/50 text-foreground">
				{children}
			</span>
			<span
				role="tooltip"
				className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100"
			>
				{definition}
			</span>
		</span>
	);
}

function NetworkDiagram() {
	const nodeClass =
		"flex h-10 w-10 items-center justify-center rounded-full border bg-background text-xs font-medium";
	const hiddenNodeClass =
		"flex h-10 w-10 items-center justify-center rounded-full border border-dashed bg-muted/50";
	const labelClass = "mt-1.5 text-center text-[10px] text-muted-foreground";
	const connectorClass = "h-px flex-1 bg-border";

	return (
		<div className="space-y-4 rounded-lg border bg-muted/20 p-6">
			<div className="flex items-center justify-between gap-2">
				{/* Input layer */}
				<div className="flex flex-col items-center gap-3">
					<span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
						Input
					</span>
					{/* prettier-ignore */}
					<div className="flex flex-col gap-2">
						<div>
							<div className={nodeClass}>
								<span className="text-red-500 dark:text-red-400">R</span>
							</div>
							<p className={labelClass}>0-1</p>
						</div>
						<div>
							<div className={nodeClass}>
								<span className="text-green-500 dark:text-green-400">G</span>
							</div>
							<p className={labelClass}>0-1</p>
						</div>
						<div>
							<div className={nodeClass}>
								<span className="text-blue-500 dark:text-blue-400">B</span>
							</div>
							<p className={labelClass}>0-1</p>
						</div>
					</div>
				</div>

				<div className={connectorClass} />

				{/* Hidden layer 1 */}
				<div className="flex flex-col items-center gap-3">
					<span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
						Hidden
					</span>
					<div className="flex flex-col gap-2">
						{[1, 2, 3].map((i) => (
							<div key={i} className={hiddenNodeClass}>
								<div className="h-2 w-2 rounded-full bg-foreground/30" />
							</div>
						))}
					</div>
				</div>

				<div className={connectorClass} />

				{/* Hidden layer 2 */}
				<div className="flex flex-col items-center gap-3">
					<span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
						Hidden
					</span>
					<div className="flex flex-col gap-2">
						{[1, 2, 3].map((i) => (
							<div key={i} className={hiddenNodeClass}>
								<div className="h-2 w-2 rounded-full bg-foreground/30" />
							</div>
						))}
					</div>
				</div>

				<div className={connectorClass} />

				{/* Output layer */}
				<div className="flex flex-col items-center gap-3">
					<span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
						Output
					</span>
					<div className="flex flex-col gap-2">
						<div>
							<div className={nodeClass}>
								<span>D</span>
							</div>
							<p className={labelClass}>dark</p>
						</div>
						<div className="mt-4">
							<div className={nodeClass}>
								<span>L</span>
							</div>
							<p className={labelClass}>light</p>
						</div>
					</div>
				</div>
			</div>
			<p className="text-center text-xs text-muted-foreground">
				Color values flow left to right. The hidden layers are where the
				network learns which combinations of red, green, and blue
				correspond to needing light or dark text. Each node applies a
				weighted calculation to its inputs and passes the result
				forward.
			</p>
		</div>
	);
}

export default function LearnPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-12 px-6 py-12">
			<div className="space-y-4">
				<Link
					href="/"
					className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					Back to app
				</Link>
				<h1 className="text-3xl font-bold tracking-tight">
					How It Works
				</h1>
				<p className="text-lg text-muted-foreground">
					This app trains a neural network to decide whether black or
					white text is more readable on any background color.
					Everything runs in your browser.
				</p>
			</div>

			<SectionDivider />

			<section className="space-y-8">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
						<Eye className="h-5 w-5" />
					</div>
					<h2 className="text-xl font-semibold tracking-tight">
						The Simple Version
					</h2>
				</div>

				<div className="space-y-4 text-muted-foreground">
					<p>
						Some background colors clearly need white text, and
						others clearly need black. But many colors fall in a
						grey area where the best choice is not obvious, even to
						people. This app lets a neural network learn the answer
						from your preferences.
					</p>

					<div className="space-y-6">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<MousePointerClick className="h-4 w-4 text-foreground" />
								<h3 className="font-medium text-foreground">
									1. You provide examples
								</h3>
							</div>
							<p className="pl-6">
								The app shows you a random background color with
								two options: black text and white text. You pick
								whichever one looks more readable. Each choice
								becomes a training example that the model will
								learn from.
							</p>
						</div>

						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<TrendingUp className="h-4 w-4 text-foreground" />
								<h3 className="font-medium text-foreground">
									2. The model trains on your choices
								</h3>
							</div>
							<p className="pl-6">
								Once you have enough examples, the app feeds
								them into a neural network. It processes your
								choices over many rounds, gradually learning the
								relationship between a color and which text
								works best on it.
							</p>
						</div>

						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Wand2 className="h-4 w-4 text-foreground" />
								<h3 className="font-medium text-foreground">
									3. It predicts new colors
								</h3>
							</div>
							<p className="pl-6">
								After training, pick any color and the model
								will predict whether to use black or white text.
								The more varied your training examples, the
								better it handles edge cases.
							</p>
						</div>
					</div>
				</div>
			</section>

			<SectionDivider />

			<section className="space-y-8">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
						<Network className="h-5 w-5" />
					</div>
					<h2 className="text-xl font-semibold tracking-tight">
						Under the Hood
					</h2>
				</div>

				<div className="space-y-6 text-muted-foreground">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Layers className="h-4 w-4 text-foreground" />
							<h3 className="font-medium text-foreground">
								Neural network architecture
							</h3>
						</div>
						<div className="space-y-3 pl-6">
							<p>
								The model is a{" "}
								<Term definition="A type of neural network where data flows in one direction, from input to output, with no loops or cycles.">
									feedforward neural network
								</Term>{" "}
								built with{" "}
								<a
									href="https://brain.js.org"
									target="_blank"
									rel="noopener noreferrer"
									className="font-medium text-foreground underline-offset-4 hover:underline"
								>
									Brain.js
								</a>
								, a JavaScript library for GPU-accelerated
								neural networks that runs entirely in the
								browser.
							</p>
							<p>
								The network has three input neurons, one for
								each color channel (red, green, blue), with
								values{" "}
								<Term definition="Scaling values to a standard range (here 0 to 1) so the network can process them consistently. For example, an RGB value of 255 becomes 1.">
									normalized
								</Term>{" "}
								to a 0-1 range. It uses two{" "}
								<Term definition="Layers between input and output that detect patterns in the data. They are called 'hidden' because their values are not directly visible as inputs or outputs.">
									hidden layers
								</Term>{" "}
								that allow it to learn non-linear relationships
								between color values and readability. The output
								layer produces a score for two labels:{" "}
								<code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
									dark
								</code>{" "}
								(the background is dark, use white text) and{" "}
								<code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
									light
								</code>{" "}
								(the background is light, use black text).
							</p>
							<NetworkDiagram />
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<SlidersHorizontal className="h-4 w-4 text-foreground" />
							<h3 className="font-medium text-foreground">
								Training process
							</h3>
						</div>
						<div className="space-y-3 pl-6">
							<p>
								Each of your choices is stored as a mapping from
								an RGB color to a label. When training begins,
								the network uses{" "}
								<Term definition="The core learning algorithm. It calculates how much each weight contributed to the error, then adjusts them to reduce that error.">
									backpropagation
								</Term>{" "}
								to adjust its internal weights across many
								iterations, minimizing the error between its
								predictions and your labels.
							</p>
							<p>
								Backpropagation works by running each training
								example through the network, comparing the
								output to the expected label, then propagating
								the error backwards through the layers to adjust
								weights. This is repeated across all examples
								for every iteration.
							</p>
							<p>
								Three presets control the iteration count: Quick
								(100), Balanced (1,000), and Thorough (5,000).
								Higher iteration counts take longer but can
								improve accuracy, especially with larger or more
								diverse training sets. However, too many
								iterations on a small dataset can lead to{" "}
								<Term definition="When a model performs well on training data but poorly on new data, because it memorized specific examples instead of learning general rules.">
									overfitting
								</Term>
								, where the model memorizes the training data
								rather than learning general patterns.
							</p>
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Hand className="h-4 w-4 text-foreground" />
							<h3 className="font-medium text-foreground">
								Prediction
							</h3>
						</div>
						<div className="space-y-3 pl-6">
							<p>
								To predict, the network runs a{" "}
								<Term definition="Passing input data through the network layer by layer, from input to output, to produce a prediction. No learning happens during this step.">
									forward pass
								</Term>{" "}
								on the input color and produces a score between
								0 and 1 for each label. The label with the
								higher score becomes the recommendation. For
								example, if the network outputs{" "}
								<code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
									dark: 0.92
								</code>{" "}
								and{" "}
								<code className="rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">
									light: 0.08
								</code>
								, it recommends white text.
							</p>
							<p>
								Prediction quality depends entirely on your
								training data. A model trained on a diverse set
								of colors across the full spectrum will handle
								edge cases better than one trained on only a
								handful of examples. After training, the app
								shows a fit rating (Excellent, Good, Fair, or
								Poor) based on the final training loss and the
								number of examples you provided.
							</p>
						</div>
					</div>

					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Lock className="h-4 w-4 text-foreground" />
							<h3 className="font-medium text-foreground">
								Privacy and storage
							</h3>
						</div>
						<div className="space-y-3 pl-6">
							<p>
								All training and prediction happens in the
								browser using JavaScript. No data is sent to any
								server. Your training examples and the resulting
								model weights never leave your device.
							</p>
							<p>
								Trained models are serialized to JSON and saved
								in localStorage, with up to five slots for model
								history. Each saved model stores the network
								weights, the number of training examples used,
								and a timestamp, so you can compare models
								trained with different data or presets.
							</p>
						</div>
					</div>
				</div>
			</section>

			<SectionDivider />

			<div className="pb-4 text-center">
				<Link
					href="/"
					className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
				>
					Start training a model
					<ArrowLeft className="h-3.5 w-3.5 rotate-180" />
				</Link>
			</div>
		</div>
	);
}
