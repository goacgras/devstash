import { createServerFn } from "@tanstack/react-start";
import { getDashboardItems } from "#/lib/db/items";
import type { ItemsResult } from "#/types/items";

export const getItems = createServerFn({ method: "GET" }).handler(
	async (): Promise<ItemsResult> => {
		try {
			const data = await getDashboardItems();
			return { success: true, data };
		} catch (error) {
			console.error("Failed to load items", error);
			return { success: false, error: "Failed to load items" };
		}
	},
);
