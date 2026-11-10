import { Pin } from "lucide-react";
import type { DashboardItem } from "#/types/items";
import HoverCard from "./HoverCard";
import { TYPE_ACCENT_CLASSES, TypeIcon } from "./ItemTypeIcon";

interface ItemListProps {
	title: string;
	items: DashboardItem[];
	showPinIcon?: boolean;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	timeZone: "UTC",
});

export default function ItemList({
	title,
	items,
	showPinIcon = false,
}: ItemListProps) {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="flex items-center gap-2 text-lg font-semibold">
				{showPinIcon ? (
					<Pin aria-hidden className="size-4 text-muted-foreground" />
				) : null}
				{title}
			</h2>
			{items.length === 0 ? (
				<p className="text-sm text-muted-foreground">No items</p>
			) : (
				<ul className="flex flex-col gap-3">
					{items.map((item) => (
						<HoverCard
							key={item.id}
							accentClassName={TYPE_ACCENT_CLASSES[item.typeName]}
							className="items-start gap-4"
						>
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
								<TypeIcon name={item.typeName} icon={item.typeIcon} />
							</div>
							<div className="flex min-w-0 flex-1 flex-col gap-1">
								<h3 className="truncate font-medium">{item.title}</h3>
								{item.description ? (
									<p className="truncate text-sm text-muted-foreground">
										{item.description}
									</p>
								) : null}
								{item.tags.length > 0 ? (
									<div className="mt-1 flex flex-wrap gap-2">
										{item.tags.map((tag) => (
											<span
												key={tag}
												className="rounded-md bg-muted px-2 py-0.5 text-xs"
											>
												{tag}
											</span>
										))}
									</div>
								) : null}
							</div>
							<time
								dateTime={item.updatedAt}
								className="shrink-0 text-sm text-muted-foreground"
							>
								{DATE_FORMATTER.format(new Date(item.updatedAt))}
							</time>
						</HoverCard>
					))}
				</ul>
			)}
		</section>
	);
}
