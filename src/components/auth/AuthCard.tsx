import { Layers } from "lucide-react";
import type { ReactNode } from "react";

interface AuthCardProps {
	title: string;
	description: string;
	children: ReactNode;
}

export default function AuthCard({
	title,
	description,
	children,
}: AuthCardProps) {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
			<div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
				<div className="flex flex-col items-center gap-2 text-center">
					<div className="flex size-10 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-blue-500 text-white">
						<Layers className="size-5" />
					</div>
					<h1 className="text-xl font-semibold">{title}</h1>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
				{children}
			</div>
		</main>
	);
}
