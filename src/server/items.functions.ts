import { createServerFn } from "@tanstack/react-start";
import { getDashboardItems, getSidebarItemTypes } from "#/lib/db/items";
import type { ItemsResult, ItemTypesResult } from "#/types/items";

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

export const getItemTypes = createServerFn({ method: "GET" }).handler(
	async (): Promise<ItemTypesResult> => {
		try {
			const data = await getSidebarItemTypes();
			return { success: true, data };
		} catch (error) {
			console.error("Failed to load item types", error);
			return { success: false, error: "Failed to load item types" };
		}
	},
);
