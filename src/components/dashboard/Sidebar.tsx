import { Layers } from "lucide-react";
import { getItemCountsByType, getRecentCollections } from "#/lib/dashboard";
import {
	MOCK_COLLECTIONS,
	MOCK_ITEM_TYPES,
	MOCK_ITEMS,
	MOCK_USER,
} from "#/lib/mock-data";
import { cn } from "#/lib/utils";
import SidebarCollections from "./SidebarCollections";
import SidebarTypes from "./SidebarTypes";
import SidebarUserArea from "./SidebarUserArea";

const RECENT_COLLECTION_LIMIT = 5;

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
	const typeCounts = getItemCountsByType(MOCK_ITEMS);
	const favoriteCollections = MOCK_COLLECTIONS.filter(
		(collection) => collection.isFavorite,
	);
	const recentCollections = getRecentCollections(
		MOCK_COLLECTIONS,
		MOCK_ITEMS,
		RECENT_COLLECTION_LIMIT,
	);

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
					<SidebarTypes
						types={MOCK_ITEM_TYPES}
						counts={typeCounts}
						onNavigate={onNavigate}
					/>
					<div className="mx-4 border-t border-sidebar-border" />
					<SidebarCollections
						title="Favorites"
						collections={favoriteCollections}
						showFavoriteIcon
					/>
					<SidebarCollections title="Recent" collections={recentCollections} />
				</nav>
				<SidebarUserArea user={MOCK_USER} />
			</div>
		</aside>
	);
}
