import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { Suspense } from "react";
import Skeleton from "#/components/ui/skeleton";
import { MOCK_USER } from "#/lib/mock-data";
import { cn } from "#/lib/utils";
import { collectionsQueryOptions } from "#/queries/collections";
import { itemTypesQueryOptions } from "#/queries/items";
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
						<SidebarNavContent onNavigate={onNavigate} />
					</Suspense>
				</nav>
				<SidebarUserArea user={MOCK_USER} />
			</div>
		</aside>
	);
}

function SidebarNavContent({ onNavigate }: { onNavigate: () => void }) {
	const { data: itemTypes } = useSuspenseQuery(itemTypesQueryOptions);
	const { data: collections } = useSuspenseQuery(collectionsQueryOptions);

	const favoriteCollections = collections.filter(
		(collection) => collection.isFavorite,
	);
	// Collections come from the database ordered by most recently updated
	const recentCollections = collections.slice(0, RECENT_COLLECTION_LIMIT);

	return (
		<>
			<SidebarTypes types={itemTypes} onNavigate={onNavigate} />
			<div className="mx-4 border-t border-sidebar-border" />
			<SidebarCollections
				title="Favorites"
				collections={favoriteCollections}
				showFavoriteIcon
			/>
			<SidebarCollections
				title="Recent"
				collections={recentCollections}
				showTypeDot
			/>
			<div className="px-2 pb-2">
				<Link
					to="/collections"
					onClick={onNavigate}
					className="flex items-center rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
				>
					View all collections
				</Link>
			</div>
		</>
	);
}

function SidebarNavSkeleton() {
	return (
		<div className="flex flex-col gap-3 px-4 py-4">
			<Skeleton className="h-4 w-20" />
			<Skeleton className="h-7 w-full" />
			<Skeleton className="h-7 w-full" />
			<Skeleton className="h-7 w-full" />
		</div>
	);
}
