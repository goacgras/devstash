import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	AUTH_ERROR_MESSAGES,
	signInWithCredentials,
	signInWithGitHub,
} from "#/lib/auth-client";
import {
	type FieldErrors,
	signInSchema,
	toFieldErrors,
} from "#/lib/validations/auth";
import FormField from "./FormField";

interface SignInFormProps {
	redirectTo: string;
	errorCode?: string;
}

export default function SignInForm({ redirectTo, errorCode }: SignInFormProps) {
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	const credentialsMutation = useMutation({
		mutationFn: (values: { email: string; password: string }) =>
			signInWithCredentials(values.email, values.password, redirectTo),
	});
	const githubMutation = useMutation({
		mutationFn: () => signInWithGitHub(redirectTo),
	});

	const urlError = errorCode
		? (AUTH_ERROR_MESSAGES[errorCode] ?? "Sign in failed. Please try again.")
		: null;
	const formError =
		credentialsMutation.error?.message ??
		githubMutation.error?.message ??
		urlError;
	const isPending = credentialsMutation.isPending || githubMutation.isPending;

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const parsed = signInSchema.safeParse({
			email: formData.get("email"),
			password: formData.get("password"),
		});
		if (!parsed.success) {
			setFieldErrors(toFieldErrors(parsed.error));
			return;
		}
		setFieldErrors({});
		credentialsMutation.mutate(parsed.data);
	};

	return (
		<div className="space-y-4">
			<form onSubmit={handleSubmit} className="space-y-4" noValidate>
				<FormField
					name="email"
					label="Email"
					type="email"
					autoComplete="email"
					error={fieldErrors.email}
				/>
				<FormField
					name="password"
					label="Password"
					type="password"
					autoComplete="current-password"
					error={fieldErrors.password}
				/>
				{formError ? (
					<p role="alert" className="text-sm text-destructive">
						{formError}
					</p>
				) : null}
				<Button type="submit" className="w-full" disabled={isPending}>
					{credentialsMutation.isPending ? "Signing in..." : "Sign in"}
				</Button>
			</form>
			<div className="flex items-center gap-3 text-xs text-muted-foreground">
				<div className="h-px flex-1 bg-border" />
				or
				<div className="h-px flex-1 bg-border" />
			</div>
			<Button
				type="button"
				variant="outline"
				className="w-full"
				disabled={isPending}
				onClick={() => githubMutation.mutate()}
			>
				Sign in with GitHub
			</Button>
			<p className="text-center text-sm text-muted-foreground">
				Don't have an account?{" "}
				<Link to="/register" className="text-foreground underline">
					Register
				</Link>
			</p>
		</div>
	);
}
