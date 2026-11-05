import { PanelLeft, Plus, Search } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

interface DashboardTopBarProps {
	onToggleSidebar: () => void;
}

export default function DashboardTopBar({
	onToggleSidebar,
}: DashboardTopBarProps) {
	return (
		<header className="flex h-16 items-center gap-4 border-b border-border px-4">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label="Toggle sidebar"
				onClick={onToggleSidebar}
			>
				<PanelLeft />
			</Button>
			<div className="relative max-w-md flex-1">
				<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search items..."
					aria-label="Search items"
					className="pl-9"
				/>
			</div>
			<Button type="button" className="ml-auto">
				<Plus />
				New Item
			</Button>
		</header>
	);
}
