import { FolderOpen, Star } from "lucide-react";
import type { MockCollection } from "#/lib/mock-data";

interface SidebarCollectionsProps {
	title: string;
	collections: MockCollection[];
	showFavoriteIcon?: boolean;
}

export default function SidebarCollections({
	title,
	collections,
	showFavoriteIcon = false,
}: SidebarCollectionsProps) {
	return (
		<div className="px-2 py-2">
			<p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
				{title}
			</p>
			{collections.length === 0 ? (
				<p className="px-2 py-1.5 text-sm text-muted-foreground">
					No collections
				</p>
			) : (
				<ul className="flex flex-col gap-0.5">
					{collections.map((collection) => (
						<li
							key={collection.id}
							className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
						>
							<FolderOpen className="size-4 shrink-0 text-muted-foreground" />
							<span className="flex-1 truncate">{collection.name}</span>
							{showFavoriteIcon ? (
								<Star
									aria-label="Favorite"
									className="size-4 shrink-0 fill-yellow-400 text-yellow-400"
								/>
							) : null}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
