import type { MockCollection, MockItem } from "#/lib/mock-data";
import type { DashboardCollection } from "#/types/collections";
import type { DashboardItems } from "#/types/items";

export function getItemCountsByType(items: MockItem[]): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const item of items) {
		counts[item.typeId] = (counts[item.typeId] ?? 0) + 1;
	}
	return counts;
}

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

export function getRecentCollections(
	collections: MockCollection[],
	items: MockItem[],
	limit: number,
): MockCollection[] {
	const latestByCollection = new Map<string, string>();
	for (const item of items) {
		for (const collectionId of item.collectionIds) {
			const current = latestByCollection.get(collectionId);
			if (!current || item.updatedAt > current) {
				latestByCollection.set(collectionId, item.updatedAt);
			}
		}
	}

	return collections
		.filter((collection) => latestByCollection.has(collection.id))
		.sort((a, b) =>
			(latestByCollection.get(b.id) ?? "").localeCompare(
				latestByCollection.get(a.id) ?? "",
			),
		)
		.slice(0, limit);
}
