import type { MockCollection, MockItem } from "#/lib/mock-data";

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
	collections: MockCollection[],
	items: MockItem[],
): DashboardStats {
	return {
		itemCount: items.length,
		collectionCount: collections.length,
		favoriteItemCount: items.filter((item) => item.isFavorite).length,
		favoriteCollectionCount: collections.filter(
			(collection) => collection.isFavorite,
		).length,
	};
}

export function getPinnedItems(items: MockItem[]): MockItem[] {
	return sortByUpdatedAt(items.filter((item) => item.isPinned));
}

export function getRecentItems(items: MockItem[], limit: number): MockItem[] {
	return sortByUpdatedAt(items).slice(0, limit);
}

function sortByUpdatedAt(items: MockItem[]): MockItem[] {
	return [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
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
