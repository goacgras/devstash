import { createServerFn } from "@tanstack/react-start";
import { getDashboardCollections } from "#/lib/db/collections";
import type { CollectionsResult } from "#/types/collections";

export const getCollections = createServerFn({ method: "GET" }).handler(
	async (): Promise<CollectionsResult> => {
		try {
			const data = await getDashboardCollections();
			return { success: true, data };
		} catch (error) {
			console.error("Failed to load collections", error);
			return { success: false, error: "Failed to load collections" };
		}
	},
);
