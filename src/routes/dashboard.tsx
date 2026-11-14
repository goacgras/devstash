import { createFileRoute, redirect } from "@tanstack/react-router";
import DashboardError from "#/components/dashboard/DashboardError";
import DashboardLayout from "#/components/dashboard/DashboardLayout";
import { collectionsQueryOptions } from "#/queries/collections";
import { itemsQueryOptions, itemTypesQueryOptions } from "#/queries/items";
import { getCurrentUser } from "#/server/auth.functions";

export const Route = createFileRoute("/dashboard")({
	headers: () => ({ "Cache-Control": "private, no-store" }),
	beforeLoad: async ({ location }) => {
		const user = await getCurrentUser();
		if (!user) {
			throw redirect({
				href: `/api/auth/signin?callbackUrl=${encodeURIComponent(location.href)}`,
			});
		}
		return { user };
	},
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
