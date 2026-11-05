import { createFileRoute } from "@tanstack/react-router";
import DashboardLayout from "#/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
	component: Dashboard,
});

function Dashboard() {
	return <DashboardLayout />;
}
