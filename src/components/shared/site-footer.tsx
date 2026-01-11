"use client";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
	const githubUsername = siteConfig.links.github.split("/").slice(-2, -1)[0];
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t">
			<div className="container flex flex-col items-center justify-between gap-2 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
				<p>
					An open-source project by{" "}
					<a
						href={`https://github.com/${githubUsername}`}
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-foreground underline-offset-4 hover:underline"
					>
						{githubUsername}
					</a>
					. Built with Next.js, Brain.js, and shadcn/ui.
				</p>
				<p>
					© {currentYear} {siteConfig.name}
				</p>
			</div>
		</footer>
	);
}
