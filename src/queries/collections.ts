import { queryOptions } from "@tanstack/react-query";
import { getCollections } from "#/server/collections.functions";

export const collectionsQueryOptions = queryOptions({
	queryKey: ["collections"],
	queryFn: async () => {
		const result = await getCollections();
		if (!result.success) {
			throw new Error(result.error);
		}
		return result.data;
	},
});
