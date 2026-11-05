import { useSuspenseQuery } from "@tanstack/react-query";
import { getDashboardStats } from "#/lib/dashboard";
import { MOCK_ITEMS } from "#/lib/mock-data";
import { collectionsQueryOptions } from "#/queries/collections";
import RecentCollections from "./RecentCollections";
import StatsCards from "./StatsCards";

const RECENT_COLLECTION_LIMIT = 6;

export default function CollectionsOverview() {
	const { data: collections } = useSuspenseQuery(collectionsQueryOptions);
	const stats = getDashboardStats(collections, MOCK_ITEMS);
	const recentCollections = collections.slice(0, RECENT_COLLECTION_LIMIT);

	return (
		<>
			<StatsCards stats={stats} />
			<RecentCollections collections={recentCollections} />
		</>
	);
}
