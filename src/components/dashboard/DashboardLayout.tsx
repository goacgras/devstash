import DashboardTopBar from "./DashboardTopBar";

export default function DashboardLayout() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<DashboardTopBar />
			<div className="flex flex-1">
				<aside className="hidden w-64 shrink-0 border-r border-border p-4 md:block">
					<h2 className="text-lg font-semibold">Sidebar</h2>
				</aside>
				<main className="flex-1 p-6">
					<h2 className="text-lg font-semibold">Main</h2>
				</main>
			</div>
		</div>
	);
}
