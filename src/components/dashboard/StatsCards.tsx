import type { DashboardStats } from "#/lib/dashboard";

interface StatsCardsProps {
	stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
	const cards = [
		{ label: "Items", value: stats.itemCount },
		{ label: "Collections", value: stats.collectionCount },
		{ label: "Favorite items", value: stats.favoriteItemCount },
		{ label: "Favorite collections", value: stats.favoriteCollectionCount },
	];

	return (
		<ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
			{cards.map((card) => (
				<li
					key={card.label}
					className="rounded-xl border border-border bg-card p-4"
				>
					<p className="text-sm text-muted-foreground">{card.label}</p>
					<p className="mt-2 text-3xl font-semibold">{card.value}</p>
				</li>
			))}
		</ul>
	);
}
