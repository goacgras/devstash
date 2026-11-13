import Skeleton from "#/components/ui/skeleton";

export default function SidebarNavSkeleton() {
	return (
		<div className="flex flex-col gap-3 px-4 py-4">
			<Skeleton className="h-4 w-20" />
			<Skeleton className="h-7 w-full" />
			<Skeleton className="h-7 w-full" />
			<Skeleton className="h-7 w-full" />
		</div>
	);
}
