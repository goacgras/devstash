export interface MockUser {
	id: string;
	name: string;
	email: string;
}

export interface MockItemType {
	id: string;
	name: string;
	icon: string;
	color: string;
}

export interface MockCollection {
	id: string;
	name: string;
	description: string;
	isFavorite: boolean;
	itemCount: number;
	// Item types in the collection, most common first
	typeIds: string[];
}

export interface MockItem {
	id: string;
	title: string;
	description: string;
	typeId: string;
	isFavorite: boolean;
	isPinned: boolean;
	tags: string[];
	collectionIds: string[];
	updatedAt: string;
}

export const MOCK_USER: MockUser = {
	id: "user-1",
	name: "John Doe",
	email: "john@example.com",
};

export const MOCK_ITEM_TYPES: MockItemType[] = [
	{ id: "snippet", name: "Snippets", icon: "Code", color: "#3b82f6" },
	{ id: "prompt", name: "Prompts", icon: "Sparkles", color: "#8b5cf6" },
	{ id: "command", name: "Commands", icon: "Terminal", color: "#f97316" },
	{ id: "note", name: "Notes", icon: "StickyNote", color: "#fde047" },
	{ id: "file", name: "Files", icon: "File", color: "#6b7280" },
	{ id: "image", name: "Images", icon: "Image", color: "#ec4899" },
	{ id: "link", name: "Links", icon: "Link", color: "#10b981" },
];

export const MOCK_COLLECTIONS: MockCollection[] = [
	{
		id: "react-patterns",
		name: "React Patterns",
		description: "Common React patterns and hooks",
		isFavorite: true,
		itemCount: 12,
		typeIds: ["snippet", "note", "link"],
	},
	{
		id: "python-snippets",
		name: "Python Snippets",
		description: "Useful Python code snippets",
		isFavorite: false,
		itemCount: 8,
		typeIds: ["snippet", "note"],
	},
	{
		id: "context-files",
		name: "Context Files",
		description: "AI context files for projects",
		isFavorite: true,
		itemCount: 5,
		typeIds: ["file", "note"],
	},
	{
		id: "interview-prep",
		name: "Interview Prep",
		description: "Technical interview preparation",
		isFavorite: false,
		itemCount: 24,
		typeIds: ["note", "snippet", "link", "prompt"],
	},
	{
		id: "git-commands",
		name: "Git Commands",
		description: "Frequently used git commands",
		isFavorite: true,
		itemCount: 15,
		typeIds: ["command", "note"],
	},
	{
		id: "ai-prompts",
		name: "AI Prompts",
		description: "Curated AI prompts for coding",
		isFavorite: false,
		itemCount: 18,
		typeIds: ["prompt", "snippet", "note"],
	},
];

export const MOCK_ITEMS: MockItem[] = [
	{
		id: "item-1",
		title: "useAuth Hook",
		description: "Custom authentication hook for React applications",
		typeId: "snippet",
		isFavorite: true,
		isPinned: true,
		tags: ["react", "auth", "hooks"],
		collectionIds: ["react-patterns"],
		updatedAt: "2026-01-15",
	},
	{
		id: "item-2",
		title: "API Error Handling Pattern",
		description: "Fetch wrapper with exponential backoff retry logic",
		typeId: "snippet",
		isFavorite: false,
		isPinned: true,
		tags: ["api", "errors"],
		collectionIds: ["react-patterns"],
		updatedAt: "2026-01-12",
	},
	{
		id: "item-3",
		title: "Code Review Prompt",
		description: "Prompt for a thorough review of a pull request",
		typeId: "prompt",
		isFavorite: false,
		isPinned: false,
		tags: ["ai", "review"],
		collectionIds: ["ai-prompts"],
		updatedAt: "2026-01-10",
	},
	{
		id: "item-4",
		title: "Interactive Rebase",
		description: "Rewrite the last few commits before pushing",
		typeId: "command",
		isFavorite: true,
		isPinned: false,
		tags: ["git"],
		collectionIds: ["git-commands"],
		updatedAt: "2026-01-08",
	},
	{
		id: "item-5",
		title: "Context Files Overview",
		description: "Notes on which context files each project needs",
		typeId: "note",
		isFavorite: false,
		isPinned: false,
		tags: ["ai", "context"],
		collectionIds: ["context-files"],
		updatedAt: "2026-01-06",
	},
	{
		id: "item-6",
		title: "Python Dataclass Example",
		description: "Dataclass with default factory and post-init validation",
		typeId: "snippet",
		isFavorite: false,
		isPinned: false,
		tags: ["python"],
		collectionIds: ["python-snippets"],
		updatedAt: "2026-01-04",
	},
];
