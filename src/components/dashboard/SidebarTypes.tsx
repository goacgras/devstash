import { Link } from "@tanstack/react-router";
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
import type { MockItemType } from "#/lib/mock-data";

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

interface SidebarTypesProps {
	types: MockItemType[];
	counts: Record<string, number>;
	onNavigate: () => void;
}

export default function SidebarTypes({
	types,
	counts,
	onNavigate,
}: SidebarTypesProps) {
	return (
		<div className="px-2 py-2">
			<p className="px-2 py-1.5 text-sm text-muted-foreground">Types</p>
			<ul className="flex flex-col gap-0.5">
				{types.map((type) => {
					const Icon = ITEM_TYPE_ICONS[type.icon] ?? File;
					return (
						<li key={type.id}>
							<Link
								to="/items/$type"
								params={{ type: type.id }}
								onClick={onNavigate}
								className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
							>
								<Icon
									className={`size-4 ${TYPE_COLOR_CLASSES[type.id] ?? ""}`}
								/>
								<span className="flex-1 truncate">{type.name}</span>
								<span className="text-xs text-muted-foreground">
									{counts[type.id] ?? 0}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
