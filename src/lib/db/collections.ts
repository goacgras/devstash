import { prisma } from "#/db";
import { getDemoUserId } from "#/lib/db/demo-user";
import type {
	CollectionTypeSummary,
	DashboardCollection,
} from "#/types/collections";

interface CollectionItemLink {
	item: { itemType: { name: string; icon: string } };
}

export function summarizeTypes(
	links: CollectionItemLink[],
): CollectionTypeSummary[] {
	const summaries = new Map<string, CollectionTypeSummary>();
	for (const { item } of links) {
		const { name, icon } = item.itemType;
		const current = summaries.get(name);
		if (current) {
			current.count += 1;
		} else {
			summaries.set(name, { name, icon, count: 1 });
		}
	}

	return [...summaries.values()].sort(
		(a, b) => b.count - a.count || a.name.localeCompare(b.name),
	);
}

export async function getDashboardCollections(): Promise<
	DashboardCollection[]
> {
	const userId = await getDemoUserId();
	if (!userId) {
		return [];
	}

	const collections = await prisma.collection.findMany({
		where: { userId },
		orderBy: { updatedAt: "desc" },
		select: {
			id: true,
			name: true,
			description: true,
			isFavorite: true,
			_count: { select: { items: true } },
			items: {
				select: {
					item: {
						select: { itemType: { select: { name: true, icon: true } } },
					},
				},
			},
		},
	});

	return collections.map((collection) => ({
		id: collection.id,
		name: collection.name,
		description: collection.description,
		isFavorite: collection.isFavorite,
		itemCount: collection._count.items,
		types: summarizeTypes(collection.items),
	}));
}
