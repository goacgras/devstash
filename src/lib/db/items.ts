import { prisma } from "#/db";
import type { Prisma } from "#/generated/prisma/client";
import { getDemoUserId } from "#/lib/db/demo-user";
import type {
	DashboardItem,
	DashboardItems,
	SidebarItemType,
} from "#/types/items";

const RECENT_ITEM_LIMIT = 10;

// Display order for the sidebar; unknown type names sort last.
const SYSTEM_TYPE_ORDER = [
	"snippet",
	"prompt",
	"command",
	"note",
	"file",
	"image",
	"link",
];

function typeRank(name: string): number {
	const index = SYSTEM_TYPE_ORDER.indexOf(name);
	return index === -1 ? SYSTEM_TYPE_ORDER.length : index;
}

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

type ItemRow = Prisma.ItemGetPayload<{ select: typeof ITEM_SELECT }>;

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

export async function getSidebarItemTypes(): Promise<SidebarItemType[]> {
	const userId = await getDemoUserId();

	const [systemTypes, counts] = await Promise.all([
		prisma.itemType.findMany({
			where: { isSystem: true },
			select: { id: true, name: true, icon: true },
		}),
		userId
			? prisma.item.groupBy({
					by: ["itemTypeId"],
					where: { userId },
					_count: { _all: true },
				})
			: Promise.resolve([]),
	]);

	const countByTypeId = new Map(
		counts.map((row) => [row.itemTypeId, row._count._all]),
	);

	return systemTypes
		.map((type) => ({
			name: type.name,
			icon: type.icon,
			count: countByTypeId.get(type.id) ?? 0,
		}))
		.sort((a, b) => typeRank(a.name) - typeRank(b.name));
}
