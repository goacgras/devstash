import { Suspense } from "react";
import { getPinnedItems, getRecentItems } from "#/lib/dashboard";
import { MOCK_ITEMS } from "#/lib/mock-data";
import CollectionsOverview from "./CollectionsOverview";
import CollectionsSkeleton from "./CollectionsSkeleton";
import ItemList from "./ItemList";

const RECENT_ITEM_LIMIT = 10;

export default function DashboardMain() {
	const pinnedItems = getPinnedItems(MOCK_ITEMS);
	const recentItems = getRecentItems(MOCK_ITEMS, RECENT_ITEM_LIMIT);

	return (
		<main className="flex flex-1 flex-col gap-8 p-6">
			<Suspense fallback={<CollectionsSkeleton />}>
				<CollectionsOverview />
			</Suspense>
			<ItemList title="Pinned" items={pinnedItems} showPinIcon />
			<ItemList title="Recent Items" items={recentItems} />
		</main>
	);
}
