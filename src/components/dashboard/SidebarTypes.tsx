import { Link } from "@tanstack/react-router";
import type { SidebarItemType } from "#/types/items";
import { TypeIcon } from "./ItemTypeIcon";

interface SidebarTypesProps {
	types: SidebarItemType[];
	onNavigate: () => void;
}

// System type names are singular ("snippet"); the sidebar shows them plural.
function toPluralLabel(name: string): string {
	return `${name.charAt(0).toUpperCase()}${name.slice(1)}s`;
}

export default function SidebarTypes({ types, onNavigate }: SidebarTypesProps) {
	return (
		<div className="px-2 py-2">
			<p className="px-2 py-1.5 text-sm text-muted-foreground">Types</p>
			<ul className="flex flex-col gap-0.5">
				{types.map((type) => (
					<li key={type.name}>
						<Link
							to="/items/$type"
							params={{ type: type.name }}
							onClick={onNavigate}
							className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
						>
							<TypeIcon name={type.name} icon={type.icon} />
							<span className="flex-1 truncate">
								{toPluralLabel(type.name)}
							</span>
							<span className="text-xs text-muted-foreground">
								{type.count}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
