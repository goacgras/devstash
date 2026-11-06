import { FolderOpen, Star } from "lucide-react";
import { cn } from "#/lib/utils";
import type { DashboardCollection } from "#/types/collections";
import { TYPE_DOT_CLASSES } from "./ItemTypeIcon";

interface SidebarCollectionsProps {
	title: string;
	collections: DashboardCollection[];
	showFavoriteIcon?: boolean;
	// Show a circle in the most-used item type's color instead of the folder icon
	showTypeDot?: boolean;
}

export default function SidebarCollections({
	title,
	collections,
	showFavoriteIcon = false,
	showTypeDot = false,
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
					{collections.map((collection) => {
						const mostUsedType = collection.types[0];
						return (
							<li
								key={collection.id}
								className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
							>
								{showTypeDot ? (
									<span
										role="img"
										aria-label={
											mostUsedType
												? `Most used type: ${mostUsedType.name}`
												: "No items"
										}
										className={cn(
											"mx-1 size-2.5 shrink-0 rounded-full",
											mostUsedType
												? TYPE_DOT_CLASSES[mostUsedType.name]
												: "bg-muted-foreground/40",
										)}
									/>
								) : (
									<FolderOpen className="size-4 shrink-0 text-muted-foreground" />
								)}
								<span className="flex-1 truncate">{collection.name}</span>
								{showFavoriteIcon ? (
									<Star
										aria-label="Favorite"
										className="size-4 shrink-0 fill-yellow-400 text-yellow-400"
									/>
								) : null}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
