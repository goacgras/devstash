import Skeleton from "#/components/ui/skeleton";

const ITEM_ROW_KEYS = ["item-1", "item-2", "item-3", "item-4", "item-5"];

export default function ItemsSkeleton() {
	return (
		<section className="flex flex-col gap-4">
			<Skeleton className="h-6 w-32" />
			<ul className="flex flex-col gap-3">
				{ITEM_ROW_KEYS.map((key) => (
					<li
						key={key}
						className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
					>
						<Skeleton className="size-10 rounded-lg" />
						<div className="flex flex-1 flex-col gap-2">
							<Skeleton className="h-5 w-48" />
							<Skeleton className="h-4 w-full max-w-md" />
							<Skeleton className="h-4 w-24" />
						</div>
						<Skeleton className="h-4 w-12" />
					</li>
				))}
			</ul>
		</section>
	);
}
