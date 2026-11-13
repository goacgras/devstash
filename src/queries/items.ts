import { queryOptions } from "@tanstack/react-query";
import { unwrapResult } from "#/lib/result";
import { getItems, getItemTypes } from "#/server/items.functions";

export const itemsQueryOptions = queryOptions({
	queryKey: ["items"],
	queryFn: async () => unwrapResult(await getItems()),
});

export const itemTypesQueryOptions = queryOptions({
	queryKey: ["item-types"],
	queryFn: async () => unwrapResult(await getItemTypes()),
});
