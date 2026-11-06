export interface DashboardItem {
	id: string;
	title: string;
	description: string | null;
	isFavorite: boolean;
	isPinned: boolean;
	// ISO timestamp
	updatedAt: string;
	// System type name (e.g. "snippet") and its lucide icon name
	typeName: string;
	typeIcon: string;
	tags: string[];
}

export interface DashboardItems {
	pinnedItems: DashboardItem[];
	recentItems: DashboardItem[];
	itemCount: number;
	favoriteItemCount: number;
}

export interface SidebarItemType {
	// System type name (e.g. "snippet") and its lucide icon name
	name: string;
	icon: string;
	// Items of this type owned by the user
	count: number;
}

export type ItemsResult =
	| { success: true; data: DashboardItems }
	| { success: false; error: string };

export type ItemTypesResult =
	| { success: true; data: SidebarItemType[] }
	| { success: false; error: string };
