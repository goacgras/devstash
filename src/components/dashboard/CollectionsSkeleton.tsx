import Skeleton from "#/components/ui/skeleton";

const STAT_CARD_KEYS = [
	"items",
	"collections",
	"favorite-items",
	"favorite-collections",
];
const COLLECTION_CARD_KEYS = [
	"collection-1",
	"collection-2",
	"collection-3",
	"collection-4",
	"collection-5",
	"collection-6",
];

export default function CollectionsSkeleton() {
	return (
		<>
			<ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
				{STAT_CARD_KEYS.map((key) => (
					<li
						key={key}
						className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
					>
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-8 w-12" />
					</li>
				))}
			</ul>
			<section className="flex flex-col gap-4">
				<Skeleton className="h-6 w-40" />
				<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{COLLECTION_CARD_KEYS.map((key) => (
						<li
							key={key}
							className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
						>
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-4 w-full" />
							<div className="flex items-center gap-2">
								<Skeleton className="size-4" />
								<Skeleton className="size-4" />
							</div>
						</li>
					))}
				</ul>
			</section>
		</>
	);
}
