import { useSuspenseQuery } from "@tanstack/react-query";
import { itemsQueryOptions } from "#/queries/items";
import ItemList from "./ItemList";

export default function DashboardItems() {
	const { data } = useSuspenseQuery(itemsQueryOptions);

	return (
		<>
			{data.pinnedItems.length > 0 ? (
				<ItemList title="Pinned" items={data.pinnedItems} showPinIcon />
			) : null}
			<ItemList title="Recent Items" items={data.recentItems} />
		</>
	);
}
