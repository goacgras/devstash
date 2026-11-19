import { createFileRoute } from "@tanstack/react-router";
import { requireUser } from "#/lib/auth-guard";

export const Route = createFileRoute("/profile")({
	headers: () => ({ "Cache-Control": "private, no-store" }),
	beforeLoad: ({ location }) => requireUser(location),
	component: Profile,
});

function Profile() {
	const { user } = Route.useRouteContext();

	return (
		<main className="p-6">
			<h1 className="text-2xl font-semibold">Profile</h1>
			<p className="text-muted-foreground">{user.email}</p>
		</main>
	);
}
