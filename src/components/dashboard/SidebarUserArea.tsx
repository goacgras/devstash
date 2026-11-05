import { Settings } from "lucide-react";
import { Button } from "#/components/ui/button";
import type { MockUser } from "#/lib/mock-data";

interface SidebarUserAreaProps {
	user: MockUser;
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export default function SidebarUserArea({ user }: SidebarUserAreaProps) {
	return (
		<div className="flex items-center gap-3 border-t border-sidebar-border p-3">
			<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
				{getInitials(user.name)}
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium">{user.name}</p>
				<p className="truncate text-xs text-muted-foreground">{user.email}</p>
			</div>
			<Button variant="ghost" size="icon-sm" aria-label="Account settings">
				<Settings />
			</Button>
		</div>
	);
}
