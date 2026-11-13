import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { collectionsQueryOptions } from "#/queries/collections";
import { itemTypesQueryOptions } from "#/queries/items";
import SidebarCollections from "./SidebarCollections";
import SidebarTypes from "./SidebarTypes";

const SIDEBAR_RECENT_LIMIT = 5;

interface SidebarNavProps {
	onNavigate: () => void;
}

export default function SidebarNav({ onNavigate }: SidebarNavProps) {
	const { data: itemTypes } = useSuspenseQuery(itemTypesQueryOptions);
	const { data: collections } = useSuspenseQuery(collectionsQueryOptions);

	const favoriteCollections = collections.filter(
		(collection) => collection.isFavorite,
	);
	// Collections come from the database ordered by most recently updated
	const recentCollections = collections.slice(0, SIDEBAR_RECENT_LIMIT);

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
