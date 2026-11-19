import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import AuthCard from "#/components/auth/AuthCard";
import SignInForm from "#/components/auth/SignInForm";
import { DEFAULT_REDIRECT, redirectSchema } from "#/lib/validations/auth";
import { getCurrentUser } from "#/server/auth.functions";

const searchSchema = z.object({
	redirect: redirectSchema,
	error: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/sign-in")({
	headers: () => ({ "Cache-Control": "private, no-store" }),
	validateSearch: searchSchema,
	beforeLoad: async () => {
		if (await getCurrentUser()) {
			throw redirect({ to: DEFAULT_REDIRECT });
		}
	},
	component: SignIn,
});

function SignIn() {
	const { redirect: redirectTo, error } = Route.useSearch();

	return (
		<AuthCard title="Sign in to DevStash" description="Welcome back">
			<SignInForm
				redirectTo={redirectTo ?? DEFAULT_REDIRECT}
				errorCode={error}
			/>
		</AuthCard>
	);
}
