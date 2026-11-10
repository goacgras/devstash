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

export const TYPE_ACCENT_CLASSES: Record<string, string> = {
	snippet: "border-l-blue-500",
	prompt: "border-l-violet-500",
	command: "border-l-orange-500",
	note: "border-l-yellow-300",
	file: "border-l-gray-500",
	image: "border-l-pink-500",
	link: "border-l-emerald-500",
};

export const TYPE_DOT_CLASSES: Record<string, string> = {
	snippet: "bg-blue-500",
	prompt: "bg-violet-500",
	command: "bg-orange-500",
	note: "bg-yellow-300",
	file: "bg-gray-500",
	image: "bg-pink-500",
	link: "bg-emerald-500",
};

interface TypeIconProps {
	// System type name (e.g. "snippet"), used for the color
	name: string;
	// Lucide icon name (e.g. "Code")
	icon: string;
	label?: string;
	className?: string;
}

export function TypeIcon({ name, icon, label, className }: TypeIconProps) {
	const Icon = ITEM_TYPE_ICONS[icon] ?? File;

	return (
		<Icon
			aria-label={label ?? name}
			className={cn("size-4 shrink-0", TYPE_COLOR_CLASSES[name], className)}
		/>
	);
}
