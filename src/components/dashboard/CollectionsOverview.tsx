import { useSuspenseQuery } from "@tanstack/react-query";
import { getDashboardStats } from "#/lib/dashboard";
import { collectionsQueryOptions } from "#/queries/collections";
import { itemsQueryOptions } from "#/queries/items";
import RecentCollections from "./RecentCollections";
import StatsCards from "./StatsCards";

const OVERVIEW_RECENT_LIMIT = 6;

export default function CollectionsOverview() {
	const { data: collections } = useSuspenseQuery(collectionsQueryOptions);
	const { data: items } = useSuspenseQuery(itemsQueryOptions);
	const stats = getDashboardStats(collections, items);
	const recentCollections = collections.slice(0, OVERVIEW_RECENT_LIMIT);

	return (
		<>
			<StatsCards stats={stats} />
			<RecentCollections collections={recentCollections} />
		</>
	);
}
