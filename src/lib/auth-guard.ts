import { redirect } from "@tanstack/react-router";
import { getCurrentUser } from "#/server/auth.functions";

export async function requireUser(location: { href: string }) {
	const user = await getCurrentUser();
	if (!user) {
		throw redirect({ to: "/sign-in", search: { redirect: location.href } });
	}
	return { user };
}
