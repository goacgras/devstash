import {
	getDashboardStats,
	getPinnedItems,
	getRecentCollections,
	getRecentItems,
} from "#/lib/dashboard";
import { MOCK_COLLECTIONS, MOCK_ITEMS } from "#/lib/mock-data";
import ItemList from "./ItemList";
import RecentCollections from "./RecentCollections";
import StatsCards from "./StatsCards";

const RECENT_COLLECTION_LIMIT = 6;
const RECENT_ITEM_LIMIT = 10;

export default function DashboardMain() {
	const stats = getDashboardStats(MOCK_COLLECTIONS, MOCK_ITEMS);
	const recentCollections = getRecentCollections(
		MOCK_COLLECTIONS,
		MOCK_ITEMS,
		RECENT_COLLECTION_LIMIT,
	);
	const pinnedItems = getPinnedItems(MOCK_ITEMS);
	const recentItems = getRecentItems(MOCK_ITEMS, RECENT_ITEM_LIMIT);

	return (
		<main className="flex flex-1 flex-col gap-8 p-6">
			<StatsCards stats={stats} />
			<RecentCollections collections={recentCollections} />
			<ItemList title="Pinned" items={pinnedItems} showPinIcon />
			<ItemList title="Recent Items" items={recentItems} />
		</main>
	);
}
