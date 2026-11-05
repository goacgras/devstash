export interface CollectionTypeSummary {
	name: string;
	icon: string;
	count: number;
}

export interface DashboardCollection {
	id: string;
	name: string;
	description: string | null;
	isFavorite: boolean;
	itemCount: number;
	// Item types in the collection, most used first
	types: CollectionTypeSummary[];
}

export type CollectionsResult =
	| { success: true; data: DashboardCollection[] }
	| { success: false; error: string };
