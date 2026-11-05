import {
	Code,
	File,
	Image,
	Link as LinkIcon,
	type LucideIcon,
	Sparkles,
	StickyNote,
	Terminal,
} from "lucide-react";
import { MOCK_ITEM_TYPES } from "#/lib/mock-data";
import { cn } from "#/lib/utils";

const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
	Code,
	Sparkles,
	Terminal,
	StickyNote,
	File,
	Image,
	Link: LinkIcon,
};

const TYPE_COLOR_CLASSES: Record<string, string> = {
	snippet: "text-blue-500",
	prompt: "text-violet-500",
	command: "text-orange-500",
	note: "text-yellow-300",
	file: "text-gray-500",
	image: "text-pink-500",
	link: "text-emerald-500",
};

interface ItemTypeIconProps {
	typeId: string;
	className?: string;
}

export default function ItemTypeIcon({ typeId, className }: ItemTypeIconProps) {
	const itemType = MOCK_ITEM_TYPES.find((type) => type.id === typeId);
	const Icon = ITEM_TYPE_ICONS[itemType?.icon ?? ""] ?? File;

	return (
		<Icon
			aria-label={itemType?.name}
			className={cn("size-4 shrink-0", TYPE_COLOR_CLASSES[typeId], className)}
		/>
	);
}
