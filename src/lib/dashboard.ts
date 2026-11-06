import type { DashboardCollection } from "#/types/collections";
import type { DashboardItems } from "#/types/items";

export interface DashboardStats {
	itemCount: number;
	collectionCount: number;
	favoriteItemCount: number;
	favoriteCollectionCount: number;
}

export function getDashboardStats(
	collections: DashboardCollection[],
	items: Pick<DashboardItems, "itemCount" | "favoriteItemCount">,
): DashboardStats {
	return {
		itemCount: items.itemCount,
		collectionCount: collections.length,
		favoriteItemCount: items.favoriteItemCount,
		favoriteCollectionCount: collections.filter(
			(collection) => collection.isFavorite,
		).length,
	};
}
