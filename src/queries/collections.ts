import { queryOptions } from "@tanstack/react-query";
import { unwrapResult } from "#/lib/result";
import { getCollections } from "#/server/collections.functions";

export const collectionsQueryOptions = queryOptions({
	queryKey: ["collections"],
	queryFn: async () => unwrapResult(await getCollections()),
});
