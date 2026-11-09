"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function SiteFooter() {
	const isLearnPage = usePathname() === "/learn";

	return (
		<footer className="border-t">
			<div className="container flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground sm:justify-between sm:py-6">
				<p className={cn(!isLearnPage && "hidden sm:block")}>
					Next.js · Brain.js · shadcn/ui
				</p>
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
