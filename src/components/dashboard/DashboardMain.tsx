import { Suspense } from "react";
import CollectionsOverview from "./CollectionsOverview";
import CollectionsSkeleton from "./CollectionsSkeleton";
import DashboardItems from "./DashboardItems";
import ItemsSkeleton from "./ItemsSkeleton";

export default function DashboardMain() {
	return (
		<main className="flex flex-1 flex-col gap-8 p-6">
			<Suspense fallback={<CollectionsSkeleton />}>
				<CollectionsOverview />
			</Suspense>
			<Suspense fallback={<ItemsSkeleton />}>
				<DashboardItems />
			</Suspense>
		</main>
	);
}
