import { useState } from "react";
import DashboardMain from "./DashboardMain";
import DashboardTopBar from "./DashboardTopBar";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
	// Desktop and mobile sidebars have separate state: the md: breakpoint in
	// Sidebar decides which one is visible, so toggling both keeps them in sync.
	const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsDesktopSidebarOpen((open) => !open);
		setIsMobileSidebarOpen((open) => !open);
	};

	const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

	return (
		<div className="flex min-h-screen bg-background text-foreground">
			<Sidebar
				isDesktopOpen={isDesktopSidebarOpen}
				isMobileOpen={isMobileSidebarOpen}
				onNavigate={closeMobileSidebar}
			/>
			{isMobileSidebarOpen ? (
				<button
					type="button"
					aria-label="Close sidebar"
					onClick={closeMobileSidebar}
					className="fixed inset-0 z-30 bg-black/50 md:hidden"
				/>
			) : null}
			<div className="flex min-w-0 flex-1 flex-col">
				<DashboardTopBar onToggleSidebar={toggleSidebar} />
				<DashboardMain />
			</div>
		</div>
	);
}
