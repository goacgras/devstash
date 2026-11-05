import { Star } from "lucide-react";
import { cn } from "#/lib/utils";
import type { DashboardCollection } from "#/types/collections";
import { TYPE_BORDER_CLASSES, TypeIcon } from "./ItemTypeIcon";

interface RecentCollectionsProps {
	collections: DashboardCollection[];
}

export default function RecentCollections({
	collections,
}: RecentCollectionsProps) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-lg font-semibold">Recent Collections</h2>
			<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{collections.map((collection) => {
					const mostUsedType = collection.types[0];
					return (
						<li
							key={collection.id}
							className={cn(
								"flex flex-col gap-3 rounded-xl border bg-card p-4",
								mostUsedType
									? TYPE_BORDER_CLASSES[mostUsedType.name]
									: "border-border",
							)}
						>
							<div className="flex items-center gap-2">
								<h3 className="font-medium">{collection.name}</h3>
								{collection.isFavorite ? (
									<Star
										aria-label="Favorite"
										className="size-4 shrink-0 fill-yellow-400 text-yellow-400"
									/>
								) : null}
							</div>
							<p className="text-sm text-muted-foreground">
								{collection.itemCount}{" "}
								{collection.itemCount === 1 ? "item" : "items"}
							</p>
							{collection.description ? (
								<p className="text-sm">{collection.description}</p>
							) : null}
							<div className="flex items-center gap-2">
								{collection.types.map((type) => (
									<TypeIcon key={type.name} name={type.name} icon={type.icon} />
								))}
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
