import { createFileRoute } from "@tanstack/react-router";
import DashboardError from "#/components/dashboard/DashboardError";
import DashboardLayout from "#/components/dashboard/DashboardLayout";
import { requireUser } from "#/lib/auth-guard";
import { collectionsQueryOptions } from "#/queries/collections";
import { itemsQueryOptions, itemTypesQueryOptions } from "#/queries/items";

export const Route = createFileRoute("/dashboard")({
	headers: () => ({ "Cache-Control": "private, no-store" }),
	beforeLoad: ({ location }) => requireUser(location),
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
