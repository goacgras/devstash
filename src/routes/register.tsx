import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthCard from "#/components/auth/AuthCard";
import RegisterForm from "#/components/auth/RegisterForm";
import { DEFAULT_REDIRECT } from "#/lib/validations/auth";
import { getCurrentUser } from "#/server/auth.functions";

export const Route = createFileRoute("/register")({
	headers: () => ({ "Cache-Control": "private, no-store" }),
	beforeLoad: async () => {
		if (await getCurrentUser()) {
			throw redirect({ to: DEFAULT_REDIRECT });
		}
	},
	component: Register,
});

function Register() {
	return (
		<AuthCard
			title="Create your account"
			description="Start organizing your developer knowledge"
		>
			<RegisterForm />
		</AuthCard>
	);
}
