import { Star } from "lucide-react";
import type { MockCollection } from "#/lib/mock-data";
import ItemTypeIcon from "./ItemTypeIcon";

interface RecentCollectionsProps {
	collections: MockCollection[];
}

export default function RecentCollections({
	collections,
}: RecentCollectionsProps) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-lg font-semibold">Recent Collections</h2>
			<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{collections.map((collection) => (
					<li
						key={collection.id}
						className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
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
							{collection.itemCount} items
						</p>
						<p className="text-sm">{collection.description}</p>
						<div className="flex items-center gap-2">
							{collection.typeIds.map((typeId) => (
								<ItemTypeIcon key={typeId} typeId={typeId} />
							))}
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
