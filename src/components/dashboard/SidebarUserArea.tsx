import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import UserAvatar from "#/components/ui/UserAvatar";
import { signOut } from "#/lib/auth-client";
import type { CurrentUser } from "#/types/auth";

interface SidebarUserAreaProps {
	user: CurrentUser;
}

export default function SidebarUserArea({ user }: SidebarUserAreaProps) {
	const displayName = user.name ?? user.email ?? "Account";

	return (
		<div className="flex items-center gap-1 border-t border-sidebar-border p-3">
			<Link
				to="/profile"
				className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-1 hover:bg-sidebar-accent"
			>
				<UserAvatar image={user.image} name={user.name} email={user.email} />
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium">{displayName}</p>
					{user.email ? (
						<p className="truncate text-xs text-muted-foreground">
							{user.email}
						</p>
					) : null}
				</div>
			</Link>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon-sm" aria-label="Account menu">
						<ChevronsUpDown />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="top" align="end">
					<DropdownMenuItem onSelect={() => void signOut()}>
						<LogOut />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
