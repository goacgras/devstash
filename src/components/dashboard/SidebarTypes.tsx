import { Link } from "@tanstack/react-router";
import type { MockItemType } from "#/lib/mock-data";
import ItemTypeIcon from "./ItemTypeIcon";

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
				{types.map((type) => (
					<li key={type.id}>
						<Link
							to="/items/$type"
							params={{ type: type.id }}
							onClick={onNavigate}
							className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
						>
							<ItemTypeIcon typeId={type.id} />
							<span className="flex-1 truncate">{type.name}</span>
							<span className="text-xs text-muted-foreground">
								{counts[type.id] ?? 0}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
