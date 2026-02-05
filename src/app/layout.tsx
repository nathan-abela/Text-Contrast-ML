import "@/styles/globals.css";
import { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";
import { TailwindIndicator } from "@/components/shared/tailwind-indicator";
import { ThemeProvider } from "@/components/shared/theme-provider";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<>
			<html lang="en" suppressHydrationWarning>
				<head />
				<body
					className={cn(
						"h-screen overflow-hidden font-sans antialiased",
						fontSans.variable
					)}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
					>
						<div className="dot-grid flex h-full items-center justify-center bg-background p-0 lg:p-4">
							<div className="flex h-full w-full max-w-6xl flex-col overflow-hidden bg-background lg:h-[calc(100vh-2rem)] lg:rounded-xl lg:border lg:shadow-sm">
								<SiteHeader />
								<main className="flex-1 overflow-auto">
									{children}
								</main>
								<SiteFooter />
							</div>
						</div>
						<TailwindIndicator />
					</ThemeProvider>
				</body>
			</html>
		</>
	);
}
