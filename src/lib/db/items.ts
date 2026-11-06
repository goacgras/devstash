import { prisma } from "#/db";
import { getDemoUserId } from "#/lib/db/demo-user";
import type { DashboardItem, DashboardItems } from "#/types/items";

const RECENT_ITEM_LIMIT = 10;

const ITEM_SELECT = {
	id: true,
	title: true,
	description: true,
	isFavorite: true,
	isPinned: true,
	updatedAt: true,
	itemType: { select: { name: true, icon: true } },
	tags: { select: { name: true }, orderBy: { name: "asc" } },
} as const;

interface ItemRow {
	id: string;
	title: string;
	description: string | null;
	isFavorite: boolean;
	isPinned: boolean;
	updatedAt: Date;
	itemType: { name: string; icon: string };
	tags: { name: string }[];
}

function toDashboardItem(item: ItemRow): DashboardItem {
	return {
		id: item.id,
		title: item.title,
		description: item.description,
		isFavorite: item.isFavorite,
		isPinned: item.isPinned,
		updatedAt: item.updatedAt.toISOString(),
		typeName: item.itemType.name,
		typeIcon: item.itemType.icon,
		tags: item.tags.map((tag) => tag.name),
	};
}

export async function getDashboardItems(): Promise<DashboardItems> {
	const userId = await getDemoUserId();
	if (!userId) {
		return {
			pinnedItems: [],
			recentItems: [],
			itemCount: 0,
			favoriteItemCount: 0,
		};
	}

	const [pinned, recent, itemCount, favoriteItemCount] = await Promise.all([
		prisma.item.findMany({
			where: { userId, isPinned: true },
			orderBy: { updatedAt: "desc" },
			select: ITEM_SELECT,
		}),
		prisma.item.findMany({
			where: { userId },
			orderBy: { updatedAt: "desc" },
			take: RECENT_ITEM_LIMIT,
			select: ITEM_SELECT,
		}),
		prisma.item.count({ where: { userId } }),
		prisma.item.count({ where: { userId, isFavorite: true } }),
	]);

	return {
		pinnedItems: pinned.map(toDashboardItem),
		recentItems: recent.map(toDashboardItem),
		itemCount,
		favoriteItemCount,
	};
}
