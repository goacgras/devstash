import { createFileRoute } from "@tanstack/react-router";
import DashboardLayout from "#/components/dashboard/DashboardLayout";
import { collectionsQueryOptions } from "#/queries/collections";
import { itemsQueryOptions, itemTypesQueryOptions } from "#/queries/items";

export const Route = createFileRoute("/dashboard")({
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.query(collectionsQueryOptions),
			context.queryClient.query(itemsQueryOptions),
			context.queryClient.query(itemTypesQueryOptions),
		]);
	},
	component: Dashboard,
	errorComponent: DashboardError,
});

function Dashboard() {
	return <DashboardLayout />;
}

function DashboardError() {
	return (
		<main className="p-6">
			<p className="text-sm text-muted-foreground">
				Something went wrong loading your dashboard. Please refresh the page.
			</p>
		</main>
	);
}
