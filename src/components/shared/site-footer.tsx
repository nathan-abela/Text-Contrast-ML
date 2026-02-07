"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function SiteFooter() {
	const isLearnPage = usePathname() === "/learn";

	return (
		<footer className="border-t">
			<div className="container flex flex-col items-center justify-between gap-2 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
				<p>Next.js · Brain.js · shadcn/ui</p>
				{!isLearnPage && (
					<Link
						href="/learn"
						className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
					>
						Learn how it works
						<ArrowRight className="h-3.5 w-3.5" />
					</Link>
				)}
			</div>
		</footer>
	);
}
