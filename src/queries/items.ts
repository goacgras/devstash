import { queryOptions } from "@tanstack/react-query";
import { getItems } from "#/server/items.functions";

export const itemsQueryOptions = queryOptions({
	queryKey: ["items"],
	queryFn: async () => {
		const result = await getItems();
		if (!result.success) {
			throw new Error(result.error);
		}
		return result.data;
	},
});
