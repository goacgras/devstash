import { Layers } from "lucide-react";
import { Suspense } from "react";
import { MOCK_USER } from "#/lib/mock-data";
import { cn } from "#/lib/utils";
import SidebarNav from "./SidebarNav";
import SidebarNavSkeleton from "./SidebarNavSkeleton";
import SidebarUserArea from "./SidebarUserArea";

interface SidebarProps {
	isDesktopOpen: boolean;
	isMobileOpen: boolean;
	onNavigate: () => void;
}

export default function Sidebar({
	isDesktopOpen,
	isMobileOpen,
	onNavigate,
}: SidebarProps) {
	return (
		<aside
			className={cn(
				"fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200",
				isMobileOpen ? "translate-x-0" : "-translate-x-full",
				"md:static md:z-auto md:shrink-0 md:translate-x-0 md:transition-[width]",
				isDesktopOpen ? "md:w-64" : "md:w-0 md:border-r-0",
			)}
		>
			<div className="flex h-full w-64 flex-col">
				<div className="flex h-16 items-center gap-2 px-4">
					<div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-blue-500 text-white">
						<Layers className="size-4" />
					</div>
					<span className="text-lg font-semibold">DevStash</span>
				</div>
				<nav className="flex flex-1 flex-col overflow-y-auto">
					<Suspense fallback={<SidebarNavSkeleton />}>
						<SidebarNav onNavigate={onNavigate} />
					</Suspense>
				</nav>
				<SidebarUserArea user={MOCK_USER} />
			</div>
		</aside>
	);
}
